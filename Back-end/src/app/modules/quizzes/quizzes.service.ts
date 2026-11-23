import { prisma } from "../../lib/prisma";
import {
  QuizAnswersInput,
  QuizCreateInput,
  QuizUpdateInput,
} from "./quizzes.interface";

export const listQuizzes = (batchId: string) =>
  prisma.quiz.findMany({
    where: { batchId },
    include: { questions: { include: { options: true } } },
  });

export const createQuiz = (batchId: string, data: QuizCreateInput) => {
  const { questions, ...quiz } = data;
  return prisma.quiz.create({
    data: {
      ...quiz,
      batchId,
      questions: questions?.length
        ? {
            create: questions.map((question) => ({
              ...question,
              options: question.options?.length
                ? { create: question.options }
                : undefined,
            })),
          }
        : undefined,
    },
  });
};

export const updateQuiz = (id: string, data: QuizUpdateInput) =>
  prisma.quiz.update({ where: { id }, data });

export const startQuizAttempt = (quizId: string, studentId: string) =>
  prisma.quizAttempt.create({ data: { quizId, studentId } });

export const getQuizAttempt = (id: string) =>
  prisma.quizAttempt.findUnique({
    where: { id },
    include: {
      quiz: { include: { questions: { include: { options: true } } } },
    },
  });

export const saveQuizAnswer = (
  attemptId: string,
  questionId: string,
  selectedOptionId: string | undefined,
  answerText: string | undefined,
  awardedMarks: number,
) =>
  prisma.quizAnswer.upsert({
    where: { attemptId_questionId: { attemptId, questionId } },
    create: {
      attemptId,
      questionId,
      selectedOptionId,
      answerText,
      awardedMarks,
    },
    update: { selectedOptionId, answerText, awardedMarks },
  });

export const finishQuizAttempt = (id: string, score: number) =>
  prisma.quizAttempt.update({
    where: { id },
    data: { score, submittedAt: new Date(), status: "SUBMITTED" },
  });

export const submitQuizAttempt = async (
  id: string,
  studentId: string,
  input: QuizAnswersInput,
) => {
  const attempt = await getQuizAttempt(id);
  if (!attempt || attempt.studentId !== studentId) return null;

  let score = 0;
  for (const answer of input.answers ?? []) {
    const question = attempt.quiz.questions.find(
      (item) => item.id === answer.questionId,
    );
    const correct = question?.options.find(
      (option) =>
        option.isCorrect && option.id === answer.selectedOptionId,
    );
    const awardedMarks = correct && question ? Number(question.marks) : 0;
    score += awardedMarks;
    await saveQuizAnswer(
      attempt.id,
      answer.questionId,
      answer.selectedOptionId,
      answer.answerText,
      awardedMarks,
    );
  }
  return finishQuizAttempt(attempt.id, score);
};

export const listQuizAttemptsForStudent = (studentId: string) =>
  prisma.quizAttempt.findMany({
    where: { studentId },
    include: { quiz: true, answers: true },
  });
