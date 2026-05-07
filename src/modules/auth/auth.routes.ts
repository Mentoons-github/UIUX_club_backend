import express from "express";
import { validate } from "../../middleware/validate.middleware";
import { loginSchema, registerSchema } from "./auth.validation";
import { login, register } from "./auth.controller";
const router = express.Router();

// router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
// router.post("/logout");
// router.get("/me");

export default router;
