import { z } from "zod";

const uuidSchema = z.uuid();

export const assignmentIdParamsSchema = z.object({
  id: uuidSchema,
});

export const assignmentSubmissionsParamsSchema = z.object({
  assignmentId: uuidSchema,
});

export const batchIdParamsSchema = z.object({
  batchId: uuidSchema,
});

export const listAssignmentsQuerySchema = z.object({
  batchId: uuidSchema.optional(),
  all: z.enum(["true", "false"]).optional(),
});

const dateTimeSchema = z
  .iso.datetime()
  .transform((value) => new Date(value))
  .nullable()
  .optional();

export const createAssignmentValidationSchema = z.object({
  batchId: uuidSchema,
  title: z.string().trim().min(1).max(255),
  instructions: z.string().trim().min(1),
  totalMarks: z.number().positive().max(999999.99),
  dueAt: dateTimeSchema,
  attachmentUrl: z.string().url().nullable().optional(),
  isPublished: z.boolean().optional(),
});

export const createBatchAssignmentValidationSchema = z.object({
  title: z.string().trim().min(1).max(255),
  instructions: z.string().trim().min(1),
  totalMarks: z.number().positive().max(999999.99),
  dueAt: dateTimeSchema,
  attachmentUrl: z.string().url().nullable().optional(),
  isPublished: z.boolean().optional(),
});

export const updateAssignmentValidationSchema = z
  .object({
    batchId: uuidSchema.optional(),
    title: z.string().trim().min(1).max(255).optional(),
    instructions: z.string().trim().min(1).optional(),
    totalMarks: z.number().positive().max(999999.99).optional(),
    dueAt: dateTimeSchema,
    attachmentUrl: z.string().url().nullable().optional(),
    isPublished: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export const submitAssignmentValidationSchema = z
  .object({
    answerText: z.string().trim().nullable().optional(),
    fileUrl: z.string().url().nullable().optional(),
  })
  .refine(
    (data) => Boolean(data.answerText?.trim() || data.fileUrl),
    "An answer or file is required.",
  );

export const reviewSubmissionValidationSchema = z
  .object({
    marks: z.number().min(0).max(999999.99).nullable().optional(),
    feedback: z.string().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });
