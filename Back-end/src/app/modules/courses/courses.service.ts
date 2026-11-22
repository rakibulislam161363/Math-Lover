import { prisma } from "../../lib/prisma";
import {
  BatchCreateInput,
  BatchUpdateInput,
  CourseClassLevel,
  CourseCreateInput,
  CourseUpdateInput,
} from "./courses.interface";

export const listCourses = (
  classLevel?: CourseClassLevel,
  includeUnpublished = false,
) =>
  prisma.course.findMany({
    where: {
      isPublished: includeUnpublished ? undefined : true,
      classLevel,
    },
    include: { batches: true },
  });

export const createCourse = (data: CourseCreateInput) =>
  prisma.course.create({ data });

export const getCourse = (slug: string) =>
  prisma.course.findUnique({ where: { slug }, include: { batches: true } });

export const updateCourse = (id: string, data: CourseUpdateInput) =>
  prisma.course.update({ where: { id }, data });

export const deleteCourse = (id: string) =>
  prisma.course.delete({ where: { id } });

export const listBatches = (courseId?: string) =>
  prisma.batch.findMany({
    where: { courseId },
    include: { course: true },
  });

export const createBatch = (data: BatchCreateInput) =>
  prisma.batch.create({ data });

export const getBatch = (id: string) =>
  prisma.batch.findUnique({
    where: { id },
    include: { course: true, schedules: true, chapters: true },
  });

export const updateBatch = (id: string, data: BatchUpdateInput) =>
  prisma.batch.update({ where: { id }, data });

export const deleteBatch = (id: string) =>
  prisma.batch.delete({ where: { id } });
