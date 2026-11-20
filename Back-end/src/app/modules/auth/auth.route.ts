import { Router } from "express";
import { auth } from "../../middleware/auth";
import { authController } from "./auth.controller";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshTokens);
router.post("/logout", authController.logout);
router.get("/me", auth(), authController.getCurrentUser);

export default router;