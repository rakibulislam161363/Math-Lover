import { RequestHandler } from "express";
import httpStatus from "http-status";
import { z } from "zod";
import { HttpError } from "../utils/httpError";

type RequestSource = "body" | "cookies";

export const validateRequest = (
  schema: z.ZodType,
  source: RequestSource = "body",
): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(source === "body" ? req.body : req.cookies);
    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join(".") || "request"}: ${issue.message}`)
        .join("; ");
      next(new HttpError(httpStatus.BAD_REQUEST, message));
      return;
    }

    if (source === "body") {
      req.body = result.data;
    } else {
      req.cookies = result.data;
    }
    next();
  };
};
