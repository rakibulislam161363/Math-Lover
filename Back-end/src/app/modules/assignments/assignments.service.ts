import httpStatus from "http-status";
import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../utils/httpError";
import {
  AssignmentCreateInput,
  AssignmentSubmissionCreateInput,
  AssignmentSubmissionUpdateInput,
  AssignmentUpdateInput,
} from "./assignments.interface";

export const listAssignments = (
  userId: string,
  userRole: UserRole,
  batchId?: string,
  includeUnpublished = false,
) => {
  const isAdmin = userRole === UserRole.ADMIN;

  return prisma.assignment.findMany({
    where: {
      batchId,
      isPublished: isAdmin && includeUnpublished ? undefined : true,
      ...(isAdmin
        ? {}
        : {
            batch: {
              is: {
                enrollments: {
                  some: {
                    studentId: userId,
                    status: "ACTIVE",
                    assignmentAccessEnabled: true,
                  },
                },
              },
            },
          }),
    },
    include: { batch: { include: { course: true } } },
    orderBy: { createdAt: "desc" },
  });
};

export const createAssignment = (
  data: AssignmentCreateInput,
  batchId?: string,
) =>
  prisma.assignment.create({
    data: { ...data, ...(batchId ? { batchId } : {}) },
  });

export const getAssignment = async (
  id: string,
  userId: string,
  userRole: UserRole,
) => {
  const isAdmin = userRole === UserRole.ADMIN;

  if (isAdmin) {
    return prisma.assignment.findUnique({
      where: { id },
      include: {
        batch: { include: { course: true } },
        submissions: {
          include: {
            student: {
              select: { id: true, fullName: true, email: true, phone: true },
            },
            reviewer: { select: { id: true, fullName: true } },
          },
        },
      },
    });
  }

  return prisma.assignment.findFirst({
    where: {
      id,
      isPublished: true,
      batch: {
        is: {
          enrollments: {
            some: {
              studentId: userId,
              status: "ACTIVE",
              assignmentAccessEnabled: true,
            },
          },
        },
      },
    },
    include: { batch: { include: { course: true } } },
  });
};

export const updateAssignment = (id: string, data: AssignmentUpdateInput) =>
  prisma.assignment.update({ where: { id }, data });

export const deleteAssignment = (id: string) =>
  prisma.assignment.delete({ where: { id } });

export const listSubmissionsForAssignment = (assignmentId: string) =>
  prisma.assignmentSubmission.findMany({
    where: { assignmentId },
    include: {
      student: {
        select: { id: true, fullName: true, email: true, phone: true },
      },
      reviewer: { select: { id: true, fullName: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

export const submitAssignment = async (
  studentId: string,
  assignmentId: string,
  data: AssignmentSubmissionCreateInput,
) => {
  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId, isPublished: true },
    select: { batchId: true },
  });

  if (!assignment) {
    throw new HttpError(httpStatus.NOT_FOUND, "Published assignment not found.");
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentId,
      batchId: assignment.batchId,
      status: "ACTIVE",
      assignmentAccessEnabled: true,
    },
    select: { id: true },
  });

  if (!enrollment) {
    throw new HttpError(
      httpStatus.FORBIDDEN,
      "Active assignment access is required for this batch.",
    );
  }

  return prisma.assignmentSubmission.upsert({
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
};

export const listSubmissionsForStudent = (studentId: string) =>
  prisma.assignmentSubmission.findMany({
    where: { studentId },
    include: {
      assignment: true,
      reviewer: { select: { id: true, fullName: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

export const reviewSubmission = async (
  reviewerId: string,
  id: string,
  data: AssignmentSubmissionUpdateInput,
) => {
  const submission = await prisma.assignmentSubmission.findUnique({
    where: { id },
    select: { assignment: { select: { totalMarks: true } } },
  });
  if (!submission) {
    throw new HttpError(httpStatus.NOT_FOUND, "Submission not found.");
  }
  if (
    data.marks !== undefined &&
    data.marks !== null &&
    Number(data.marks) > Number(submission.assignment.totalMarks)
  ) {
    throw new HttpError(
      httpStatus.BAD_REQUEST,
      "Awarded marks cannot exceed the assignment's total marks.",
    );
  }

  return prisma.assignmentSubmission.update({
    where: { id },
    data: {
      ...data,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      status: "REVIEWED",
    },
  });
};
