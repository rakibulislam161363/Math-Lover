import { prisma } from "../../lib/prisma";
import { NoticeCreateInput, NoticeUpdateInput } from "./notices.interface";

export const listNotices = (batchId?: string) =>
  prisma.notice.findMany({
    where: {
      isPublished: true,
      ...(batchId
        ? { OR: [{ batchId }, { batchId: null }] }
        : {}),
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

export const createNotice = (data: NoticeCreateInput) =>
  prisma.notice.create({ data });

export const updateNotice = (id: string, data: NoticeUpdateInput) =>
  prisma.notice.update({ where: { id }, data });

export const deleteNotice = (id: string) =>
  prisma.notice.delete({ where: { id } });
