import { z } from "zod";

export const createInterviewSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  candidateEmail: z.string().email("Enter a valid candidate email"),
  date: z.string().min(1, "Pick a date and time"),
  duration: z.coerce.number().int().min(15, "Minimum 15 minutes").max(240, "Maximum 240 minutes"),
});

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;