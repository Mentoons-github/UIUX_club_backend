import { NextFunction, Request, Response } from "express";
import User from "../modules/user/user.model";
import AppError from "../utils/AppError";
import EmployerModel from "../modules/employer/employer.model";
import SubEmployerModel from "../modules/subEmployer/subEmployer.model";

export const ensureUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, role } = req.user!;

    let exists = null;

    if (role === "user") {
      exists = await User.exists({ _id: id });
    }

    if (role === "employer") {
      exists = await EmployerModel.exists({ _id: id });
    }

    if (role === "sub_employer") {
      exists = await SubEmployerModel.exists({ _id: id });
    }

    if (!exists) {
      throw new AppError("Account not found", 401);
    }

    next();
  } catch (error) {
    next(error);
  }
};
