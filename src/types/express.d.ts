import { Request } from "express";
import { SUB_EMPLOYER_PERMISSIONS } from "../modules/subEmployer/subEmployer.constants";
import { SubEmployerPermission } from "../modules/subEmployer";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        permissions?: SubEmployerPermission[];
      };
    }
  }
}
