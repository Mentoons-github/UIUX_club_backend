import asyncHandler from "express-async-handler";
import { successResponse } from "../../../utils";
import {
  createDesignComment,
  addDesignReplyComment,
  getDesignCommentsService,
  getDesignRepliesService,
} from "./designComment.service";

export const addDesignComment = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const { content, designId } = req.body;

  const comment = await createDesignComment({ userId, content, designId });
  return successResponse(res, 201, "Comment added", comment);
});

export const addDesignReply = asyncHandler(async (req, res) => {
  const userId = req.user!.id;
  const { reply, designId, parentComment } = req.body;

  console.log("reached");

  const replyComment = await addDesignReplyComment({
    designId,
    parentComment,
    content: reply,
    userId,
  });

  console.log("reply comment added")

  return successResponse(res, 201, "Reply added", replyComment);
});

export const getDesignComments = asyncHandler(async (req, res) => {
  const designId = req.params.designId as string;
  const { page = 1, limit = 5 } = req.query;

  const result = await getDesignCommentsService({
    designId,
    page: Number(page),
    limit: Number(limit),
  });

  res.status(200).json({ success: true, data: result });
});

export const getMoreDesignReplies = asyncHandler(async (req, res) => {
  const commentId = req.params.commentId as string;
  const { page = 1, limit = 5 } = req.query;

  const replies = await getDesignRepliesService({
    parentCommentId: commentId,
    page: Number(page),
    limit: Number(limit),
  });

  res.status(200).json({ success: true, data: replies });
});
