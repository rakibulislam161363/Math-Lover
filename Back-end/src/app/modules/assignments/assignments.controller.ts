import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { HttpError } from "../../utils/httpError";
import { sendResponse } from "../../utils/sendResponse";
import * as assignmentsService from "./assignments.service";
import {
  AssignmentCreateInput,
  AssignmentSubmissionCreateInput,
  AssignmentSubmissionUpdateInput,
  AssignmentUpdateInput,
} from "./assignments.interface";

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

const requireUserId = (req: Request): string => {
  if (!req.user) {
    throw new HttpError(
      httpStatus.UNAUTHORIZED,
      "Authentication required.",
    );
  }
  return req.user.id;
};

const listAssignments = respond("Assignments retrieved successfully.", (req) =>
  assignmentsService.listAssignments(
    typeof req.query.batchId === "string" ? req.query.batchId : undefined,
    req.query.all === "true",
  ),
);

const createAssignment = respond(
  "Assignment created successfully.",
  (req) =>
    assignmentsService.createAssignment(
      req.body as AssignmentCreateInput,
    ),
  httpStatus.CREATED,
);

const getAssignment = respond("Assignment retrieved successfully.", async (req) => {
  const assignment = await assignmentsService.getAssignment(param(req, "id"));
  if (!assignment) {
    throw new HttpError(httpStatus.NOT_FOUND, "Assignment not found.");
  }
  return assignment;
});

const updateAssignment = respond("Assignment updated successfully.", (req) =>
  assignmentsService.updateAssignment(
    param(req, "id"),
    req.body as AssignmentUpdateInput,
  ),
);

const deleteAssignment = respond("Assignment deleted successfully.", (req) =>
  assignmentsService.deleteAssignment(param(req, "id")),
);

const listSubmissionsForAssignment = respond(
  "Assignment submissions retrieved successfully.",
  (req) =>
    assignmentsService.listSubmissionsForAssignment(
      param(req, "assignmentId"),
    ),
);

const submitAssignment = respond(
  "Assignment submitted successfully.",
  (req) =>
    assignmentsService.submitAssignment(
      requireUserId(req),
      param(req, "assignmentId"),
      req.body as AssignmentSubmissionCreateInput,
    ),
  httpStatus.CREATED,
);

const listMySubmissions = respond(
  "My submissions retrieved successfully.",
  (req) =>
    assignmentsService.listSubmissionsForStudent(requireUserId(req)),
);

const reviewSubmission = respond(
  "Submission reviewed successfully.",
  (req) =>
    assignmentsService.reviewSubmission(
      requireUserId(req),
      param(req, "id"),
      req.body as AssignmentSubmissionUpdateInput,
    ),
);

export const assignmentsController = {
  listAssignments,
  createAssignment,
  getAssignment,
  updateAssignment,
  deleteAssignment,
  listSubmissionsForAssignment,
  submitAssignment,
  listMySubmissions,
  reviewSubmission,
};
