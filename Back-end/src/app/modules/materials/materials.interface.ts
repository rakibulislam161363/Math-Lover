import type { z } from "zod";
import type {
  createMaterialValidationSchema,
  updateMaterialValidationSchema,
} from "./materials.validation";

export type MaterialCreateInput = z.infer<
  typeof createMaterialValidationSchema
>;
export type MaterialUpdateInput = z.infer<
  typeof updateMaterialValidationSchema
>;
