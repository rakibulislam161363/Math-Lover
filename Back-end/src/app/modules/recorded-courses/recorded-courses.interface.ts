import type { z } from "zod";
import type {
  createChapterValidationSchema,
  createLessonValidationSchema,
  lessonProgressValidationSchema,
  updateChapterValidationSchema,
  updateLessonValidationSchema,
} from "./recorded-courses.validation";

export type ChapterCreateInput = z.infer<
  typeof createChapterValidationSchema
>;
export type ChapterUpdateInput = z.infer<
  typeof updateChapterValidationSchema
>;
export type LessonCreateInput = z.infer<
  typeof createLessonValidationSchema
>;
export type LessonUpdateInput = z.infer<
  typeof updateLessonValidationSchema
>;
export type LessonProgressUpdateInput = z.infer<
  typeof lessonProgressValidationSchema
>;
