import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("checking");
    console.log(req.user);
    console.log(roles);
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError("Forbidden", 403);
    }

    console.log("role accepted");
    next();
  };
};
