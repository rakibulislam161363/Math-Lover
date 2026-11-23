import type { z } from "zod";
import type {
  createNoticeValidationSchema,
  updateNoticeValidationSchema,
} from "./notices.validation";

export type NoticeCreateInput = z.infer<
  typeof createNoticeValidationSchema
>;
export type NoticeUpdateInput = z.infer<
  typeof updateNoticeValidationSchema
>;
