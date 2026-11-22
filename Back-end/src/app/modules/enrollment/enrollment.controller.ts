import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { HttpError } from "../../utils/httpError";
import { sendResponse } from "../../utils/sendResponse";
import * as enrollmentService from "./enrollment.service";
import {
  AccessLogCreateInput,
  EnrollmentUpdateInput,
} from "./enrollment.interface";

type ControllerAction = (req: Request) => Promise<unknown>;

const respond = (
  message: string,
  action: ControllerAction,
  statusCode: number = httpStatus.OK,
) =>
  catchAsync(async (req: Request, res: Response) => {
    const data = await action(req);
    sendResponse(res, { success: true, statusCode, message, data });
  });

const param = (req: Request, name: string): string => {
  const value = req.params[name];
  return typeof value === "string" ? value : "";
};

const requireUser = (req: Request) => {
  if (!req.user) {
    throw new HttpError(
      httpStatus.UNAUTHORIZED,
      "Authentication required.",
    );
  }
  return req.user;
};

const createEnrollment = respond(
  "Enrollment created successfully.",
  (req) => enrollmentService.createEnrollment(requireUser(req).id, req.body.batchId),
  httpStatus.CREATED,
);
const listMyEnrollments = respond(
  "Enrollments retrieved successfully.",
  (req) => enrollmentService.listEnrollmentsForStudent(requireUser(req).id),
);
const listEnrollments = respond("Enrollments retrieved successfully.", () =>
  enrollmentService.listEnrollments(),
);
const updateEnrollment = respond("Enrollment updated successfully.", (req) =>
  enrollmentService.updateEnrollment(
    param(req, "id"),
    req.body as EnrollmentUpdateInput,
  ),
);
const createAccessLog = respond(
  "Access log created successfully.",
  (req) =>
    enrollmentService.createAccessLog(
      requireUser(req).id,
      req.body as AccessLogCreateInput,
    ),
  httpStatus.CREATED,
);
const listAccessLogs = respond("Access logs retrieved successfully.", (req) =>
  enrollmentService.listAccessLogs(param(req, "enrollmentId")),
);

export const enrollmentController = {
  createEnrollment,
  listMyEnrollments,
  listEnrollments,
  updateEnrollment,
  createAccessLog,
  listAccessLogs,
};
