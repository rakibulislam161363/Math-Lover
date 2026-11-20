import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import httpStatus from "http-status";
import { UserRole } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../utils/httpError";
import { jwtUtils } from "../../utils/jwt";
import { AuthResult, LoginInput, RegisterInput } from "./auth.interface";

const PASSWORD_SALT_ROUNDS = 12;
const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const publicUserSelect = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
} as const;

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

export async function register(input: RegisterInput): Promise<AuthResult> {
  const jwtSecret = getJwtSecret();
  const passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);
  const refreshToken = createRefreshToken();
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        passwordHash,
        phone: input.phone,
        role: UserRole.STUDENT,
      },
      select: publicUserSelect,
    });

    await tx.refreshSession.create({
      data: {
        tokenHash: hashRefreshToken(refreshToken),
        userId: newUser.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    return newUser;
  });

  return createAuthResult(user, jwtSecret, refreshToken);
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
    throw new HttpError(
      httpStatus.UNAUTHORIZED,
      "Invalid email or password.",
    );
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
      throw new HttpError(httpStatus.UNAUTHORIZED, "Refresh token was already used.");
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