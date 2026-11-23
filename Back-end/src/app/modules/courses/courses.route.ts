import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { coursesController } from "./courses.controller";
import {
  batchIdParamsSchema,
  courseIdParamsSchema,
  courseSlugParamsSchema,
  createBatchValidationSchema,
  createCourseValidationSchema,
  listBatchesQuerySchema,
  listCoursesQuerySchema,
  updateBatchValidationSchema,
  updateCourseValidationSchema,
} from "./courses.validation";

const router = Router();
const adminOnly = auth(UserRole.ADMIN);

router.get(
  "/courses",
  auth(),
  validateRequest(listCoursesQuerySchema, "query"),
  coursesController.listCourses,
);
router.post(
  "/courses",
  adminOnly,
  validateRequest(createCourseValidationSchema),
  coursesController.createCourse,
);
router.get(
  "/courses/:slug",
  auth(),
  validateRequest(courseSlugParamsSchema, "params"),
  coursesController.getCourse,
);
router.patch(
  "/courses/:id",
  adminOnly,
  validateRequest(courseIdParamsSchema, "params"),
  validateRequest(updateCourseValidationSchema),
  coursesController.updateCourse,
);
router.delete(
  "/courses/:id",
  adminOnly,
  validateRequest(courseIdParamsSchema, "params"),
  coursesController.deleteCourse,
);

router.get(
  "/batches",
  auth(),
  validateRequest(listBatchesQuerySchema, "query"),
  coursesController.listBatches,
);
router.post(
  "/batches",
  adminOnly,
  validateRequest(createBatchValidationSchema),
  coursesController.createBatch,
);
router.get(
  "/batches/:id",
  auth(),
  validateRequest(batchIdParamsSchema, "params"),
  coursesController.getBatch,
);
router.patch(
  "/batches/:id",
  adminOnly,
  validateRequest(batchIdParamsSchema, "params"),
  validateRequest(updateBatchValidationSchema),
  coursesController.updateBatch,
);
router.delete(
  "/batches/:id",
  adminOnly,
  validateRequest(batchIdParamsSchema, "params"),
  coursesController.deleteBatch,
);

export default router;
