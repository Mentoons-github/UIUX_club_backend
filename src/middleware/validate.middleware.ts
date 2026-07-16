import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";

export const validate =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      console.log("error found :", result.error);
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.format(),
      });
    }

    req.body = result.data;
    next();
  };
