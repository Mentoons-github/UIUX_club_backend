import z from "zod";
import { reportReasons } from "./report.constants";

export const reportBodySchema = z.object({
  reason: z.enum(reportReasons),
  description: z.string().trim().max(500).optional(),
});
