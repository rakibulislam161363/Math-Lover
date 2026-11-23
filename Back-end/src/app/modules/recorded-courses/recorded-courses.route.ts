import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { recordedCoursesController } from "./recorded-courses.controller";
import {
  batchIdParamsSchema,
  chapterIdParamsSchema,
  createChapterValidationSchema,
  createLessonValidationSchema,
  idParamsSchema,
  lessonIdParamsSchema,
  lessonProgressValidationSchema,
  updateChapterValidationSchema,
  updateLessonValidationSchema,
} from "./recorded-courses.validation";

const router = Router();
const adminOnly = auth(UserRole.ADMIN);
const studentOnly = auth(UserRole.STUDENT);

router.get(
  "/batches/:batchId/chapters",
  auth(),
  validateRequest(batchIdParamsSchema, "params"),
  recordedCoursesController.listChapters,
);
router.post(
  "/batches/:batchId/chapters",
  adminOnly,
  validateRequest(batchIdParamsSchema, "params"),
  validateRequest(createChapterValidationSchema),
  recordedCoursesController.createChapter,
);
router.patch(
  "/chapters/:id",
  adminOnly,
  validateRequest(idParamsSchema, "params"),
  validateRequest(updateChapterValidationSchema),
  recordedCoursesController.updateChapter,
);
router.delete(
  "/chapters/:id",
  adminOnly,
  validateRequest(idParamsSchema, "params"),
  recordedCoursesController.deleteChapter,
);

router.get(
  "/chapters/:chapterId/lessons",
  auth(),
  validateRequest(chapterIdParamsSchema, "params"),
  recordedCoursesController.listLessons,
);
router.post(
  "/chapters/:chapterId/lessons",
  adminOnly,
  validateRequest(chapterIdParamsSchema, "params"),
  validateRequest(createLessonValidationSchema),
  recordedCoursesController.createLesson,
);
router.patch(
  "/lessons/:id",
  adminOnly,
  validateRequest(idParamsSchema, "params"),
  validateRequest(updateLessonValidationSchema),
  recordedCoursesController.updateLesson,
);
router.delete(
  "/lessons/:id",
  adminOnly,
  validateRequest(idParamsSchema, "params"),
  recordedCoursesController.deleteLesson,
);
router.get(
  "/lessons/:lessonId/progress",
  studentOnly,
  validateRequest(lessonIdParamsSchema, "params"),
  recordedCoursesController.getLessonProgress,
);
router.put(
  "/lessons/:lessonId/progress",
  studentOnly,
  validateRequest(lessonIdParamsSchema, "params"),
  validateRequest(lessonProgressValidationSchema),
  recordedCoursesController.updateLessonProgress,
);

export default router;
