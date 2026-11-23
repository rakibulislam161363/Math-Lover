import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { HttpError } from "../../utils/httpError";
import { sendResponse } from "../../utils/sendResponse";
import * as noticesService from "./notices.service";
import { NoticeCreateInput, NoticeUpdateInput } from "./notices.interface";

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

const listNotices = respond("Notices retrieved successfully.", (req) => {
  const user = requireUser(req);
  return noticesService.listNotices(
    typeof req.params.batchId === "string"
      ? req.params.batchId
      : undefined,
    user.id,
    user.role,
  );
});

const createNotice = respond(
  "Notice created successfully.",
  (req) => noticesService.createNotice(req.body as NoticeCreateInput),
  httpStatus.CREATED,
);

const updateNotice = respond("Notice updated successfully.", (req) =>
  noticesService.updateNotice(
    param(req, "id"),
    req.body as NoticeUpdateInput,
  ),
);

const deleteNotice = respond("Notice deleted successfully.", (req) =>
  noticesService.deleteNotice(param(req, "id")),
);

export const noticesController = {
  listNotices,
  createNotice,
  updateNotice,
  deleteNotice,
};
