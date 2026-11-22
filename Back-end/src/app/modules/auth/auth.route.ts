import { Router } from "express";
import { auth } from "../../middleware/auth";
import { authController } from "./auth.controller";

const router = Router();

router.post("/register", authController.register);
router.post("/verify-registration", authController.verifyRegistration);
router.post("/login", authController.login);
router.post("/google-login", authController.googleLogin);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/refresh", authController.refreshTokens);
router.post("/logout", authController.logout);
router.get("/me", auth(), authController.getCurrentUser);

export default router;