export type OtpPurpose = "register" | "login" | "reset-password";

export interface IOtp {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  otp: string;
  expiresAt: Date;
  purpose: OtpPurpose;
}

export type VerifyOTPInput = {
  otp: string;
  email: string;
  purpose: OtpPurpose;
};
