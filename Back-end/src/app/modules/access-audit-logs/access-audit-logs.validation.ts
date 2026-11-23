import { z } from "zod";

export const createAccessAuditLogValidationSchema = z.object({
  enrollmentId: z.uuid("A valid enrollment ID is required."),
  accessType: z.enum(["RECORDED", "LIVE", "MATERIAL", "ASSIGNMENT"]),
  action: z.enum(["SUSPENDED", "RESTORED", "GRANTED", "REVOKED"]),
  reason: z.string().trim().max(1000).optional(),
});

export const listAccessAuditLogsParamsSchema = z.object({
  enrollmentId: z.uuid("A valid enrollment ID is required."),
});
