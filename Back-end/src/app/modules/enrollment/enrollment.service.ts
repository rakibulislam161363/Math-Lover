import { prisma } from "../../lib/prisma";
import { EnrollmentUpdateInput } from "./enrollment.interface";

export const createEnrollment = (studentId: string, batchId: string) =>
  prisma.enrollment.create({
    data: { batchId, studentId, status: "PENDING" },
  });

export const listEnrollmentsForStudent = (studentId: string) =>
  prisma.enrollment.findMany({
    where: { studentId },
    include: { batch: { include: { course: true } } },
  });

export const listEnrollments = () =>
  prisma.enrollment.findMany({
    include: { student: true, batch: { include: { course: true } } },
  });

export const updateEnrollment = (
  id: string,
  data: EnrollmentUpdateInput,
) => prisma.enrollment.update({ where: { id }, data });
