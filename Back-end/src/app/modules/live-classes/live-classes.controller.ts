import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { HttpError } from "../../utils/httpError";
import { sendResponse } from "../../utils/sendResponse";
import * as liveClassesService from "./live-classes.service";
import {
  AttendanceInput,
  ScheduleCreateInput,
  SessionCreateInput,
  SessionUpdateInput,
} from "./live-classes.interface";

type ControllerAction = (req: Request) => Promise<unknown>;

const respond = (
  message: string,
  action: ControllerAction,
  statusCode: number = httpStatus.OK,
) =>
  catchAsync(async (req: Request, res: Response) => {
    const data = await action(req);
    sendResponse(res, { success: true, statusCode, message, data });
  });

const param = (req: Request, name: string): string => {
  const value = req.params[name];
  return typeof value === "string" ? value : "";
};

const requireUser = (req: Request) => {
  if (!req.user) {
    throw new HttpError(
      httpStatus.UNAUTHORIZED,
      "Authentication required.",
    );
  }
  return req.user;
};

const listSchedules = respond("Schedules retrieved successfully.", (req) =>
  liveClassesService.listSchedules(param(req, "batchId")),
);

const createSchedule = respond(
  "Schedule created successfully.",
  (req) =>
    liveClassesService.createSchedule(
      param(req, "batchId"),
      req.body as ScheduleCreateInput,
    ),
  httpStatus.CREATED,
);

const listSessions = respond("Sessions retrieved successfully.", (req) => {
  const user = requireUser(req);
  return liveClassesService.listSessions(
    param(req, "batchId"),
    user.id,
    user.role,
  );
});

const createSession = respond(
  "Session created successfully.",
  (req) =>
    liveClassesService.createSession(
      param(req, "batchId"),
      req.body as SessionCreateInput,
    ),
  httpStatus.CREATED,
);

const updateSession = respond("Session updated successfully.", (req) =>
  liveClassesService.updateSession(
    param(req, "id"),
    req.body as SessionUpdateInput,
  ),
);

const listAttendance = respond("Attendance retrieved successfully.", (req) =>
  liveClassesService.listAttendance(param(req, "sessionId")),
);

const markAttendance = respond("Attendance marked successfully.", (req) =>
  liveClassesService.markAttendance(
    param(req, "sessionId"),
    requireUser(req).id,
    req.body as AttendanceInput,
  ),
);

export const liveClassesController = {
  listSchedules,
  createSchedule,
  listSessions,
  createSession,
  updateSession,
  listAttendance,
  markAttendance,
};
