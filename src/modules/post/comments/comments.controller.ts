import asyncHandler from "express-async-handler";
import { successResponse } from "../../../utils";
import {
  addReplyComment,
  crateNewComment,
  getPostCommentService,
  getRepliesService,
} from "./comments.service";

export const addComment = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const { content, postId } = req.body;

  const comment = await crateNewComment({ userId, content, postId });
  return successResponse(res, 201, "Comment added", comment);
});

export const addReply = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const { reply, postId, parentComment } = req.body;

  const replyComment = await addReplyComment({
    postId,
    parentComment,
    content: reply,
    userId,
  });

  return successResponse(res, 201, "Reply added", replyComment);
});

export const getPostComments = asyncHandler(async (req, res) => {
  const postId = req.params.postId as string;
  const { page = 1, limit = 5 } = req.query;

  const result = await getPostCommentService({
    postId,
    page: Number(page),
    limit: Number(limit),
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getMoreReplies = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId as string;
  const { page = 1, limit = 5 } = req.query;

  const replies = await getRepliesService({
    parentCommentId: commentId,
    page: Number(page),
    limit: Number(limit),
  });

  res.status(200).json({ success: true, data: replies });
});
