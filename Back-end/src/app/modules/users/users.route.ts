import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { usersController } from "./users.controller";
import { studentProfileValidationSchema } from "./users.validation";

const router = Router();
const studentOnly = auth(UserRole.STUDENT);

router.get("/profile/me", studentOnly, usersController.getMyStudentProfile);
router.put(
  "/profile/me",
  studentOnly,
  validateRequest(studentProfileValidationSchema),
  usersController.upsertMyStudentProfile,
);

export default router;
