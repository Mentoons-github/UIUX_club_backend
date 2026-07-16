import mongoose from "mongoose";
import AppError from "../../utils/AppError";
import {
  findUserById,
  increaseFollowers,
  increaseFollowingCount,
} from "../user";
import FollowModel from "./follow.model";
import { sendFollowRequest } from "./followRequest/followRequest.service";

export const followUser = async (followerId: string, followingId: string) => {
  if (followerId === followingId) {
    throw new AppError("You cannot follow yourself", 400);
  }

  const user = await findUserById(followingId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const alreadyFollowing = await FollowModel.findOne({
    follower: followerId,
    following: followingId,
  });

  if (alreadyFollowing) {
    throw new AppError("Already following this user", 409);
  }

  if (user.isPrivate) {
    return await sendFollowRequest(followerId, followingId);
  }

  return await createFollow(followerId, followingId);
};

export const createFollow = async (followerId: string, followingId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const follow = await FollowModel.create(
      [
        {
          follower: followerId,
          following: followingId,
        },
      ],
      { session },
    );

    await Promise.all([
      increaseFollowers(followingId, session),
      increaseFollowingCount(followerId, session),
    ]);

    await session.commitTransaction();

    return follow[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const fetchFollowers = async (userId: string) => {
  const followers = await FollowModel.find({ following: userId }).populate(
    "follower",
    "firstName lastName profilePicture occupation",
  );

  return followers.map((f) => f.follower);
};

export const fetchFollowing = async (userId: string) => {
  const following = await FollowModel.find({ follower: userId }).populate(
    "following",
    "firstName lastName profilePicture occupation",
  );

  return following.map((f) => f.following);
};
