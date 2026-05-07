import asyncHandler from "express-async-handler";
import { verifyOTP } from "./otp.service";
import { successResponse } from "../../utils";

export const otpVerification = asyncHandler(async (req, res) => {
  const result = await verifyOTP(req.body);
  return successResponse(res, 200, "OTP verified", result);
});
