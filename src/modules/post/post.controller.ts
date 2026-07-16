import asyncHandler from "express-async-handler";
import {
  getPostById,
  getUserFeedPosts,
  getUserPosts,
  uploadPost,
} from "./post.service";
import { successResponse } from "../../utils";

export const getPostsByUser = asyncHandler(async (req, res) => {
  console.log("reached user posts");
  const currentUserId = req.user?.id as string;
  const paramUserId = req.params.userId as string;

  console.log(currentUserId, paramUserId);

  const userId = paramUserId || currentUserId;
  const posts = await getUserPosts(userId as string, currentUserId);
  return successResponse(res, 200, "User posts fetched successfully", posts);
});

export const createPost = asyncHandler(async (req, res) => {
  const data = { media: req.files, ...req.body };
  const userId = req.user?.id;

  console.log("adding files");
  const post = await uploadPost(data, userId as string);

  return successResponse(res, 200, "Post uploaded", post);
});

export const getUserFeed = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const posts = await getUserFeedPosts(userId);
  console.log("post to pass :", posts);
  return successResponse(res, 200, "Feed fetched successfully", posts);
});

export const getPostDetail = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const postId = req.params.postId as string;
  const postDetail = await getPostById(postId, userId);
  return successResponse(res, 200, "post fetched successfully", postDetail);
});
