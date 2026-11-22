import { prisma } from "../../lib/prisma";
import {
  AccessLogCreateInput,
  AssignmentCreateInput,
  AssignmentSubmissionInput,
  AssignmentUpdateInput,
  AttendanceInput,
  BatchCreateInput,
  BatchUpdateInput,
  ChapterCreateInput,
  ChapterUpdateInput,
  CourseCreateInput,
  CourseClassLevel,
  CourseUpdateInput,
  EnrollmentUpdateInput,
  InvoiceCreateInput,
  InvoiceUpdateInput,
  LessonCreateInput,
  LessonProgressInput,
  LessonUpdateInput,
  MaterialCreateInput,
  MaterialUpdateInput,
  NoticeCreateInput,
  NoticeUpdateInput,
  PaymentCreateInput,
  PaymentUpdateInput,
  QuizAnswersInput,
  QuizCreateInput,
  QuizUpdateInput,
  ScheduleCreateInput,
  SessionCreateInput,
  SessionUpdateInput,
  SubmissionReviewInput,
} from "./platform.interface";

export const listCourses = (
  classLevel?: CourseClassLevel,
  includeUnpublished = false,
) =>
  prisma.course.findMany({
    where: {
      isPublished: includeUnpublished ? undefined : true,
      classLevel,
    },
    include: { batches: true },
  });
export const createCourse = (data: CourseCreateInput) =>
  prisma.course.create({ data });
export const getCourse = (slug: string) =>
  prisma.course.findUnique({ where: { slug }, include: { batches: true } });
export const updateCourse = (id: string, data: CourseUpdateInput) =>
  prisma.course.update({ where: { id }, data });
export const deleteCourse = (id: string) =>
  prisma.course.delete({ where: { id } });

export const listBatches = (courseId?: string) =>
  prisma.batch.findMany({
    where: { courseId },
    include: { course: true },
  });
export const createBatch = (data: BatchCreateInput) =>
  prisma.batch.create({ data });
export const getBatch = (id: string) =>
  prisma.batch.findUnique({
    where: { id },
    include: { course: true, schedules: true, chapters: true },
  });
export const updateBatch = (id: string, data: BatchUpdateInput) =>
  prisma.batch.update({ where: { id }, data });
export const deleteBatch = (id: string) =>
  prisma.batch.delete({ where: { id } });

export const createEnrollment = (studentId: string, batchId: string) =>
  prisma.enrollment.create({
    data: { batchId, studentId, status: "PENDING" },
  });
export const listEnrollmentsForStudent = (studentId: string) =>
  prisma.enrollment.findMany({
    where: { studentId },
    include: { batch: { include: { course: true } } },
  });
export const listEnrollments = () =>
  prisma.enrollment.findMany({
    include: { student: true, batch: { include: { course: true } } },
  });
export const updateEnrollment = (id: string, data: EnrollmentUpdateInput) =>
  prisma.enrollment.update({ where: { id }, data });

export const listChapters = (batchId: string) =>
  prisma.chapter.findMany({
    where: { batchId },
    orderBy: { sortOrder: "asc" },
    include: { lessons: true },
  });
export const createChapter = (batchId: string, data: ChapterCreateInput) =>
  prisma.chapter.create({ data: { ...data, batchId } });
export const updateChapter = (id: string, data: ChapterUpdateInput) =>
  prisma.chapter.update({ where: { id }, data });
export const deleteChapter = (id: string) =>
  prisma.chapter.delete({ where: { id } });

export const listLessons = (chapterId: string) =>
  prisma.lesson.findMany({
    where: { chapterId },
    orderBy: { sortOrder: "asc" },
  });
export const createLesson = (chapterId: string, data: LessonCreateInput) =>
  prisma.lesson.create({ data: { ...data, chapterId } });
export const updateLesson = (id: string, data: LessonUpdateInput) =>
  prisma.lesson.update({ where: { id }, data });
export const deleteLesson = (id: string) =>
  prisma.lesson.delete({ where: { id } });
export const getLessonProgress = (studentId: string, lessonId: string) =>
  prisma.lessonProgress.findUnique({
    where: { studentId_lessonId: { studentId, lessonId } },
  });
export const updateLessonProgress = (
  studentId: string,
  lessonId: string,
  data: LessonProgressInput,
) =>
  prisma.lessonProgress.upsert({
    where: { studentId_lessonId: { studentId, lessonId } },
    create: { ...data, studentId, lessonId },
    update: data,
  });

export const listMaterials = (batchId: string) =>
  prisma.material.findMany({ where: { batchId } });
