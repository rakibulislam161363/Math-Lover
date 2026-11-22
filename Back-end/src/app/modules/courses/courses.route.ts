import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { coursesController } from "./courses.controller";

const router = Router();
const adminOnly = auth(UserRole.ADMIN);

router.get("/courses", coursesController.listCourses);
router.post("/courses", adminOnly, coursesController.createCourse);
router.get("/courses/:slug", coursesController.getCourse);
router.patch("/courses/:id", adminOnly, coursesController.updateCourse);
router.delete("/courses/:id", adminOnly, coursesController.deleteCourse);

router.get("/batches", coursesController.listBatches);
router.post("/batches", adminOnly, coursesController.createBatch);
router.get("/batches/:id", coursesController.getBatch);
router.patch("/batches/:id", adminOnly, coursesController.updateBatch);
router.delete("/batches/:id", adminOnly, coursesController.deleteBatch);

export default router;
