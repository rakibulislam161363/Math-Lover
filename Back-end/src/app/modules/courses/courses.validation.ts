import { z } from "zod";

const uuidSchema = z.uuid();

export const courseIdParamsSchema = z.object({
  id: uuidSchema,
});

export const courseSlugParamsSchema = z.object({
  slug: z.string().trim().min(1).max(255),
});

export const batchIdParamsSchema = z.object({
  id: uuidSchema,
});

export const listCoursesQuerySchema = z.object({
  classLevel: z
    .enum(["CLASS_6", "CLASS_7", "CLASS_8", "CLASS_9", "CLASS_10"])
    .optional(),
  all: z.enum(["true", "false"]).optional(),
});

export const listBatchesQuerySchema = z.object({
  courseId: uuidSchema.optional(),
});

export const createCourseValidationSchema = z.object({
  title: z.string().trim().min(1).max(255),
  slug: z.string().trim().min(1).max(255),
  classLevel: z.enum(["CLASS_6", "CLASS_7", "CLASS_8", "CLASS_9", "CLASS_10"]),
  description: z.string().trim().nullable().optional(),
  thumbnailUrl: z.string().url().nullable().optional(),
  isPublished: z.boolean().optional(),
});

export const updateCourseValidationSchema = z
  .object({
    title: z.string().trim().min(1).max(255).optional(),
    slug: z.string().trim().min(1).max(255).optional(),
    classLevel: z
      .enum(["CLASS_6", "CLASS_7", "CLASS_8", "CLASS_9", "CLASS_10"])
      .optional(),
    description: z.string().trim().nullable().optional(),
    thumbnailUrl: z.string().url().nullable().optional(),
    isPublished: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

const dateTimeSchema = z
  .iso.datetime()
  .transform((value) => new Date(value))
  .nullable()
  .optional();

const batchFields = {
  title: z.string().trim().min(1).max(255),
  monthlyFee: z.number().positive().max(99999999.99),
  capacity: z.number().int().positive().nullable().optional(),
  startDate: dateTimeSchema,
  endDate: dateTimeSchema,
  enrollmentOpen: z.boolean().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE", "COMPLETED"]).optional(),
};

export const createBatchValidationSchema = z
  .object({
    courseId: uuidSchema,
    ...batchFields,
  })
  .refine(
    (batch) =>
      !batch.startDate ||
      !batch.endDate ||
      batch.endDate >= batch.startDate,
    {
      message: "Batch end date must be on or after its start date.",
      path: ["endDate"],
    },
  );

export const updateBatchValidationSchema = z
  .object({
    courseId: uuidSchema.optional(),
    title: z.string().trim().min(1).max(255).optional(),
    monthlyFee: z.number().positive().max(99999999.99).optional(),
    capacity: z.number().int().positive().nullable().optional(),
    startDate: dateTimeSchema,
    endDate: dateTimeSchema,
    enrollmentOpen: z.boolean().optional(),
    status: z.enum(["DRAFT", "ACTIVE", "INACTIVE", "COMPLETED"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  })
  .refine(
    (batch) =>
      batch.startDate === undefined ||
      batch.endDate === undefined ||
      batch.startDate === null ||
      batch.endDate === null ||
      batch.endDate >= batch.startDate,
    {
      message: "Batch end date must be on or after its start date.",
      path: ["endDate"],
    },
  );
