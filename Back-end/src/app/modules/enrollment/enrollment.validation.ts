import { z } from "zod";

const uuidSchema = z.uuid();

export const enrollmentIdParamsSchema = z.object({
  id: uuidSchema,
});

export const createEnrollmentValidationSchema = z.object({
  batchId: uuidSchema,
});

const dateTimeSchema = z
  .iso.datetime()
  .transform((value) => new Date(value))
  .nullable()
  .optional();

export const updateEnrollmentValidationSchema = z
  .object({
    status: z
      .enum(["PENDING", "ACTIVE", "COMPLETED", "CANCELLED", "SUSPENDED"])
      .optional(),
    enrolledAt: dateTimeSchema,
    startedAt: dateTimeSchema,
    endedAt: dateTimeSchema,
    recordedAccessUntil: dateTimeSchema,
    liveAccessEnabled: z.boolean().optional(),
    materialAccessEnabled: z.boolean().optional(),
    assignmentAccessEnabled: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });
