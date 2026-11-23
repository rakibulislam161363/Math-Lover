import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { noticesController } from "./notices.controller";
import {
  batchIdParamsSchema,
  createNoticeValidationSchema,
  noticeIdParamsSchema,
  updateNoticeValidationSchema,
} from "./notices.validation";

const router = Router();
const adminOnly = auth(UserRole.ADMIN);

router.get("/notices", noticesController.listNotices);
router.get(
  "/batches/:batchId/notices",
  validateRequest(batchIdParamsSchema, "params"),
  noticesController.listNotices,
);
router.post(
  "/notices",
  adminOnly,
  validateRequest(createNoticeValidationSchema),
  noticesController.createNotice,
);
router.patch(
  "/notices/:id",
  adminOnly,
  validateRequest(noticeIdParamsSchema, "params"),
  validateRequest(updateNoticeValidationSchema),
  noticesController.updateNotice,
);
router.delete(
  "/notices/:id",
  adminOnly,
  validateRequest(noticeIdParamsSchema, "params"),
  noticesController.deleteNotice,
);

export default router;
