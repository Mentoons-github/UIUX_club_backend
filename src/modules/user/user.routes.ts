import express from "express";
import {
  blockEmployer,
  blockUser,
  getUserDetail,
  unBlockEmployer,
  unBlockUser,
  updateUserDetail,
} from "./user.controller";
import { upload } from "../media/media.middleware";
import { verifyAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/requireRole.middleware";
import { ROLES } from "../../constants/roles.constants";
import { ensureUserExists } from "../../middleware/ensureUserExists.middleware";

const router = express.Router();

router.get("/:userId", getUserDetail);
router.patch("/:userId", upload.single("profilePicture"), updateUserDetail);

router.post(
  "/blocks/users/:userId",
  verifyAuth,
  requireRole(ROLES.USER),
  ensureUserExists,
  blockUser,
);
router.delete(
  "/unblock/users/:userId",
  verifyAuth,
  requireRole(ROLES.USER),
  ensureUserExists,
  unBlockUser,
);

router.post(
  "/blocks/employer/:employerId",
  verifyAuth,
  requireRole(ROLES.USER),
  ensureUserExists,
  blockEmployer,
);

router.post(
  "/unblocks/employer/:employerId",
  verifyAuth,
  requireRole(ROLES.USER),
  ensureUserExists,
  unBlockEmployer,
);

export default router;
