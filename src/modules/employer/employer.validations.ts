import { z } from "zod";

const phoneRegex = /^[6-9]\d{9}$/;

export const editEmployerProfileSchema = z.object({
  firstName: z.string().trim().min(2, "Too short").optional(),
  lastName: z.string().trim().min(1, "Too short").optional(),
  age: z.coerce
    .number({ error: "Age must be a number" })
    .min(18, "Must be at least 18")
    .max(100, "That doesn't look right")
    .optional(),
  mobile: z
    .string()
    .regex(phoneRegex, "Enter a valid 10-digit mobile number")
    .optional(),
  whatsapp: z
    .string()
    .regex(phoneRegex, "Enter a valid 10-digit WhatsApp number")
    .optional(),
});
