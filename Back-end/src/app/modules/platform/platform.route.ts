import { Router } from "express";
import { auth } from "../../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { platformController } from "./platform.controller";

const router = Router();
const adminOnly = auth(UserRole.ADMIN);

router.get("/batches/:batchId/chapters", platformController.listChapters);
router.post("/batches/:batchId/chapters", adminOnly, platformController.createChapter);
router.patch("/chapters/:id", adminOnly, platformController.updateChapter);
router.delete("/chapters/:id", adminOnly, platformController.deleteChapter);

router.get("/chapters/:chapterId/lessons", platformController.listLessons);
router.post("/chapters/:chapterId/lessons", adminOnly, platformController.createLesson);
router.patch("/lessons/:id", adminOnly, platformController.updateLesson);
router.delete("/lessons/:id", adminOnly, platformController.deleteLesson);
router.get("/lessons/:lessonId/progress", auth(), platformController.getLessonProgress);
router.put("/lessons/:lessonId/progress", auth(), platformController.updateLessonProgress);

router.get("/batches/:batchId/materials", platformController.listMaterials);
router.post("/batches/:batchId/materials", adminOnly, platformController.createMaterial);
router.patch("/materials/:id", adminOnly, platformController.updateMaterial);
router.delete("/materials/:id", adminOnly, platformController.deleteMaterial);

router.get("/batches/:batchId/schedules", platformController.listSchedules);
router.post("/batches/:batchId/schedules", adminOnly, platformController.createSchedule);
router.get("/batches/:batchId/sessions", platformController.listSessions);
router.post("/batches/:batchId/sessions", adminOnly, platformController.createSession);
router.patch("/sessions/:id", adminOnly, platformController.updateSession);
router.get("/sessions/:sessionId/attendance", adminOnly, platformController.listAttendance);
router.put("/sessions/:sessionId/attendance", adminOnly, platformController.markAttendance);

router.get("/batches/:batchId/assignments", platformController.listAssignments);
router.post("/batches/:batchId/assignments", adminOnly, platformController.createAssignment);
router.patch("/assignments/:id", adminOnly, platformController.updateAssignment);
router.delete("/assignments/:id", adminOnly, platformController.deleteAssignment);
router.post("/assignments/:assignmentId/submissions", auth(), platformController.submitAssignment);
router.get("/assignments/:assignmentId/submissions", adminOnly, platformController.listSubmissions);
router.patch("/submissions/:id", adminOnly, platformController.reviewSubmission);

router.get("/batches/:batchId/quizzes", platformController.listQuizzes);
router.post("/batches/:batchId/quizzes", adminOnly, platformController.createQuiz);
router.patch("/quizzes/:id", adminOnly, platformController.updateQuiz);
router.post("/quizzes/:quizId/attempts", auth(), platformController.startQuizAttempt);
router.post("/quiz-attempts/:attemptId/submit", auth(), platformController.submitQuizAttempt);
router.get("/quiz-attempts/me", auth(), platformController.listMyQuizAttempts);

router.get("/batches/:batchId/notices", platformController.listNotices);
router.post("/notices", adminOnly, platformController.createNotice);
router.patch("/notices/:id", adminOnly, platformController.updateNotice);
router.delete("/notices/:id", adminOnly, platformController.deleteNotice);

router.get("/notifications/me", auth(), platformController.listMyNotifications);
router.patch("/notifications/:id/read", auth(), platformController.markNotificationRead);

export default router;
