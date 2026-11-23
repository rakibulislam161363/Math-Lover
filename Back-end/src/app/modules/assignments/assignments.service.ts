import { prisma } from "../../lib/prisma";
import {
  AssignmentCreateInput,
  AssignmentSubmissionCreateInput,
  AssignmentSubmissionUpdateInput,
  AssignmentUpdateInput,
} from "./assignments.interface";

export const listAssignments = (
  batchId?: string,
  includeUnpublished = false,
) =>
  prisma.assignment.findMany({
    where: {
      batchId,
      isPublished: includeUnpublished ? undefined : true,
    },
    include: { batch: { include: { course: true } } },
    orderBy: { createdAt: "desc" },
  });

export const createAssignment = (data: AssignmentCreateInput) =>
  prisma.assignment.create({ data });

export const getAssignment = (id: string) =>
  prisma.assignment.findUnique({
    where: { id },
    include: {
      batch: { include: { course: true } },
      submissions: { include: { student: true, reviewer: true } },
    },
  });

export const updateAssignment = (id: string, data: AssignmentUpdateInput) =>
  prisma.assignment.update({ where: { id }, data });

export const deleteAssignment = (id: string) =>
  prisma.assignment.delete({ where: { id } });

export const listSubmissionsForAssignment = (assignmentId: string) =>
  prisma.assignmentSubmission.findMany({
    where: { assignmentId },
    include: { student: true, reviewer: true },
    orderBy: { submittedAt: "desc" },
  });

export const submitAssignment = (
  studentId: string,
  assignmentId: string,
  data: AssignmentSubmissionCreateInput,
) =>
  prisma.assignmentSubmission.upsert({
    where: {
      assignmentId_studentId: { assignmentId, studentId },
    },
    create: {
      ...data,
      assignmentId,
      studentId,
    },
    update: {
      answerText: data.answerText,
      fileUrl: data.fileUrl,
      status: "SUBMITTED",
      submittedAt: new Date(),
      marks: null,
      feedback: null,
      reviewedAt: null,
      reviewedBy: null,
    },
  });

export const listSubmissionsForStudent = (studentId: string) =>
  prisma.assignmentSubmission.findMany({
    where: { studentId },
    include: { assignment: true, reviewer: true },
    orderBy: { submittedAt: "desc" },
  });

export const reviewSubmission = (
  reviewerId: string,
  id: string,
  data: AssignmentSubmissionUpdateInput,
) =>
  prisma.assignmentSubmission.update({
    where: { id },
    data: {
      ...data,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      status: "REVIEWED",
    },
  });
