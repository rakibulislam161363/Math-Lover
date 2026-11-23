import { Prisma } from "../../../generated/prisma/client";

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
