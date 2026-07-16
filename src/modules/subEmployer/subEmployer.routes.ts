import express from "express";
import {
  acceptSubEmployerInvitation,
  getMySubEmployers,
  sendSubEmployerInvitation,
} from "./subEmployer.controller";
import { verifyAuth } from "../../middleware/auth.middleware";
import { ensureUserExists } from "../../middleware/ensureUserExists.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import { ROLES } from "../../constants/roles.constants";

const router = express.Router();

router.get("/", verifyAuth, getMySubEmployers);

router.post(
  "/invite",
  verifyAuth,
  requireRole(ROLES.EMPLOYER),
  ensureUserExists,
  sendSubEmployerInvitation,
);
router.post("/accept/:token", acceptSubEmployerInvitation);

export default router;
