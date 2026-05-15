import express from "express";
import { validate } from "../../middleware/validate.middleware";
import { loginSchema, registerSchema } from "./auth.validation";
import {
  forgotPassword,
  generateRefreshToken,
  login,
  logout,
  register,
  resetPassword,
} from "./auth.controller";
const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.post("/refresh-token", generateRefreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);
// router.get("/me");

export default router;
