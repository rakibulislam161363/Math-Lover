import { Prisma } from "../../../generated/prisma/client";
import { QuestionType } from "../../../generated/prisma/enums";

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
