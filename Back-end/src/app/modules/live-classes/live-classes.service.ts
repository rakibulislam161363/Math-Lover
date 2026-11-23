import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import { UserRole } from "../../../generated/prisma/enums";
import { HttpError } from "../../utils/httpError";
import {
  AttendanceInput,
  ScheduleCreateInput,
  SessionCreateInput,
  SessionUpdateInput,
} from "./live-classes.interface";

export const listSchedules = (batchId: string) =>
  prisma.batchSchedule.findMany({
    where: { batchId },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

export const createSchedule = (
  batchId: string,
  data: ScheduleCreateInput,
) => prisma.batchSchedule.create({ data: { ...data, batchId } });

export const listSessions = async (
  batchId: string,
  userId: string,
  userRole: UserRole,
) => {
  if (userRole !== UserRole.ADMIN) {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        batchId,
        studentId: userId,
        status: "ACTIVE",
        liveAccessEnabled: true,
      },
      select: { id: true },
    });
    if (!enrollment) {
      throw new HttpError(
        httpStatus.FORBIDDEN,
        "Active enrollment with live-class access is required.",
      );
    }
  }

  return prisma.classSession.findMany({
    where: { batchId },
    orderBy: { startsAt: "asc" },
  });
};

export const createSession = async (
  batchId: string,
  data: SessionCreateInput,
) => {
  if (data.scheduleId) {
    const schedule = await prisma.batchSchedule.findFirst({
      where: { id: data.scheduleId, batchId },
      select: { id: true },
    });
    if (!schedule) {
      throw new HttpError(
        httpStatus.BAD_REQUEST,
        "Schedule must belong to the selected batch.",
      );
    }
  }

  return prisma.classSession.create({ data: { ...data, batchId } });
};

export const updateSession = async (
  id: string,
  data: SessionUpdateInput,
) => {
  const session = await prisma.classSession.findUnique({
    where: { id },
    select: { batchId: true, startsAt: true, endsAt: true },
  });
  if (!session) {
    throw new HttpError(httpStatus.NOT_FOUND, "Class session not found.");
  }

  const startsAt = data.startsAt ?? session.startsAt;
  const endsAt = data.endsAt ?? session.endsAt;
  if (endsAt <= startsAt) {
    throw new HttpError(
      httpStatus.BAD_REQUEST,
      "Session end time must be after its start time.",
    );
  }

  if (data.scheduleId) {
    const schedule = await prisma.batchSchedule.findFirst({
      where: { id: data.scheduleId, batchId: session.batchId },
      select: { id: true },
    });
    if (!schedule) {
      throw new HttpError(
        httpStatus.BAD_REQUEST,
        "Schedule must belong to the session's batch.",
      );
    }
  }

  return prisma.classSession.update({ where: { id }, data });
};

export const listAttendance = (sessionId: string) =>
  prisma.attendance.findMany({
    where: { sessionId },
    include: {
      student: {
        select: { id: true, fullName: true, email: true, phone: true },
      },
    },
    orderBy: { markedAt: "desc" },
  });

export const markAttendance = (
  sessionId: string,
  markedBy: string,
  data: AttendanceInput,
) =>
  prisma.attendance.upsert({
    where: {
      sessionId_studentId: { sessionId, studentId: data.studentId },
    },
    create: { ...data, sessionId, markedBy },
    update: { status: data.status, markedBy, markedAt: new Date() },
  });
