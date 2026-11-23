import type { z } from "zod";
import type {
  createScheduleValidationSchema,
  createSessionValidationSchema,
  markAttendanceValidationSchema,
  updateSessionValidationSchema,
} from "./live-classes.validation";

export type ScheduleCreateInput = z.infer<
  typeof createScheduleValidationSchema
>;
export type SessionCreateInput = z.infer<
  typeof createSessionValidationSchema
>;
export type SessionUpdateInput = z.infer<
  typeof updateSessionValidationSchema
>;
export type AttendanceInput = z.infer<
  typeof markAttendanceValidationSchema
>;
