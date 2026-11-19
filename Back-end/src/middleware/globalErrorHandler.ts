import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";
import { HttpError } from "../utils/httpError";

export const globalErrorHandler: ErrorRequestHandler = (
  error: unknown,
  req,
  res,
  next,
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";

  if (error instanceof HttpError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Invalid database operation.";
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      statusCode = httpStatus.CONFLICT;
      message = "A record with the provided unique value already exists.";
    } else if (error.code === "P2003") {
      statusCode = httpStatus.BAD_REQUEST;
      message = "A related record does not exist.";
    } else if (error.code === "P2025") {
      statusCode = httpStatus.NOT_FOUND;
      message = "The requested record was not found.";
    }
  } else if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientUnknownRequestError
  ) {
    statusCode = httpStatus.SERVICE_UNAVAILABLE;
    message = "The database is temporarily unavailable.";
  } else if (error instanceof Error) {
    console.error(error);
  } else {
    console.error("An unknown error occurred:", error);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
}