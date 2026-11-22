import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { enrollmentController } from "./enrollment.controller";

const router = Router();
const adminOnly = auth(UserRole.ADMIN);

router.post("/enrollments", auth(), enrollmentController.createEnrollment);
router.get("/enrollments/me", auth(), enrollmentController.listMyEnrollments);
router.get("/enrollments", adminOnly, enrollmentController.listEnrollments);
router.patch("/enrollments/:id", adminOnly, enrollmentController.updateEnrollment);
router.post("/access-logs", adminOnly, enrollmentController.createAccessLog);
router.get(
  "/enrollments/:enrollmentId/access-logs",
  adminOnly,
  enrollmentController.listAccessLogs,
);

export default router;
