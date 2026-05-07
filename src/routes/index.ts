import express from "express";
import { authRoutes } from "../modules/auth";
import { otpRoutes } from "../modules/otp";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/otp", otpRoutes);

export default router;
