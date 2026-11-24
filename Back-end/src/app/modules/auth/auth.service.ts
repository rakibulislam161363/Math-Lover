import bcrypt from "bcryptjs";
import { createHash, randomBytes, randomInt } from "node:crypto";
import ejs from "ejs";
import type { TokenPayload } from "google-auth-library";
import httpStatus from "http-status";
import { AuthProvider, UserRole } from "../../../generated/prisma/enums";
import config from "../../config";
import { googleClient } from "../../lib/googleAuth";
import { transporter } from "../../lib/nodemailer";
import { prisma } from "../../lib/prisma";
import { redisClient } from "../../lib/redis";
import { HttpError } from "../../utils/httpError";
import { jwtUtils } from "../../utils/jwt";
import {
  AuthResult,
  ForgotPasswordInput,
  GoogleLoginInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  SetPasswordInput,
  VerifyRegistrationInput,
} from "./auth.interface";
import path from "node:path";

const PASSWORD_SALT_ROUNDS = 12;
const ACCESS_TOKEN_TTL = "1d";
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const REGISTRATION_OTP_TTL_SECONDS = 5 * 60;
const PASSWORD_RESET_OTP_TTL_SECONDS = 5 * 60;

const publicUserSelect = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
} as const;

type PendingRegistration = {
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string;
};

function getJwtSecret(): string {
  if (!config.jwtSecret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return config.jwtSecret;
}

function createAuthResult(
  user: AuthResult["user"],
  jwtSecret: string,
  refreshToken: string,
): AuthResult {
  return {
    user,
    accessToken: jwtUtils.createToken(
      { id: user.id, tokenType: "access" },
      jwtSecret,
      ACCESS_TOKEN_TTL,
    ),
    refreshToken,
  };
}

function createRefreshToken(): string {
  return randomBytes(32).toString("hex");
}

function hashRefreshToken(refreshToken: string): string {
  return createHash("sha256").update(refreshToken).digest("hex");
}

function getRefreshTokenExpiry(): Date {
  return new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
}

function getRegistrationKeys(email: string) {
  return {
    otpKey: `user-registration-otp:${email}`,
    dataKey: `user-registration-data:${email}`,
  };
}

function getPasswordResetKey(email: string): string {
  return `password-reset-otp:${email}`;
}

async function sendWelcomeEmail(
  user: Pick<AuthResult["user"], "fullName" | "email">,
): Promise<void> {
  const templatePath = path.join(
    process.cwd(),
    "src/app/templates/welcome-user.ejs",
  );
  const html = await ejs.renderFile(templatePath, {
    fullName: user.fullName,
  });

  await transporter.sendMail({
    from: config.email_sender,
    to: user.email,
    subject: "Welcome to Math Solution",
    html,
  });
}

export async function register(input: RegisterInput): Promise<void> {
  const email = input.email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new HttpError(
      httpStatus.CONFLICT,
      "User with this email already exists.",
    );
  }

  const passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);
  const otp = randomInt(100000, 1000000).toString();
  const { otpKey, dataKey } = getRegistrationKeys(email);
  const pendingRegistration: PendingRegistration = {
    fullName: input.fullName,
    email,
    passwordHash,
    phone: input.phone,
  };

  await redisClient.set(otpKey, otp, {
    expiration: { type: "EX", value: REGISTRATION_OTP_TTL_SECONDS },
  });
  await redisClient.set(dataKey, JSON.stringify(pendingRegistration), {
    expiration: { type: "EX", value: REGISTRATION_OTP_TTL_SECONDS },
  });

  const templatePath = path.join(
    process.cwd(),
    "src/app/templates/registration-user-otp.ejs",
  );
  const html = await ejs.renderFile(templatePath, {
    fullName: input.fullName,
    email,
    otp,
    expirationMinutes: REGISTRATION_OTP_TTL_SECONDS / 60,
  });

  await transporter.sendMail({
    from: config.email_sender,
    to: email,
    subject: "Email Verification",
    html,
  });
}

