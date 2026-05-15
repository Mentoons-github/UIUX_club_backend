import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = { ...err, message: err.message };

  if (err.name === "CastError")
    error = new AppError(`Invalid value for ${err.path}`, 400);

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    error = new AppError(messages.join(". "), 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(`${field} is already taken`, 409);
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    status: error.status || "error",
    message: error.message || "Something went wrong",
  });
};

export default errorHandler;
