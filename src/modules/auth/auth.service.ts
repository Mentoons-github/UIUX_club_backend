import User from "../user/User.model";
import AppError from "../../utils/AppError";
import { OtpPurpose, sendOTP, VerifyOTPInput } from "../otp";
import { EnsureAuthSessionInput, IRegisterRequest } from "./auth.types";
import OTPAuthSessionModel from "../otp/otpAuthSession.model";

export const registerUser = async (data: IRegisterRequest) => {
  const userExists = await User.findOne({ email: data.email });
  if (userExists) {
    throw new AppError("User already exists. Please login", 400);
  }

  await sendOTP({ ...data, purpose: "register" });
  return {
    email: data.email,
  };
};


