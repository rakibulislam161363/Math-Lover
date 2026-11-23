import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { liveClassesController } from "./live-classes.controller";
import {
  batchIdParamsSchema,
  createScheduleValidationSchema,
  createSessionValidationSchema,
  markAttendanceValidationSchema,
  sessionAttendanceParamsSchema,
  sessionIdParamsSchema,
  updateSessionValidationSchema,
} from "./live-classes.validation";

const router = Router();
const adminOnly = auth(UserRole.ADMIN);

router.get(
  "/batches/:batchId/schedules",
  validateRequest(batchIdParamsSchema, "params"),
  liveClassesController.listSchedules,
);
router.post(
  "/batches/:batchId/schedules",
  adminOnly,
  validateRequest(batchIdParamsSchema, "params"),
  validateRequest(createScheduleValidationSchema),
  liveClassesController.createSchedule,
);
router.get(
  "/batches/:batchId/sessions",
  auth(),
  validateRequest(batchIdParamsSchema, "params"),
  liveClassesController.listSessions,
);
router.post(
  "/batches/:batchId/sessions",
  adminOnly,
  validateRequest(batchIdParamsSchema, "params"),
  validateRequest(createSessionValidationSchema),
  liveClassesController.createSession,
);
router.patch(
  "/sessions/:id",
  adminOnly,
  validateRequest(sessionIdParamsSchema, "params"),
  validateRequest(updateSessionValidationSchema),
  liveClassesController.updateSession,
);
router.get(
  "/sessions/:sessionId/attendance",
  adminOnly,
  validateRequest(sessionAttendanceParamsSchema, "params"),
  liveClassesController.listAttendance,
);
router.put(
  "/sessions/:sessionId/attendance",
  adminOnly,
  validateRequest(sessionAttendanceParamsSchema, "params"),
  validateRequest(markAttendanceValidationSchema),
  liveClassesController.markAttendance,
);

export default router;
