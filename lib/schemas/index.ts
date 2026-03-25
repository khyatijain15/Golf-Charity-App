import { z } from "zod";

export const scoreSchema = z.object({
  score: z.coerce
    .number()
    .min(1, { message: "Score must be at least 1" })
    .max(45, { message: "Score cannot exceed 45" }),
  played_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
});

export const charitySchema = z.object({
    charity_percentage: z.coerce.number().min(10, "Minimum contribution is 10%").max(100, "Maximum is 100%"),
    selected_charity_id: z.string().uuid("Invalid Charity ID"),
});

export const drawConfigSchema = z.object({
    draw_type: z.enum(['random', 'algorithmic']),
    jackpot_amount: z.coerce.number().min(0),
    winning_numbers: z.array(z.number().min(1).max(45)).length(5).optional(),
});
