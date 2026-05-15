import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const verifyAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = verifyToken(token) as {
    id: string;
    role: string;
  };

  req.user = {
    id: decoded.id,
    role: decoded.role,
  };

  next();
};
