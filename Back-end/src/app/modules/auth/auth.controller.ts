import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { HttpError } from "../../utils/httpError";
import { sendResponse } from "../../utils/sendResponse";
import * as authService from "./auth.service";
import { AuthResult } from "./auth.interface";
import {
  validateLoginInput,
  validateGoogleLoginInput,
  validateForgotPasswordInput,
  validateRefreshToken,
  validateRegisterInput,
  validateRegistrationVerification,
  validateResetPasswordInput,
} from "./auth.validation";

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
  const input = validateRegisterInput(req.body);
  await authService.register(input);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.ACCEPTED,
    message: "Verification code sent to your email.",
    data: null,
  });
});

const verifyRegistration = catchAsync(async (req: Request, res: Response) => {
  const input = validateRegistrationVerification(req.body);
  await authService.verifyRegistration(input);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Account created successfully. Please log in to continue.",
    data: null,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const input = validateLoginInput(req.body);
  const result = await authService.login(input);

  sendAuthenticatedResponse(
    res,
    httpStatus.OK,
    "Logged in successfully.",
    result,
  );
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const input = validateGoogleLoginInput(req.body);
  const result = await authService.googleLogin(input);

  sendAuthenticatedResponse(
    res,
    httpStatus.OK,
    "Logged in with Google successfully.",
    result,
  );
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const input = validateForgotPasswordInput(req.body);
  await authService.forgotPassword(input);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.ACCEPTED,
    message: "If the account can reset its password, a code will be emailed.",
    data: null,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const input = validateResetPasswordInput(req.body);
  await authService.resetPassword(input);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Password reset successfully.",
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
  const refreshToken = validateRefreshToken(req.cookies?.refreshToken);
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
  logout,
  getCurrentUser,
  refreshTokens,
};