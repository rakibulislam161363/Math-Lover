import { prisma } from "../../lib/prisma";
import {
  EnrollmentStatus,
  UserRole,
} from "../../../generated/prisma/enums";
import {
  BatchCreateInput,
  BatchUpdateInput,
  CourseClassLevel,
  CourseCreateInput,
  CourseUpdateInput,
} from "./courses.interface";

export const listCourses = async (
  userId: string,
  userRole: UserRole,
  classLevel?: CourseClassLevel,
  includeUnpublished = false,
) => {
  const isAdmin = userRole === UserRole.ADMIN;
  const studentProfile = isAdmin
    ? null
    : await prisma.studentProfile.findUnique({
        where: { userId },
        select: { classLevel: true },
      });

  if (!isAdmin && !studentProfile) return [];

  return prisma.course.findMany({
    where: {
      isPublished: isAdmin && includeUnpublished ? undefined : true,
      classLevel: isAdmin ? classLevel : studentProfile?.classLevel,
    },
    include: {
      batches: isAdmin
        ? true
        : {
            where: {
              status: "ACTIVE",
              enrollmentOpen: true,
              OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
            },
          },
    },
  });
};

export const createCourse = (data: CourseCreateInput) =>
  prisma.course.create({ data });

export const getCourse = async (
  slug: string,
  userId: string,
  userRole: UserRole,
) => {
  const isAdmin = userRole === UserRole.ADMIN;
  const studentProfile = isAdmin
    ? null
    : await prisma.studentProfile.findUnique({
        where: { userId },
        select: { classLevel: true },
      });

  if (!isAdmin && !studentProfile) return null;

  return prisma.course.findFirst({
    where: {
      slug,
      isPublished: isAdmin ? undefined : true,
      classLevel: isAdmin ? undefined : studentProfile?.classLevel,
    },
    include: {
      batches: isAdmin
        ? true
        : {
            where: {
              status: "ACTIVE",
              enrollmentOpen: true,
              OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
            },
          },
    },
  });
};

export const updateCourse = (id: string, data: CourseUpdateInput) =>
  prisma.course.update({ where: { id }, data });

export const deleteCourse = (id: string) =>
  prisma.course.delete({ where: { id } });

export const listBatches = async (
  courseId: string | undefined,
  userId: string,
  userRole: UserRole,
) => {
  const isAdmin = userRole === UserRole.ADMIN;
  const studentProfile = isAdmin
    ? null
    : await prisma.studentProfile.findUnique({
        where: { userId },
        select: { classLevel: true },
      });

  if (!isAdmin && !studentProfile) return [];
  const classLevel = studentProfile?.classLevel;

  return prisma.batch.findMany({
    where: {
      courseId,
      ...(isAdmin
        ? {}
        : {
            status: "ACTIVE",
            enrollmentOpen: true,
            OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
            course: {
              is: {
                isPublished: true,
                classLevel,
              },
            },
          }),
    },
    include: { course: true },
  });
};

export const createBatch = (data: BatchCreateInput) =>
  prisma.batch.create({ data });

export const getBatch = async (
  id: string,
  userId: string,
  userRole: UserRole,
) => {
  const isAdmin = userRole === UserRole.ADMIN;
  if (isAdmin) {
    return prisma.batch.findUnique({
      where: { id },
      include: { course: true, schedules: true, chapters: true },
    });
  }

  const now = new Date();
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { classLevel: true },
  });
  const visibilityConditions = [
    ...(studentProfile
      ? [
          {
            status: "ACTIVE" as const,
            enrollmentOpen: true,
            course: {
              is: {
                isPublished: true,
                classLevel: studentProfile.classLevel,
              },
            },
          },
        ]
      : []),
    {
      enrollments: {
        some: {
          studentId: userId,
          status: {
            in: [EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED],
          },
          OR: [
            { recordedAccessUntil: null },
            { recordedAccessUntil: { gt: now } },
          ],
        },
      },
    },
  ];

  return prisma.batch.findFirst({
    where: {
      id,
      AND: [
        { OR: [{ endDate: null }, { endDate: { gte: now } }] },
        { OR: visibilityConditions },
      ],
    },
    include: {
      course: true,
      schedules: true,
    },
  });
};

export const updateBatch = (id: string, data: BatchUpdateInput) =>
  prisma.batch.update({ where: { id }, data });

export const deleteBatch = (id: string) =>
  prisma.batch.delete({ where: { id } });
