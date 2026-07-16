import z from "zod";

const textStatusSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
});

const mediaStatusSchema = z.object({
  type: z.enum(["image", "video"]),
  caption: z.string().optional(),
});

export const createStatusSchema = z.discriminatedUnion("type", [
  textStatusSchema,
  mediaStatusSchema,
]);
