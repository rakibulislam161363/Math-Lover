import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { HttpError } from "../../utils/httpError";
import { sendResponse } from "../../utils/sendResponse";
import * as authService from "./auth.service";
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

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function sendAuthenticatedResponse(
  res: Response,
  statusCode: number,
  message: string,
  result: AuthResult,
): void {
  res.cookie("accessToken", result.accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  res.cookie("refreshToken", result.refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
  sendResponse(res, {
    success: true,
    statusCode,
    message,
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
}

const register = catchAsync(async (req: Request, res: Response) => {
  const input = req.body as RegisterInput;
  await authService.register(input);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.ACCEPTED,
    message: "Verification code sent to your email.",
    data: null,
  });
});

const verifyRegistration = catchAsync(async (req: Request, res: Response) => {
  const input = req.body as VerifyRegistrationInput;
  await authService.verifyRegistration(input);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Account created successfully. Please log in to continue.",
    data: null,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const input = req.body as LoginInput;
  const result = await authService.login(input);

  sendAuthenticatedResponse(
    res,
    httpStatus.OK,
    "Logged in successfully.",
    result,
  );
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const input = req.body as GoogleLoginInput;
  const result = await authService.googleLogin(input);

  sendAuthenticatedResponse(
    res,
    httpStatus.OK,
    "Logged in with Google successfully.",
    result,
  );
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const input = req.body as ForgotPasswordInput;
  await authService.forgotPassword(input);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.ACCEPTED,
    message: "If the account can reset its password, a code will be emailed.",
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const input = req.body as ResetPasswordInput;
  await authService.resetPassword(input);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password reset successfully.",
    data: null,
  });
});

const setPassword = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new HttpError(httpStatus.UNAUTHORIZED, "Authentication required.");
  }

  await authService.setPassword(
    req.user.id,
    req.body as SetPasswordInput,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password set successfully. You can now use Google or password login.",
    data: null,
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (typeof refreshToken === "string") {
    await authService.revokeRefreshToken(refreshToken);
  }

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Logged out successfully.",
    data: null,
  });
});

const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string;
  const result = await authService.refreshTokens(refreshToken);

  sendAuthenticatedResponse(
    res,
    httpStatus.OK,
    "Tokens refreshed successfully.",
    result,
  );
});

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new HttpError(httpStatus.UNAUTHORIZED, "Authentication required.");
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Current user retrieved successfully.",
    data: { user: req.user },
  });
});

export const authController = {
  register,
  verifyRegistration,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  setPassword,
  logout,
  getCurrentUser,
  refreshTokens,
};