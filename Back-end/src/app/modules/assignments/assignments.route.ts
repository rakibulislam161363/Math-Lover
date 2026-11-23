import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { assignmentsController } from "./assignments.controller";
import {
  assignmentIdParamsSchema,
  assignmentSubmissionsParamsSchema,
  batchIdParamsSchema,
  createBatchAssignmentValidationSchema,
  createAssignmentValidationSchema,
  listAssignmentsQuerySchema,
  reviewSubmissionValidationSchema,
  submitAssignmentValidationSchema,
  updateAssignmentValidationSchema,
} from "./assignments.validation";

const router = Router();
const adminOnly = auth(UserRole.ADMIN);
const authenticated = auth();
const studentOnly = auth(UserRole.STUDENT);

router.get(
  "/batches/:batchId/assignments",
  authenticated,
  validateRequest(batchIdParamsSchema, "params"),
  assignmentsController.listAssignments,
);
router.post(
  "/batches/:batchId/assignments",
  adminOnly,
  validateRequest(batchIdParamsSchema, "params"),
  validateRequest(createBatchAssignmentValidationSchema),
  assignmentsController.createAssignment,
);

router.get(
  "/assignments",
  authenticated,
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
  authenticated,
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
  studentOnly,
  validateRequest(assignmentSubmissionsParamsSchema, "params"),
  validateRequest(submitAssignmentValidationSchema),
  assignmentsController.submitAssignment,
);
router.get(
  "/submissions/me",
  studentOnly,
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
