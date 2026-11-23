import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { quizzesController } from "./quizzes.controller";
import {
  attemptIdParamsSchema,
  batchIdParamsSchema,
  createQuizValidationSchema,
  quizAttemptParamsSchema,
  quizIdParamsSchema,
  submitQuizAttemptValidationSchema,
  updateQuizValidationSchema,
} from "./quizzes.validation";

const router = Router();
const adminOnly = auth(UserRole.ADMIN);

router.get(
  "/batches/:batchId/quizzes",
  auth(),
  validateRequest(batchIdParamsSchema, "params"),
  quizzesController.listQuizzes,
);
router.post(
  "/batches/:batchId/quizzes",
  adminOnly,
  validateRequest(batchIdParamsSchema, "params"),
  validateRequest(createQuizValidationSchema),
  quizzesController.createQuiz,
);
router.patch(
  "/quizzes/:id",
  adminOnly,
  validateRequest(quizIdParamsSchema, "params"),
  validateRequest(updateQuizValidationSchema),
  quizzesController.updateQuiz,
);
router.post(
  "/quizzes/:quizId/attempts",
  auth(UserRole.STUDENT),
  validateRequest(quizAttemptParamsSchema, "params"),
  quizzesController.startQuizAttempt,
);
router.post(
  "/quiz-attempts/:attemptId/submit",
  auth(UserRole.STUDENT),
  validateRequest(attemptIdParamsSchema, "params"),
  validateRequest(submitQuizAttemptValidationSchema),
  quizzesController.submitQuizAttempt,
);
router.get(
  "/quiz-attempts/me",
  auth(UserRole.STUDENT),
  quizzesController.listMyQuizAttempts,
);

export default router;
