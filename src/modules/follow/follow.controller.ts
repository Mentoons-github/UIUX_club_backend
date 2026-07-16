import asyncHandler from "express-async-handler";
import { fetchFollowers, fetchFollowing, followUser } from "./follow.service";
import { successResponse } from "../../utils";

export const createFollowUser = asyncHandler(async (req, res) => {
  const followerId = req.user!.id;
  const followingId = req.params.followingId as string;

  const f = await followUser(followerId, followingId);

  return successResponse(res, 200, "followed successfully", f);
});

export const getFollowers = asyncHandler(async (req, res) => {
  const userId = req.params.userId as string;

  const followers = await fetchFollowers(userId);

  return successResponse(res, 200, "Followers fetched", followers);
});

export const getFollowing = asyncHandler(async (req, res) => {
  const userId = req.params.userId as string;

  const following = await fetchFollowing(userId);

  return successResponse(res, 200, "Following fetched", following);
});
