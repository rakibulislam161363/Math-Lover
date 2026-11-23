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

router.post(
  "/enrollments",
  auth(),
  validateRequest(createEnrollmentValidationSchema),
  enrollmentController.createEnrollment,
);
router.get("/enrollments/me", auth(), enrollmentController.listMyEnrollments);
router.get("/enrollments", adminOnly, enrollmentController.listEnrollments);
router.patch(
  "/enrollments/:id",
  adminOnly,
  validateRequest(enrollmentIdParamsSchema, "params"),
  validateRequest(updateEnrollmentValidationSchema),
  enrollmentController.updateEnrollment,
);

export default router;
