import { Router } from "express";
import {
  acceptFollowRequest,
  rejectFollowRequest,
} from "./followRequest.controller";
import { verifyAuth } from "../../../middleware/auth.middleware";

const router = Router();

router.patch("/:senderId/accept", verifyAuth, acceptFollowRequest);
router.patch("/:senderId/reject", verifyAuth, rejectFollowRequest);

export default router;
