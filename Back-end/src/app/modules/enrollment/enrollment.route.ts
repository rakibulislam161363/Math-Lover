import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { enrollmentController } from "./enrollment.controller";
import {
  createEnrollmentValidationSchema,
  enrollmentIdParamsSchema,
  updateEnrollmentValidationSchema,
} from "./enrollment.validation";

const router = Router();
const adminOnly = auth(UserRole.ADMIN);
const studentOnly = auth(UserRole.STUDENT);

router.post(
  "/enrollments",
  studentOnly,
  validateRequest(createEnrollmentValidationSchema),
  enrollmentController.createEnrollment,
);
router.get("/enrollments/me", studentOnly, enrollmentController.listMyEnrollments);
router.get("/enrollments", adminOnly, enrollmentController.listEnrollments);
router.patch(
  "/enrollments/:id",
  adminOnly,
  validateRequest(enrollmentIdParamsSchema, "params"),
  validateRequest(updateEnrollmentValidationSchema),
  enrollmentController.updateEnrollment,
);

export default router;
