import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { assignmentsController } from "./assignments.controller";
import {
  assignmentIdParamsSchema,
  assignmentSubmissionsParamsSchema,
  createAssignmentValidationSchema,
  listAssignmentsQuerySchema,
  reviewSubmissionValidationSchema,
  submitAssignmentValidationSchema,
  updateAssignmentValidationSchema,
} from "./assignments.validation";

const router = Router();
const adminOnly = auth(UserRole.ADMIN);

router.get(
  "/assignments",
  validateRequest(listAssignmentsQuerySchema, "query"),
  assignmentsController.listAssignments,
);
router.post(
  "/assignments",
  adminOnly,
  validateRequest(createAssignmentValidationSchema),
  assignmentsController.createAssignment,
);
router.get(
  "/assignments/:id",
  validateRequest(assignmentIdParamsSchema, "params"),
  assignmentsController.getAssignment,
);
router.patch(
  "/assignments/:id",
  adminOnly,
  validateRequest(assignmentIdParamsSchema, "params"),
  validateRequest(updateAssignmentValidationSchema),
  assignmentsController.updateAssignment,
);
router.delete(
  "/assignments/:id",
  adminOnly,
  validateRequest(assignmentIdParamsSchema, "params"),
  assignmentsController.deleteAssignment,
);

router.get(
  "/assignments/:assignmentId/submissions",
  adminOnly,
  validateRequest(assignmentSubmissionsParamsSchema, "params"),
  assignmentsController.listSubmissionsForAssignment,
);
router.post(
  "/assignments/:assignmentId/submissions",
  auth(),
  validateRequest(assignmentSubmissionsParamsSchema, "params"),
  validateRequest(submitAssignmentValidationSchema),
  assignmentsController.submitAssignment,
);
router.get(
  "/submissions/me",
  auth(),
  assignmentsController.listMySubmissions,
);
router.patch(
  "/submissions/:id",
  adminOnly,
  validateRequest(assignmentIdParamsSchema, "params"),
  validateRequest(reviewSubmissionValidationSchema),
  assignmentsController.reviewSubmission,
);

export default router;
