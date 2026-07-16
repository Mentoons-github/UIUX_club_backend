import { z } from "zod";

export const employerRegisterSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    age: z.coerce
      .number({ error: "Enter a valid age" })
      .min(18, "Enter a valid age")
      .max(100, "Enter a valid age"),
    designation: z.string().min(1, "Designation is required"),
    designationOther: z.string().optional(),
    companyName: z.string().min(1, "Company name is required"),
    industry: z.string().min(1, "Select an industry"),
    companySize: z.string().min(1, "Select company size"),
    location: z.string().min(1, "Location is required"),
    turnover: z.string().optional(),
    perks: z.array(z.string()).optional(),
    companyAbout: z.string().optional(),
    mobile: z
      .string()
      .min(1, "Mobile number is required")
      .regex(/^\+?[0-9]{7,15}$/, "Enter a valid mobile number"),
    sameAsPhone: z.boolean().optional(),
    whatsapp: z
      .string()
      .regex(/^\+?[0-9]{7,15}$/, "Enter a valid WhatsApp number")
      .optional()
      .or(z.literal("")),
    website: z
      .string()
      .min(1, "Website is required")
      .regex(
        /^https?:\/\/.+\..+/,
        "Enter a valid URL (e.g. https://company.com)",
      ),
    jobTitle: z.string().min(1, "Job title is required"),
    jobType: z.string().min(1, "Select a job type"),
    workLocation: z.string().min(1, "Select a work location"),
    expLevel: z.string().min(1, "Select experience level"),
    jobDescription: z.string().min(1, "Job description is required"),
    workEmail: z
      .string()
      .min(1, "Work email is required")
      .regex(/\S+@\S+\.\S+/, "Enter a valid email"),
    password: z.string().min(8, "Minimum 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .superRefine((data, ctx) => {
    if (data.designation === "Others" && !data.designationOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify your designation",
        path: ["designationOther"],
      });
    }

    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });
