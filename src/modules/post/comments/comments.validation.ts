import { z } from "zod";

export const addCommentSchema = z.object({
  content: z.string(),
  postId: z.string(),
});

export const replyCommentSchema = z.object({
  reply: z.string(),
  parentComment: z.string(),
  postId: z.string(),
});
