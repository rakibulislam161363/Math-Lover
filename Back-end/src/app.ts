import express, { Application } from "express";
import cors from "cors";
import config from "./app/config";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFoundPage";
import authRoutes from "./app/modules/auth/auth.route";
import platformRoutes from "./app/modules/platform/platform.route";
import enrollmentRoutes from "./app/modules/enrollment/enrollment.route";
import coursesRoutes from "./app/modules/courses/courses.route";
import usersRoutes from "./app/modules/users/users.route";
import paymentsRoutes from "./app/modules/payments/payments.route";
import assignmentsRoutes from "./app/modules/assignments/assignments.route";
import accessAuditLogsRoutes from "./app/modules/access-audit-logs/access-audit-logs.route";
import liveClassesRoutes from "./app/modules/live-classes/live-classes.route";
import recordedCoursesRoutes from "./app/modules/recorded-courses/recorded-courses.route";
import noticesRoutes from "./app/modules/notices/notices.route";
import materialsRoutes from "./app/modules/materials/materials.route";
import notificationsRoutes from "./app/modules/notifications/notifications.route";
import quizzesRoutes from "./app/modules/quizzes/quizzes.route";

const app: Application = express();
app.use(
  cors({
    origin: config.appUrl ?? false,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req, res) =>
  res.status(200).json({
    message: "api is running",
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api", platformRoutes);
app.use("/api", enrollmentRoutes);
app.use("/api", coursesRoutes);
app.use("/api", usersRoutes);
app.use("/api", paymentsRoutes);
app.use("/api", assignmentsRoutes);
app.use("/api", accessAuditLogsRoutes);
app.use("/api", liveClassesRoutes);
app.use("/api", recordedCoursesRoutes);
app.use("/api", noticesRoutes);
app.use("/api", materialsRoutes);
app.use("/api", notificationsRoutes);
app.use("/api", quizzesRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;