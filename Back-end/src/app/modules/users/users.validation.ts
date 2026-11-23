import { z } from "zod";

export const studentProfileValidationSchema = z.object({
  classLevel: z.enum(["CLASS_6", "CLASS_7", "CLASS_8", "CLASS_9", "CLASS_10"]),
  schoolName: z.string().trim().min(1).max(255).nullable().optional(),
  guardianName: z.string().trim().min(1).max(100).nullable().optional(),
  guardianPhone: z.string().trim().min(1).max(32).nullable().optional(),
});
