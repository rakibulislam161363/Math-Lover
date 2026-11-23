import { Prisma } from "../../../generated/prisma/client";

export type AccessAuditLogCreateInput = Pick<
  Prisma.AccessAuditLogUncheckedCreateInput,
  "enrollmentId" | "adminId" | "accessType" | "action" | "reason"
>;
