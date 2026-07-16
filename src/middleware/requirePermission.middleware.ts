import { NextFunction, Request, Response } from "express";
import { SubEmployerPermission } from "../modules/subEmployer";
import { ROLES } from "../constants/roles.constants";

export const requirePermission =
  (...permissions: SubEmployerPermission[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log("========== requirePermission ==========");

    const user = req.user;

    console.log("User:", user);
    console.log("Required Permissions:", permissions);

    if (!user) {
      console.log("❌ No authenticated user found.");
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    console.log("Role:", user.role);

    if (user.role === ROLES.EMPLOYER) {
      console.log("✅ Employer detected. Skipping permission check.");
      return next();
    }

    if (user.role !== ROLES.SUB_EMPLOYER) {
      console.log("❌ Invalid role:", user.role);
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const userPermissions = user.permissions ?? [];

    console.log("User Permissions:", userPermissions);

    const hasPermissions = permissions.every((permission) => {
      const hasPermission = userPermissions.includes(permission);

      console.log(
        `Checking "${permission}" => ${hasPermission ? "✅" : "❌"}`
      );

      return hasPermission;
    });

    console.log("Final Permission Result:", hasPermissions);

    if (!hasPermissions) {
      console.log("❌ Permission denied");
      return res.status(403).json({
        message: "Permission denied, Please check again",
      });
    }

    console.log("✅ Permission granted");
    console.log("======================================");

    return next();
  };