import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { HttpError } from "../../utils/httpError";
import { sendResponse } from "../../utils/sendResponse";
import * as quizzesService from "./quizzes.service";
import {
  QuizAnswersInput,
  QuizCreateInput,
  QuizUpdateInput,
} from "./quizzes.interface";

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

const listQuizzes = respond("Quizzes retrieved successfully.", (req) =>
  quizzesService.listQuizzes(param(req, "batchId")),
);

const createQuiz = respond(
  "Quiz created successfully.",
  (req) =>
    quizzesService.createQuiz(
      param(req, "batchId"),
      req.body as QuizCreateInput,
    ),
  httpStatus.CREATED,
);

const updateQuiz = respond("Quiz updated successfully.", (req) =>
  quizzesService.updateQuiz(param(req, "id"), req.body as QuizUpdateInput),
);

const startQuizAttempt = respond(
  "Quiz attempt started successfully.",
  (req) =>
    quizzesService.startQuizAttempt(
      param(req, "quizId"),
      requireUser(req).id,
    ),
  httpStatus.CREATED,
);

const submitQuizAttempt = respond(
  "Quiz submitted successfully.",
  async (req) => {
    const attempt = await quizzesService.submitQuizAttempt(
      param(req, "attemptId"),
      requireUser(req).id,
      req.body as QuizAnswersInput,
    );
    if (!attempt) {
      throw new HttpError(httpStatus.NOT_FOUND, "Quiz attempt not found.");
    }
    return attempt;
  },
);

const listMyQuizAttempts = respond(
  "Quiz attempts retrieved successfully.",
  (req) => quizzesService.listQuizAttemptsForStudent(requireUser(req).id),
);

export const quizzesController = {
  listQuizzes,
  createQuiz,
  updateQuiz,
  startQuizAttempt,
  submitQuizAttempt,
  listMyQuizAttempts,
};
