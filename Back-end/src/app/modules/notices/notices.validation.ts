import { z } from "zod";

const uuidSchema = z.uuid();
const publishedAtSchema = z.coerce.date().nullable().optional();

export const batchIdParamsSchema = z.object({
  batchId: uuidSchema,
});

export const noticeIdParamsSchema = z.object({
  id: uuidSchema,
});

export const createNoticeValidationSchema = z.object({
  batchId: uuidSchema.nullable().optional(),
  title: z.string().trim().min(1).max(255),
  content: z.string().trim().min(1),
  publishedAt: publishedAtSchema,
  isPublished: z.boolean().optional(),
});

export const updateNoticeValidationSchema = z
  .object({
    batchId: uuidSchema.nullable().optional(),
    title: z.string().trim().min(1).max(255).optional(),
    content: z.string().trim().min(1).optional(),
    publishedAt: publishedAtSchema,
    isPublished: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });
