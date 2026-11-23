import { z } from "zod";

const uuidSchema = z.uuid();

export const batchIdParamsSchema = z.object({
  batchId: uuidSchema,
});

export const quizIdParamsSchema = z.object({
  id: uuidSchema,
});

export const quizAttemptParamsSchema = z.object({
  quizId: uuidSchema,
});

export const attemptIdParamsSchema = z.object({
  attemptId: uuidSchema,
});

const quizQuestionSchema = z.object({
  questionText: z.string().trim().min(1),
  questionType: z.enum(["MCQ", "TRUE_FALSE"]).optional(),
  marks: z.number().positive(),
  sortOrder: z.number().int().min(0).optional(),
  options: z
    .array(
      z.object({
        optionText: z.string().trim().min(1),
        isCorrect: z.boolean().optional(),
        sortOrder: z.number().int().min(0).optional(),
      }),
    )
    .optional(),
});

export const createQuizValidationSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().nullable().optional(),
  totalMarks: z.number().positive().max(999999.99),
  durationMinutes: z.number().int().positive().nullable().optional(),
  startAt: z
    .iso.datetime()
    .transform((value) => new Date(value))
    .nullable()
    .optional(),
  endAt: z
    .iso.datetime()
    .transform((value) => new Date(value))
    .nullable()
    .optional(),
  isPublished: z.boolean().optional(),
  questions: z.array(quizQuestionSchema).optional(),
});

export const updateQuizValidationSchema = z
  .object({
    title: z.string().trim().min(1).max(255).optional(),
    description: z.string().trim().nullable().optional(),
    totalMarks: z.number().positive().max(999999.99).optional(),
    durationMinutes: z.number().int().positive().nullable().optional(),
    startAt: z
      .iso.datetime()
      .transform((value) => new Date(value))
      .nullable()
      .optional(),
    endAt: z
      .iso.datetime()
      .transform((value) => new Date(value))
      .nullable()
      .optional(),
    isPublished: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export const submitQuizAttemptValidationSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: uuidSchema,
        selectedOptionId: uuidSchema.optional(),
        answerText: z.string().optional(),
      }),
    )
    .optional(),
});
