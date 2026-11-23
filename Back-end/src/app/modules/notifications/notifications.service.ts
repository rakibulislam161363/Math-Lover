import { prisma } from "../../lib/prisma";

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
