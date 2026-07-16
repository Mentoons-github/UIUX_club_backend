import express from "express";
import { otpVerification, resendOTP } from "./otp.controller";

const router = express.Router();

router.post("/verify", otpVerification);
router.post("/resend", resendOTP);

export default router;
