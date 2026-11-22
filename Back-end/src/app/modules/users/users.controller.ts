import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { HttpError } from "../../utils/httpError";
import { sendResponse } from "../../utils/sendResponse";
import * as usersService from "./users.service";
import { StudentProfileInput } from "./users.interface";

const requireUserId = (req: Request): string => {
  if (!req.user) {
    throw new HttpError(
      httpStatus.UNAUTHORIZED,
      "Authentication required.",
    );
  }
  return req.user.id;
};

const getMyStudentProfile = catchAsync(async (req: Request, res: Response) => {
  const profile = await usersService.getStudentProfile(requireUserId(req));

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Student profile retrieved successfully.",
    data: profile,
  });
});

const upsertMyStudentProfile = catchAsync(
  async (req: Request, res: Response) => {
    const profile = await usersService.upsertStudentProfile(
      requireUserId(req),
      req.body as StudentProfileInput,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Student profile saved successfully.",
      data: profile,
    });
  },
);

export const usersController = {
  getMyStudentProfile,
  upsertMyStudentProfile,
};
