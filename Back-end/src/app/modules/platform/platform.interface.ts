import { Prisma } from "../../../generated/prisma/client";
import {
  AttendanceStatus,
  QuestionType,
} from "../../../generated/prisma/enums";

export type ChapterCreateInput = Omit<Prisma.ChapterUncheckedCreateInput, "batchId">;
export type ChapterUpdateInput = Prisma.ChapterUncheckedUpdateInput;
export type LessonCreateInput = Omit<Prisma.LessonUncheckedCreateInput, "chapterId">;
export type LessonUpdateInput = Prisma.LessonUncheckedUpdateInput;
export type LessonProgressInput = Omit<
  Prisma.LessonProgressUncheckedCreateInput,
  "studentId" | "lessonId"
>;
export type MaterialCreateInput = Omit<Prisma.MaterialUncheckedCreateInput, "batchId">;
export type MaterialUpdateInput = Prisma.MaterialUncheckedUpdateInput;
export type ScheduleCreateInput = Omit<
  Prisma.BatchScheduleUncheckedCreateInput,
  "batchId"
>;
export type SessionCreateInput = Omit<
  Prisma.ClassSessionUncheckedCreateInput,
  "batchId"
>;
export type SessionUpdateInput = Prisma.ClassSessionUncheckedUpdateInput;
export type AttendanceInput = {
  studentId: string;
  status: AttendanceStatus;
};
export type AssignmentCreateInput = Omit<
  Prisma.AssignmentUncheckedCreateInput,
  "batchId"
>;
export type AssignmentUpdateInput = Prisma.AssignmentUncheckedUpdateInput;
export type AssignmentSubmissionInput = Pick<
  Prisma.AssignmentSubmissionUncheckedCreateInput,
  "answerText" | "fileUrl"
>;
export type SubmissionReviewInput = Pick<
  Prisma.AssignmentSubmissionUncheckedUpdateInput,
  "marks" | "feedback"
>;
export type QuizQuestionInput = {
  questionText: string;
  questionType?: QuestionType;
  marks: number;
  sortOrder?: number;
  options?: Array<{
    optionText: string;
    isCorrect?: boolean;
    sortOrder?: number;
  }>;
};
export type QuizCreateInput = Omit<
  Prisma.QuizUncheckedCreateInput,
  "batchId" | "questions"
> & { questions?: QuizQuestionInput[] };
export type QuizUpdateInput = Prisma.QuizUncheckedUpdateInput;
export type QuizAnswersInput = {
  answers?: Array<{
    questionId: string;
    selectedOptionId?: string;
    answerText?: string;
  }>;
};
export type NoticeCreateInput = Prisma.NoticeUncheckedCreateInput;
export type NoticeUpdateInput = Prisma.NoticeUncheckedUpdateInput;
