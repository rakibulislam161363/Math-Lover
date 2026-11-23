import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { HttpError } from "../../utils/httpError";
import { sendResponse } from "../../utils/sendResponse";
import * as platformService from "./platform.service";
import {
  AssignmentCreateInput,
  AssignmentSubmissionInput,
  AssignmentUpdateInput,
  SubmissionReviewInput,
} from "./platform.interface";

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

const listAssignments = respond("Assignments retrieved successfully.", (req) =>
  platformService.listAssignments(param(req, "batchId")),
);
const createAssignment = respond(
  "Assignment created successfully.",
  (req) =>
    platformService.createAssignment(
      param(req, "batchId"),
      req.body as AssignmentCreateInput,
    ),
  httpStatus.CREATED,
);
const updateAssignment = respond("Assignment updated successfully.", (req) =>
  platformService.updateAssignment(
    param(req, "id"),
    req.body as AssignmentUpdateInput,
  ),
);
const deleteAssignment = respond("Assignment deleted successfully.", (req) =>
  platformService.deleteAssignment(param(req, "id")),
);
const submitAssignment = respond(
  "Assignment submitted successfully.",
  (req) =>
    platformService.submitAssignment(
      param(req, "assignmentId"),
      requireUser(req).id,
      req.body as AssignmentSubmissionInput,
    ),
  httpStatus.CREATED,
);
const listSubmissions = respond("Submissions retrieved successfully.", (req) =>
  platformService.listSubmissions(param(req, "assignmentId")),
);
const reviewSubmission = respond("Submission reviewed successfully.", (req) =>
  platformService.reviewSubmission(
    param(req, "id"),
    requireUser(req).id,
    req.body as SubmissionReviewInput,
  ),
);

export const platformController = {
  listAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  listSubmissions,
  reviewSubmission,
};
