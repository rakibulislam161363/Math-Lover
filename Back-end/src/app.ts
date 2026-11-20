import express, { Application } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFoundPage";
import authRoutes from "./modules/auth/auth.route";

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

app.use(notFound);
app.use(globalErrorHandler);

export default app;