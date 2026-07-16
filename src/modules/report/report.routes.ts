import { Router } from "express";
import { reportEmployer, reportUser } from "./report.controller";
import { verifyAuth } from "../../middleware/auth.middleware";
import { ensureUserExists } from "../../middleware/ensureUserExists.middleware";
import { validate } from "../../middleware/validate.middleware";
import { reportBodySchema } from "./report.validation";

const router = Router();

router.post(
  "/user/:userId",
  verifyAuth,
  ensureUserExists,
  validate(reportBodySchema),
  reportUser,
);

router.post(
  "/employer/:employerId",
  verifyAuth,
  ensureUserExists,
  validate(reportBodySchema),
  reportEmployer,
);

export default router;
