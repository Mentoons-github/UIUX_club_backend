import { OtpPurpose } from "../otp";

export interface IRegisterOtpRequest extends IBaseOtpRequest {
  purpose: "register";
  firstName: string;
  lastName: string;
  password: string;
}

export interface IForgotPasswordOtpRequest extends IBaseOtpRequest {
  purpose: "reset-password";
}

export interface IBaseOtpRequest {
  email: string;
  purpose: OtpPurpose;
}

export type JwtPayload = { role: string; id: string };

export type RegisterOtpInput = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  purpose: "register";
};

export type ForgotPasswordOtpInput = {
  email: string;
  purpose: "reset-password";
};

export type SendOtpInput = RegisterOtpInput | ForgotPasswordOtpInput;

export type EnsureAuthSessionInput = {
  email: string;
  purpose: "register" | "reset-password";
  otp: string;
  firstName?: string;
  lastName?: string;
  hashedPassword?: string;
};
