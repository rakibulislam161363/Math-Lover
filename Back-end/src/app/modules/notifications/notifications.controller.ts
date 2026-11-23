import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { HttpError } from "../../utils/httpError";
import { sendResponse } from "../../utils/sendResponse";
import * as notificationsService from "./notifications.service";

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

const listMyNotifications = respond(
  "Notifications retrieved successfully.",
  (req) => notificationsService.listNotificationsForUser(requireUser(req).id),
);

const markNotificationRead = respond(
  "Notification marked as read.",
  (req) =>
    notificationsService.markNotificationRead(
      param(req, "id"),
      requireUser(req).id,
    ),
);

export const notificationsController = {
  listMyNotifications,
  markNotificationRead,
};
