import { Prisma } from "../../../generated/prisma/client";
import { NotificationType } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

type NotificationClient = Prisma.TransactionClient;

export const notifyBatchStudents = async (
  client: NotificationClient,
  batchId: string,
  data: {
    title: string;
    message: string;
    type: NotificationType;
    relatedEntityId?: string;
  },
) => {
  const enrollments = await client.enrollment.findMany({
    where: { batchId, status: "ACTIVE" },
    select: { studentId: true },
    distinct: ["studentId"],
  });

  if (enrollments.length === 0) return;

  await client.notification.createMany({
    data: enrollments.map(({ studentId }) => ({
      ...data,
      userId: studentId,
    })),
  });
};

export const listNotificationsForUser = (userId: string) =>
  prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

export const markNotificationRead = (id: string, userId: string) =>
  prisma.notification.updateMany({
    where: { id, userId },
    data: { readAt: new Date() },
  });
