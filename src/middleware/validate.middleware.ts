import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      console.log("not success");
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.format(),
      });
    }

    req.body = result.data;
    next();
  };
