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

export type JwtPayload = { role: string; id: string; permissions?: string[] };

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

export type EmployerRegisterOtpInput = {
  email: string;
  firstName: string;
  lastName: string;
  purpose: "employer-register";
  [key: string]: any;
};

export type SendOtpInput =
  | RegisterOtpInput
  | ForgotPasswordOtpInput
  | EmployerRegisterOtpInput;

export type EnsureAuthSessionInput =
  | {
      email: string;
      purpose: "register";
      otp: string;
      firstName?: string;
      lastName?: string;
      hashedPassword?: string;
    }
  | {
      email: string;
      purpose: "employer-register";
      otp: string;
      employerData: Record<string, any>;
    }
  | {
      email: string;
      purpose: "reset-password";
      otp: string;
    };
