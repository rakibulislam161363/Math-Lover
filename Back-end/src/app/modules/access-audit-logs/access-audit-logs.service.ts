import { prisma } from "../../lib/prisma";
import { AccessAuditLogCreateInput } from "./access-audit-logs.interface";

export const createAccessAuditLog = (data: AccessAuditLogCreateInput) =>
  prisma.accessAuditLog.create({
    data,
  });

export const listAccessAuditLogs = (enrollmentId: string) =>
  prisma.accessAuditLog.findMany({
    where: { enrollmentId },
    orderBy: { createdAt: "desc" },
  });
