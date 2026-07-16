import asyncHandler from "express-async-handler";
import { successResponse } from "../../../utils";
import {
  loginEmployer,
  generateNewEmployerAccessToken,
  getEmployerByEmailStrictCheck,
} from "./employer.auth.service";
import { sendOTP } from "../../otp";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/api/v1/employer/auth/refresh-token",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const initiateEmployerRegistration = asyncHandler(async (req, res) => {
  const data = req.body;
  await getEmployerByEmailStrictCheck(data.workEmail);

  const {
    confirmPassword: _confirmPassword,
    sameAsPhone: _sameAsPhone,
    ...employerData
  } = data;

  await sendOTP({
    ...employerData,
    email: data.workEmail,
    purpose: "employer-register",
  });

  return successResponse(res, 200, "OTP sent");
});

export const employerLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { employer, accessToken, refreshToken } = await loginEmployer(
    email,
    password,
  );

  res.cookie("employerRefreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

  return successResponse(res, 200, "Login successful", {
    employer,
    accessToken,
  });
});

export const employerRefreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.employerRefreshToken;
  const result = await generateNewEmployerAccessToken(token);
  return successResponse(res, 200, "Access token refreshed", result);
});

export const employerLogout = asyncHandler(async (req, res) => {
  res.clearCookie("employerRefreshToken", REFRESH_COOKIE_OPTIONS);
  return successResponse(res, 200, "Logout successful");
});
