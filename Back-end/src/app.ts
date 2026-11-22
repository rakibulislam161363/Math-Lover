import express, { Application } from "express";
import cors from "cors";
import config from "./app/config";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFoundPage";
import authRoutes from "./app/modules/auth/auth.route";
import platformRoutes from "./app/modules/platform/platform.route";

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

app.use(notFound);
app.use(globalErrorHandler);

export default app;