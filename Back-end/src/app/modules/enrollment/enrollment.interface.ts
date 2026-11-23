import type { z } from "zod";
import type { updateEnrollmentValidationSchema } from "./enrollment.validation";

export type EnrollmentUpdateInput = z.infer<
  typeof updateEnrollmentValidationSchema
>;
