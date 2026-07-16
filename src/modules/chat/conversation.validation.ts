import { z } from "zod";

export const findOrCreateConversationSchema = z.object({
  receiverId: z.string(),
  receiverType: z.enum(["User", "Employer"]),
});
