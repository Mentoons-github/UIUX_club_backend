import { OtpPurpose } from "../otp";

export interface IRegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export type EnsureAuthSessionInput = {
  email: string;
  firstName: string;
  lastName: string;
  purpose: OtpPurpose;
  otp: string;
  hashedPassword: string;
};
