import { RequestHandler } from "express";
import httpStatus from "http-status";
import { z } from "zod";
import { HttpError } from "../utils/httpError";

type RequestSource = "body" | "cookies" | "params" | "query";

export const validateRequest = (
  schema: z.ZodType,
  source: RequestSource = "body",
): RequestHandler => {
  return (req, _res, next) => {
    const requestData =
      source === "body"
        ? req.body
        : source === "cookies"
          ? req.cookies
          : source === "params"
            ? req.params
            : req.query;
    const result = schema.safeParse(requestData);
    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join(".") || "request"}: ${issue.message}`)
        .join("; ");
      next(new HttpError(httpStatus.BAD_REQUEST, message));
      return;
    }

    if (source === "body") {
      req.body = result.data;
    } else if (source === "cookies") {
      req.cookies = result.data;
    } else if (source === "params") {
      Object.assign(req.params, result.data);
    }
    next();
  };
};