export const createMaterial = (batchId: string, data: MaterialCreateInput) =>
  prisma.material.create({ data: { ...data, batchId } });
export const updateMaterial = (id: string, data: MaterialUpdateInput) =>
  prisma.material.update({ where: { id }, data });
export const deleteMaterial = (id: string) =>
  prisma.material.delete({ where: { id } });

export const listSchedules = (batchId: string) =>
  prisma.batchSchedule.findMany({ where: { batchId } });
export const createSchedule = (batchId: string, data: ScheduleCreateInput) =>
  prisma.batchSchedule.create({ data: { ...data, batchId } });
export const listSessions = (batchId: string) =>
  prisma.classSession.findMany({
    where: { batchId },
    orderBy: { startsAt: "asc" },
  });
export const createSession = (batchId: string, data: SessionCreateInput) =>
  prisma.classSession.create({ data: { ...data, batchId } });
export const updateSession = (id: string, data: SessionUpdateInput) =>
  prisma.classSession.update({ where: { id }, data });
export const listAttendance = (sessionId: string) =>
  prisma.attendance.findMany({
    where: { sessionId },
    include: { student: true },
  });
export const markAttendance = (
  sessionId: string,
  markedBy: string,
  data: AttendanceInput,
) =>
  prisma.attendance.upsert({
    where: {
      sessionId_studentId: { sessionId, studentId: data.studentId },
    },
    create: { ...data, sessionId, markedBy },
    update: { status: data.status, markedBy },
  });

export const listAssignments = (batchId: string) =>
  prisma.assignment.findMany({ where: { batchId } });
export const createAssignment = (
  batchId: string,
  data: AssignmentCreateInput,
) => prisma.assignment.create({ data: { ...data, batchId } });
export const updateAssignment = (id: string, data: AssignmentUpdateInput) =>
  prisma.assignment.update({ where: { id }, data });
export const deleteAssignment = (id: string) =>
  prisma.assignment.delete({ where: { id } });
export const submitAssignment = (
  assignmentId: string,
  studentId: string,
  data: AssignmentSubmissionInput,
) =>
  prisma.assignmentSubmission.upsert({
    where: { assignmentId_studentId: { assignmentId, studentId } },
    create: { ...data, assignmentId, studentId },
    update: { ...data, status: "SUBMITTED" },
  });
export const listSubmissions = (assignmentId: string) =>
  prisma.assignmentSubmission.findMany({
    where: { assignmentId },
    include: { student: true },
  });
export const reviewSubmission = (
  id: string,
  reviewerId: string,
  data: SubmissionReviewInput,
) =>
  prisma.assignmentSubmission.update({
    where: { id },
    data: {
      ...data,
      status: "REVIEWED",
      reviewedAt: new Date(),
      reviewedBy: reviewerId,
    },
  });

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

export const listNotices = (batchId?: string) =>
  prisma.notice.findMany({
    where: { batchId, isPublished: true },
    orderBy: { publishedAt: "desc" },
  });
export const createNotice = (data: NoticeCreateInput) =>
  prisma.notice.create({ data });
export const updateNotice = (id: string, data: NoticeUpdateInput) =>
  prisma.notice.update({ where: { id }, data });
export const deleteNotice = (id: string) =>
  prisma.notice.delete({ where: { id } });

export const listNotificationsForUser = (userId: string) =>
  prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
export const markNotificationRead = (id: string, userId: string) =>
  prisma.notification.updateMany({
    where: { id, userId },
    data: { readAt: new Date() },
  });

export const listInvoices = (enrollmentId: string) =>
  prisma.monthlyInvoice.findMany({ where: { enrollmentId } });
export const createInvoice = (data: InvoiceCreateInput) =>
  prisma.monthlyInvoice.create({ data });
export const updateInvoice = (id: string, data: InvoiceUpdateInput) =>
  prisma.monthlyInvoice.update({ where: { id }, data });
export const listPaymentsForStudent = (studentId: string) =>
  prisma.payment.findMany({
    where: { studentId },
    include: { allocations: true },
  });
export const createPayment = (studentId: string, data: PaymentCreateInput) =>
  prisma.payment.create({ data: { ...data, studentId } });
export const updatePayment = (id: string, data: PaymentUpdateInput) =>
  prisma.payment.update({ where: { id }, data });

export const createAccessLog = (
  adminId: string,
  data: AccessLogCreateInput,
) => prisma.accessAuditLog.create({ data: { ...data, adminId } });
export const listAccessLogs = (enrollmentId: string) =>
  prisma.accessAuditLog.findMany({
    where: { enrollmentId },
    orderBy: { createdAt: "desc" },
  });
