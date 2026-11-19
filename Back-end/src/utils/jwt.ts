import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions["expiresIn"],
) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (accessToken: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(accessToken, secret);
    if (typeof verifiedToken === "string") {
      return {
        success: false as const,
        error: "Invalid token",
      };
    }

    return {
      success: true as const,
      data: verifiedToken,
    };
  } catch {
    return {
      success: false as const,
      error: "Invalid token",
    };
  }
};

export const jwtUtils = {
  createToken,
  verifyToken,
};