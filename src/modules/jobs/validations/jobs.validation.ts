import { z } from "zod";

const screeningQuestionSchema = z.object({
  question: z.string().trim().min(1, "Question is required"),
  required: z.boolean().optional().default(true),
});

export const createJobSchema = z.object({
  category: z.enum(["internship", "uiux", "freelancers"]),
  title: z.string().trim().min(1, "Title is required"),
  tag: z.string().trim().optional(),
  skills: z.array(z.string()).optional().default([]),
  description: z.string().trim().min(1, "Description is required"),
  role: z.string().trim().min(1, "Role is required"),
  company: z.object({
    name: z.string().trim().min(1, "Company name is required"),
    logo: z.string().trim().optional().default(""),
  }),
  location: z.string().trim().min(1, "Location is required"),
  type: z.enum([
    "Full-time",
    "Hybrid",
    "On-site",
    "Contract",
    "Project",
    "Ongoing",
    "Remote",
  ]),
  salary: z.string().trim().min(1, "Salary is required"),
  experienceRequired: z.string().trim().optional(),
  tags: z.array(z.string()).optional().default([]),
  paid: z.boolean().optional().default(true),
  screeningQuestions: z.array(screeningQuestionSchema).optional().default([]),
  benefits: z.array(z.string()).optional().default([]),
  responsibilities: z.array(z.string()).optional().default([]),
  requirements: z.array(z.string()).optional().default([]),
  preferredQualifications: z.array(z.string()).optional().default([]),
});