export async function verifyRegistration(
  input: VerifyRegistrationInput,
): Promise<void> {
  const email = input.email.trim().toLowerCase();
  const { otpKey, dataKey } = getRegistrationKeys(email);
  const [storedOtp, storedData] = await Promise.all([
    redisClient.get(otpKey),
    redisClient.get(dataKey),
  ]);

  if (!storedOtp || !storedData || storedOtp !== input.otp) {
    throw new HttpError(
      httpStatus.UNAUTHORIZED,
      "The verification code is invalid or has expired.",
    );
  }

  const pendingRegistration = JSON.parse(storedData) as PendingRegistration;
  if (
    typeof pendingRegistration.fullName !== "string" ||
    pendingRegistration.email !== email ||
    typeof pendingRegistration.passwordHash !== "string"
  ) {
    throw new HttpError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Pending registration data is invalid.",
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    await redisClient.del([otpKey, dataKey]);
    throw new HttpError(
      httpStatus.CONFLICT,
      "User with this email already exists.",
    );
  }

  const user = await prisma.user.create({
    data: {
      fullName: pendingRegistration.fullName,
      email,
      passwordHash: pendingRegistration.passwordHash,
      phone: pendingRegistration.phone,
      role: UserRole.STUDENT,
    },
    select: publicUserSelect,
  });

  await redisClient.del([otpKey, dataKey]);
  await sendWelcomeEmail(user);
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const jwtSecret = getJwtSecret();
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      ...publicUserSelect,
      passwordHash: true,
      isActive: true,
    },
  });

  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw new HttpError(httpStatus.UNAUTHORIZED, "Invalid email or password.");
  }
  if (!user.isActive) {
    throw new HttpError(httpStatus.FORBIDDEN, "User is inactive.");
  }

  const refreshToken = createRefreshToken();
  await prisma.refreshSession.create({
    data: {
      tokenHash: hashRefreshToken(refreshToken),
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  const safeUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };

  return createAuthResult(safeUser, jwtSecret, refreshToken);
}

export async function googleLogin(input: GoogleLoginInput): Promise<AuthResult> {
  const jwtSecret = getJwtSecret();
  if (!config.google_client_id) {
    throw new Error("GOOGLE_CLIENT_ID is not configured.");
  }

  let googlePayload: TokenPayload | undefined;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: input.idToken,
      audience: config.google_client_id,
    });
    googlePayload = ticket.getPayload();
  } catch {
    throw new HttpError(
      httpStatus.UNAUTHORIZED,
      "Invalid or expired Google ID token.",
    );
  }

  if (!googlePayload?.email || googlePayload.email_verified !== true) {
    throw new HttpError(
      httpStatus.UNAUTHORIZED,
      "A Google account with a verified email is required.",
    );
  }

  const email = googlePayload.email.trim().toLowerCase();
  const fullName =
    googlePayload.name?.trim() || email.slice(0, email.indexOf("@"));
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  const isNewUser = existingUser === null;
  const passwordHash = await bcrypt.hash(
    randomBytes(32).toString("hex"),
    PASSWORD_SALT_ROUNDS,
  );
  const user = await prisma.user.upsert({
    where: { email },
    create: {
      fullName,
      email,
      passwordHash,
      role: UserRole.STUDENT,
      authProvider: AuthProvider.GOOGLE,
      googleId: googlePayload.sub,
    },
    update: {},
    select: {
      ...publicUserSelect,
      isActive: true,
      authProvider: true,
      googleId: true,
    },
  });

  if (user.role !== UserRole.STUDENT) {
    throw new HttpError(
      httpStatus.FORBIDDEN,
      "Google login is only available for student accounts.",
    );
  }
  if (!user.isActive) {
    throw new HttpError(httpStatus.FORBIDDEN, "User is inactive.");
  }
  if (
    (user.authProvider === AuthProvider.GOOGLE &&
      user.googleId !== googlePayload.sub) ||
    (user.googleId && user.googleId !== googlePayload.sub)
  ) {
    throw new HttpError(
      httpStatus.CONFLICT,
      "This email is already linked to a different Google account.",
    );
  }
  if (!user.googleId) {
    await prisma.user.update({
      where: { id: user.id },
      data: { googleId: googlePayload.sub },
    });
  }

  const safeUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };

  const refreshToken = createRefreshToken();
  await prisma.refreshSession.create({
    data: {
      tokenHash: hashRefreshToken(refreshToken),
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  if (isNewUser) {
    await sendWelcomeEmail(user);
  }

  return createAuthResult(safeUser, jwtSecret, refreshToken);
}

export async function forgotPassword(
  input: ForgotPasswordInput,
): Promise<void> {
  const email = input.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      email: true,
      fullName: true,
      isActive: true,
      authProvider: true,
    },
  });

  if (
    !user ||
    !user.isActive ||
    user.authProvider === AuthProvider.GOOGLE
  ) {
    return;
  }

  const otp = randomInt(100000, 1000000).toString();
  const key = getPasswordResetKey(user.email);
  await redisClient.set(key, otp, {
    expiration: { type: "EX", value: PASSWORD_RESET_OTP_TTL_SECONDS },
  });

  const templatePath = path.join(
    process.cwd(),
    "src/app/templates/forgot-password-otp.ejs",
  );
  const html = await ejs.renderFile(templatePath, {
    fullName: user.fullName,
    otp,
    expirationMinutes: PASSWORD_RESET_OTP_TTL_SECONDS / 60,
  });

  await transporter.sendMail({
    from: config.email_sender,
    to: user.email,
    subject: "Password Reset",
    html,
  });
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const email = input.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      fullName: true,
      isActive: true,
      authProvider: true,
    },
  });

  if (!user || !user.isActive) {
    throw new HttpError(
      httpStatus.BAD_REQUEST,
      "The password reset code is invalid or has expired.",
    );
  }
  if (user.authProvider === AuthProvider.GOOGLE) {
    throw new HttpError(
      httpStatus.BAD_REQUEST,
      "Google accounts cannot reset their password.",
    );
  }

  const key = getPasswordResetKey(user.email);
  const storedOtp = await redisClient.get(key);
  if (!storedOtp || storedOtp !== input.otp) {
    throw new HttpError(
      httpStatus.BAD_REQUEST,
      "The password reset code is invalid or has expired.",
    );
  }

  const passwordHash = await bcrypt.hash(
    input.newPassword,
    PASSWORD_SALT_ROUNDS,
  );
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    }),
    prisma.refreshSession.deleteMany({ where: { userId: user.id } }),
  ]);
  await redisClient.del(key);

  const templatePath = path.join(
    process.cwd(),
    "src/app/templates/reset-password-success.ejs",
  );
  const html = await ejs.renderFile(templatePath, {
    fullName: user.fullName,
  });

  await transporter.sendMail({
    from: config.email_sender,
    to: user.email,
    subject: "Password Changed",
    html,
  });
}

