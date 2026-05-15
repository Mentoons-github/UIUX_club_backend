import asyncHandler from "express-async-handler";
import { getUserFeedPosts, getUserPosts, uploadPost } from "./post.service";
import { successResponse } from "../../utils";

export const getPostsByUser = asyncHandler(async (req, res) => {
  const userId = req.user?.id as string;
  const posts = await getUserPosts(userId);
  return successResponse(res, 200, "User posts fetched successfully", posts);
});

export const createPost = asyncHandler(async (req, res) => {
  const data = { media: req.files, ...req.body };
  const userId = req.user?.id;

  const post = await uploadPost(data, userId as string);

  return successResponse(res, 200, "Post uploaded", post);
});

export const getUserFeed = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const posts = await getUserFeedPosts(userId);
  return successResponse(res, 200, "Feed fetched successfully", posts);
});
