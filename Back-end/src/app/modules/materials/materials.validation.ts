import { z } from "zod";

const uuidSchema = z.uuid();

export const batchIdParamsSchema = z.object({
  batchId: uuidSchema,
});

export const materialIdParamsSchema = z.object({
  id: uuidSchema,
});

export const createMaterialValidationSchema = z.object({
  chapterId: uuidSchema.nullable().optional(),
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().nullable().optional(),
  fileUrl: z.string().url(),
  fileType: z.enum(["PDF", "IMAGE", "LINK", "OTHER"]).optional(),
  isPublished: z.boolean().optional(),
});

export const updateMaterialValidationSchema = z
  .object({
    chapterId: uuidSchema.nullable().optional(),
    title: z.string().trim().min(1).max(255).optional(),
    description: z.string().trim().nullable().optional(),
    fileUrl: z.string().url().optional(),
    fileType: z.enum(["PDF", "IMAGE", "LINK", "OTHER"]).optional(),
    isPublished: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });
