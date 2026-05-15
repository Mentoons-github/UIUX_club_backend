import User from "../user/User.model";
import AppError from "../../utils/AppError";
import { sendOTP } from "../otp";
import { accessToken, refreshToken, refreshTokenVerify } from "../../utils/jwt";
import { comparePassword, hashPassword } from "../../utils";
import { findUserByEmail } from "../user";
import { IRegisterOtpRequest } from "./auth.types";

export const registerUser = async (data: IRegisterOtpRequest) => {
  const userExists = await User.findOne({ email: data.email });
  if (userExists) {
    throw new AppError("User already exists. Please login", 400);
  }

  await sendOTP({ ...data, purpose: "register" });
  return {
    email: data.email,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const { accessToken, refreshToken } = await issueAuthToken(
    user._id.toString(),
    user.role,
  );

  return { user, accessToken, refreshToken };
};

export const issueAuthToken = async (userId: string, role: string) => {
  const payload = { id: userId, role };
  return {
    accessToken: accessToken(payload),
    refreshToken: refreshToken(payload),
  };
};

export const verifyRefreshToken = (token: string) => {
  if (!token) {
    throw new AppError("Refresh token not found", 401);
  }
  return refreshTokenVerify(token);
};

export const generateNewAccessToken = async (token: string) => {
  const decoded = verifyRefreshToken(token);
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const authAccessToken = accessToken({
    id: user._id.toString(),
    role: user.role,
  });

  return {
    accessToken: authAccessToken,
    user,
  };
};

export const forgotPasswordRequest = async (email: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  await sendOTP({ email, purpose: "reset-password" });
};

export const passwordReset = async (
  email: string,
  newPassword: string,
  newConfirmPassword: string,
) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (newPassword !== newConfirmPassword) {
    throw new AppError("Passwords do not match", 400);
  }

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save();
};
