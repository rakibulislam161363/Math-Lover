import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { assignmentsController } from "./assignments.controller";

const router = Router();
const adminOnly = auth(UserRole.ADMIN);

router.get("/assignments", assignmentsController.listAssignments);
router.post("/assignments", adminOnly, assignmentsController.createAssignment);
router.get("/assignments/:id", assignmentsController.getAssignment);
router.patch(
  "/assignments/:id",
  adminOnly,
  assignmentsController.updateAssignment,
);
router.delete(
  "/assignments/:id",
  adminOnly,
  assignmentsController.deleteAssignment,
);

router.get(
  "/assignments/:assignmentId/submissions",
  adminOnly,
  assignmentsController.listSubmissionsForAssignment,
);
router.post(
  "/assignments/:assignmentId/submissions",
  auth(),
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
  assignmentsController.reviewSubmission,
);

export default router;
