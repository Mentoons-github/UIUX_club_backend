import express from "express";
import {
  createFollowUser,
  getFollowers,
  getFollowing,
} from "./follow.controller";
import { verifyAuth } from "../../middleware/auth.middleware";
import { followRequestRoute } from "./followRequest";

const router = express.Router();

router.use("/follow-request", followRequestRoute);
router.post("/:followingId", verifyAuth, createFollowUser);
router.get("/:userId/followers", getFollowers);
router.get("/:userId/following", getFollowing);

export default router;
