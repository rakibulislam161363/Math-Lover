import httpStatus from "http-status";
import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../utils/httpError";
import { notifyBatchStudents } from "../notifications/notifications.service";
import { NoticeCreateInput, NoticeUpdateInput } from "./notices.interface";

export const listNotices = async (
  batchId: string | undefined,
  userId: string,
  userRole: UserRole,
) => {
  const isAdmin = userRole === UserRole.ADMIN;

  if (isAdmin) {
    return prisma.notice.findMany({
      where: batchId ? { OR: [{ batchId }, { batchId: null }] } : undefined,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
  }

  let visibleBatchIds: string[];
  if (batchId) {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        batchId,
        studentId: userId,
        status: "ACTIVE",
      },
      select: { batchId: true },
    });
    if (!enrollment) {
      throw new HttpError(
        httpStatus.FORBIDDEN,
        "Active enrollment is required to view batch notices.",
      );
    }
    visibleBatchIds = [batchId];
  } else {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: userId, status: "ACTIVE" },
      select: { batchId: true },
    });
    visibleBatchIds = enrollments.map(
      ({ batchId: enrolledBatchId }) => enrolledBatchId,
    );
  }

  return prisma.notice.findMany({
    where: {
      isPublished: true,
      OR: [
        { batchId: null },
        ...(visibleBatchIds.length
          ? [{ batchId: { in: visibleBatchIds } }]
          : []),
      ],
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
};

export const createNotice = (data: NoticeCreateInput) =>
  prisma.$transaction(async (tx) => {
    const notice = await tx.notice.create({ data });
    if (notice.isPublished && notice.batchId) {
      await notifyBatchStudents(tx, notice.batchId, {
        title: notice.title,
        message: notice.content,
        type: "ANNOUNCEMENT",
        relatedEntityId: notice.id,
      });
    } else if (notice.isPublished) {
      const users = await tx.user.findMany({
        where: { role: "STUDENT", isActive: true },
        select: { id: true },
      });
      if (users.length) {
        await tx.notification.createMany({
          data: users.map(({ id }) => ({
            userId: id,
            title: notice.title,
            message: notice.content,
            type: "ANNOUNCEMENT",
            relatedEntityId: notice.id,
          })),
        });
      }
    }
    return notice;
  });

export const updateNotice = (id: string, data: NoticeUpdateInput) =>
  prisma.$transaction(async (tx) => {
    const existing = await tx.notice.findUnique({
      where: { id },
      select: { isPublished: true },
    });
    if (!existing) {
      throw new HttpError(httpStatus.NOT_FOUND, "Notice not found.");
    }

    const notice = await tx.notice.update({ where: { id }, data });
    if (!existing.isPublished && notice.isPublished) {
      if (notice.batchId) {
        await notifyBatchStudents(tx, notice.batchId, {
          title: notice.title,
          message: notice.content,
          type: "ANNOUNCEMENT",
          relatedEntityId: notice.id,
        });
      } else {
        const users = await tx.user.findMany({
          where: { role: "STUDENT", isActive: true },
          select: { id: true },
        });
        if (users.length) {
          await tx.notification.createMany({
            data: users.map(({ id }) => ({
              userId: id,
              title: notice.title,
              message: notice.content,
              type: "ANNOUNCEMENT",
              relatedEntityId: notice.id,
            })),
          });
        }
      }
    }
    return notice;
  });

export const deleteNotice = (id: string) =>
  prisma.notice.delete({ where: { id } });
