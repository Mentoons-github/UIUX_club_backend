import { z } from "zod";

const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–500", "500+"] as const;

const INDUSTRIES = [
  "Technology",
  "Finance & Banking",
  "Healthcare",
  "Education",
  "Retail & E-commerce",
  "Manufacturing",
  "Media & Entertainment",
  "Consulting",
  "Real Estate",
  "Logistics",
  "Other",
] as const;

const WORK_LOCATIONS = ["On-site", "Remote", "Hybrid"] as const;

const JOB_TYPES = [
  "Full-Time",
  "Part-Time",
  "Contract",
  "Internship",
  "Freelance",
] as const;

export const companyUpdateSchema = z.object({
  companyName: z.string().trim().min(2, "Too short"),
  companyAbout: z.string().trim().min(10, "Too short"),
  companySize: z.enum(COMPANY_SIZES, { message: "Select a valid company size" }),
  industry: z.enum(INDUSTRIES, { message: "Select a valid industry" }),
  workLocation: z.enum(WORK_LOCATIONS, { message: "Select a valid work location" }),
  location: z.string().trim().min(2, "Location is required"),
  turnover: z.string().trim().min(2, "Too short"),
  perks: z.array(z.string().trim().min(2, "Too short")).default([]),
  website: z.string().trim().url("Enter a valid URL"),
  jobTitle: z.string().trim().min(2, "Too short"),
  jobType: z.enum(JOB_TYPES, { message: "Select a valid job type" }),
  designation: z.string().trim().min(2, "Designation is required"),
});

