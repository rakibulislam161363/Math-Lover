import { z } from "zod";

const uuidSchema = z.uuid();
const timeSchema = z.string().regex(
  /^(?:[01]\d|2[0-3]):[0-5]\d$/,
  "Time must use HH:mm format.",
);
const dateSchema = z.coerce.date();

export const batchIdParamsSchema = z.object({
  batchId: uuidSchema,
});

export const scheduleIdParamsSchema = z.object({
  id: uuidSchema,
});

export const sessionIdParamsSchema = z.object({
  id: uuidSchema,
});

export const sessionAttendanceParamsSchema = z.object({
  sessionId: uuidSchema,
});

export const createScheduleValidationSchema = z
  .object({
    dayOfWeek: z.enum([
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ]),
    startTime: timeSchema,
    endTime: timeSchema,
    timezone: z.string().trim().min(1).optional(),
    effectiveFrom: dateSchema.nullable().optional(),
    effectiveUntil: dateSchema.nullable().optional(),
    isActive: z.boolean().optional(),
  })
  .superRefine((schedule, context) => {
    if (schedule.endTime <= schedule.startTime) {
      context.addIssue({
        code: "custom",
        message: "Schedule end time must be after its start time.",
        path: ["endTime"],
      });
    }

    if (
      schedule.effectiveFrom &&
      schedule.effectiveUntil &&
      schedule.effectiveUntil < schedule.effectiveFrom
    ) {
      context.addIssue({
        code: "custom",
        message: "Schedule end date must be on or after its start date.",
        path: ["effectiveUntil"],
      });
    }
  });

export const updateScheduleValidationSchema = z
  .object({
    dayOfWeek: z
      .enum([
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ])
      .optional(),
    startTime: timeSchema.optional(),
    endTime: timeSchema.optional(),
    timezone: z.string().trim().min(1).optional(),
    effectiveFrom: dateSchema.nullable().optional(),
    effectiveUntil: dateSchema.nullable().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((schedule) => Object.keys(schedule).length > 0, {
    message: "At least one field must be provided.",
  })
  .refine(
    (schedule) =>
      schedule.startTime === undefined ||
      schedule.endTime === undefined ||
      schedule.endTime > schedule.startTime,
    {
      message: "Schedule end time must be after its start time.",
      path: ["endTime"],
    },
  )
  .refine(
    (schedule) =>
      schedule.effectiveFrom === undefined ||
      schedule.effectiveUntil === undefined ||
      schedule.effectiveFrom === null ||
      schedule.effectiveUntil === null ||
      schedule.effectiveUntil >= schedule.effectiveFrom,
    {
      message: "Schedule end date must be on or after its start date.",
      path: ["effectiveUntil"],
    },
  );

const createSessionSchema = z.object({
  scheduleId: uuidSchema.nullable().optional(),
  title: z.string().trim().min(1).max(255),
  topic: z.string().trim().nullable().optional(),
  startsAt: dateSchema,
  endsAt: dateSchema,
  meetUrl: z.string().url().nullable().optional(),
  status: z.enum(["SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"]).optional(),
});

export const createSessionValidationSchema = createSessionSchema.refine(
  (session) => session.endsAt > session.startsAt,
  {
    message: "Session end time must be after its start time.",
    path: ["endsAt"],
  },
);

export const updateSessionValidationSchema = z
  .object({
    scheduleId: uuidSchema.nullable().optional(),
    title: z.string().trim().min(1).max(255).optional(),
    topic: z.string().trim().nullable().optional(),
    startsAt: dateSchema.optional(),
    endsAt: dateSchema.optional(),
    meetUrl: z.string().url().nullable().optional(),
    status: z
      .enum(["SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"])
      .optional(),
  })
  .refine((session) => Object.keys(session).length > 0, {
    message: "At least one field must be provided.",
  })
  .refine(
    (session) =>
      session.startsAt === undefined ||
      session.endsAt === undefined ||
      session.endsAt > session.startsAt,
    {
      message: "Session end time must be after its start time.",
      path: ["endsAt"],
    },
  );

export const markAttendanceValidationSchema = z.object({
  studentId: uuidSchema,
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
});
