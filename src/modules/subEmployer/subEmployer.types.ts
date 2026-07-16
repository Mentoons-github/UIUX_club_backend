import { SUB_EMPLOYER_PERMISSIONS } from "./subEmployer.constants";

export interface IRegisterSubEmployer {
  name: string;
  email: string;
  password?: string;
  mobile: string;
}

export type SubEmployerPermission =
  (typeof SUB_EMPLOYER_PERMISSIONS)[keyof typeof SUB_EMPLOYER_PERMISSIONS];
