import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { HttpError } from "../../utils/httpError";
import { sendResponse } from "../../utils/sendResponse";
import * as materialsService from "./materials.service";
import {
  MaterialCreateInput,
  MaterialUpdateInput,
} from "./materials.interface";

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

const listMaterials = respond("Materials retrieved successfully.", (req) => {
  const user = requireUser(req);
  return materialsService.listMaterials(
    param(req, "batchId"),
    user.id,
    user.role,
  );
});

const createMaterial = respond(
  "Material created successfully.",
  (req) =>
    materialsService.createMaterial(
      param(req, "batchId"),
      req.body as MaterialCreateInput,
    ),
  httpStatus.CREATED,
);

const updateMaterial = respond("Material updated successfully.", (req) =>
  materialsService.updateMaterial(
    param(req, "id"),
    req.body as MaterialUpdateInput,
  ),
);

const deleteMaterial = respond("Material deleted successfully.", (req) =>
  materialsService.deleteMaterial(param(req, "id")),
);

export const materialsController = {
  listMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
};
