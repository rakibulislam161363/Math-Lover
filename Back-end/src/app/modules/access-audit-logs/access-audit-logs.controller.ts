import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { HttpError } from "../../utils/httpError";
import { sendResponse } from "../../utils/sendResponse";
import * as accessAuditLogsService from "./access-audit-logs.service";
import { AccessAuditLogCreateInput } from "./access-audit-logs.interface";

const requireAdminId = (req: Request): string => {
  if (!req.user) {
    throw new HttpError(
      httpStatus.UNAUTHORIZED,
      "Authentication required.",
    );
  }
  return req.user.id;
};

const param = (req: Request, name: string): string => {
  const value = req.params[name];
  return typeof value === "string" ? value : "";
};

const createAccessAuditLog = catchAsync(
  async (req: Request, res: Response) => {
    const data = await accessAuditLogsService.createAccessAuditLog({
      ...(req.body as Omit<AccessAuditLogCreateInput, "adminId">),
      adminId: requireAdminId(req),
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Access audit log created successfully.",
      data,
    });
  },
);

const listAccessAuditLogs = catchAsync(
  async (req: Request, res: Response) => {
    const data = await accessAuditLogsService.listAccessAuditLogs(
      param(req, "enrollmentId"),
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Access audit logs retrieved successfully.",
      data,
    });
  },
);

export const accessAuditLogsController = {
  createAccessAuditLog,
  listAccessAuditLogs,
};
