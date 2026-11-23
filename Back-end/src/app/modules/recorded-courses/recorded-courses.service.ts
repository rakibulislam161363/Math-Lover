import httpStatus from "http-status";
import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../utils/httpError";
import {
  ChapterCreateInput,
  ChapterUpdateInput,
  LessonCreateInput,
  LessonProgressUpdateInput,
  LessonUpdateInput,
} from "./recorded-courses.interface";

const assertRecordedAccess = async (
  studentId: string,
  batchId: string,
  requireMaterials = false,
) => {
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentId,
      batchId,
      status: { in: ["ACTIVE", "COMPLETED"] },
      ...(requireMaterials
        ? { materialAccessEnabled: true }
        : {
            OR: [
              { recordedAccessUntil: null },
              { recordedAccessUntil: { gt: new Date() } },
            ],
          }),
    },
    select: { id: true },
  });

  if (!enrollment) {
    throw new HttpError(
      httpStatus.FORBIDDEN,
      requireMaterials
        ? "Active material access is required for this batch."
        : "Recorded-course access is not available for this batch.",
    );
  }
};

const assertLessonAccess = async (
  lessonId: string,
  studentId: string,
): Promise<void> => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      isPublished: true,
      chapter: { select: { batchId: true, isPublished: true } },
    },
  });

  if (!lesson || !lesson.isPublished || !lesson.chapter.isPublished) {
    throw new HttpError(httpStatus.NOT_FOUND, "Published lesson not found.");
  }

  await assertRecordedAccess(studentId, lesson.chapter.batchId);
};

export const listChapters = async (
  batchId: string,
  userId: string,
  userRole: UserRole,
) => {
  const isAdmin = userRole === UserRole.ADMIN;
  if (!isAdmin) {
    await assertRecordedAccess(userId, batchId);
  }

  return prisma.chapter.findMany({
    where: { batchId, isPublished: isAdmin ? undefined : true },
    orderBy: { sortOrder: "asc" },
    include: {
      lessons: {
        where: { isPublished: isAdmin ? undefined : true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
};

export const createChapter = (batchId: string, data: ChapterCreateInput) =>
  prisma.chapter.create({ data: { ...data, batchId } });

export const updateChapter = (id: string, data: ChapterUpdateInput) =>
  prisma.chapter.update({ where: { id }, data });

export const deleteChapter = (id: string) =>
  prisma.chapter.delete({ where: { id } });

export const listLessons = async (
  chapterId: string,
  userId: string,
  userRole: UserRole,
) => {
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    select: { batchId: true, isPublished: true },
  });
  if (!chapter || (userRole !== UserRole.ADMIN && !chapter.isPublished)) {
    throw new HttpError(httpStatus.NOT_FOUND, "Published chapter not found.");
  }

  if (userRole !== UserRole.ADMIN) {
    await assertRecordedAccess(userId, chapter.batchId);
  }

  return prisma.lesson.findMany({
    where: {
      chapterId,
      isPublished: userRole === UserRole.ADMIN ? undefined : true,
    },
    orderBy: { sortOrder: "asc" },
  });
};

export const createLesson = async (
  chapterId: string,
  data: LessonCreateInput,
) => {
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    select: { id: true },
  });
  if (!chapter) {
    throw new HttpError(httpStatus.NOT_FOUND, "Chapter not found.");
  }

  return prisma.lesson.create({ data: { ...data, chapterId } });
};

export const updateLesson = (id: string, data: LessonUpdateInput) =>
  prisma.lesson.update({ where: { id }, data });

export const deleteLesson = (id: string) =>
  prisma.lesson.delete({ where: { id } });

export const getLessonProgress = async (
  studentId: string,
  lessonId: string,
) => {
  await assertLessonAccess(lessonId, studentId);
  return prisma.lessonProgress.findUnique({
    where: { studentId_lessonId: { studentId, lessonId } },
  });
};

export const updateLessonProgress = async (
  studentId: string,
  lessonId: string,
  data: LessonProgressUpdateInput,
) => {
  await assertLessonAccess(lessonId, studentId);
  return prisma.lessonProgress.upsert({
    where: { studentId_lessonId: { studentId, lessonId } },
    create: {
      ...data,
      studentId,
      lessonId,
      lastWatchedAt: new Date(),
    },
    update: { ...data, lastWatchedAt: new Date() },
  });
};

