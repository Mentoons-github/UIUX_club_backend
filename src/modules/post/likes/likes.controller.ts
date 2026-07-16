import asyncHandler from "express-async-handler";
import { dislikePostService, likePostService } from "./likes.service";
import { successResponse } from "../../../utils";
import AppError from "../../../utils/AppError";

export const likePost = asyncHandler(async (req, res) => {
  console.log("reached like post");
  const postId = req.params.postId as string;
  const userId = req.user!.id;

  if (!postId) {
    throw new AppError("No post found", 404);
  }
  await likePostService({ userId, postId });
  return successResponse(res, 200, "Liked post");
});

export const dislikePost = asyncHandler(async (req, res) => {
  const postId = req.params.postId as string;
  const userId = req.user!.id;
  if (!postId) {
    throw new AppError("No post found", 404);
  }
  await dislikePostService({ userId, postId });
  return successResponse(res, 200, "Disliked post");
});
