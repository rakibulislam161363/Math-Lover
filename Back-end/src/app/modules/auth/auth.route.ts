import { Router } from "express";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { authController } from "./auth.controller";
import {
  forgotPasswordValidationSchema,
  googleLoginValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
  registerValidationSchema,
  resetPasswordValidationSchema,
  setPasswordValidationSchema,
  verifyRegistrationValidationSchema,
} from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerValidationSchema),
  authController.register,
);
router.post(
  "/verify-registration",
  validateRequest(verifyRegistrationValidationSchema),
  authController.verifyRegistration,
);
router.post(
  "/login",
  validateRequest(loginValidationSchema),
  authController.login,
);
router.post(
  "/google-login",
  validateRequest(googleLoginValidationSchema),
  authController.googleLogin,
);
router.post(
  "/forgot-password",
  validateRequest(forgotPasswordValidationSchema),
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  validateRequest(resetPasswordValidationSchema),
  authController.resetPassword,
);
router.post(
  "/set-password",
  auth(),
  validateRequest(setPasswordValidationSchema),
  authController.setPassword,
);
router.post(
  "/refresh",
  validateRequest(refreshTokenValidationSchema, "cookies"),
  authController.refreshTokens,
);
router.post("/logout", authController.logout);
router.get("/me", auth(), authController.getCurrentUser);

export default router;