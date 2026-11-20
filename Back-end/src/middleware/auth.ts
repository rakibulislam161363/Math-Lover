import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../generated/prisma/enums";
import httpStatus from "http-status";
import config from "../config";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";
import { catchAsync } from "../utils/catchAsync";
import { HttpError } from "../utils/httpError";

type AuthenticatedUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const auth = (...requiredRoles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    const token =
      req.cookies?.accessToken ??
      (authorization?.startsWith("Bearer ")
        ? authorization.slice("Bearer ".length)
        : authorization);

    if (!token) {
      throw new HttpError(
        httpStatus.UNAUTHORIZED,
        "Access denied. No token provided.",
      );
    }

    if (!config.jwtSecret) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwtSecret);

    if (!verifiedToken.success) {
      throw new HttpError(httpStatus.UNAUTHORIZED, verifiedToken.error);
    }

    const payload = verifiedToken.data;
    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof payload.id !== "string" ||
      !payload.id ||
      payload.tokenType !== "access"
    ) {
      throw new HttpError(httpStatus.UNAUTHORIZED, "Invalid token.");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new HttpError(httpStatus.UNAUTHORIZED, "User not found.");
    }
    if (!user.isActive) {
      throw new HttpError(httpStatus.FORBIDDEN, "User is inactive.");
    }

    if (requiredRoles.length && !requiredRoles.includes(user.role)) {
      throw new HttpError(
        httpStatus.FORBIDDEN,
        "Forbidden. You don't have permission to access this resource.",
      );
    }

    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
    next();
  });
};