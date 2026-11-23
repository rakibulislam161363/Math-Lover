import { z } from "zod";

const uuidSchema = z.uuid();

export const batchIdParamsSchema = z.object({
  batchId: uuidSchema,
});

export const chapterIdParamsSchema = z.object({
  chapterId: uuidSchema,
});

export const lessonIdParamsSchema = z.object({
  lessonId: uuidSchema,
});

export const idParamsSchema = z.object({
  id: uuidSchema,
});

export const createChapterValidationSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional(),
});

export const updateChapterValidationSchema = z
  .object({
    title: z.string().trim().min(1).max(255).optional(),
    description: z.string().trim().nullable().optional(),
    sortOrder: z.number().int().min(0).optional(),
    isPublished: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export const createLessonValidationSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().nullable().optional(),
  videoProvider: z.enum(["YOUTUBE"]).optional(),
  videoId: z.string().trim().min(1).nullable().optional(),
  videoUrl: z.string().url().nullable().optional(),
  durationSeconds: z.number().int().positive().nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isPublished: z.boolean().optional(),
});

export const updateLessonValidationSchema = z
  .object({
    title: z.string().trim().min(1).max(255).optional(),
    description: z.string().trim().nullable().optional(),
    videoProvider: z.enum(["YOUTUBE"]).optional(),
    videoId: z.string().trim().min(1).nullable().optional(),
    videoUrl: z.string().url().nullable().optional(),
    durationSeconds: z.number().int().positive().nullable().optional(),
    sortOrder: z.number().int().min(0).optional(),
    isPublished: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export const lessonProgressValidationSchema = z.object({
  watchedSeconds: z.number().int().min(0),
  completionPercentage: z.number().min(0).max(100),
  isCompleted: z.boolean(),
});

