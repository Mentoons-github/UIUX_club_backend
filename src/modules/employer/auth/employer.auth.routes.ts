import { Router } from "express";
import {
  employerLogin,
  employerLogout,
  employerRefreshToken,
  initiateEmployerRegistration,
} from "./employer.auth.controller";
import { validate } from "../../../middleware/validate.middleware";
import { employerRegisterSchema } from "./employer.auth.validation";

const router = Router();

router.post(
  "/register",
  validate(employerRegisterSchema),
  initiateEmployerRegistration,
);
router.post("/login", employerLogin);
router.post("/refresh-token", employerRefreshToken);
router.post("/logout", employerLogout);

export default router;
