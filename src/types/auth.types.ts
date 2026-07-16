import { ROLES } from "../constants/roles.constants";

export interface SendMail {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export type Role = "SubEmployer" | "User" | "Admin" | "Employer";
