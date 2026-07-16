import { z } from "zod";

const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  currentlyWorking: z
    .union([z.boolean(), z.string()])
    .transform((v) => v === true || v === "true"),
  description: z.string().optional(),
});

const screeningAnswerSchema = z.object({
  questionId: z.string(),
  question: z.string(),
  answer: z.string(),
});

export const applyJobSchema = z.object({
  email: z.string().email(),
  age: z.coerce.number().min(18).max(60),
  gender: z.enum(["male", "female", "non-binary", "prefer-not-to-say"]),
  country: z.string().min(2),
  state: z.string().min(1),
  city: z.string().min(1),
  phoneNumber: z.string().min(7).max(15),
  whatsappNumber: z.string().min(7).max(15),
  portfolioLink: z.string().url().optional().or(z.literal("")),
  totalExperienceYears: z.coerce.number().min(0).optional(),
  experience: z
    .union([z.string(), z.array(experienceSchema)])
    .transform((v) => (typeof v === "string" ? JSON.parse(v) : v))
    .pipe(z.array(experienceSchema))
    .optional()
    .default([]),
  screeningAnswers: z
    .union([z.string(), z.array(screeningAnswerSchema)])
    .transform((v) => (typeof v === "string" ? JSON.parse(v) : v))
    .pipe(z.array(screeningAnswerSchema))
    .optional()
    .default([]),
});
