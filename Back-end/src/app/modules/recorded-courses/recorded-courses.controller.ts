import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { HttpError } from "../../utils/httpError";
import { sendResponse } from "../../utils/sendResponse";
import * as recordedCoursesService from "./recorded-courses.service";
import {
  ChapterCreateInput,
  ChapterUpdateInput,
  LessonCreateInput,
  LessonProgressUpdateInput,
  LessonUpdateInput,
} from "./recorded-courses.interface";

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

const listChapters = respond("Chapters retrieved successfully.", (req) => {
  const user = requireUser(req);
  return recordedCoursesService.listChapters(
    param(req, "batchId"),
    user.id,
    user.role,
  );
});

const createChapter = respond(
  "Chapter created successfully.",
  (req) =>
    recordedCoursesService.createChapter(
      param(req, "batchId"),
      req.body as ChapterCreateInput,
    ),
  httpStatus.CREATED,
);

const updateChapter = respond("Chapter updated successfully.", (req) =>
  recordedCoursesService.updateChapter(
    param(req, "id"),
    req.body as ChapterUpdateInput,
  ),
);

const deleteChapter = respond("Chapter deleted successfully.", (req) =>
  recordedCoursesService.deleteChapter(param(req, "id")),
);

const listLessons = respond("Lessons retrieved successfully.", (req) => {
  const user = requireUser(req);
  return recordedCoursesService.listLessons(
    param(req, "chapterId"),
    user.id,
    user.role,
  );
});

const createLesson = respond(
  "Lesson created successfully.",
  (req) =>
    recordedCoursesService.createLesson(
      param(req, "chapterId"),
      req.body as LessonCreateInput,
    ),
  httpStatus.CREATED,
);

const updateLesson = respond("Lesson updated successfully.", (req) =>
  recordedCoursesService.updateLesson(
    param(req, "id"),
    req.body as LessonUpdateInput,
  ),
);

const deleteLesson = respond("Lesson deleted successfully.", (req) =>
  recordedCoursesService.deleteLesson(param(req, "id")),
);

const getLessonProgress = respond(
  "Lesson progress retrieved successfully.",
  (req) =>
    recordedCoursesService.getLessonProgress(
      requireUser(req).id,
      param(req, "lessonId"),
    ),
);

const updateLessonProgress = respond(
  "Lesson progress updated successfully.",
  (req) =>
    recordedCoursesService.updateLessonProgress(
      requireUser(req).id,
      param(req, "lessonId"),
      req.body as LessonProgressUpdateInput,
    ),
);

export const recordedCoursesController = {
  listChapters,
  createChapter,
  updateChapter,
  deleteChapter,
  listLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonProgress,
  updateLessonProgress,
};
