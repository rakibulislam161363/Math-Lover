import { Prisma } from "../../../generated/prisma/client";

export type EnrollmentUpdateInput = Prisma.EnrollmentUncheckedUpdateInput;
export type AccessLogCreateInput = Omit<
  Prisma.AccessAuditLogUncheckedCreateInput,
  "adminId"
>;
