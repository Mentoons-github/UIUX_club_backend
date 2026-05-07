import express from "express";
import { otpVerification } from "./otp.controller";

const router = express.Router();

router.post("/verify", otpVerification);
// router.post("/resend");

export default router;
