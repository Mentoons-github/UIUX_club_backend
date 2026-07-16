import { z } from "zod";

export const likeSchema = z.object({
  params: z.object({
    postId: z.string().min(1),
  }),
});