export async function setPassword(
  userId: string,
  input: SetPasswordInput,
): Promise<void> {
  const passwordHash = await bcrypt.hash(
    input.newPassword,
    PASSWORD_SALT_ROUNDS,
  );
  const updated = await prisma.user.updateMany({
    where: { id: userId, authProvider: AuthProvider.GOOGLE },
    data: {
      passwordHash,
      authProvider: AuthProvider.CREDENTIAL,
    },
  });

  if (updated.count === 0) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) {
      throw new HttpError(httpStatus.NOT_FOUND, "User not found.");
    }

    throw new HttpError(
      httpStatus.CONFLICT,
      "A password is already set for this account.",
    );
  }
}

export async function refreshTokens(
  refreshToken: string,
): Promise<AuthResult> {
  const jwtSecret = getJwtSecret();
  const tokenHash = hashRefreshToken(refreshToken);
  const now = new Date();
  const session = await prisma.refreshSession.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: {
          ...publicUserSelect,
          isActive: true,
        },
      },
    },
  });

  if (!session) {
    throw new HttpError(httpStatus.UNAUTHORIZED, "Invalid refresh token.");
  }
  if (session.expiresAt <= now) {
    await prisma.refreshSession.deleteMany({ where: { id: session.id } });
    throw new HttpError(httpStatus.UNAUTHORIZED, "Refresh token has expired.");
  }
  if (!session.user.isActive) {
    await prisma.refreshSession.deleteMany({ where: { id: session.id } });
    throw new HttpError(httpStatus.FORBIDDEN, "User is inactive.");
  }

  const nextRefreshToken = createRefreshToken();
  await prisma.$transaction(async (tx) => {
    const deleted = await tx.refreshSession.deleteMany({
      where: {
        id: session.id,
        tokenHash,
        expiresAt: { gt: now },
      },
    });

    if (deleted.count !== 1) {
      throw new HttpError(
        httpStatus.UNAUTHORIZED,
        "Refresh token was already used.",
      );
    }

    await tx.refreshSession.create({
      data: {
        tokenHash: hashRefreshToken(nextRefreshToken),
        userId: session.userId,
        expiresAt: getRefreshTokenExpiry(),
      },
    });
  });

  const user = {
    id: session.user.id,
    fullName: session.user.fullName,
    email: session.user.email,
    phone: session.user.phone,
    role: session.user.role,
    createdAt: session.user.createdAt,
  };

  return createAuthResult(user, jwtSecret, nextRefreshToken);
}

export async function revokeRefreshToken(refreshToken: string): Promise<void> {
  await prisma.refreshSession.deleteMany({
    where: { tokenHash: hashRefreshToken(refreshToken) },
  });
}
