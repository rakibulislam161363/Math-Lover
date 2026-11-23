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
  .transform((value) => new Date(value));

const nullableDateTimeSchema = dateTimeSchema
  .nullable()
  .optional();

export const updateEnrollmentValidationSchema = z
  .object({
    status: z
      .enum(["PENDING", "ACTIVE", "COMPLETED", "CANCELLED", "SUSPENDED"])
      .optional(),
    enrolledAt: dateTimeSchema.optional(),
    startedAt: nullableDateTimeSchema,
    endedAt: nullableDateTimeSchema,
    recordedAccessUntil: nullableDateTimeSchema,
    liveAccessEnabled: z.boolean().optional(),
    materialAccessEnabled: z.boolean().optional(),
    assignmentAccessEnabled: z.boolean().optional(),
    reason: z.string().trim().min(1).max(1000).optional(),
  })
  .refine((data) => Object.keys(data).some((key) => key !== "reason"), {
    message: "At least one field must be provided.",
  })
  .refine(
    (data) =>
      !(
        "status" in data ||
        "recordedAccessUntil" in data ||
        "liveAccessEnabled" in data ||
        "materialAccessEnabled" in data ||
        "assignmentAccessEnabled" in data
      ) || Boolean(data.reason),
    {
      message: "A reason is required when changing enrollment access.",
      path: ["reason"],
    },
  );
