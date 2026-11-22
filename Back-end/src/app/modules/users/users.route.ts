import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { usersController } from "./users.controller";

const router = Router();
const studentOnly = auth(UserRole.STUDENT);

router.get("/profile/me", studentOnly, usersController.getMyStudentProfile);
router.put("/profile/me", studentOnly, usersController.upsertMyStudentProfile);

export default router;
