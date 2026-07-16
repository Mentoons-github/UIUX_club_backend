import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { SubEmployerPermission } from "../modules/subEmployer";

export const verifyAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = verifyToken(token) as {
    id: string;
    role: string;
    permissions?: SubEmployerPermission[];
  };

  req.user = {
    id: decoded.id,
    role: decoded.role,
    permissions: decoded.permissions ?? [],
  };

  next();
};

export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyToken(token) as {
      id: string;
      role: string;
      permissions?: SubEmployerPermission[];
    };

    req.user = {
      id: decoded.id,
      role: decoded.role,
      permissions: decoded.permissions ?? [],
    };
  } catch (err) {}

  next();
};
