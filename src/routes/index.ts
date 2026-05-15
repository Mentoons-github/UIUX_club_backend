import express from "express";
import { authRoutes } from "../modules/auth";
import { otpRoutes } from "../modules/otp";
import { postRoutes } from "../modules/post";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/otp", otpRoutes);
router.use("/post", postRoutes);

export default router;
