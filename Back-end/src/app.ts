import express, { Application } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
const app: Application = express();
app.use(
  cors({
    origin: config.appUrl,
    credentials: true,
  }),
);


// app.use(
//   "/api/payment/confirm",
//   express.raw({ type: "application/json" })
// );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use("/api/users", userRoute);
// app.use("/api/auth", authRoute);
// app.use("/api/categories", categoriesRoute);
// app.use("/api/services", routerService);
// app.use("/api/booking", bookingRoute);
// app.use("/api/payment", paymentRouter);
// app.use("/api/review", reviewRoute);
// app.use("/api/technicians", technicianRoute);
// app.use(notFound);
// app.use(globalErrorHandler);

export default app;