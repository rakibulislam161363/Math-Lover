import { Router } from "express";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { platformController } from "./platform.controller";
import {
  assignmentIdParamsSchema,
  batchIdParamsSchema,
  createAssignmentValidationSchema,
  idParamsSchema,
  reviewSubmissionValidationSchema,
  submitAssignmentValidationSchema,
  updateAssignmentValidationSchema,
} from "./platform.validation";

const router = Router();
const adminOnly = auth(UserRole.ADMIN);

router.get(
  "/batches/:batchId/assignments",
  validateRequest(batchIdParamsSchema, "params"),
  platformController.listAssignments,
);
router.post(
  "/batches/:batchId/assignments",
  adminOnly,
  validateRequest(batchIdParamsSchema, "params"),
  validateRequest(createAssignmentValidationSchema),
  platformController.createAssignment,
);
router.patch(
  "/assignments/:id",
  adminOnly,
  validateRequest(idParamsSchema, "params"),
  validateRequest(updateAssignmentValidationSchema),
  platformController.updateAssignment,
);
router.delete(
  "/assignments/:id",
  adminOnly,
  validateRequest(idParamsSchema, "params"),
  platformController.deleteAssignment,
);
router.post(
  "/assignments/:assignmentId/submissions",
  auth(),
  validateRequest(assignmentIdParamsSchema, "params"),
  validateRequest(submitAssignmentValidationSchema),
  platformController.submitAssignment,
);
router.get(
  "/assignments/:assignmentId/submissions",
  adminOnly,
  validateRequest(assignmentIdParamsSchema, "params"),
  platformController.listSubmissions,
);
router.patch(
  "/submissions/:id",
  adminOnly,
  validateRequest(idParamsSchema, "params"),
  validateRequest(reviewSubmissionValidationSchema),
  platformController.reviewSubmission,
);

export default router;
