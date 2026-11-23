import httpStatus from "http-status";
import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../utils/httpError";
import {
  QuizAnswersInput,
  QuizCreateInput,
  QuizUpdateInput,
} from "./quizzes.interface";

export const listQuizzes = (
  batchId: string,
  userId: string,
  userRole: UserRole,
) => {
  if (userRole === UserRole.ADMIN) {
    return prisma.quiz.findMany({
      where: { batchId },
      include: { questions: { include: { options: true } } },
    });
  }

  return prisma.quiz.findMany({
    where: {
      batchId,
      isPublished: true,
      batch: {
        is: {
          status: "ACTIVE",
          enrollments: {
            some: { studentId: userId, status: "ACTIVE" },
          },
        },
      },
    },
    include: {
      questions: {
        orderBy: { sortOrder: "asc" },
        include: {
          options: {
            select: {
              id: true,
              questionId: true,
              optionText: true,
              sortOrder: true,
            },
          },
        },
      },
    },
  });
};

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

export const updateQuiz = async (id: string, data: QuizUpdateInput) => {
  const existing = await prisma.quiz.findUnique({
    where: { id },
    select: { startAt: true, endAt: true },
  });
  if (!existing) {
    throw new HttpError(httpStatus.NOT_FOUND, "Quiz not found.");
  }

  const startAt =
    data.startAt === undefined ? existing.startAt : data.startAt;
  const endAt = data.endAt === undefined ? existing.endAt : data.endAt;
  if (startAt && endAt && endAt <= startAt) {
    throw new HttpError(
      httpStatus.BAD_REQUEST,
      "Quiz end time must be after its start time.",
    );
  }

  return prisma.quiz.update({ where: { id }, data });
};

export const startQuizAttempt = async (quizId: string, studentId: string) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: {
      batchId: true,
      isPublished: true,
      startAt: true,
      endAt: true,
      batch: { select: { status: true } },
    },
  });

  const now = new Date();
  if (
    !quiz ||
    !quiz.isPublished ||
    quiz.batch.status !== "ACTIVE" ||
    (quiz.startAt && quiz.startAt > now) ||
    (quiz.endAt && quiz.endAt <= now)
  ) {
    throw new HttpError(
      httpStatus.NOT_FOUND,
      "Quiz is not available for attempts.",
    );
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentId,
      batchId: quiz.batchId,
      status: "ACTIVE",
    },
    select: { id: true },
  });
  if (!enrollment) {
    throw new HttpError(
      httpStatus.FORBIDDEN,
      "Active enrollment is required to attempt this quiz.",
    );
  }

  return prisma.quizAttempt.create({ data: { quizId, studentId } });
};

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
  if (
    attempt.status !== "IN_PROGRESS" ||
    (attempt.quiz.endAt && attempt.quiz.endAt <= new Date()) ||
    (attempt.quiz.durationMinutes !== null &&
      attempt.startedAt.getTime() +
        attempt.quiz.durationMinutes * 60 * 1000 <=
        Date.now())
  ) {
    throw new HttpError(
      httpStatus.CONFLICT,
      "This quiz attempt is no longer available.",
    );
  }

  let score = 0;
  for (const answer of input.answers ?? []) {
    const question = attempt.quiz.questions.find(
      (item) => item.id === answer.questionId,
    );
    if (!question) {
      throw new HttpError(
        httpStatus.BAD_REQUEST,
        "An answer references a question outside this quiz.",
      );
    }
    if (
      answer.selectedOptionId &&
      !question.options.some((option) => option.id === answer.selectedOptionId)
    ) {
      throw new HttpError(
        httpStatus.BAD_REQUEST,
        "A selected option does not belong to its question.",
      );
    }
    const correct = question.options.find(
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
