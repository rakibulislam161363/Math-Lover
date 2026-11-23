import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { accessAuditLogsController } from "./access-audit-logs.controller";
import {
  createAccessAuditLogValidationSchema,
  listAccessAuditLogsParamsSchema,
} from "./access-audit-logs.validation";

const router = Router();
const adminOnly = auth(UserRole.ADMIN);

router.post(
  "/access-logs",
  adminOnly,
  validateRequest(createAccessAuditLogValidationSchema),
  accessAuditLogsController.createAccessAuditLog,
);
router.get(
  "/enrollments/:enrollmentId/access-logs",
  adminOnly,
  validateRequest(listAccessAuditLogsParamsSchema, "params"),
  accessAuditLogsController.listAccessAuditLogs,
);

export default router;
