import { prisma } from "../../lib/prisma";
import httpStatus from "http-status";
import { UserRole } from "../../../generated/prisma/enums";
import { HttpError } from "../../utils/httpError";
import { notifyBatchStudents } from "../notifications/notifications.service";
import {
  AttendanceInput,
  ScheduleCreateInput,
  ScheduleUpdateInput,
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
) =>
  prisma.$transaction(async (tx) => {
    const schedule = await tx.batchSchedule.create({
      data: { ...data, batchId },
    });
    if (schedule.isActive) {
      await notifyBatchStudents(tx, batchId, {
        title: "Class schedule updated",
        message: `${schedule.dayOfWeek}: ${schedule.startTime}-${schedule.endTime}`,
        type: "SCHEDULE_UPDATE",
        relatedEntityId: schedule.id,
      });
    }
    return schedule;
  });

export const updateSchedule = async (
  id: string,
  data: ScheduleUpdateInput,
) => {
  const existing = await prisma.batchSchedule.findUnique({
    where: { id },
    select: {
      batchId: true,
      startTime: true,
      endTime: true,
      effectiveFrom: true,
      effectiveUntil: true,
    },
  });
  if (!existing) {
    throw new HttpError(httpStatus.NOT_FOUND, "Batch schedule not found.");
  }
  const startTime = data.startTime ?? existing.startTime;
  const endTime = data.endTime ?? existing.endTime;
  const effectiveFrom =
    data.effectiveFrom === undefined
      ? existing.effectiveFrom
      : data.effectiveFrom;
  const effectiveUntil =
    data.effectiveUntil === undefined
      ? existing.effectiveUntil
      : data.effectiveUntil;
  if (endTime <= startTime) {
    throw new HttpError(
      httpStatus.BAD_REQUEST,
      "Schedule end time must be after its start time.",
    );
  }
  if (
    effectiveFrom &&
    effectiveUntil &&
    effectiveUntil < effectiveFrom
  ) {
    throw new HttpError(
      httpStatus.BAD_REQUEST,
      "Schedule end date must be on or after its start date.",
    );
  }

  return prisma.$transaction(async (tx) => {
    const schedule = await tx.batchSchedule.update({
      where: { id },
      data,
    });
    await notifyBatchStudents(tx, schedule.batchId, {
      title: schedule.isActive
        ? "Class schedule updated"
        : "Class schedule deactivated",
      message: `${schedule.dayOfWeek}: ${schedule.startTime}-${schedule.endTime}`,
      type: "SCHEDULE_UPDATE",
      relatedEntityId: schedule.id,
    });
    return schedule;
  });
};

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

  const sessions = await prisma.classSession.findMany({
    where: { batchId },
    orderBy: { startsAt: "asc" },
  });

  if (userRole === UserRole.ADMIN) return sessions;

  const now = new Date();
  return sessions.map((session) => {
    const joinAvailable =
      session.status !== "CANCELLED" &&
      session.status !== "COMPLETED" &&
      Boolean(session.meetUrl) &&
      now >= new Date(session.startsAt.getTime() - 10 * 60 * 1000) &&
      now <= session.endsAt;

    return {
      ...session,
      meetUrl: joinAvailable ? session.meetUrl : null,
      joinAvailable,
    };
  });
};

export const getJoinLink = async (
  sessionId: string,
  userId: string,
  userRole: UserRole,
) => {
  const session = await prisma.classSession.findUnique({
    where: { id: sessionId },
    select: {
      batchId: true,
      startsAt: true,
      endsAt: true,
      meetUrl: true,
      status: true,
    },
  });

  if (
    !session ||
    session.status === "CANCELLED" ||
    session.status === "COMPLETED"
  ) {
    throw new HttpError(httpStatus.NOT_FOUND, "Class session not found.");
  }

  if (userRole !== UserRole.ADMIN) {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        batchId: session.batchId,
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

    const now = new Date();
    if (
      now < new Date(session.startsAt.getTime() - 10 * 60 * 1000) ||
      now > session.endsAt
    ) {
      throw new HttpError(
        httpStatus.FORBIDDEN,
        "The class join window is not open.",
      );
    }
  }

  if (!session.meetUrl) {
    throw new HttpError(
      httpStatus.NOT_FOUND,
      "A meeting link is not available for this session.",
    );
  }

  return { meetUrl: session.meetUrl };
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

  return prisma.$transaction(async (tx) => {
    const session = await tx.classSession.create({
      data: { ...data, batchId },
    });
    await notifyBatchStudents(tx, batchId, {
      title: "New live class scheduled",
      message: `${session.title} starts at ${session.startsAt.toISOString()}.`,
      type: "SCHEDULE_UPDATE",
      relatedEntityId: session.id,
    });
    return session;
  });
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

  return prisma.$transaction(async (tx) => {
    const updatedSession = await tx.classSession.update({
      where: { id },
      data,
    });
    if (
      data.title !== undefined ||
      data.startsAt !== undefined ||
      data.endsAt !== undefined ||
      data.meetUrl !== undefined ||
      data.status !== undefined
    ) {
      await notifyBatchStudents(tx, session.batchId, {
        title: "Live class updated",
        message: `${updatedSession.title} is scheduled for ${updatedSession.startsAt.toISOString()}.`,
        type: "SCHEDULE_UPDATE",
        relatedEntityId: updatedSession.id,
      });
    }
    return updatedSession;
  });
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
