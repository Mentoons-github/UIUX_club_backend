import { z } from "zod";

export const extendJobExpiryDateSchema = z.object({
  date: z
    .string()
    .trim()
    .min(1, "Expiry date is required")
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Invalid expiry date",
    })
    .refine(
      (value) => {
        const selectedDate = new Date(value);
        const today = new Date();

        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        return selectedDate >= today;
      },
      {
        message: "Expiry date cannot be in the past",
      },
    )
    .refine(
      (value) => {
        const selectedDate = new Date(value);
        const maxDate = new Date();

        maxDate.setHours(0, 0, 0, 0);
        maxDate.setMonth(maxDate.getMonth() + 3);

        return selectedDate <= maxDate;
      },
      {
        message: "Expiry date cannot be more than 3 months from today",
      },
    ),
});
