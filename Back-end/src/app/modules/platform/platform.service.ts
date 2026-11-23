import { prisma } from "../../lib/prisma";
import {
  AssignmentCreateInput,
  AssignmentSubmissionInput,
  AssignmentUpdateInput,
  SubmissionReviewInput,
} from "./platform.interface";

export const listAssignments = (batchId: string) =>
  prisma.assignment.findMany({ where: { batchId } });
export const createAssignment = (
  batchId: string,
  data: AssignmentCreateInput,
) => prisma.assignment.create({ data: { ...data, batchId } });
export const updateAssignment = (id: string, data: AssignmentUpdateInput) =>
  prisma.assignment.update({ where: { id }, data });
export const deleteAssignment = (id: string) =>
  prisma.assignment.delete({ where: { id } });
export const submitAssignment = (
  assignmentId: string,
  studentId: string,
  data: AssignmentSubmissionInput,
) =>
  prisma.assignmentSubmission.upsert({
    where: { assignmentId_studentId: { assignmentId, studentId } },
    create: { ...data, assignmentId, studentId },
    update: { ...data, status: "SUBMITTED" },
  });
export const listSubmissions = (assignmentId: string) =>
  prisma.assignmentSubmission.findMany({
    where: { assignmentId },
    include: { student: true },
  });
export const reviewSubmission = (
  id: string,
  reviewerId: string,
  data: SubmissionReviewInput,
) =>
  prisma.assignmentSubmission.update({
    where: { id },
    data: {
      ...data,
      status: "REVIEWED",
      reviewedAt: new Date(),
      reviewedBy: reviewerId,
    },
  });

