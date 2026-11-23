import { Router } from "express";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { notificationsController } from "./notifications.controller";
import { notificationIdParamsSchema } from "./notifications.validation";

const router = Router();

router.get(
  "/notifications/me",
  auth(),
  notificationsController.listMyNotifications,
);
router.patch(
  "/notifications/:id/read",
  auth(),
  validateRequest(notificationIdParamsSchema, "params"),
  notificationsController.markNotificationRead,
);

export default router;
