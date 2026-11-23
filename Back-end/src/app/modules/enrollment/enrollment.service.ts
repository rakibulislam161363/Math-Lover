import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../utils/httpError";
import { EnrollmentUpdateInput } from "./enrollment.interface";

export const createEnrollment = async (studentId: string, batchId: string) => {
  const [profile, batch, existingEnrollment] = await Promise.all([
    prisma.studentProfile.findUnique({
      where: { userId: studentId },
      select: { classLevel: true },
    }),
    prisma.batch.findUnique({
      where: { id: batchId },
      select: {
        status: true,
        enrollmentOpen: true,
        capacity: true,
        endDate: true,
        course: { select: { classLevel: true, isPublished: true } },
      },
    }),
    prisma.enrollment.findUnique({
      where: { studentId_batchId: { studentId, batchId } },
      select: { id: true },
    }),
  ]);

  if (!profile) {
    throw new HttpError(
      httpStatus.BAD_REQUEST,
      "Complete your student profile before enrolling.",
    );
  }
  if (
    !batch ||
    batch.status !== "ACTIVE" ||
    !batch.enrollmentOpen ||
    (batch.endDate !== null && batch.endDate <= new Date()) ||
    !batch.course.isPublished ||
    batch.course.classLevel !== profile.classLevel
  ) {
    throw new HttpError(
      httpStatus.BAD_REQUEST,
      "This batch is not available for your selected class.",
    );
  }
  if (existingEnrollment) {
    throw new HttpError(
      httpStatus.CONFLICT,
      "You already have an enrollment for this batch.",
    );
  }

  if (batch.capacity !== null) {
    const enrolledCount = await prisma.enrollment.count({
      where: {
        batchId,
        status: { in: ["PENDING", "ACTIVE"] },
      },
    });
    if (enrolledCount >= batch.capacity) {
      throw new HttpError(httpStatus.CONFLICT, "This batch is full.");
    }
  }

  return prisma.enrollment.create({
    data: { batchId, studentId, status: "PENDING" },
  });
};

export const listEnrollmentsForStudent = (studentId: string) =>
  prisma.enrollment.findMany({
    where: { studentId },
    include: { batch: { include: { course: true } } },
  });

export const listEnrollments = () =>
  prisma.enrollment.findMany({
    include: {
      student: {
        select: { id: true, fullName: true, email: true, phone: true },
      },
      batch: { include: { course: true } },
    },
  });

export const updateEnrollment = (
  id: string,
  adminId: string,
  data: EnrollmentUpdateInput,
) =>
  prisma.$transaction(async (tx) => {
    const enrollment = await tx.enrollment.findUnique({
      where: { id },
      select: {
        status: true,
        recordedAccessUntil: true,
        liveAccessEnabled: true,
        materialAccessEnabled: true,
        assignmentAccessEnabled: true,
      },
    });
    if (!enrollment) {
      throw new HttpError(httpStatus.NOT_FOUND, "Enrollment not found.");
    }

    const { reason, ...updateData } = data;
    const updatedEnrollment = await tx.enrollment.update({
      where: { id },
      data: updateData,
    });

    const auditEntries: Array<{
      enrollmentId: string;
      adminId: string;
      accessType: "RECORDED" | "LIVE" | "MATERIAL" | "ASSIGNMENT";
      action: "SUSPENDED" | "RESTORED" | "GRANTED" | "REVOKED";
      reason?: string;
    }> = [];
    const logAccess = (
      accessType: "RECORDED" | "LIVE" | "MATERIAL" | "ASSIGNMENT",
      action: "SUSPENDED" | "RESTORED" | "GRANTED" | "REVOKED",
    ) => {
      auditEntries.push({
        enrollmentId: id,
        adminId,
        accessType,
        action,
        reason,
      });
    };

    if (
      data.liveAccessEnabled !== undefined &&
      data.liveAccessEnabled !== enrollment.liveAccessEnabled
    ) {
      logAccess("LIVE", data.liveAccessEnabled ? "GRANTED" : "REVOKED");
    }
    if (
      data.materialAccessEnabled !== undefined &&
      data.materialAccessEnabled !== enrollment.materialAccessEnabled
    ) {
      logAccess(
        "MATERIAL",
        data.materialAccessEnabled ? "GRANTED" : "REVOKED",
      );
    }
    if (
      data.assignmentAccessEnabled !== undefined &&
      data.assignmentAccessEnabled !== enrollment.assignmentAccessEnabled
    ) {
      logAccess(
        "ASSIGNMENT",
        data.assignmentAccessEnabled ? "GRANTED" : "REVOKED",
      );
    }
    if (data.recordedAccessUntil !== undefined) {
      const oldValue = enrollment.recordedAccessUntil?.getTime() ?? null;
      const newValue =
        data.recordedAccessUntil instanceof Date
          ? data.recordedAccessUntil.getTime()
          : data.recordedAccessUntil ?? null;
      if (newValue !== oldValue) {
        logAccess(
          "RECORDED",
          newValue === null || newValue > Date.now() ? "GRANTED" : "REVOKED",
        );
      }
    }
    if (data.status !== undefined && data.status !== enrollment.status) {
      const action =
        data.status === "SUSPENDED"
          ? "SUSPENDED"
          : data.status === "CANCELLED"
            ? "REVOKED"
            : ["ACTIVE", "COMPLETED"].includes(data.status) &&
                !["ACTIVE", "COMPLETED"].includes(enrollment.status)
              ? enrollment.status === "SUSPENDED"
                ? "RESTORED"
                : "GRANTED"
              : undefined;
      if (action) {
        for (const accessType of [
          "RECORDED",
          "LIVE",
          "MATERIAL",
          "ASSIGNMENT",
        ] as const) {
          logAccess(accessType, action);
        }
      }
    }

    if (auditEntries.length) {
      await tx.accessAuditLog.createMany({ data: auditEntries });
    }

    return updatedEnrollment;
  });
