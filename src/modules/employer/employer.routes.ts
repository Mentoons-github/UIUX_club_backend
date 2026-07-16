import express from "express";
import { verifyAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import { ROLES } from "../../constants/roles.constants";
import {
  employerBlockUser,
  employerEditProfile,
  employerProfile,
  employerUnBlockUser,
} from "./employer.controller";
import { employerAuth } from "./auth";
import { ensureUserExists } from "../../middleware/ensureUserExists.middleware";
import { upload } from "../media/media.middleware";
import { validate } from "../../middleware/validate.middleware";
import { editEmployerProfileSchema } from "./employer.validations";
import { companyRoutes } from "./company";

const router = express.Router();

router.use("/auth", employerAuth);
router.use("/company", companyRoutes);

router.use(verifyAuth, requireRole(ROLES.EMPLOYER));

router
  .route("/profile")
  .get(employerProfile)
  .put(
    upload.single("profilePicture"),
    ensureUserExists,
    validate(editEmployerProfileSchema),
    employerEditProfile,
  );

router.post("/blocks/user/:userId", ensureUserExists, employerBlockUser);

router.delete("/unblocks/user/:userId", ensureUserExists, employerUnBlockUser);

export default router;
