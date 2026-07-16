import asyncHandler from "express-async-handler";
import { successResponse } from "../../utils";
import {
  forgotPasswordRequest,
  generateNewAccessToken,
  loginUser,
  passwordReset,
  registerUser,
} from "./auth.service";
import AppError from "../../utils/AppError";

//SignUp
export const register = asyncHandler(async (req, res) => {
  console.log("reached registration");
  const result = await registerUser(req.body);
  return successResponse(res, 200, "OTP send successfully", result.email);
});

//Signin
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await loginUser(email, password);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/v1/auth/refresh-token",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return successResponse(res, 200, "OTP verified", {
    user,
    accessToken,
  });
});

//refreshToken generator
export const generateRefreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const result = await generateNewAccessToken(refreshToken);
  return successResponse(res, 200, "Access token refreshed", result);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await forgotPasswordRequest(email);
  return successResponse(res, 200, "OTP sent to email", { email });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, newConfirmPassword } = req.body;
  await passwordReset(email, newPassword, newConfirmPassword);
  return successResponse(res, 200, "Password reset successful");
});

//logout
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/v1/auth/refresh-token",
  });
  return successResponse(res, 200, "Logout successful");
});
