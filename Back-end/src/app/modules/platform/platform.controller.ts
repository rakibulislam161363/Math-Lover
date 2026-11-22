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
  AttendanceInput,
  ChapterCreateInput,
  ChapterUpdateInput,
  LessonCreateInput,
  LessonProgressInput,
  LessonUpdateInput,
  MaterialCreateInput,
  MaterialUpdateInput,
  NoticeCreateInput,
  NoticeUpdateInput,
  QuizAnswersInput,
  QuizCreateInput,
  QuizUpdateInput,
  ScheduleCreateInput,
  SessionCreateInput,
  SessionUpdateInput,
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

const listChapters = respond("Chapters retrieved successfully.", (req) =>
  platformService.listChapters(param(req, "batchId")),
);
const createChapter = respond(
  "Chapter created successfully.",
  (req) =>
    platformService.createChapter(
      param(req, "batchId"),
      req.body as ChapterCreateInput,
    ),
  httpStatus.CREATED,
);
const updateChapter = respond("Chapter updated successfully.", (req) =>
  platformService.updateChapter(param(req, "id"), req.body as ChapterUpdateInput),
);
const deleteChapter = respond("Chapter deleted successfully.", (req) =>
  platformService.deleteChapter(param(req, "id")),
);

const listLessons = respond("Lessons retrieved successfully.", (req) =>
  platformService.listLessons(param(req, "chapterId")),
);
const createLesson = respond(
  "Lesson created successfully.",
  (req) =>
    platformService.createLesson(
      param(req, "chapterId"),
      req.body as LessonCreateInput,
    ),
  httpStatus.CREATED,
);
const updateLesson = respond("Lesson updated successfully.", (req) =>
  platformService.updateLesson(param(req, "id"), req.body as LessonUpdateInput),
);
const deleteLesson = respond("Lesson deleted successfully.", (req) =>
  platformService.deleteLesson(param(req, "id")),
);
const getLessonProgress = respond(
  "Lesson progress retrieved successfully.",
  (req) =>
    platformService.getLessonProgress(
      requireUser(req).id,
      param(req, "lessonId"),
    ),
);
const updateLessonProgress = respond(
  "Lesson progress updated successfully.",
  (req) =>
    platformService.updateLessonProgress(
      requireUser(req).id,
      param(req, "lessonId"),
      req.body as LessonProgressInput,
    ),
);

const listMaterials = respond("Materials retrieved successfully.", (req) =>
  platformService.listMaterials(param(req, "batchId")),
);
const createMaterial = respond(
  "Material created successfully.",
  (req) =>
    platformService.createMaterial(
      param(req, "batchId"),
      req.body as MaterialCreateInput,
    ),
  httpStatus.CREATED,
);
const updateMaterial = respond("Material updated successfully.", (req) =>
  platformService.updateMaterial(
    param(req, "id"),
    req.body as MaterialUpdateInput,
  ),
);
const deleteMaterial = respond("Material deleted successfully.", (req) =>
  platformService.deleteMaterial(param(req, "id")),
);

const listSchedules = respond("Schedules retrieved successfully.", (req) =>
  platformService.listSchedules(param(req, "batchId")),
);
const createSchedule = respond(
  "Schedule created successfully.",
  (req) =>
    platformService.createSchedule(
      param(req, "batchId"),
      req.body as ScheduleCreateInput,
    ),
  httpStatus.CREATED,
);
const listSessions = respond("Sessions retrieved successfully.", (req) =>
  platformService.listSessions(param(req, "batchId")),
);
const createSession = respond(
  "Session created successfully.",
  (req) =>
    platformService.createSession(
      param(req, "batchId"),
      req.body as SessionCreateInput,
    ),
  httpStatus.CREATED,
);
const updateSession = respond("Session updated successfully.", (req) =>
  platformService.updateSession(
    param(req, "id"),
    req.body as SessionUpdateInput,
  ),
);
const listAttendance = respond("Attendance retrieved successfully.", (req) =>
  platformService.listAttendance(param(req, "sessionId")),
);
const markAttendance = respond("Attendance marked successfully.", (req) =>
  platformService.markAttendance(
    param(req, "sessionId"),
    requireUser(req).id,
    req.body as AttendanceInput,
  ),
);

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

const listQuizzes = respond("Quizzes retrieved successfully.", (req) =>
  platformService.listQuizzes(param(req, "batchId")),
);
const createQuiz = respond(
  "Quiz created successfully.",
  (req) =>
    platformService.createQuiz(
      param(req, "batchId"),
      req.body as QuizCreateInput,
    ),
  httpStatus.CREATED,
);
const updateQuiz = respond("Quiz updated successfully.", (req) =>
  platformService.updateQuiz(param(req, "id"), req.body as QuizUpdateInput),
);
const startQuizAttempt = respond(
  "Quiz attempt started successfully.",
  (req) =>
    platformService.startQuizAttempt(
      param(req, "quizId"),
      requireUser(req).id,
    ),
  httpStatus.CREATED,
);
const submitQuizAttempt = respond("Quiz submitted successfully.", async (req) => {
  const attempt = await platformService.submitQuizAttempt(
    param(req, "attemptId"),
    requireUser(req).id,
    req.body as QuizAnswersInput,
  );
  if (!attempt) {
    throw new HttpError(httpStatus.NOT_FOUND, "Quiz attempt not found.");
  }
  return attempt;
});
const listMyQuizAttempts = respond(
  "Quiz attempts retrieved successfully.",
  (req) => platformService.listQuizAttemptsForStudent(requireUser(req).id),
);

const listNotices = respond("Notices retrieved successfully.", (req) =>
  platformService.listNotices(param(req, "batchId")),
);
const createNotice = respond(
  "Notice created successfully.",
  (req) => platformService.createNotice(req.body as NoticeCreateInput),
  httpStatus.CREATED,
);
const updateNotice = respond("Notice updated successfully.", (req) =>
  platformService.updateNotice(param(req, "id"), req.body as NoticeUpdateInput),
);
const deleteNotice = respond("Notice deleted successfully.", (req) =>
  platformService.deleteNotice(param(req, "id")),
);

const listMyNotifications = respond(
  "Notifications retrieved successfully.",
  (req) => platformService.listNotificationsForUser(requireUser(req).id),
);
const markNotificationRead = respond(
  "Notification marked as read.",
  (req) =>
    platformService.markNotificationRead(
      param(req, "id"),
      requireUser(req).id,
    ),
);

export const platformController = {
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
  listMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  listSchedules,
  createSchedule,
  listSessions,
  createSession,
  updateSession,
  listAttendance,
  markAttendance,
  listAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  listSubmissions,
  reviewSubmission,
  listQuizzes,
  createQuiz,
  updateQuiz,
  startQuizAttempt,
  submitQuizAttempt,
  listMyQuizAttempts,
  listNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  listMyNotifications,
  markNotificationRead,
};
