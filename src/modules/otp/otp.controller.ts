import asyncHandler from "express-async-handler";
import {
  deleteOTPAuthSession,
  OTPResend,
  sendOTP,
  verifyOTP,
} from "./otp.service";
import { successResponse } from "../../utils";
import { issueAuthToken, USER_REFRESH_COOKIE_OPTIONS } from "../auth";
import { createUser, IUser } from "../user";
import AppError from "../../utils/AppError";
import {
  createEmployerAccount,
  EMPLOYER_REFRESH_COOKIE_OPTIONS,
} from "../employer";

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
    const userData = {
      email: session.email,
      firstName: session.firstName!,
      lastName: session.lastName!,
      password: session.password!,
    };

    const user = await createUser(userData);

    await deleteOTPAuthSession({ email, purpose });

    const tokens = await issueAuthToken(user._id.toString(), "user");

    res.cookie(
      "refreshToken",
      tokens.refreshToken,
      USER_REFRESH_COOKIE_OPTIONS,
    );

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

  if (purpose === "employer-register") {
    const employerData = session.employerData;

    const { employer, accessToken, refreshToken } =
      await createEmployerAccount(employerData);

    await deleteOTPAuthSession({ email, purpose });

    res.cookie(
      "employerRefreshToken",
      refreshToken,
      EMPLOYER_REFRESH_COOKIE_OPTIONS,
    );

    return successResponse(res, 200, "OTP verified", {
      employer,
      accessToken,
    });
  }

  throw new AppError("Invalid OTP purpose", 400);
});
