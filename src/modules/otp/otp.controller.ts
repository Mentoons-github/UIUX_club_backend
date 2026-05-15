import asyncHandler from "express-async-handler";
import {
  deleteOTPAuthSession,
  OTPResend,
  sendOTP,
  verifyOTP,
} from "./otp.service";
import { successResponse } from "../../utils";
import { issueAuthToken } from "../auth";
import { createUser, IUser } from "../user";
import AppError from "../../utils/AppError";

export const resendOTP = asyncHandler(async (req, res) => {
  console.log(req.body);
  const result = await OTPResend(req.body.email, req.body.purpose);

  return successResponse(res, 200, "OTP sent successfully", {
    email: result.email,
  });
});

export const otpVerification = asyncHandler(async (req, res) => {
  const { session } = await verifyOTP(req.body);
  const { purpose, email } = req.body;

  if (purpose === "register") {
    const userData: IUser = {
      email: session.email,
      firstName: session.firstName!,
      lastName: session.lastName!,
      password: session.password!,
    };

    const user = await createUser(userData);

    await deleteOTPAuthSession({ email, purpose });

    const tokens = await issueAuthToken(user._id.toString(), "user");

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/v1/auth/refresh-token",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, 200, "OTP verified", {
      user,
      accessToken: tokens.accessToken,
    });
  }

  if (purpose === "reset-password") {
    await deleteOTPAuthSession({ email, purpose });

    return successResponse(res, 200, "OTP verified", {
      email,
      message: "You can now reset password",
    });
  }

  throw new AppError("Invalid OTP purpose", 400);
});
