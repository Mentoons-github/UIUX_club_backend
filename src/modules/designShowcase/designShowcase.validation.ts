import { z } from "zod";
import { SHOWCASE_CATEGORIES } from "./designShowcase.constants";

const linkPreviewSchema = z
  .object({
    url: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    image: z
      .object({
        url: z.string().optional().nullable(),
      })
      .optional()
      .nullable(),
    logo: z
      .object({
        url: z.string().optional().nullable(),
      })
      .optional()
      .nullable(),
    publisher: z.string().optional().nullable(),
    author: z.string().optional().nullable(),
  })
  .optional()
  .nullable();

export const createDesignShowcaseSchema = z.object({
  caption: z.string().optional(),

  linkPreview: z.preprocess((value) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }
    return value;
  }, linkPreviewSchema),

  videoUrls: z.preprocess((value) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return [value];
      }
    }
    return value;
  }, z.array(z.string()).optional()),

  tools: z.preprocess(
    (value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return [value];
        }
      }
      return value;
    },
    z.array(z.string().min(1).max(50)).max(10).optional(),
  ),

  category: z.enum(SHOWCASE_CATEGORIES).optional(),
});
