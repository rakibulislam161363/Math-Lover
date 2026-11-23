import { Request, Response } from "express";
import httpStatus from "http-status";
import { ClassLevel } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { HttpError } from "../../utils/httpError";
import { sendResponse } from "../../utils/sendResponse";
import * as coursesService from "./courses.service";
import {
  BatchCreateInput,
  BatchUpdateInput,
  CourseCreateInput,
  CourseUpdateInput,
} from "./courses.interface";

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

const listCourses = respond("Courses retrieved successfully.", (req) => {
  const user = requireUser(req);
  return coursesService.listCourses(
    user.id,
    user.role,
    typeof req.query.classLevel === "string"
      ? (req.query.classLevel as ClassLevel)
      : undefined,
    req.query.all === "true",
  );
});
const createCourse = respond(
  "Course created successfully.",
  (req) => coursesService.createCourse(req.body as CourseCreateInput),
  httpStatus.CREATED,
);
const getCourse = respond("Course retrieved successfully.", async (req) => {
  const user = requireUser(req);
  const course = await coursesService.getCourse(
    param(req, "slug"),
    user.id,
    user.role,
  );
  if (!course) throw new HttpError(httpStatus.NOT_FOUND, "Course not found.");
  return course;
});
const updateCourse = respond("Course updated successfully.", (req) =>
  coursesService.updateCourse(param(req, "id"), req.body as CourseUpdateInput),
);
const deleteCourse = respond("Course deleted successfully.", (req) =>
  coursesService.deleteCourse(param(req, "id")),
);

const listBatches = respond("Batches retrieved successfully.", (req) => {
  const user = requireUser(req);
  return coursesService.listBatches(
    typeof req.query.courseId === "string" ? req.query.courseId : undefined,
    user.id,
    user.role,
  );
});
const createBatch = respond(
  "Batch created successfully.",
  (req) => coursesService.createBatch(req.body as BatchCreateInput),
  httpStatus.CREATED,
);
const getBatch = respond("Batch retrieved successfully.", (req) => {
  const user = requireUser(req);
  return coursesService.getBatch(param(req, "id"), user.id, user.role);
});
const updateBatch = respond("Batch updated successfully.", (req) =>
  coursesService.updateBatch(param(req, "id"), req.body as BatchUpdateInput),
);
const deleteBatch = respond("Batch deleted successfully.", (req) =>
  coursesService.deleteBatch(param(req, "id")),
);

export const coursesController = {
  listCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  listBatches,
  createBatch,
  getBatch,
  updateBatch,
  deleteBatch,
};
