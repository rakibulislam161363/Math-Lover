import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { HttpError } from "../../utils/httpError";
import { sendResponse } from "../../utils/sendResponse";
import * as authService from "./auth.service";
import { AuthResult } from "./auth.interface";
import {
  validateLoginInput,
  validateRefreshToken,
  validateRegisterInput,
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
    data: { user: result.user },
  });
}

const register = catchAsync(async (req: Request, res: Response) => {
  const input = validateRegisterInput(req.body);
  const result = await authService.register(input);

  sendAuthenticatedResponse(
    res,
    httpStatus.CREATED,
    "Account created successfully.",
    result,
  );
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
  login,
  logout,
  getCurrentUser,
  refreshTokens,
};