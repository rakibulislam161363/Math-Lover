import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { materialsController } from "./materials.controller";
import {
  batchIdParamsSchema,
  createMaterialValidationSchema,
  materialIdParamsSchema,
  updateMaterialValidationSchema,
} from "./materials.validation";

const router = Router();
const adminOnly = auth(UserRole.ADMIN);

router.get(
  "/batches/:batchId/materials",
  auth(),
  validateRequest(batchIdParamsSchema, "params"),
  materialsController.listMaterials,
);
router.post(
  "/batches/:batchId/materials",
  adminOnly,
  validateRequest(batchIdParamsSchema, "params"),
  validateRequest(createMaterialValidationSchema),
  materialsController.createMaterial,
);
router.patch(
  "/materials/:id",
  adminOnly,
  validateRequest(materialIdParamsSchema, "params"),
  validateRequest(updateMaterialValidationSchema),
  materialsController.updateMaterial,
);
router.delete(
  "/materials/:id",
  adminOnly,
  validateRequest(materialIdParamsSchema, "params"),
  materialsController.deleteMaterial,
);

export default router;
