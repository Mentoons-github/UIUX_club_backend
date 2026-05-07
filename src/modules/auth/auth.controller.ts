import asyncHandler from "express-async-handler";
import User from "../user/User.model";
import AppError from "../../utils/AppError";
import { sendOTP } from "../otp";
import { successResponse } from "../../utils";
import { registerUser } from "./auth.service";

//SignUp
export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  return successResponse(res, 200, "OTP send successfully", result.email);
});

//Signin
export const login = asyncHandler(async (req, res) => {});
