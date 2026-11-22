var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express from "express";
import cors from "cors";

// src/app/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
var config = {
  port: Number(process.env.PORT ?? 5e3),
  appUrl: process.env.APP_URL,
  jwtSecret: process.env.JWT_SECRET,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  redis_user: process.env.REDIS_USER,
  redis_password: process.env.REDIS_PASSWORD,
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
  smtp_user: process.env.SMTP_USER,
  smtp_password: process.env.SMTP_PASSWORD,
  email_sender: process.env.EMAIL_SENDER
};
var config_default = config;

// src/app.ts
import cookieParser from "cookie-parser";

// src/app/middleware/globalErrorHandler.ts
import httpStatus from "http-status";

// src/generated/prisma/client.ts
import * as path2 from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config2 = {
  "previewFeatures": [],
  "clientVersion": "7.10.1",
  "engineVersion": "d1b3f377ca835d73fd50954a5e22128b9ebdd6b8",
  "activeProvider": "postgresql",
  "inlineSchema": 'model AccessAuditLog {\n  id           String       @id @default(uuid()) @db.Uuid\n  enrollmentId String       @db.Uuid\n  adminId      String       @db.Uuid\n  accessType   AccessType\n  action       AccessAction\n  reason       String?\n  createdAt    DateTime     @default(now())\n\n  enrollment Enrollment @relation(fields: [enrollmentId], references: [id], onDelete: Restrict)\n  admin      User       @relation("AccessLogAdmin", fields: [adminId], references: [id], onDelete: Restrict)\n\n  @@index([enrollmentId, createdAt])\n  @@index([adminId, createdAt])\n}\n\nmodel Assignment {\n  id            String    @id @default(uuid()) @db.Uuid\n  batchId       String    @db.Uuid\n  title         String\n  instructions  String\n  totalMarks    Decimal   @db.Decimal(8, 2)\n  dueAt         DateTime?\n  attachmentUrl String?\n  isPublished   Boolean   @default(false)\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n\n  batch       Batch                  @relation(fields: [batchId], references: [id], onDelete: Cascade)\n  submissions AssignmentSubmission[]\n\n  @@index([batchId, isPublished, dueAt])\n}\n\nmodel AssignmentSubmission {\n  id           String           @id @default(uuid()) @db.Uuid\n  assignmentId String           @db.Uuid\n  studentId    String           @db.Uuid\n  answerText   String?\n  fileUrl      String?\n  marks        Decimal?         @db.Decimal(8, 2)\n  feedback     String?\n  status       SubmissionStatus @default(SUBMITTED)\n  submittedAt  DateTime         @default(now())\n  reviewedAt   DateTime?\n  reviewedBy   String?          @db.Uuid\n  createdAt    DateTime         @default(now())\n  updatedAt    DateTime         @updatedAt\n\n  assignment Assignment @relation(fields: [assignmentId], references: [id], onDelete: Cascade)\n  student    User       @relation(fields: [studentId], references: [id], onDelete: Restrict)\n  reviewer   User?      @relation("SubmissionReviewer", fields: [reviewedBy], references: [id], onDelete: SetNull)\n\n  @@unique([assignmentId, studentId])\n  @@index([studentId, status])\n}\n\nmodel Course {\n  id           String     @id @default(uuid()) @db.Uuid\n  title        String\n  slug         String     @unique\n  classLevel   ClassLevel\n  description  String?\n  thumbnailUrl String?\n  isPublished  Boolean    @default(false)\n  createdAt    DateTime   @default(now())\n  updatedAt    DateTime   @updatedAt\n\n  batches Batch[]\n\n  @@index([classLevel, isPublished])\n}\n\nmodel Batch {\n  id             String      @id @default(uuid()) @db.Uuid\n  courseId       String      @db.Uuid\n  title          String\n  monthlyFee     Decimal     @db.Decimal(10, 2)\n  capacity       Int?\n  startDate      DateTime?\n  endDate        DateTime?\n  enrollmentOpen Boolean     @default(false)\n  status         BatchStatus @default(DRAFT)\n  createdAt      DateTime    @default(now())\n  updatedAt      DateTime    @updatedAt\n\n  course      Course          @relation(fields: [courseId], references: [id], onDelete: Restrict)\n  enrollments Enrollment[]\n  schedules   BatchSchedule[]\n  sessions    ClassSession[]\n  chapters    Chapter[]\n  materials   Material[]\n  assignments Assignment[]\n  quizzes     Quiz[]\n  notices     Notice[]\n\n  @@index([courseId, status, enrollmentOpen])\n  @@index([startDate, endDate])\n}\n\nmodel Enrollment {\n  id                      String           @id @default(uuid()) @db.Uuid\n  studentId               String           @db.Uuid\n  batchId                 String           @db.Uuid\n  status                  EnrollmentStatus @default(PENDING)\n  enrolledAt              DateTime         @default(now())\n  startedAt               DateTime?\n  endedAt                 DateTime?\n  recordedAccessUntil     DateTime?\n  liveAccessEnabled       Boolean          @default(true)\n  materialAccessEnabled   Boolean          @default(true)\n  assignmentAccessEnabled Boolean          @default(true)\n  createdAt               DateTime         @default(now())\n  updatedAt               DateTime         @updatedAt\n\n  student    User             @relation("StudentEnrollments", fields: [studentId], references: [id], onDelete: Restrict)\n  batch      Batch            @relation(fields: [batchId], references: [id], onDelete: Restrict)\n  invoices   MonthlyInvoice[]\n  payments   Payment[]\n  accessLogs AccessAuditLog[]\n\n  @@unique([studentId, batchId])\n  @@index([studentId, status])\n  @@index([batchId, status])\n  @@index([recordedAccessUntil])\n}\n\nenum UserRole {\n  ADMIN\n  STUDENT\n}\n\nenum AuthProvider {\n  CREDENTIAL\n  GOOGLE\n}\n\nenum ClassLevel {\n  CLASS_6\n  CLASS_7\n  CLASS_8\n  CLASS_9\n  CLASS_10\n}\n\nenum BatchStatus {\n  DRAFT\n  ACTIVE\n  INACTIVE\n  COMPLETED\n}\n\nenum EnrollmentStatus {\n  PENDING\n  ACTIVE\n  COMPLETED\n  CANCELLED\n  SUSPENDED\n}\n\nenum InvoiceStatus {\n  PENDING\n  PARTIALLY_PAID\n  PAID\n  OVERDUE\n  CANCELLED\n  REFUNDED\n}\n\nenum PaymentStatus {\n  INITIATED\n  PENDING\n  SUCCESS\n  FAILED\n  CANCELLED\n  REFUNDED\n}\n\nenum PaymentProvider {\n  SSLCOMMERZ\n  BKASH\n  NAGAD\n  BANK\n  MANUAL\n  OTHER\n}\n\nenum PaymentMethod {\n  CARD\n  MOBILE_BANKING\n  BANK_TRANSFER\n  CASH\n  OTHER\n}\n\nenum DayOfWeek {\n  MONDAY\n  TUESDAY\n  WEDNESDAY\n  THURSDAY\n  FRIDAY\n  SATURDAY\n  SUNDAY\n}\n\nenum SessionStatus {\n  SCHEDULED\n  LIVE\n  COMPLETED\n  CANCELLED\n}\n\nenum AttendanceStatus {\n  PRESENT\n  ABSENT\n  LATE\n  EXCUSED\n}\n\nenum VideoProvider {\n  YOUTUBE\n}\n\nenum MaterialFileType {\n  PDF\n  IMAGE\n  LINK\n  OTHER\n}\n\nenum SubmissionStatus {\n  SUBMITTED\n  REVIEWED\n  LATE\n}\n\nenum QuestionType {\n  MCQ\n  TRUE_FALSE\n}\n\nenum QuizAttemptStatus {\n  IN_PROGRESS\n  SUBMITTED\n  GRADED\n}\n\nenum NotificationType {\n  PAYMENT_REMINDER\n  SCHEDULE_UPDATE\n  NEW_LESSON\n  ANNOUNCEMENT\n  ASSIGNMENT\n  QUIZ\n  GENERAL\n}\n\nenum ReminderChannel {\n  IN_APP\n  EMAIL\n}\n\nenum ReminderStatus {\n  PENDING\n  SENT\n  FAILED\n  CANCELLED\n}\n\nenum AccessType {\n  RECORDED\n  LIVE\n  MATERIAL\n  ASSIGNMENT\n}\n\nenum AccessAction {\n  SUSPENDED\n  RESTORED\n  GRANTED\n  REVOKED\n}\n\nmodel MonthlyInvoice {\n  id           String        @id @default(uuid()) @db.Uuid\n  enrollmentId String        @db.Uuid\n  billingMonth DateTime      @db.Date\n  periodStart  DateTime      @db.Date\n  periodEnd    DateTime      @db.Date\n  amount       Decimal       @db.Decimal(10, 2)\n  currency     String        @default("BDT") @db.VarChar(3)\n  dueDate      DateTime\n  status       InvoiceStatus @default(PENDING)\n  paidAt       DateTime?\n  createdAt    DateTime      @default(now())\n  updatedAt    DateTime      @updatedAt\n\n  enrollment  Enrollment          @relation(fields: [enrollmentId], references: [id], onDelete: Restrict)\n  allocations PaymentAllocation[]\n  reminders   PaymentReminder[]\n\n  @@unique([enrollmentId, billingMonth])\n  @@index([status, dueDate])\n  @@index([periodStart, periodEnd])\n}\n\nmodel BatchSchedule {\n  id             String    @id @default(uuid()) @db.Uuid\n  batchId        String    @db.Uuid\n  dayOfWeek      DayOfWeek\n  startTime      String    @db.VarChar(5)\n  endTime        String    @db.VarChar(5)\n  timezone       String    @default("Asia/Dhaka")\n  effectiveFrom  DateTime?\n  effectiveUntil DateTime?\n  isActive       Boolean   @default(true)\n  createdAt      DateTime  @default(now())\n  updatedAt      DateTime  @updatedAt\n\n  batch    Batch          @relation(fields: [batchId], references: [id], onDelete: Cascade)\n  sessions ClassSession[]\n\n  @@index([batchId, dayOfWeek, isActive])\n}\n\nmodel ClassSession {\n  id         String        @id @default(uuid()) @db.Uuid\n  batchId    String        @db.Uuid\n  scheduleId String?       @db.Uuid\n  title      String\n  topic      String?\n  startsAt   DateTime\n  endsAt     DateTime\n  meetUrl    String?\n  status     SessionStatus @default(SCHEDULED)\n  createdAt  DateTime      @default(now())\n  updatedAt  DateTime      @updatedAt\n\n  batch      Batch          @relation(fields: [batchId], references: [id], onDelete: Cascade)\n  schedule   BatchSchedule? @relation(fields: [scheduleId], references: [id], onDelete: SetNull)\n  attendance Attendance[]\n\n  @@index([batchId, startsAt])\n  @@index([status, startsAt])\n}\n\nmodel Attendance {\n  id        String           @id @default(uuid()) @db.Uuid\n  sessionId String           @db.Uuid\n  studentId String           @db.Uuid\n  status    AttendanceStatus @default(ABSENT)\n  markedAt  DateTime         @default(now())\n  markedBy  String?          @db.Uuid\n\n  session ClassSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)\n  student User         @relation(fields: [studentId], references: [id], onDelete: Restrict)\n\n  @@unique([sessionId, studentId])\n  @@index([studentId, status])\n}\n\nmodel Material {\n  id          String           @id @default(uuid()) @db.Uuid\n  batchId     String           @db.Uuid\n  chapterId   String?          @db.Uuid\n  title       String\n  description String?\n  fileUrl     String\n  fileType    MaterialFileType @default(OTHER)\n  isPublished Boolean          @default(false)\n  createdAt   DateTime         @default(now())\n  updatedAt   DateTime         @updatedAt\n\n  batch   Batch    @relation(fields: [batchId], references: [id], onDelete: Cascade)\n  chapter Chapter? @relation(fields: [chapterId], references: [id], onDelete: SetNull)\n\n  @@index([batchId, isPublished])\n  @@index([chapterId])\n}\n\nmodel Notice {\n  id          String    @id @default(uuid()) @db.Uuid\n  batchId     String?   @db.Uuid\n  title       String\n  content     String\n  publishedAt DateTime?\n  isPublished Boolean   @default(false)\n  createdAt   DateTime  @default(now())\n  updatedAt   DateTime  @updatedAt\n\n  batch Batch? @relation(fields: [batchId], references: [id], onDelete: Cascade)\n\n  @@index([isPublished, publishedAt])\n  @@index([batchId, isPublished])\n}\n\nmodel Notification {\n  id              String           @id @default(uuid()) @db.Uuid\n  userId          String           @db.Uuid\n  title           String\n  message         String\n  type            NotificationType @default(GENERAL)\n  relatedEntityId String?          @db.Uuid\n  readAt          DateTime?\n  createdAt       DateTime         @default(now())\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId, readAt, createdAt])\n}\n\nmodel PaymentReminder {\n  id          String          @id @default(uuid()) @db.Uuid\n  invoiceId   String          @db.Uuid\n  userId      String          @db.Uuid\n  scheduledAt DateTime\n  sentAt      DateTime?\n  channel     ReminderChannel @default(IN_APP)\n  status      ReminderStatus  @default(PENDING)\n  createdAt   DateTime        @default(now())\n\n  invoice MonthlyInvoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)\n  user    User           @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([status, scheduledAt])\n  @@index([userId, createdAt])\n}\n\nmodel Payment {\n  id                   String          @id @default(uuid()) @db.Uuid\n  studentId            String          @db.Uuid\n  enrollmentId         String          @db.Uuid\n  amount               Decimal         @db.Decimal(10, 2)\n  currency             String          @default("BDT") @db.VarChar(3)\n  provider             PaymentProvider\n  transactionId        String?         @unique\n  gatewayTransactionId String?         @unique\n  idempotencyKey       String?         @unique\n  status               PaymentStatus   @default(INITIATED)\n  paymentMethod        PaymentMethod?\n  paidAt               DateTime?\n  validatedAt          DateTime?\n  createdAt            DateTime        @default(now())\n  updatedAt            DateTime        @updatedAt\n\n  student     User                @relation("StudentPayments", fields: [studentId], references: [id], onDelete: Restrict)\n  enrollment  Enrollment          @relation(fields: [enrollmentId], references: [id], onDelete: Restrict)\n  allocations PaymentAllocation[]\n\n  @@index([studentId, status])\n  @@index([enrollmentId, createdAt])\n}\n\nmodel PaymentAllocation {\n  id              String   @id @default(uuid()) @db.Uuid\n  paymentId       String   @db.Uuid\n  invoiceId       String   @db.Uuid\n  allocatedAmount Decimal  @db.Decimal(10, 2)\n  createdAt       DateTime @default(now())\n\n  payment Payment        @relation(fields: [paymentId], references: [id], onDelete: Restrict)\n  invoice MonthlyInvoice @relation(fields: [invoiceId], references: [id], onDelete: Restrict)\n\n  @@unique([paymentId, invoiceId])\n  @@index([invoiceId])\n}\n\nmodel Quiz {\n  id              String    @id @default(uuid()) @db.Uuid\n  batchId         String    @db.Uuid\n  title           String\n  description     String?\n  totalMarks      Decimal   @db.Decimal(8, 2)\n  durationMinutes Int?\n  startAt         DateTime?\n  endAt           DateTime?\n  isPublished     Boolean   @default(false)\n  createdAt       DateTime  @default(now())\n  updatedAt       DateTime  @updatedAt\n\n  batch     Batch          @relation(fields: [batchId], references: [id], onDelete: Cascade)\n  questions QuizQuestion[]\n  attempts  QuizAttempt[]\n\n  @@index([batchId, isPublished, startAt])\n}\n\nmodel QuizQuestion {\n  id           String       @id @default(uuid()) @db.Uuid\n  quizId       String       @db.Uuid\n  questionText String\n  questionType QuestionType @default(MCQ)\n  marks        Decimal      @db.Decimal(8, 2)\n  sortOrder    Int          @default(0)\n  createdAt    DateTime     @default(now())\n  updatedAt    DateTime     @updatedAt\n\n  quiz    Quiz         @relation(fields: [quizId], references: [id], onDelete: Cascade)\n  options QuizOption[]\n  answers QuizAnswer[]\n\n  @@index([quizId, sortOrder])\n}\n\nmodel QuizOption {\n  id         String  @id @default(uuid()) @db.Uuid\n  questionId String  @db.Uuid\n  optionText String\n  isCorrect  Boolean @default(false)\n  sortOrder  Int     @default(0)\n\n  question QuizQuestion @relation(fields: [questionId], references: [id], onDelete: Cascade)\n  answers  QuizAnswer[]\n\n  @@index([questionId, sortOrder])\n}\n\nmodel QuizAttempt {\n  id          String            @id @default(uuid()) @db.Uuid\n  quizId      String            @db.Uuid\n  studentId   String            @db.Uuid\n  score       Decimal?          @db.Decimal(8, 2)\n  startedAt   DateTime          @default(now())\n  submittedAt DateTime?\n  status      QuizAttemptStatus @default(IN_PROGRESS)\n  createdAt   DateTime          @default(now())\n  updatedAt   DateTime          @updatedAt\n\n  quiz    Quiz         @relation(fields: [quizId], references: [id], onDelete: Cascade)\n  student User         @relation(fields: [studentId], references: [id], onDelete: Restrict)\n  answers QuizAnswer[]\n\n  @@index([quizId, studentId])\n  @@index([studentId, status])\n}\n\nmodel QuizAnswer {\n  id               String   @id @default(uuid()) @db.Uuid\n  attemptId        String   @db.Uuid\n  questionId       String   @db.Uuid\n  selectedOptionId String?  @db.Uuid\n  answerText       String?\n  awardedMarks     Decimal? @db.Decimal(8, 2)\n  createdAt        DateTime @default(now())\n  updatedAt        DateTime @updatedAt\n\n  attempt        QuizAttempt  @relation(fields: [attemptId], references: [id], onDelete: Cascade)\n  question       QuizQuestion @relation(fields: [questionId], references: [id], onDelete: Restrict)\n  selectedOption QuizOption?  @relation(fields: [selectedOptionId], references: [id], onDelete: SetNull)\n\n  @@unique([attemptId, questionId])\n  @@index([questionId])\n}\n\nmodel Chapter {\n  id          String   @id @default(uuid()) @db.Uuid\n  batchId     String   @db.Uuid\n  title       String\n  description String?\n  sortOrder   Int      @default(0)\n  isPublished Boolean  @default(false)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  batch     Batch      @relation(fields: [batchId], references: [id], onDelete: Cascade)\n  lessons   Lesson[]\n  materials Material[]\n\n  @@index([batchId, sortOrder])\n}\n\nmodel Lesson {\n  id              String        @id @default(uuid()) @db.Uuid\n  chapterId       String        @db.Uuid\n  title           String\n  description     String?\n  videoProvider   VideoProvider @default(YOUTUBE)\n  videoId         String?\n  videoUrl        String?\n  durationSeconds Int?\n  sortOrder       Int           @default(0)\n  isPublished     Boolean       @default(false)\n  createdAt       DateTime      @default(now())\n  updatedAt       DateTime      @updatedAt\n\n  chapter  Chapter          @relation(fields: [chapterId], references: [id], onDelete: Cascade)\n  progress LessonProgress[]\n\n  @@index([chapterId, sortOrder, isPublished])\n}\n\nmodel LessonProgress {\n  id                   String    @id @default(uuid()) @db.Uuid\n  studentId            String    @db.Uuid\n  lessonId             String    @db.Uuid\n  watchedSeconds       Int       @default(0)\n  completionPercentage Decimal   @default(0) @db.Decimal(5, 2)\n  isCompleted          Boolean   @default(false)\n  lastWatchedAt        DateTime?\n  createdAt            DateTime  @default(now())\n  updatedAt            DateTime  @updatedAt\n\n  student User   @relation(fields: [studentId], references: [id], onDelete: Cascade)\n  lesson  Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)\n\n  @@unique([studentId, lessonId])\n  @@index([studentId, isCompleted])\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id           String       @id @default(uuid()) @db.Uuid\n  fullName     String\n  email        String       @unique\n  passwordHash String\n  phone        String?\n  role         UserRole     @default(STUDENT)\n  authProvider AuthProvider @default(CREDENTIAL)\n  googleId     String?      @unique\n  isActive     Boolean      @default(true)\n  createdAt    DateTime     @default(now())\n  updatedAt    DateTime     @updatedAt\n\n  studentProfile        StudentProfile?\n  enrollments           Enrollment[]           @relation("StudentEnrollments")\n  payments              Payment[]              @relation("StudentPayments")\n  attendances           Attendance[]\n  lessonProgress        LessonProgress[]\n  assignmentSubmissions AssignmentSubmission[]\n  quizAttempts          QuizAttempt[]\n  notifications         Notification[]\n  paymentReminders      PaymentReminder[]\n  accessAuditLogs       AccessAuditLog[]       @relation("AccessLogAdmin")\n  reviewedSubmissions   AssignmentSubmission[] @relation("SubmissionReviewer")\n  refreshSessions       RefreshSession[]\n\n  @@index([role, isActive])\n  @@index([createdAt])\n}\n\nmodel RefreshSession {\n  id        String   @id @default(uuid()) @db.Uuid\n  tokenHash String   @unique\n  userId    String   @db.Uuid\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@index([expiresAt])\n}\n\nmodel StudentProfile {\n  id            String     @id @default(uuid()) @db.Uuid\n  userId        String     @unique @db.Uuid\n  classLevel    ClassLevel\n  schoolName    String?\n  guardianName  String?\n  guardianPhone String?\n  createdAt     DateTime   @default(now())\n  updatedAt     DateTime   @updatedAt\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config2.runtimeDataModel = JSON.parse('{"models":{"AccessAuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"accessType","kind":"enum","type":"AccessType"},{"name":"action","kind":"enum","type":"AccessAction"},{"name":"reason","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"enrollment","kind":"object","type":"Enrollment","relationName":"AccessAuditLogToEnrollment"},{"name":"admin","kind":"object","type":"User","relationName":"AccessLogAdmin"}],"dbName":null,"schema":null},"Assignment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"batchId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"instructions","kind":"scalar","type":"String"},{"name":"totalMarks","kind":"scalar","type":"Decimal"},{"name":"dueAt","kind":"scalar","type":"DateTime"},{"name":"attachmentUrl","kind":"scalar","type":"String"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"batch","kind":"object","type":"Batch","relationName":"AssignmentToBatch"},{"name":"submissions","kind":"object","type":"AssignmentSubmission","relationName":"AssignmentToAssignmentSubmission"}],"dbName":null,"schema":null},"AssignmentSubmission":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"assignmentId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"answerText","kind":"scalar","type":"String"},{"name":"fileUrl","kind":"scalar","type":"String"},{"name":"marks","kind":"scalar","type":"Decimal"},{"name":"feedback","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"SubmissionStatus"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedAt","kind":"scalar","type":"DateTime"},{"name":"reviewedBy","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"assignment","kind":"object","type":"Assignment","relationName":"AssignmentToAssignmentSubmission"},{"name":"student","kind":"object","type":"User","relationName":"AssignmentSubmissionToUser"},{"name":"reviewer","kind":"object","type":"User","relationName":"SubmissionReviewer"}],"dbName":null,"schema":null},"Course":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"classLevel","kind":"enum","type":"ClassLevel"},{"name":"description","kind":"scalar","type":"String"},{"name":"thumbnailUrl","kind":"scalar","type":"String"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"batches","kind":"object","type":"Batch","relationName":"BatchToCourse"}],"dbName":null,"schema":null},"Batch":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"courseId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"monthlyFee","kind":"scalar","type":"Decimal"},{"name":"capacity","kind":"scalar","type":"Int"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"enrollmentOpen","kind":"scalar","type":"Boolean"},{"name":"status","kind":"enum","type":"BatchStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"course","kind":"object","type":"Course","relationName":"BatchToCourse"},{"name":"enrollments","kind":"object","type":"Enrollment","relationName":"BatchToEnrollment"},{"name":"schedules","kind":"object","type":"BatchSchedule","relationName":"BatchToBatchSchedule"},{"name":"sessions","kind":"object","type":"ClassSession","relationName":"BatchToClassSession"},{"name":"chapters","kind":"object","type":"Chapter","relationName":"BatchToChapter"},{"name":"materials","kind":"object","type":"Material","relationName":"BatchToMaterial"},{"name":"assignments","kind":"object","type":"Assignment","relationName":"AssignmentToBatch"},{"name":"quizzes","kind":"object","type":"Quiz","relationName":"BatchToQuiz"},{"name":"notices","kind":"object","type":"Notice","relationName":"BatchToNotice"}],"dbName":null,"schema":null},"Enrollment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"batchId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"EnrollmentStatus"},{"name":"enrolledAt","kind":"scalar","type":"DateTime"},{"name":"startedAt","kind":"scalar","type":"DateTime"},{"name":"endedAt","kind":"scalar","type":"DateTime"},{"name":"recordedAccessUntil","kind":"scalar","type":"DateTime"},{"name":"liveAccessEnabled","kind":"scalar","type":"Boolean"},{"name":"materialAccessEnabled","kind":"scalar","type":"Boolean"},{"name":"assignmentAccessEnabled","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"student","kind":"object","type":"User","relationName":"StudentEnrollments"},{"name":"batch","kind":"object","type":"Batch","relationName":"BatchToEnrollment"},{"name":"invoices","kind":"object","type":"MonthlyInvoice","relationName":"EnrollmentToMonthlyInvoice"},{"name":"payments","kind":"object","type":"Payment","relationName":"EnrollmentToPayment"},{"name":"accessLogs","kind":"object","type":"AccessAuditLog","relationName":"AccessAuditLogToEnrollment"}],"dbName":null,"schema":null},"MonthlyInvoice":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"billingMonth","kind":"scalar","type":"DateTime"},{"name":"periodStart","kind":"scalar","type":"DateTime"},{"name":"periodEnd","kind":"scalar","type":"DateTime"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"dueDate","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"InvoiceStatus"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"enrollment","kind":"object","type":"Enrollment","relationName":"EnrollmentToMonthlyInvoice"},{"name":"allocations","kind":"object","type":"PaymentAllocation","relationName":"MonthlyInvoiceToPaymentAllocation"},{"name":"reminders","kind":"object","type":"PaymentReminder","relationName":"MonthlyInvoiceToPaymentReminder"}],"dbName":null,"schema":null},"BatchSchedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"batchId","kind":"scalar","type":"String"},{"name":"dayOfWeek","kind":"enum","type":"DayOfWeek"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"timezone","kind":"scalar","type":"String"},{"name":"effectiveFrom","kind":"scalar","type":"DateTime"},{"name":"effectiveUntil","kind":"scalar","type":"DateTime"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"batch","kind":"object","type":"Batch","relationName":"BatchToBatchSchedule"},{"name":"sessions","kind":"object","type":"ClassSession","relationName":"BatchScheduleToClassSession"}],"dbName":null,"schema":null},"ClassSession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"batchId","kind":"scalar","type":"String"},{"name":"scheduleId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"topic","kind":"scalar","type":"String"},{"name":"startsAt","kind":"scalar","type":"DateTime"},{"name":"endsAt","kind":"scalar","type":"DateTime"},{"name":"meetUrl","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"SessionStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"batch","kind":"object","type":"Batch","relationName":"BatchToClassSession"},{"name":"schedule","kind":"object","type":"BatchSchedule","relationName":"BatchScheduleToClassSession"},{"name":"attendance","kind":"object","type":"Attendance","relationName":"AttendanceToClassSession"}],"dbName":null,"schema":null},"Attendance":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"sessionId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"AttendanceStatus"},{"name":"markedAt","kind":"scalar","type":"DateTime"},{"name":"markedBy","kind":"scalar","type":"String"},{"name":"session","kind":"object","type":"ClassSession","relationName":"AttendanceToClassSession"},{"name":"student","kind":"object","type":"User","relationName":"AttendanceToUser"}],"dbName":null,"schema":null},"Material":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"batchId","kind":"scalar","type":"String"},{"name":"chapterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"fileUrl","kind":"scalar","type":"String"},{"name":"fileType","kind":"enum","type":"MaterialFileType"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"batch","kind":"object","type":"Batch","relationName":"BatchToMaterial"},{"name":"chapter","kind":"object","type":"Chapter","relationName":"ChapterToMaterial"}],"dbName":null,"schema":null},"Notice":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"batchId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"publishedAt","kind":"scalar","type":"DateTime"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"batch","kind":"object","type":"Batch","relationName":"BatchToNotice"}],"dbName":null,"schema":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"NotificationType"},{"name":"relatedEntityId","kind":"scalar","type":"String"},{"name":"readAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"}],"dbName":null,"schema":null},"PaymentReminder":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"invoiceId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"scheduledAt","kind":"scalar","type":"DateTime"},{"name":"sentAt","kind":"scalar","type":"DateTime"},{"name":"channel","kind":"enum","type":"ReminderChannel"},{"name":"status","kind":"enum","type":"ReminderStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"invoice","kind":"object","type":"MonthlyInvoice","relationName":"MonthlyInvoiceToPaymentReminder"},{"name":"user","kind":"object","type":"User","relationName":"PaymentReminderToUser"}],"dbName":null,"schema":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"enrollmentId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"provider","kind":"enum","type":"PaymentProvider"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"gatewayTransactionId","kind":"scalar","type":"String"},{"name":"idempotencyKey","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"validatedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"student","kind":"object","type":"User","relationName":"StudentPayments"},{"name":"enrollment","kind":"object","type":"Enrollment","relationName":"EnrollmentToPayment"},{"name":"allocations","kind":"object","type":"PaymentAllocation","relationName":"PaymentToPaymentAllocation"}],"dbName":null,"schema":null},"PaymentAllocation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"paymentId","kind":"scalar","type":"String"},{"name":"invoiceId","kind":"scalar","type":"String"},{"name":"allocatedAmount","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"payment","kind":"object","type":"Payment","relationName":"PaymentToPaymentAllocation"},{"name":"invoice","kind":"object","type":"MonthlyInvoice","relationName":"MonthlyInvoiceToPaymentAllocation"}],"dbName":null,"schema":null},"Quiz":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"batchId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"totalMarks","kind":"scalar","type":"Decimal"},{"name":"durationMinutes","kind":"scalar","type":"Int"},{"name":"startAt","kind":"scalar","type":"DateTime"},{"name":"endAt","kind":"scalar","type":"DateTime"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"batch","kind":"object","type":"Batch","relationName":"BatchToQuiz"},{"name":"questions","kind":"object","type":"QuizQuestion","relationName":"QuizToQuizQuestion"},{"name":"attempts","kind":"object","type":"QuizAttempt","relationName":"QuizToQuizAttempt"}],"dbName":null,"schema":null},"QuizQuestion":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"quizId","kind":"scalar","type":"String"},{"name":"questionText","kind":"scalar","type":"String"},{"name":"questionType","kind":"enum","type":"QuestionType"},{"name":"marks","kind":"scalar","type":"Decimal"},{"name":"sortOrder","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"quiz","kind":"object","type":"Quiz","relationName":"QuizToQuizQuestion"},{"name":"options","kind":"object","type":"QuizOption","relationName":"QuizOptionToQuizQuestion"},{"name":"answers","kind":"object","type":"QuizAnswer","relationName":"QuizAnswerToQuizQuestion"}],"dbName":null,"schema":null},"QuizOption":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"questionId","kind":"scalar","type":"String"},{"name":"optionText","kind":"scalar","type":"String"},{"name":"isCorrect","kind":"scalar","type":"Boolean"},{"name":"sortOrder","kind":"scalar","type":"Int"},{"name":"question","kind":"object","type":"QuizQuestion","relationName":"QuizOptionToQuizQuestion"},{"name":"answers","kind":"object","type":"QuizAnswer","relationName":"QuizAnswerToQuizOption"}],"dbName":null,"schema":null},"QuizAttempt":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"quizId","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"score","kind":"scalar","type":"Decimal"},{"name":"startedAt","kind":"scalar","type":"DateTime"},{"name":"submittedAt","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"QuizAttemptStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"quiz","kind":"object","type":"Quiz","relationName":"QuizToQuizAttempt"},{"name":"student","kind":"object","type":"User","relationName":"QuizAttemptToUser"},{"name":"answers","kind":"object","type":"QuizAnswer","relationName":"QuizAnswerToQuizAttempt"}],"dbName":null,"schema":null},"QuizAnswer":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"attemptId","kind":"scalar","type":"String"},{"name":"questionId","kind":"scalar","type":"String"},{"name":"selectedOptionId","kind":"scalar","type":"String"},{"name":"answerText","kind":"scalar","type":"String"},{"name":"awardedMarks","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"attempt","kind":"object","type":"QuizAttempt","relationName":"QuizAnswerToQuizAttempt"},{"name":"question","kind":"object","type":"QuizQuestion","relationName":"QuizAnswerToQuizQuestion"},{"name":"selectedOption","kind":"object","type":"QuizOption","relationName":"QuizAnswerToQuizOption"}],"dbName":null,"schema":null},"Chapter":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"batchId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"sortOrder","kind":"scalar","type":"Int"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"batch","kind":"object","type":"Batch","relationName":"BatchToChapter"},{"name":"lessons","kind":"object","type":"Lesson","relationName":"ChapterToLesson"},{"name":"materials","kind":"object","type":"Material","relationName":"ChapterToMaterial"}],"dbName":null,"schema":null},"Lesson":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"chapterId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"videoProvider","kind":"enum","type":"VideoProvider"},{"name":"videoId","kind":"scalar","type":"String"},{"name":"videoUrl","kind":"scalar","type":"String"},{"name":"durationSeconds","kind":"scalar","type":"Int"},{"name":"sortOrder","kind":"scalar","type":"Int"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"chapter","kind":"object","type":"Chapter","relationName":"ChapterToLesson"},{"name":"progress","kind":"object","type":"LessonProgress","relationName":"LessonToLessonProgress"}],"dbName":null,"schema":null},"LessonProgress":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"lessonId","kind":"scalar","type":"String"},{"name":"watchedSeconds","kind":"scalar","type":"Int"},{"name":"completionPercentage","kind":"scalar","type":"Decimal"},{"name":"isCompleted","kind":"scalar","type":"Boolean"},{"name":"lastWatchedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"student","kind":"object","type":"User","relationName":"LessonProgressToUser"},{"name":"lesson","kind":"object","type":"Lesson","relationName":"LessonToLessonProgress"}],"dbName":null,"schema":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"passwordHash","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"authProvider","kind":"enum","type":"AuthProvider"},{"name":"googleId","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"studentProfile","kind":"object","type":"StudentProfile","relationName":"StudentProfileToUser"},{"name":"enrollments","kind":"object","type":"Enrollment","relationName":"StudentEnrollments"},{"name":"payments","kind":"object","type":"Payment","relationName":"StudentPayments"},{"name":"attendances","kind":"object","type":"Attendance","relationName":"AttendanceToUser"},{"name":"lessonProgress","kind":"object","type":"LessonProgress","relationName":"LessonProgressToUser"},{"name":"assignmentSubmissions","kind":"object","type":"AssignmentSubmission","relationName":"AssignmentSubmissionToUser"},{"name":"quizAttempts","kind":"object","type":"QuizAttempt","relationName":"QuizAttemptToUser"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"paymentReminders","kind":"object","type":"PaymentReminder","relationName":"PaymentReminderToUser"},{"name":"accessAuditLogs","kind":"object","type":"AccessAuditLog","relationName":"AccessLogAdmin"},{"name":"reviewedSubmissions","kind":"object","type":"AssignmentSubmission","relationName":"SubmissionReviewer"},{"name":"refreshSessions","kind":"object","type":"RefreshSession","relationName":"RefreshSessionToUser"}],"dbName":null,"schema":null},"RefreshSession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tokenHash","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"RefreshSessionToUser"}],"dbName":null,"schema":null},"StudentProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"classLevel","kind":"enum","type":"ClassLevel"},{"name":"schoolName","kind":"scalar","type":"String"},{"name":"guardianName","kind":"scalar","type":"String"},{"name":"guardianPhone","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"StudentProfileToUser"}],"dbName":null,"schema":null}},"enums":{},"types":{}}');
config2.parameterizationSchema = {
  strings: JSON.parse('["where","user","studentProfile","orderBy","cursor","enrollments","student","enrollment","payment","allocations","invoice","reminders","_count","payments","batches","course","batch","sessions","schedules","chapter","lesson","progress","lessons","materials","chapters","assignment","reviewer","submissions","assignments","quiz","question","answers","attempt","selectedOption","options","questions","attempts","quizzes","notices","schedule","attendance","session","attendances","lessonProgress","assignmentSubmissions","quizAttempts","notifications","paymentReminders","accessAuditLogs","reviewedSubmissions","refreshSessions","invoices","accessLogs","admin","AccessAuditLog.findUnique","AccessAuditLog.findUniqueOrThrow","AccessAuditLog.findFirst","AccessAuditLog.findFirstOrThrow","AccessAuditLog.findMany","data","AccessAuditLog.createOne","AccessAuditLog.createMany","AccessAuditLog.createManyAndReturn","AccessAuditLog.updateOne","AccessAuditLog.updateMany","AccessAuditLog.updateManyAndReturn","create","update","AccessAuditLog.upsertOne","AccessAuditLog.deleteOne","AccessAuditLog.deleteMany","having","_min","_max","AccessAuditLog.groupBy","AccessAuditLog.aggregate","Assignment.findUnique","Assignment.findUniqueOrThrow","Assignment.findFirst","Assignment.findFirstOrThrow","Assignment.findMany","Assignment.createOne","Assignment.createMany","Assignment.createManyAndReturn","Assignment.updateOne","Assignment.updateMany","Assignment.updateManyAndReturn","Assignment.upsertOne","Assignment.deleteOne","Assignment.deleteMany","_avg","_sum","Assignment.groupBy","Assignment.aggregate","AssignmentSubmission.findUnique","AssignmentSubmission.findUniqueOrThrow","AssignmentSubmission.findFirst","AssignmentSubmission.findFirstOrThrow","AssignmentSubmission.findMany","AssignmentSubmission.createOne","AssignmentSubmission.createMany","AssignmentSubmission.createManyAndReturn","AssignmentSubmission.updateOne","AssignmentSubmission.updateMany","AssignmentSubmission.updateManyAndReturn","AssignmentSubmission.upsertOne","AssignmentSubmission.deleteOne","AssignmentSubmission.deleteMany","AssignmentSubmission.groupBy","AssignmentSubmission.aggregate","Course.findUnique","Course.findUniqueOrThrow","Course.findFirst","Course.findFirstOrThrow","Course.findMany","Course.createOne","Course.createMany","Course.createManyAndReturn","Course.updateOne","Course.updateMany","Course.updateManyAndReturn","Course.upsertOne","Course.deleteOne","Course.deleteMany","Course.groupBy","Course.aggregate","Batch.findUnique","Batch.findUniqueOrThrow","Batch.findFirst","Batch.findFirstOrThrow","Batch.findMany","Batch.createOne","Batch.createMany","Batch.createManyAndReturn","Batch.updateOne","Batch.updateMany","Batch.updateManyAndReturn","Batch.upsertOne","Batch.deleteOne","Batch.deleteMany","Batch.groupBy","Batch.aggregate","Enrollment.findUnique","Enrollment.findUniqueOrThrow","Enrollment.findFirst","Enrollment.findFirstOrThrow","Enrollment.findMany","Enrollment.createOne","Enrollment.createMany","Enrollment.createManyAndReturn","Enrollment.updateOne","Enrollment.updateMany","Enrollment.updateManyAndReturn","Enrollment.upsertOne","Enrollment.deleteOne","Enrollment.deleteMany","Enrollment.groupBy","Enrollment.aggregate","MonthlyInvoice.findUnique","MonthlyInvoice.findUniqueOrThrow","MonthlyInvoice.findFirst","MonthlyInvoice.findFirstOrThrow","MonthlyInvoice.findMany","MonthlyInvoice.createOne","MonthlyInvoice.createMany","MonthlyInvoice.createManyAndReturn","MonthlyInvoice.updateOne","MonthlyInvoice.updateMany","MonthlyInvoice.updateManyAndReturn","MonthlyInvoice.upsertOne","MonthlyInvoice.deleteOne","MonthlyInvoice.deleteMany","MonthlyInvoice.groupBy","MonthlyInvoice.aggregate","BatchSchedule.findUnique","BatchSchedule.findUniqueOrThrow","BatchSchedule.findFirst","BatchSchedule.findFirstOrThrow","BatchSchedule.findMany","BatchSchedule.createOne","BatchSchedule.createMany","BatchSchedule.createManyAndReturn","BatchSchedule.updateOne","BatchSchedule.updateMany","BatchSchedule.updateManyAndReturn","BatchSchedule.upsertOne","BatchSchedule.deleteOne","BatchSchedule.deleteMany","BatchSchedule.groupBy","BatchSchedule.aggregate","ClassSession.findUnique","ClassSession.findUniqueOrThrow","ClassSession.findFirst","ClassSession.findFirstOrThrow","ClassSession.findMany","ClassSession.createOne","ClassSession.createMany","ClassSession.createManyAndReturn","ClassSession.updateOne","ClassSession.updateMany","ClassSession.updateManyAndReturn","ClassSession.upsertOne","ClassSession.deleteOne","ClassSession.deleteMany","ClassSession.groupBy","ClassSession.aggregate","Attendance.findUnique","Attendance.findUniqueOrThrow","Attendance.findFirst","Attendance.findFirstOrThrow","Attendance.findMany","Attendance.createOne","Attendance.createMany","Attendance.createManyAndReturn","Attendance.updateOne","Attendance.updateMany","Attendance.updateManyAndReturn","Attendance.upsertOne","Attendance.deleteOne","Attendance.deleteMany","Attendance.groupBy","Attendance.aggregate","Material.findUnique","Material.findUniqueOrThrow","Material.findFirst","Material.findFirstOrThrow","Material.findMany","Material.createOne","Material.createMany","Material.createManyAndReturn","Material.updateOne","Material.updateMany","Material.updateManyAndReturn","Material.upsertOne","Material.deleteOne","Material.deleteMany","Material.groupBy","Material.aggregate","Notice.findUnique","Notice.findUniqueOrThrow","Notice.findFirst","Notice.findFirstOrThrow","Notice.findMany","Notice.createOne","Notice.createMany","Notice.createManyAndReturn","Notice.updateOne","Notice.updateMany","Notice.updateManyAndReturn","Notice.upsertOne","Notice.deleteOne","Notice.deleteMany","Notice.groupBy","Notice.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","PaymentReminder.findUnique","PaymentReminder.findUniqueOrThrow","PaymentReminder.findFirst","PaymentReminder.findFirstOrThrow","PaymentReminder.findMany","PaymentReminder.createOne","PaymentReminder.createMany","PaymentReminder.createManyAndReturn","PaymentReminder.updateOne","PaymentReminder.updateMany","PaymentReminder.updateManyAndReturn","PaymentReminder.upsertOne","PaymentReminder.deleteOne","PaymentReminder.deleteMany","PaymentReminder.groupBy","PaymentReminder.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","PaymentAllocation.findUnique","PaymentAllocation.findUniqueOrThrow","PaymentAllocation.findFirst","PaymentAllocation.findFirstOrThrow","PaymentAllocation.findMany","PaymentAllocation.createOne","PaymentAllocation.createMany","PaymentAllocation.createManyAndReturn","PaymentAllocation.updateOne","PaymentAllocation.updateMany","PaymentAllocation.updateManyAndReturn","PaymentAllocation.upsertOne","PaymentAllocation.deleteOne","PaymentAllocation.deleteMany","PaymentAllocation.groupBy","PaymentAllocation.aggregate","Quiz.findUnique","Quiz.findUniqueOrThrow","Quiz.findFirst","Quiz.findFirstOrThrow","Quiz.findMany","Quiz.createOne","Quiz.createMany","Quiz.createManyAndReturn","Quiz.updateOne","Quiz.updateMany","Quiz.updateManyAndReturn","Quiz.upsertOne","Quiz.deleteOne","Quiz.deleteMany","Quiz.groupBy","Quiz.aggregate","QuizQuestion.findUnique","QuizQuestion.findUniqueOrThrow","QuizQuestion.findFirst","QuizQuestion.findFirstOrThrow","QuizQuestion.findMany","QuizQuestion.createOne","QuizQuestion.createMany","QuizQuestion.createManyAndReturn","QuizQuestion.updateOne","QuizQuestion.updateMany","QuizQuestion.updateManyAndReturn","QuizQuestion.upsertOne","QuizQuestion.deleteOne","QuizQuestion.deleteMany","QuizQuestion.groupBy","QuizQuestion.aggregate","QuizOption.findUnique","QuizOption.findUniqueOrThrow","QuizOption.findFirst","QuizOption.findFirstOrThrow","QuizOption.findMany","QuizOption.createOne","QuizOption.createMany","QuizOption.createManyAndReturn","QuizOption.updateOne","QuizOption.updateMany","QuizOption.updateManyAndReturn","QuizOption.upsertOne","QuizOption.deleteOne","QuizOption.deleteMany","QuizOption.groupBy","QuizOption.aggregate","QuizAttempt.findUnique","QuizAttempt.findUniqueOrThrow","QuizAttempt.findFirst","QuizAttempt.findFirstOrThrow","QuizAttempt.findMany","QuizAttempt.createOne","QuizAttempt.createMany","QuizAttempt.createManyAndReturn","QuizAttempt.updateOne","QuizAttempt.updateMany","QuizAttempt.updateManyAndReturn","QuizAttempt.upsertOne","QuizAttempt.deleteOne","QuizAttempt.deleteMany","QuizAttempt.groupBy","QuizAttempt.aggregate","QuizAnswer.findUnique","QuizAnswer.findUniqueOrThrow","QuizAnswer.findFirst","QuizAnswer.findFirstOrThrow","QuizAnswer.findMany","QuizAnswer.createOne","QuizAnswer.createMany","QuizAnswer.createManyAndReturn","QuizAnswer.updateOne","QuizAnswer.updateMany","QuizAnswer.updateManyAndReturn","QuizAnswer.upsertOne","QuizAnswer.deleteOne","QuizAnswer.deleteMany","QuizAnswer.groupBy","QuizAnswer.aggregate","Chapter.findUnique","Chapter.findUniqueOrThrow","Chapter.findFirst","Chapter.findFirstOrThrow","Chapter.findMany","Chapter.createOne","Chapter.createMany","Chapter.createManyAndReturn","Chapter.updateOne","Chapter.updateMany","Chapter.updateManyAndReturn","Chapter.upsertOne","Chapter.deleteOne","Chapter.deleteMany","Chapter.groupBy","Chapter.aggregate","Lesson.findUnique","Lesson.findUniqueOrThrow","Lesson.findFirst","Lesson.findFirstOrThrow","Lesson.findMany","Lesson.createOne","Lesson.createMany","Lesson.createManyAndReturn","Lesson.updateOne","Lesson.updateMany","Lesson.updateManyAndReturn","Lesson.upsertOne","Lesson.deleteOne","Lesson.deleteMany","Lesson.groupBy","Lesson.aggregate","LessonProgress.findUnique","LessonProgress.findUniqueOrThrow","LessonProgress.findFirst","LessonProgress.findFirstOrThrow","LessonProgress.findMany","LessonProgress.createOne","LessonProgress.createMany","LessonProgress.createManyAndReturn","LessonProgress.updateOne","LessonProgress.updateMany","LessonProgress.updateManyAndReturn","LessonProgress.upsertOne","LessonProgress.deleteOne","LessonProgress.deleteMany","LessonProgress.groupBy","LessonProgress.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","RefreshSession.findUnique","RefreshSession.findUniqueOrThrow","RefreshSession.findFirst","RefreshSession.findFirstOrThrow","RefreshSession.findMany","RefreshSession.createOne","RefreshSession.createMany","RefreshSession.createManyAndReturn","RefreshSession.updateOne","RefreshSession.updateMany","RefreshSession.updateManyAndReturn","RefreshSession.upsertOne","RefreshSession.deleteOne","RefreshSession.deleteMany","RefreshSession.groupBy","RefreshSession.aggregate","StudentProfile.findUnique","StudentProfile.findUniqueOrThrow","StudentProfile.findFirst","StudentProfile.findFirstOrThrow","StudentProfile.findMany","StudentProfile.createOne","StudentProfile.createMany","StudentProfile.createManyAndReturn","StudentProfile.updateOne","StudentProfile.updateMany","StudentProfile.updateManyAndReturn","StudentProfile.upsertOne","StudentProfile.deleteOne","StudentProfile.deleteMany","StudentProfile.groupBy","StudentProfile.aggregate","AND","OR","NOT","id","userId","ClassLevel","classLevel","schoolName","guardianName","guardianPhone","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","tokenHash","expiresAt","fullName","email","passwordHash","phone","UserRole","role","AuthProvider","authProvider","googleId","isActive","every","some","none","studentId","lessonId","watchedSeconds","completionPercentage","isCompleted","lastWatchedAt","chapterId","title","description","VideoProvider","videoProvider","videoId","videoUrl","durationSeconds","sortOrder","isPublished","batchId","attemptId","questionId","selectedOptionId","answerText","awardedMarks","quizId","score","startedAt","submittedAt","QuizAttemptStatus","status","optionText","isCorrect","questionText","QuestionType","questionType","marks","totalMarks","durationMinutes","startAt","endAt","paymentId","invoiceId","allocatedAmount","enrollmentId","amount","currency","PaymentProvider","provider","transactionId","gatewayTransactionId","idempotencyKey","PaymentStatus","PaymentMethod","paymentMethod","paidAt","validatedAt","scheduledAt","sentAt","ReminderChannel","channel","ReminderStatus","message","NotificationType","type","relatedEntityId","readAt","content","publishedAt","fileUrl","MaterialFileType","fileType","sessionId","AttendanceStatus","markedAt","markedBy","scheduleId","topic","startsAt","endsAt","meetUrl","SessionStatus","DayOfWeek","dayOfWeek","startTime","endTime","timezone","effectiveFrom","effectiveUntil","billingMonth","periodStart","periodEnd","dueDate","InvoiceStatus","EnrollmentStatus","enrolledAt","endedAt","recordedAccessUntil","liveAccessEnabled","materialAccessEnabled","assignmentAccessEnabled","courseId","monthlyFee","capacity","startDate","endDate","enrollmentOpen","BatchStatus","slug","thumbnailUrl","assignmentId","feedback","SubmissionStatus","reviewedAt","reviewedBy","instructions","dueAt","attachmentUrl","adminId","AccessType","accessType","AccessAction","action","reason","enrollmentId_billingMonth","attemptId_questionId","assignmentId_studentId","studentId_lessonId","sessionId_studentId","paymentId_invoiceId","studentId_batchId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "yg-EArADDAcAAJwHACA1AACTBgAg7gMAAJ8HADDvAwAAggEAEPADAACfBwAw8QMBAAAAAfgDQACSBgAhvQQBAIgHACGHBQEAiAcAIYkFAACgB4kFIosFAAChB4sFIowFAQCRBgAhAQAAAAEAIAwBAACTBgAg7gMAAI8GADDvAwAAAwAQ8AMAAI8GADDxAwEAiAcAIfIDAQCIBwAh9AMAAJAG9AMi9QMBAJEGACH2AwEAkQYAIfcDAQCRBgAh-ANAAJIGACH5A0AAkgYAIQEAAAADACAVBgAAkwYAIA0AAKgGACAQAAC5BwAgMwAA7QcAIDQAAK8GACDuAwAA6wcAMO8DAAAFABDwAwAA6wcAMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIZQEAQCIBwAhpAQBAIgHACGsBEAAmwcAIa8EAADsB_AEIvAEQACSBgAh8QRAAJsHACHyBEAAmwcAIfMEIAClBgAh9AQgAKUGACH1BCAApQYAIQgGAAD4BwAgDQAArQoAIBAAAMkNACAzAADhDQAgNAAAtAoAIKwEAADuBwAg8QQAAO4HACDyBAAA7gcAIBYGAACTBgAgDQAAqAYAIBAAALkHACAzAADtBwAgNAAArwYAIO4DAADrBwAw7wMAAAUAEPADAADrBwAw8QMBAAAAAfgDQACSBgAh-QNAAJIGACGUBAEAiAcAIaQEAQCIBwAhrARAAJsHACGvBAAA7AfwBCLwBEAAkgYAIfEEQACbBwAh8gRAAJsHACHzBCAApQYAIfQEIAClBgAh9QQgAKUGACGTBQAA6gcAIAMAAAAFACADAAAGADAEAAAHACAVBgAAkwYAIAcAAJwHACAJAACdBwAg7gMAAOYHADDvAwAACQAQ8AMAAOYHADDxAwEAiAcAIfgDQACSBgAh-QNAAJIGACGUBAEAiAcAIa8EAADoB8YEIr0EAQCIBwAhvgQQAJkHACG_BAEAogYAIcEEAADnB8EEIsIEAQCRBgAhwwQBAJEGACHEBAEAkQYAIccEAADpB8cEI8gEQACbBwAhyQRAAJsHACEJBgAA-AcAIAcAAMcNACAJAADIDQAgwgQAAO4HACDDBAAA7gcAIMQEAADuBwAgxwQAAO4HACDIBAAA7gcAIMkEAADuBwAgFQYAAJMGACAHAACcBwAgCQAAnQcAIO4DAADmBwAw7wMAAAkAEPADAADmBwAw8QMBAAAAAfgDQACSBgAh-QNAAJIGACGUBAEAiAcAIa8EAADoB8YEIr0EAQCIBwAhvgQQAJkHACG_BAEAogYAIcEEAADnB8EEIsIEAQAAAAHDBAEAAAABxAQBAAAAAccEAADpB8cEI8gEQACbBwAhyQRAAJsHACEDAAAACQAgAwAACgAwBAAACwAgCggAAOUHACAKAADiBwAg7gMAAOQHADDvAwAADQAQ8AMAAOQHADDxAwEAiAcAIfgDQACSBgAhugQBAIgHACG7BAEAiAcAIbwEEACZBwAhAggAAOANACAKAADfDQAgCwgAAOUHACAKAADiBwAg7gMAAOQHADDvAwAADQAQ8AMAAOQHADDxAwEAAAAB-ANAAJIGACG6BAEAiAcAIbsEAQCIBwAhvAQQAJkHACGSBQAA4wcAIAMAAAANACADAAAOADAEAAAPACADAAAADQAgAwAADgAwBAAADwAgDQEAAJMGACAKAADiBwAg7gMAAN8HADDvAwAAEgAQ8AMAAN8HADDxAwEAiAcAIfIDAQCIBwAh-ANAAJIGACGvBAAA4QfPBCK7BAEAiAcAIcoEQACSBgAhywRAAJsHACHNBAAA4AfNBCIDAQAA-AcAIAoAAN8NACDLBAAA7gcAIA0BAACTBgAgCgAA4gcAIO4DAADfBwAw7wMAABIAEPADAADfBwAw8QMBAAAAAfIDAQCIBwAh-ANAAJIGACGvBAAA4QfPBCK7BAEAiAcAIcoEQACSBgAhywRAAJsHACHNBAAA4AfNBCIDAAAAEgAgAwAAEwAwBAAAFAAgAQAAAA0AIAEAAAASACABAAAADQAgCwYAAJMGACApAADeBwAg7gMAANwHADDvAwAAGQAQ8AMAANwHADDxAwEAiAcAIZQEAQCIBwAhrwQAAN0H2wQi2QQBAIgHACHbBEAAkgYAIdwEAQCkBwAhAwYAAPgHACApAADeDQAg3AQAAO4HACAMBgAAkwYAICkAAN4HACDuAwAA3AcAMO8DAAAZABDwAwAA3AcAMPEDAQAAAAGUBAEAiAcAIa8EAADdB9sEItkEAQCIBwAh2wRAAJIGACHcBAEApAcAIZEFAADbBwAgAwAAABkAIAMAABoAMAQAABsAIBcFAACnBgAgDwAA1QcAIBEAANIHACASAADWBwAgFwAAzAcAIBgAANcHACAcAADYBwAgJQAA2QcAICYAANoHACDuAwAA0wcAMO8DAAAdABDwAwAA0wcAMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIZsEAQCiBgAhrwQAANQH_QQi9gQBAIgHACH3BBAAmQcAIfgEAgC4BwAh-QRAAJsHACH6BEAAmwcAIfsEIAClBgAhDAUAAKwKACAPAADYDQAgEQAA1w0AIBIAANkNACAXAADVDQAgGAAA2g0AIBwAANsNACAlAADcDQAgJgAA3Q0AIPgEAADuBwAg-QQAAO4HACD6BAAA7gcAIBcFAACnBgAgDwAA1QcAIBEAANIHACASAADWBwAgFwAAzAcAIBgAANcHACAcAADYBwAgJQAA2QcAICYAANoHACDuAwAA0wcAMO8DAAAdABDwAwAA0wcAMPEDAQAAAAH4A0AAkgYAIfkDQACSBgAhmwQBAKIGACGvBAAA1Af9BCL2BAEAiAcAIfcEEACZBwAh-AQCALgHACH5BEAAmwcAIfoEQACbBwAh-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_BAEAiAcAIYAFAQCRBgAhggVAAJsHACGDBQEApAcAIQkGAAD4BwAgGQAA0Q0AIBoAAPgHACCoBAAA7gcAILUEAADuBwAg1gQAAO4HACCABQAA7gcAIIIFAADuBwAggwUAAO4HACAUBgAAkwYAIBkAAL4HACAaAAC_BwAg7gMAALwHADDvAwAARgAQ8AMAALwHADDxAwEAAAAB-ANAAJIGACH5A0AAkgYAIZQEAQCIBwAhqAQBAJEGACGtBEAAkgYAIa8EAAC9B4IFIrUEEACpBwAh1gQBAJEGACH_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-ADAEAAB_ACADAAAAEgAgAwAAEwAwBAAAFAAgDAcAAJwHACA1AACTBgAg7gMAAJ8HADDvAwAAggEAEPADAACfBwAw8QMBAIgHACH4A0AAkgYAIb0EAQCIBwAhhwUBAIgHACGJBQAAoAeJBSKLBQAAoQeLBSKMBQEAkQYAIQMHAADHDQAgNQAA-AcAIIwFAADuBwAgAwAAAIIBACADAACDAQAwBAAAAQAgAwAAAEYAIAMAAEcAMAQAAEgAIAkBAACTBgAg7gMAAJ4HADDvAwAAhgEAEPADAACeBwAw8QMBAIgHACHyAwEAiAcAIfgDQACSBgAhhQQBAKIGACGGBEAAkgYAIQEBAAD4BwAgCQEAAJMGACDuAwAAngcAMO8DAACGAQAQ8AMAAJ4HADDxAwEAAAAB8gMBAIgHACH4A0AAkgYAIYUEAQAAAAGGBEAAkgYAIQMAAACGAQAgAwAAhwEAMAQAAIgBACABAAAABQAgAQAAAAkAIAEAAAAZACABAAAANQAgAQAAAEYAIAEAAABkACABAAAAfQAgAQAAABIAIAEAAACCAQAgAQAAAEYAIAEAAACGAQAgEgcAAJwHACAJAACdBwAgCwAArgYAIO4DAACYBwAw7wMAAJUBABDwAwAAmAcAMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIa8EAACaB-8EIr0EAQCIBwAhvgQQAJkHACG_BAEAogYAIcgEQACbBwAh6gRAAJIGACHrBEAAkgYAIewEQACSBgAh7QRAAJIGACEEBwAAxw0AIAkAAMgNACALAACzCgAgyAQAAO4HACATBwAAnAcAIAkAAJ0HACALAACuBgAg7gMAAJgHADDvAwAAlQEAEPADAACYBwAw8QMBAAAAAfgDQACSBgAh-QNAAJIGACGvBAAAmgfvBCK9BAEAiAcAIb4EEACZBwAhvwQBAKIGACHIBEAAmwcAIeoEQACSBgAh6wRAAJIGACHsBEAAkgYAIe0EQACSBgAhjQUAAJcHACADAAAAlQEAIAMAAJYBADAEAACXAQAgAwAAAAkAIAMAAAoAMAQAAAsAIAMAAACCAQAgAwAAgwEAMAQAAAEAIAEAAACVAQAgAQAAAAkAIAEAAACCAQAgAQAAAAEAIAMAAACCAQAgAwAAgwEAMAQAAAEAIAMAAACCAQAgAwAAgwEAMAQAAAEAIAMAAACCAQAgAwAAgwEAMAQAAAEAIAkHAAC-CAAgNQAA4gkAIPEDAQAAAAH4A0AAAAABvQQBAAAAAYcFAQAAAAGJBQAAAIkFAosFAAAAiwUCjAUBAAAAAQE7AACiAQAgB_EDAQAAAAH4A0AAAAABvQQBAAAAAYcFAQAAAAGJBQAAAIkFAosFAAAAiwUCjAUBAAAAAQE7AACkAQAwATsAAKQBADAJBwAAvAgAIDUAAOAJACDxAwEA8gcAIfgDQAD1BwAhvQQBAPIHACGHBQEA8gcAIYkFAAC5CIkFIosFAAC6CIsFIowFAQD0BwAhAgAAAAEAIDsAAKcBACAH8QMBAPIHACH4A0AA9QcAIb0EAQDyBwAhhwUBAPIHACGJBQAAuQiJBSKLBQAAugiLBSKMBQEA9AcAIQIAAACCAQAgOwAAqQEAIAIAAACCAQAgOwAAqQEAIAMAAAABACBCAACiAQAgQwAApwEAIAEAAAABACABAAAAggEAIAQMAADEDQAgSAAAxg0AIEkAAMUNACCMBQAA7gcAIAruAwAAkAcAMO8DAACwAQAQ8AMAAJAHADDxAwEAgQYAIfgDQACEBgAhvQQBAIEGACGHBQEAgQYAIYkFAACRB4kFIosFAACSB4sFIowFAQCDBgAhAwAAAIIBACADAACvAQAwRwAAsAEAIAMAAACCAQAgAwAAgwEAMAQAAAEAIAEAAABEACABAAAARAAgAwAAAEIAIAMAAEMAMAQAAEQAIAMAAABCACADAABDADAEAABEACADAAAAQgAgAwAAQwAwBAAARAAgDBAAAMMNACAbAADpDAAg8QMBAAAAAfgDQAAAAAH5A0AAAAABmwQBAAAAAaMEIAAAAAGkBAEAAAABtgQQAAAAAYQFAQAAAAGFBUAAAAABhgUBAAAAAQE7AAC4AQAgCvEDAQAAAAH4A0AAAAAB-QNAAAAAAZsEAQAAAAGjBCAAAAABpAQBAAAAAbYEEAAAAAGEBQEAAAABhQVAAAAAAYYFAQAAAAEBOwAAugEAMAE7AAC6AQAwDBAAAMINACAbAADeDAAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhmwQBAPIHACGjBCAAgwgAIaQEAQDyBwAhtgQQAJMJACGEBQEA8gcAIYUFQACoCAAhhgUBAPQHACECAAAARAAgOwAAvQEAIArxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGbBAEA8gcAIaMEIACDCAAhpAQBAPIHACG2BBAAkwkAIYQFAQDyBwAhhQVAAKgIACGGBQEA9AcAIQIAAABCACA7AAC_AQAgAgAAAEIAIDsAAL8BACADAAAARAAgQgAAuAEAIEMAAL0BACABAAAARAAgAQAAAEIAIAcMAAC9DQAgSAAAwA0AIEkAAL8NACBaAAC-DQAgWwAAwQ0AIIUFAADuBwAghgUAAO4HACAN7gMAAI8HADDvAwAAxgEAEPADAACPBwAw8QMBAIEGACH4A0AAhAYAIfkDQACEBgAhmwQBAJUGACGjBCAAmgYAIaQEAQCBBgAhtgQQALMGACGEBQEAlQYAIYUFQAC0BgAhhgUBAIMGACEDAAAAQgAgAwAAxQEAMEcAAMYBACADAAAAQgAgAwAAQwAwBAAARAAgAQAAAEgAIAEAAABIACADAAAARgAgAwAARwAwBAAASAAgAwAAAEYAIAMAAEcAMAQAAEgAIAMAAABGACADAABHADAEAABIACAQBgAArggAIBkAAK0IACAaAACHCQAg8QMBAAAAAfgDQAAAAAH5A0AAAAABlAQBAAAAAagEAQAAAAGtBEAAAAABrwQAAACCBQK1BBAAAAAB1gQBAAAAAf8EAQAAAAGABQEAAAABggVAAAAAAYMFAQAAAAEBOwAAzgEAIA3xAwEAAAAB-ANAAAAAAfkDQAAAAAGUBAEAAAABqAQBAAAAAa0EQAAAAAGvBAAAAIIFArUEEAAAAAHWBAEAAAAB_wQBAAAAAYAFAQAAAAGCBUAAAAABgwUBAAAAAQE7AADQAQAwATsAANABADABAAAASgAgEAYAAKsIACAZAACqCAAgGgAAhQkAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZQEAQDyBwAhqAQBAPQHACGtBEAA9QcAIa8EAACnCIIFIrUEEACmCAAh1gQBAPQHACH_BAEA8gcAIYAFAQD0BwAhggVAAKgIACGDBQEA9AcAIQIAAABIACA7AADUAQAgDfEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZQEAQDyBwAhqAQBAPQHACGtBEAA9QcAIa8EAACnCIIFIrUEEACmCAAh1gQBAPQHACH_BAEA8gcAIYAFAQD0BwAhggVAAKgIACGDBQEA9AcAIQIAAABGACA7AADWAQAgAgAAAEYAIDsAANYBACABAAAASgAgAwAAAEgAIEIAAM4BACBDAADUAQAgAQAAAEgAIAEAAABGACALDAAAuA0AIEgAALsNACBJAAC6DQAgWgAAuQ0AIFsAALwNACCoBAAA7gcAILUEAADuBwAg1gQAAO4HACCABQAA7gcAIIIFAADuBwAggwUAAO4HACAQ7gMAAIsHADDvAwAA3gEAEPADAACLBwAw8QMBAIEGACH4A0AAhAYAIfkDQACEBgAhlAQBAIEGACGoBAEAgwYAIa0EQACEBgAhrwQAAIwHggUitQQQAMUGACHWBAEAgwYAIf8EAQCBBgAhgAUBAIMGACGCBUAAtAYAIYMFAQDEBgAhAwAAAEYAIAMAAN0BADBHAADeAQAgAwAAAEYAIAMAAEcAMAQAAEgAIA0OAACJBwAg7gMAAIcHADDvAwAA5AEAEPADAACHBwAw8QMBAAAAAfQDAACQBvQDIvgDQACSBgAh-QNAAJIGACGbBAEAogYAIZwEAQCRBgAhowQgAKUGACH9BAEAAAAB_gQBAJEGACEBAAAA4QEAIAEAAADhAQAgDQ4AAIkHACDuAwAAhwcAMO8DAADkAQAQ8AMAAIcHADDxAwEAiAcAIfQDAACQBvQDIvgDQACSBgAh-QNAAJIGACGbBAEAogYAIZwEAQCRBgAhowQgAKUGACH9BAEAogYAIf4EAQCRBgAhAw4AALcNACCcBAAA7gcAIP4EAADuBwAgAwAAAOQBACADAADlAQAwBAAA4QEAIAMAAADkAQAgAwAA5QEAMAQAAOEBACADAAAA5AEAIAMAAOUBADAEAADhAQAgCg4AALYNACDxAwEAAAAB9AMAAAD0AwL4A0AAAAAB-QNAAAAAAZsEAQAAAAGcBAEAAAABowQgAAAAAf0EAQAAAAH-BAEAAAABATsAAOkBACAJ8QMBAAAAAfQDAAAA9AMC-ANAAAAAAfkDQAAAAAGbBAEAAAABnAQBAAAAAaMEIAAAAAH9BAEAAAAB_gQBAAAAAQE7AADrAQAwATsAAOsBADAKDgAAqQ0AIPEDAQDyBwAh9AMAAPMH9AMi-ANAAPUHACH5A0AA9QcAIZsEAQDyBwAhnAQBAPQHACGjBCAAgwgAIf0EAQDyBwAh_gQBAPQHACECAAAA4QEAIDsAAO4BACAJ8QMBAPIHACH0AwAA8wf0AyL4A0AA9QcAIfkDQAD1BwAhmwQBAPIHACGcBAEA9AcAIaMEIACDCAAh_QQBAPIHACH-BAEA9AcAIQIAAADkAQAgOwAA8AEAIAIAAADkAQAgOwAA8AEAIAMAAADhAQAgQgAA6QEAIEMAAO4BACABAAAA4QEAIAEAAADkAQAgBQwAAKYNACBIAACoDQAgSQAApw0AIJwEAADuBwAg_gQAAO4HACAM7gMAAIYHADDvAwAA9wEAEPADAACGBwAw8QMBAIEGACH0AwAAggb0AyL4A0AAhAYAIfkDQACEBgAhmwQBAJUGACGcBAEAgwYAIaMEIACaBgAh_QQBAJUGACH-BAEAgwYAIQMAAADkAQAgAwAA9gEAMEcAAPcBACADAAAA5AEAIAMAAOUBADAEAADhAQAgAQAAAB8AIAEAAAAfACADAAAAHQAgAwAAHgAwBAAAHwAgAwAAAB0AIAMAAB4AMAQAAB8AIAMAAAAdACADAAAeADAEAAAfACAUBQAAng0AIA8AAJ0NACARAACgDQAgEgAAnw0AIBcAAKINACAYAAChDQAgHAAAow0AICUAAKQNACAmAAClDQAg8QMBAAAAAfgDQAAAAAH5A0AAAAABmwQBAAAAAa8EAAAA_QQC9gQBAAAAAfcEEAAAAAH4BAIAAAAB-QRAAAAAAfoEQAAAAAH7BCAAAAABATsAAP8BACAL8QMBAAAAAfgDQAAAAAH5A0AAAAABmwQBAAAAAa8EAAAA_QQC9gQBAAAAAfcEEAAAAAH4BAIAAAAB-QRAAAAAAfoEQAAAAAH7BCAAAAABATsAAIECADABOwAAgQIAMBQFAACzDAAgDwAAsgwAIBEAALUMACASAAC0DAAgFwAAtwwAIBgAALYMACAcAAC4DAAgJQAAuQwAICYAALoMACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGbBAEA8gcAIa8EAACxDP0EIvYEAQDyBwAh9wQQAJMJACH4BAIAwwoAIfkEQACoCAAh-gRAAKgIACH7BCAAgwgAIQIAAAAfACA7AACEAgAgC_EDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZsEAQDyBwAhrwQAALEM_QQi9gQBAPIHACH3BBAAkwkAIfgEAgDDCgAh-QRAAKgIACH6BEAAqAgAIfsEIACDCAAhAgAAAB0AIDsAAIYCACACAAAAHQAgOwAAhgIAIAMAAAAfACBCAAD_AQAgQwAAhAIAIAEAAAAfACABAAAAHQAgCAwAAKwMACBIAACvDAAgSQAArgwAIFoAAK0MACBbAACwDAAg-AQAAO4HACD5BAAA7gcAIPoEAADuBwAgDu4DAACCBwAw7wMAAI0CABDwAwAAggcAMPEDAQCBBgAh-ANAAIQGACH5A0AAhAYAIZsEAQCVBgAhrwQAAIMH_QQi9gQBAIEGACH3BBAAswYAIfgEAgC9BgAh-QRAALQGACH6BEAAtAYAIfsEIACaBgAhAwAAAB0AIAMAAIwCADBHAACNAgAgAwAAAB0AIAMAAB4AMAQAAB8AIAEAAAAHACABAAAABwAgAwAAAAUAIAMAAAYAMAQAAAcAIAMAAAAFACADAAAGADAEAAAHACADAAAABQAgAwAABgAwBAAABwAgEgYAAKsMACANAACYCgAgEAAAlgoAIDMAAJcKACA0AACZCgAg8QMBAAAAAfgDQAAAAAH5A0AAAAABlAQBAAAAAaQEAQAAAAGsBEAAAAABrwQAAADwBALwBEAAAAAB8QRAAAAAAfIEQAAAAAHzBCAAAAAB9AQgAAAAAfUEIAAAAAEBOwAAlQIAIA3xAwEAAAAB-ANAAAAAAfkDQAAAAAGUBAEAAAABpAQBAAAAAawEQAAAAAGvBAAAAPAEAvAEQAAAAAHxBEAAAAAB8gRAAAAAAfMEIAAAAAH0BCAAAAAB9QQgAAAAAQE7AACXAgAwATsAAJcCADASBgAAqgwAIA0AANYJACAQAADUCQAgMwAA1QkAIDQAANcJACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGUBAEA8gcAIaQEAQDyBwAhrARAAKgIACGvBAAA0gnwBCLwBEAA9QcAIfEEQACoCAAh8gRAAKgIACHzBCAAgwgAIfQEIACDCAAh9QQgAIMIACECAAAABwAgOwAAmgIAIA3xAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGUBAEA8gcAIaQEAQDyBwAhrARAAKgIACGvBAAA0gnwBCLwBEAA9QcAIfEEQACoCAAh8gRAAKgIACHzBCAAgwgAIfQEIACDCAAh9QQgAIMIACECAAAABQAgOwAAnAIAIAIAAAAFACA7AACcAgAgAwAAAAcAIEIAAJUCACBDAACaAgAgAQAAAAcAIAEAAAAFACAGDAAApwwAIEgAAKkMACBJAACoDAAgrAQAAO4HACDxBAAA7gcAIPIEAADuBwAgEO4DAAD-BgAw7wMAAKMCABDwAwAA_gYAMPEDAQCBBgAh-ANAAIQGACH5A0AAhAYAIZQEAQCBBgAhpAQBAIEGACGsBEAAtAYAIa8EAAD_BvAEIvAEQACEBgAh8QRAALQGACHyBEAAtAYAIfMEIACaBgAh9AQgAJoGACH1BCAAmgYAIQMAAAAFACADAACiAgAwRwAAowIAIAMAAAAFACADAAAGADAEAAAHACABAAAAlwEAIAEAAACXAQAgAwAAAJUBACADAACWAQAwBAAAlwEAIAMAAACVAQAgAwAAlgEAMAQAAJcBACADAAAAlQEAIAMAAJYBADAEAACXAQAgDwcAAKYMACAJAACTCgAgCwAAlAoAIPEDAQAAAAH4A0AAAAAB-QNAAAAAAa8EAAAA7wQCvQQBAAAAAb4EEAAAAAG_BAEAAAAByARAAAAAAeoEQAAAAAHrBEAAAAAB7ARAAAAAAe0EQAAAAAEBOwAAqwIAIAzxAwEAAAAB-ANAAAAAAfkDQAAAAAGvBAAAAO8EAr0EAQAAAAG-BBAAAAABvwQBAAAAAcgEQAAAAAHqBEAAAAAB6wRAAAAAAewEQAAAAAHtBEAAAAABATsAAK0CADABOwAArQIAMA8HAAClDAAgCQAA-gkAIAsAAPsJACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGvBAAA-AnvBCK9BAEA8gcAIb4EEACTCQAhvwQBAPIHACHIBEAAqAgAIeoEQAD1BwAh6wRAAPUHACHsBEAA9QcAIe0EQAD1BwAhAgAAAJcBACA7AACwAgAgDPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIa8EAAD4Ce8EIr0EAQDyBwAhvgQQAJMJACG_BAEA8gcAIcgEQACoCAAh6gRAAPUHACHrBEAA9QcAIewEQAD1BwAh7QRAAPUHACECAAAAlQEAIDsAALICACACAAAAlQEAIDsAALICACADAAAAlwEAIEIAAKsCACBDAACwAgAgAQAAAJcBACABAAAAlQEAIAYMAACgDAAgSAAAowwAIEkAAKIMACBaAAChDAAgWwAApAwAIMgEAADuBwAgD-4DAAD6BgAw7wMAALkCABDwAwAA-gYAMPEDAQCBBgAh-ANAAIQGACH5A0AAhAYAIa8EAAD7Bu8EIr0EAQCBBgAhvgQQALMGACG_BAEAlQYAIcgEQAC0BgAh6gRAAIQGACHrBEAAhAYAIewEQACEBgAh7QRAAIQGACEDAAAAlQEAIAMAALgCADBHAAC5AgAgAwAAAJUBACADAACWAQAwBAAAlwEAIAEAAAAlACABAAAAJQAgAwAAACMAIAMAACQAMAQAACUAIAMAAAAjACADAAAkADAEAAAlACADAAAAIwAgAwAAJAAwBAAAJQAgDRAAAJ4MACARAACfDAAg8QMBAAAAAfgDQAAAAAH5A0AAAAABkAQgAAAAAaQEAQAAAAHkBAAAAOQEAuUEAQAAAAHmBAEAAAAB5wQBAAAAAegEQAAAAAHpBEAAAAABATsAAMECACAL8QMBAAAAAfgDQAAAAAH5A0AAAAABkAQgAAAAAaQEAQAAAAHkBAAAAOQEAuUEAQAAAAHmBAEAAAAB5wQBAAAAAegEQAAAAAHpBEAAAAABATsAAMMCADABOwAAwwIAMA0QAACQDAAgEQAAkQwAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZAEIACDCAAhpAQBAPIHACHkBAAAjwzkBCLlBAEA8gcAIeYEAQDyBwAh5wQBAPIHACHoBEAAqAgAIekEQACoCAAhAgAAACUAIDsAAMYCACAL8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhkAQgAIMIACGkBAEA8gcAIeQEAACPDOQEIuUEAQDyBwAh5gQBAPIHACHnBAEA8gcAIegEQACoCAAh6QRAAKgIACECAAAAIwAgOwAAyAIAIAIAAAAjACA7AADIAgAgAwAAACUAIEIAAMECACBDAADGAgAgAQAAACUAIAEAAAAjACAFDAAAjAwAIEgAAI4MACBJAACNDAAg6AQAAO4HACDpBAAA7gcAIA7uAwAA9gYAMO8DAADPAgAQ8AMAAPYGADDxAwEAgQYAIfgDQACEBgAh-QNAAIQGACGQBCAAmgYAIaQEAQCBBgAh5AQAAPcG5AQi5QQBAJUGACHmBAEAlQYAIecEAQCVBgAh6ARAALQGACHpBEAAtAYAIQMAAAAjACADAADOAgAwRwAAzwIAIAMAAAAjACADAAAkADAEAAAlACABAAAAKQAgAQAAACkAIAMAAAAnACADAAAoADAEAAApACADAAAAJwAgAwAAKAAwBAAAKQAgAwAAACcAIAMAACgAMAQAACkAIA4QAACJDAAgJwAAigwAICgAAIsMACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGbBAEAAAABpAQBAAAAAa8EAAAA4wQC3QQBAAAAAd4EAQAAAAHfBEAAAAAB4ARAAAAAAeEEAQAAAAEBOwAA1wIAIAvxAwEAAAAB-ANAAAAAAfkDQAAAAAGbBAEAAAABpAQBAAAAAa8EAAAA4wQC3QQBAAAAAd4EAQAAAAHfBEAAAAAB4ARAAAAAAeEEAQAAAAEBOwAA2QIAMAE7AADZAgAwAQAAACMAIA4QAAD9CwAgJwAA_gsAICgAAP8LACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGbBAEA8gcAIaQEAQDyBwAhrwQAAPwL4wQi3QQBAPQHACHeBAEA9AcAId8EQAD1BwAh4ARAAPUHACHhBAEA9AcAIQIAAAApACA7AADdAgAgC_EDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZsEAQDyBwAhpAQBAPIHACGvBAAA_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_ACABAAAAfwAgAwAAAH0AIAMAAH4AMAQAAH8AIAMAAAB9ACADAAB-ADAEAAB_ACADAAAAfQAgAwAAfgAwBAAAfwAgCQEAAOkLACDxAwEAAAAB8gMBAAAAAfgDQAAAAAGbBAEAAAABzwQBAAAAAdEEAAAA0QQC0gQBAAAAAdMEQAAAAAEBOwAAtQMAIAjxAwEAAAAB8gMBAAAAAfgDQAAAAAGbBAEAAAABzwQBAAAAAdEEAAAA0QQC0gQBAAAAAdMEQAAAAAEBOwAAtwMAMAE7AAC3AwAwCQEAAOgLACDxAwEA8gcAIfIDAQDyBwAh-ANAAPUHACGbBAEA8gcAIc8EAQDyBwAh0QQAANkI0QQi0gQBAPQHACHTBEAAqAgAIQIAAAB_ACA7AAC6AwAgCPEDAQDyBwAh8gMBAPIHACH4A0AA9QcAIZsEAQDyBwAhzwQBAPIHACHRBAAA2QjRBCLSBAEA9AcAIdMEQACoCAAhAgAAAH0AIDsAALwDACACAAAAfQAgOwAAvAMAIAMAAAB_ACBCAAC1AwAgQwAAugMAIAEAAAB_ACABAAAAfQAgBQwAAOULACBIAADnCwAgSQAA5gsAINIEAADuBwAg0wQAAO4HACAL7gMAAOUGADDvAwAAwwMAEPADAADlBgAw8QMBAIEGACHyAwEAgQYAIfgDQACEBgAhmwQBAJUGACHPBAEAlQYAIdEEAADmBtEEItIEAQDEBgAh0wRAALQGACEDAAAAfQAgAwAAwgMAMEcAAMMDACADAAAAfQAgAwAAfgAwBAAAfwAgAQAAABQAIAEAAAAUACADAAAAEgAgAwAAEwAwBAAAFAAgAwAAABIAIAMAABMAMAQAABQAIAMAAAASACADAAATADAEAAAUACAKAQAAhgoAIAoAAM4IACDxAwEAAAAB8gMBAAAAAfgDQAAAAAGvBAAAAM8EArsEAQAAAAHKBEAAAAABywRAAAAAAc0EAAAAzQQCATsAAMsDACAI8QMBAAAAAfIDAQAAAAH4A0AAAAABrwQAAADPBAK7BAEAAAABygRAAAAAAcsEQAAAAAHNBAAAAM0EAgE7AADNAwAwATsAAM0DADAKAQAAhAoAIAoAAMwIACDxAwEA8gcAIfIDAQDyBwAh-ANAAPUHACGvBAAAygjPBCK7BAEA8gcAIcoEQAD1BwAhywRAAKgIACHNBAAAyQjNBCICAAAAFAAgOwAA0AMAIAjxAwEA8gcAIfIDAQDyBwAh-ANAAPUHACGvBAAAygjPBCK7BAEA8gcAIcoEQAD1BwAhywRAAKgIACHNBAAAyQjNBCICAAAAEgAgOwAA0gMAIAIAAAASACA7AADSAwAgAwAAABQAIEIAAMsDACBDAADQAwAgAQAAABQAIAEAAAASACAEDAAA4gsAIEgAAOQLACBJAADjCwAgywQAAO4HACAL7gMAAN4GADDvAwAA2QMAEPADAADeBgAw8QMBAIEGACHyAwEAgQYAIfgDQACEBgAhrwQAAOAGzwQiuwQBAIEGACHKBEAAhAYAIcsEQAC0BgAhzQQAAN8GzQQiAwAAABIAIAMAANgDADBHAADZAwAgAwAAABIAIAMAABMAMAQAABQAIAEAAAALACABAAAACwAgAwAAAAkAIAMAAAoAMAQAAAsAIAMAAAAJACADAAAKADAEAAALACADAAAACQAgAwAACgAwBAAACwAgEgYAAO0JACAHAADGCQAgCQAAxwkAIPEDAQAAAAH4A0AAAAAB-QNAAAAAAZQEAQAAAAGvBAAAAMYEAr0EAQAAAAG-BBAAAAABvwQBAAAAAcEEAAAAwQQCwgQBAAAAAcMEAQAAAAHEBAEAAAABxwQAAADHBAPIBEAAAAAByQRAAAAAAQE7AADhAwAgD_EDAQAAAAH4A0AAAAAB-QNAAAAAAZQEAQAAAAGvBAAAAMYEAr0EAQAAAAG-BBAAAAABvwQBAAAAAcEEAAAAwQQCwgQBAAAAAcMEAQAAAAHEBAEAAAABxwQAAADHBAPIBEAAAAAByQRAAAAAAQE7AADjAwAwATsAAOMDADASBgAA6wkAIAcAALUJACAJAAC2CQAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhlAQBAPIHACGvBAAAsgnGBCK9BAEA8gcAIb4EEACTCQAhvwQBAPIHACHBBAAAsQnBBCLCBAEA9AcAIcMEAQD0BwAhxAQBAPQHACHHBAAAswnHBCPIBEAAqAgAIckEQACoCAAhAgAAAAsAIDsAAOYDACAP8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhlAQBAPIHACGvBAAAsgnGBCK9BAEA8gcAIb4EEACTCQAhvwQBAPIHACHBBAAAsQnBBCLCBAEA9AcAIcMEAQD0BwAhxAQBAPQHACHHBAAAswnHBCPIBEAAqAgAIckEQACoCAAhAgAAAAkAIDsAAOgDACACAAAACQAgOwAA6AMAIAMAAAALACBCAADhAwAgQwAA5gMAIAEAAAALACABAAAACQAgCwwAAN0LACBIAADgCwAgSQAA3wsAIFoAAN4LACBbAADhCwAgwgQAAO4HACDDBAAA7gcAIMQEAADuBwAgxwQAAO4HACDIBAAA7gcAIMkEAADuBwAgEu4DAADUBgAw7wMAAO8DABDwAwAA1AYAMPEDAQCBBgAh-ANAAIQGACH5A0AAhAYAIZQEAQCBBgAhrwQAANYGxgQivQQBAIEGACG-BBAAswYAIb8EAQCVBgAhwQQAANUGwQQiwgQBAIMGACHDBAEAgwYAIcQEAQCDBgAhxwQAANcGxwQjyARAALQGACHJBEAAtAYAIQMAAAAJACADAADuAwAwRwAA7wMAIAMAAAAJACADAAAKADAEAAALACABAAAADwAgAQAAAA8AIAMAAAANACADAAAOADAEAAAPACADAAAADQAgAwAADgAwBAAADwAgAwAAAA0AIAMAAA4AMAQAAA8AIAcIAACRCgAgCgAAxAkAIPEDAQAAAAH4A0AAAAABugQBAAAAAbsEAQAAAAG8BBAAAAABATsAAPcDACAF8QMBAAAAAfgDQAAAAAG6BAEAAAABuwQBAAAAAbwEEAAAAAEBOwAA-QMAMAE7AAD5AwAwBwgAAI8KACAKAADCCQAg8QMBAPIHACH4A0AA9QcAIboEAQDyBwAhuwQBAPIHACG8BBAAkwkAIQIAAAAPACA7AAD8AwAgBfEDAQDyBwAh-ANAAPUHACG6BAEA8gcAIbsEAQDyBwAhvAQQAJMJACECAAAADQAgOwAA_gMAIAIAAAANACA7AAD-AwAgAwAAAA8AIEIAAPcDACBDAAD8AwAgAQAAAA8AIAEAAAANACAFDAAA2AsAIEgAANsLACBJAADaCwAgWgAA2QsAIFsAANwLACAI7gMAANMGADDvAwAAhQQAEPADAADTBgAw8QMBAIEGACH4A0AAhAYAIboEAQCBBgAhuwQBAIEGACG8BBAAswYAIQMAAAANACADAACEBAAwRwAAhQQAIAMAAAANACADAAAOADAEAAAPACABAAAATwAgAQAAAE8AIAMAAABNACADAABOADAEAABPACADAAAATQAgAwAATgAwBAAATwAgAwAAAE0AIAMAAE4AMAQAAE8AIA4QAADVCwAgIwAA1gsAICQAANcLACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGbBAEAAAABnAQBAAAAAaMEIAAAAAGkBAEAAAABtgQQAAAAAbcEAgAAAAG4BEAAAAABuQRAAAAAAQE7AACNBAAgC_EDAQAAAAH4A0AAAAAB-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_AgAIPEDAQAAAAH4A0AAAAAB-QNAAAAAAZQEAQAAAAGqBAEAAAABqwQQAAAAAawEQAAAAAGtBEAAAAABrwQAAACvBAIBOwAAzwQAIAnxAwEAAAAB-ANAAAAAAfkDQAAAAAGUBAEAAAABqgQBAAAAAasEEAAAAAGsBEAAAAABrQRAAAAAAa8EAAAArwQCATsAANEEADABOwAA0QQAMAwGAACDCwAgHQAA6AgAIB8AAOkIACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGUBAEA8gcAIaoEAQDyBwAhqwQQAKYIACGsBEAA9QcAIa0EQACoCAAhrwQAAOYIrwQiAgAAAGYAIDsAANQEACAJ8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhlAQBAPIHACGqBAEA8gcAIasEEACmCAAhrARAAPUHACGtBEAAqAgAIa8EAADmCK8EIgIAAABkACA7AADWBAAgAgAAAGQAIDsAANYEACADAAAAZgAgQgAAzwQAIEMAANQEACABAAAAZgAgAQAAAGQAIAcMAAD-CgAgSAAAgQsAIEkAAIALACBaAAD_CgAgWwAAggsAIKsEAADuBwAgrQQAAO4HACAM7gMAAMkGADDvAwAA3QQAEPADAADJBgAw8QMBAIEGACH4A0AAhAYAIfkDQACEBgAhlAQBAIEGACGqBAEAgQYAIasEEADFBgAhrARAAIQGACGtBEAAtAYAIa8EAADKBq8EIgMAAABkACADAADcBAAwRwAA3QQAIAMAAABkACADAABlADAEAABmACABAAAAWwAgAQAAAFsAIAMAAABZACADAABaADAEAABbACADAAAAWQAgAwAAWgAwBAAAWwAgAwAAAFkAIAMAAFoAMAQAAFsAIAseAAD4CAAgIAAA_QoAICEAAPkIACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGlBAEAAAABpgQBAAAAAacEAQAAAAGoBAEAAAABqQQQAAAAAQE7AADlBAAgCPEDAQAAAAH4A0AAAAAB-QNAAAAAAaUEAQAAAAGmBAEAAAABpwQBAAAAAagEAQAAAAGpBBAAAAABATsAAOcEADABOwAA5wQAMAEAAABVACALHgAA9QgAICAAAPwKACAhAAD2CAAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhpQQBAPIHACGmBAEA8gcAIacEAQD0BwAhqAQBAPQHACGpBBAApggAIQIAAABbACA7AADrBAAgCPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIaUEAQDyBwAhpgQBAPIHACGnBAEA9AcAIagEAQD0BwAhqQQQAKYIACECAAAAWQAgOwAA7QQAIAIAAABZACA7AADtBAAgAQAAAFUAIAMAAABbACBCAADlBAAgQwAA6wQAIAEAAABbACABAAAAWQAgCAwAAPcKACBIAAD6CgAgSQAA-QoAIFoAAPgKACBbAAD7CgAgpwQAAO4HACCoBAAA7gcAIKkEAADuBwAgC-4DAADDBgAw7wMAAPUEABDwAwAAwwYAMPEDAQCBBgAh-ANAAIQGACH5A0AAhAYAIaUEAQCBBgAhpgQBAIEGACGnBAEAxAYAIagEAQCDBgAhqQQQAMUGACEDAAAAWQAgAwAA9AQAMEcAAPUEACADAAAAWQAgAwAAWgAwBAAAWwAgAQAAAC8AIAEAAAAvACADAAAALQAgAwAALgAwBAAALwAgAwAAAC0AIAMAAC4AMAQAAC8AIAMAAAAtACADAAAuADAEAAAvACALEAAA9AoAIBYAAPUKACAXAAD2CgAg8QMBAAAAAfgDQAAAAAH5A0AAAAABmwQBAAAAAZwEAQAAAAGiBAIAAAABowQgAAAAAaQEAQAAAAEBOwAA_QQAIAjxAwEAAAAB-ANAAAAAAfkDQAAAAAGbBAEAAAABnAQBAAAAAaIEAgAAAAGjBCAAAAABpAQBAAAAAQE7AAD_BAAwATsAAP8EADALEAAA1goAIBYAANcKACAXAADYCgAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhmwQBAPIHACGcBAEA9AcAIaIEAgCSCQAhowQgAIMIACGkBAEA8gcAIQIAAAAvACA7AACCBQAgCPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZsEAQDyBwAhnAQBAPQHACGiBAIAkgkAIaMEIACDCAAhpAQBAPIHACECAAAALQAgOwAAhAUAIAIAAAAtACA7AACEBQAgAwAAAC8AIEIAAP0EACBDAACCBQAgAQAAAC8AIAEAAAAtACAGDAAA0QoAIEgAANQKACBJAADTCgAgWgAA0goAIFsAANUKACCcBAAA7gcAIAvuAwAAwgYAMO8DAACLBQAQ8AMAAMIGADDxAwEAgQYAIfgDQACEBgAh-QNAAIQGACGbBAEAlQYAIZwEAQCDBgAhogQCALIGACGjBCAAmgYAIaQEAQCBBgAhAwAAAC0AIAMAAIoFADBHAACLBQAgAwAAAC0AIAMAAC4AMAQAAC8AIAEAAAAzACABAAAAMwAgAwAAADEAIAMAADIAMAQAADMAIAMAAAAxACADAAAyADAEAAAzACADAAAAMQAgAwAAMgAwBAAAMwAgDhMAAM8KACAVAADQCgAg8QMBAAAAAfgDQAAAAAH5A0AAAAABmgQBAAAAAZsEAQAAAAGcBAEAAAABngQAAACeBAKfBAEAAAABoAQBAAAAAaEEAgAAAAGiBAIAAAABowQgAAAAAQE7AACTBQAgDPEDAQAAAAH4A0AAAAAB-QNAAAAAAZoEAQAAAAGbBAEAAAABnAQBAAAAAZ4EAAAAngQCnwQBAAAAAaAEAQAAAAGhBAIAAAABogQCAAAAAaMEIAAAAAEBOwAAlQUAMAE7AACVBQAwDhMAAMQKACAVAADFCgAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhmgQBAPIHACGbBAEA8gcAIZwEAQD0BwAhngQAAMIKngQinwQBAPQHACGgBAEA9AcAIaEEAgDDCgAhogQCAJIJACGjBCAAgwgAIQIAAAAzACA7AACYBQAgDPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZoEAQDyBwAhmwQBAPIHACGcBAEA9AcAIZ4EAADCCp4EIp8EAQD0BwAhoAQBAPQHACGhBAIAwwoAIaIEAgCSCQAhowQgAIMIACECAAAAMQAgOwAAmgUAIAIAAAAxACA7AACaBQAgAwAAADMAIEIAAJMFACBDAACYBQAgAQAAADMAIAEAAAAxACAJDAAAvQoAIEgAAMAKACBJAAC_CgAgWgAAvgoAIFsAAMEKACCcBAAA7gcAIJ8EAADuBwAgoAQAAO4HACChBAAA7gcAIA_uAwAAuwYAMO8DAAChBQAQ8AMAALsGADDxAwEAgQYAIfgDQACEBgAh-QNAAIQGACGaBAEAgQYAIZsEAQCVBgAhnAQBAIMGACGeBAAAvAaeBCKfBAEAgwYAIaAEAQCDBgAhoQQCAL0GACGiBAIAsgYAIaMEIACaBgAhAwAAADEAIAMAAKAFADBHAAChBQAgAwAAADEAIAMAADIAMAQAADMAIAEAAAA3ACABAAAANwAgAwAAADUAIAMAADYAMAQAADcAIAMAAAA1ACADAAA2ADAEAAA3ACADAAAANQAgAwAANgAwBAAANwAgCwYAALwKACAUAACXCQAg8QMBAAAAAfgDQAAAAAH5A0AAAAABlAQBAAAAAZUEAQAAAAGWBAIAAAABlwQQAAAAAZgEIAAAAAGZBEAAAAABATsAAKkFACAJ8QMBAAAAAfgDQAAAAAH5A0AAAAABlAQBAAAAAZUEAQAAAAGWBAIAAAABlwQQAAAAAZgEIAAAAAGZBEAAAAABATsAAKsFADABOwAAqwUAMAsGAAC7CgAgFAAAlQkAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZQEAQDyBwAhlQQBAPIHACGWBAIAkgkAIZcEEACTCQAhmAQgAIMIACGZBEAAqAgAIQIAAAA3ACA7AACuBQAgCfEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZQEAQDyBwAhlQQBAPIHACGWBAIAkgkAIZcEEACTCQAhmAQgAIMIACGZBEAAqAgAIQIAAAA1ACA7AACwBQAgAgAAADUAIDsAALAFACADAAAANwAgQgAAqQUAIEMAAK4FACABAAAANwAgAQAAADUAIAYMAAC2CgAgSAAAuQoAIEkAALgKACBaAAC3CgAgWwAAugoAIJkEAADuBwAgDO4DAACxBgAw7wMAALcFABDwAwAAsQYAMPEDAQCBBgAh-ANAAIQGACH5A0AAhAYAIZQEAQCBBgAhlQQBAIEGACGWBAIAsgYAIZcEEACzBgAhmAQgAJoGACGZBEAAtAYAIQMAAAA1ACADAAC2BQAwRwAAtwUAIAMAAAA1ACADAAA2ADAEAAA3ACAaAgAApgYAIAUAAKcGACANAACoBgAgKgAAqQYAICsAAKoGACAsAACrBgAgLQAArAYAIC4AAK0GACAvAACuBgAgMAAArwYAIDEAAKsGACAyAACwBgAg7gMAAKEGADDvAwAASgAQ8AMAAKEGADDxAwEAAAAB-ANAAJIGACH5A0AAkgYAIYcEAQCiBgAhiAQBAAAAAYkEAQCiBgAhigQBAJEGACGMBAAAowaMBCKOBAAApAaOBCKPBAEAAAABkAQgAKUGACEBAAAAugUAIAEAAAC6BQAgDgIAAKsKACAFAACsCgAgDQAArQoAICoAAK4KACArAACvCgAgLAAAsAoAIC0AALEKACAuAACyCgAgLwAAswoAIDAAALQKACAxAACwCgAgMgAAtQoAIIoEAADuBwAgjwQAAO4HACADAAAASgAgAwAAvQUAMAQAALoFACADAAAASgAgAwAAvQUAMAQAALoFACADAAAASgAgAwAAvQUAMAQAALoFACAXAgAAnwoAIAUAAKAKACANAAChCgAgKgAAogoAICsAAKMKACAsAACkCgAgLQAApQoAIC4AAKYKACAvAACnCgAgMAAAqAoAIDEAAKkKACAyAACqCgAg8QMBAAAAAfgDQAAAAAH5A0AAAAABhwQBAAAAAYgEAQAAAAGJBAEAAAABigQBAAAAAYwEAAAAjAQCjgQAAACOBAKPBAEAAAABkAQgAAAAAQE7AADBBQAgC_EDAQAAAAH4A0AAAAAB-QNAAAAAAYcEAQAAAAGIBAEAAAABiQQBAAAAAYoEAQAAAAGMBAAAAIwEAo4EAAAAjgQCjwQBAAAAAZAEIAAAAAEBOwAAwwUAMAE7AADDBQAwFwIAAIQIACAFAACFCAAgDQAAhggAICoAAIcIACArAACICAAgLAAAiQgAIC0AAIoIACAuAACLCAAgLwAAjAgAIDAAAI0IACAxAACOCAAgMgAAjwgAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIYcEAQDyBwAhiAQBAPIHACGJBAEA8gcAIYoEAQD0BwAhjAQAAIEIjAQijgQAAIIIjgQijwQBAPQHACGQBCAAgwgAIQIAAAC6BQAgOwAAxgUAIAvxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGHBAEA8gcAIYgEAQDyBwAhiQQBAPIHACGKBAEA9AcAIYwEAACBCIwEIo4EAACCCI4EIo8EAQD0BwAhkAQgAIMIACECAAAASgAgOwAAyAUAIAIAAABKACA7AADIBQAgAwAAALoFACBCAADBBQAgQwAAxgUAIAEAAAC6BQAgAQAAAEoAIAUMAAD-BwAgSAAAgAgAIEkAAP8HACCKBAAA7gcAII8EAADuBwAgDu4DAACXBgAw7wMAAM8FABDwAwAAlwYAMPEDAQCBBgAh-ANAAIQGACH5A0AAhAYAIYcEAQCVBgAhiAQBAJUGACGJBAEAlQYAIYoEAQCDBgAhjAQAAJgGjAQijgQAAJkGjgQijwQBAIMGACGQBCAAmgYAIQMAAABKACADAADOBQAwRwAAzwUAIAMAAABKACADAAC9BQAwBAAAugUAIAEAAACIAQAgAQAAAIgBACADAAAAhgEAIAMAAIcBADAEAACIAQAgAwAAAIYBACADAACHAQAwBAAAiAEAIAMAAACGAQAgAwAAhwEAMAQAAIgBACAGAQAA_QcAIPEDAQAAAAHyAwEAAAAB-ANAAAAAAYUEAQAAAAGGBEAAAAABATsAANcFACAF8QMBAAAAAfIDAQAAAAH4A0AAAAABhQQBAAAAAYYEQAAAAAEBOwAA2QUAMAE7AADZBQAwBgEAAPwHACDxAwEA8gcAIfIDAQDyBwAh-ANAAPUHACGFBAEA8gcAIYYEQAD1BwAhAgAAAIgBACA7AADcBQAgBfEDAQDyBwAh8gMBAPIHACH4A0AA9QcAIYUEAQDyBwAhhgRAAPUHACECAAAAhgEAIDsAAN4FACACAAAAhgEAIDsAAN4FACADAAAAiAEAIEIAANcFACBDAADcBQAgAQAAAIgBACABAAAAhgEAIAMMAAD5BwAgSAAA-wcAIEkAAPoHACAI7gMAAJQGADDvAwAA5QUAEPADAACUBgAw8QMBAIEGACHyAwEAgQYAIfgDQACEBgAhhQQBAJUGACGGBEAAhAYAIQMAAACGAQAgAwAA5AUAMEcAAOUFACADAAAAhgEAIAMAAIcBADAEAACIAQAgDAEAAJMGACDuAwAAjwYAMO8DAAADABDwAwAAjwYAMPEDAQAAAAHyAwEAAAAB9AMAAJAG9AMi9QMBAJEGACH2AwEAkQYAIfcDAQCRBgAh-ANAAJIGACH5A0AAkgYAIQEAAADoBQAgAQAAAOgFACAEAQAA-AcAIPUDAADuBwAg9gMAAO4HACD3AwAA7gcAIAMAAAADACADAADrBQAwBAAA6AUAIAMAAAADACADAADrBQAwBAAA6AUAIAMAAAADACADAADrBQAwBAAA6AUAIAkBAAD3BwAg8QMBAAAAAfIDAQAAAAH0AwAAAPQDAvUDAQAAAAH2AwEAAAAB9wMBAAAAAfgDQAAAAAH5A0AAAAABATsAAO8FACAI8QMBAAAAAfIDAQAAAAH0AwAAAPQDAvUDAQAAAAH2AwEAAAAB9wMBAAAAAfgDQAAAAAH5A0AAAAABATsAAPEFADABOwAA8QUAMAkBAAD2BwAg8QMBAPIHACHyAwEA8gcAIfQDAADzB_QDIvUDAQD0BwAh9gMBAPQHACH3AwEA9AcAIfgDQAD1BwAh-QNAAPUHACECAAAA6AUAIDsAAPQFACAI8QMBAPIHACHyAwEA8gcAIfQDAADzB_QDIvUDAQD0BwAh9gMBAPQHACH3AwEA9AcAIfgDQAD1BwAh-QNAAPUHACECAAAAAwAgOwAA9gUAIAIAAAADACA7AAD2BQAgAwAAAOgFACBCAADvBQAgQwAA9AUAIAEAAADoBQAgAQAAAAMAIAYMAADvBwAgSAAA8QcAIEkAAPAHACD1AwAA7gcAIPYDAADuBwAg9wMAAO4HACAL7gMAAIAGADDvAwAA_QUAEPADAACABgAw8QMBAIEGACHyAwEAgQYAIfQDAACCBvQDIvUDAQCDBgAh9gMBAIMGACH3AwEAgwYAIfgDQACEBgAh-QNAAIQGACEDAAAAAwAgAwAA_AUAMEcAAP0FACADAAAAAwAgAwAA6wUAMAQAAOgFACAL7gMAAIAGADDvAwAA_QUAEPADAACABgAw8QMBAIEGACHyAwEAgQYAIfQDAACCBvQDIvUDAQCDBgAh9gMBAIMGACH3AwEAgwYAIfgDQACEBgAh-QNAAIQGACELDAAAhgYAIEgAAI4GACBJAACOBgAg-gMBAAAAAfsDAQAAAAT8AwEAAAAE_QMBAAAAAf4DAQAAAAH_AwEAAAABgAQBAAAAAYEEAQCNBgAhBwwAAIYGACBIAACMBgAgSQAAjAYAIPoDAAAA9AMC-wMAAAD0Awj8AwAAAPQDCIEEAACLBvQDIg4MAACJBgAgSAAAigYAIEkAAIoGACD6AwEAAAAB-wMBAAAABfwDAQAAAAX9AwEAAAAB_gMBAAAAAf8DAQAAAAGABAEAAAABgQQBAIgGACGCBAEAAAABgwQBAAAAAYQEAQAAAAELDAAAhgYAIEgAAIcGACBJAACHBgAg-gNAAAAAAfsDQAAAAAT8A0AAAAAE_QNAAAAAAf4DQAAAAAH_A0AAAAABgARAAAAAAYEEQACFBgAhCwwAAIYGACBIAACHBgAgSQAAhwYAIPoDQAAAAAH7A0AAAAAE_ANAAAAABP0DQAAAAAH-A0AAAAAB_wNAAAAAAYAEQAAAAAGBBEAAhQYAIQj6AwIAAAAB-wMCAAAABPwDAgAAAAT9AwIAAAAB_gMCAAAAAf8DAgAAAAGABAIAAAABgQQCAIYGACEI-gNAAAAAAfsDQAAAAAT8A0AAAAAE_QNAAAAAAf4DQAAAAAH_A0AAAAABgARAAAAAAYEEQACHBgAhDgwAAIkGACBIAACKBgAgSQAAigYAIPoDAQAAAAH7AwEAAAAF_AMBAAAABf0DAQAAAAH-AwEAAAAB_wMBAAAAAYAEAQAAAAGBBAEAiAYAIYIEAQAAAAGDBAEAAAABhAQBAAAAAQj6AwIAAAAB-wMCAAAABfwDAgAAAAX9AwIAAAAB_gMCAAAAAf8DAgAAAAGABAIAAAABgQQCAIkGACEL-gMBAAAAAfsDAQAAAAX8AwEAAAAF_QMBAAAAAf4DAQAAAAH_AwEAAAABgAQBAAAAAYEEAQCKBgAhggQBAAAAAYMEAQAAAAGEBAEAAAABBwwAAIYGACBIAACMBgAgSQAAjAYAIPoDAAAA9AMC-wMAAAD0Awj8AwAAAPQDCIEEAACLBvQDIgT6AwAAAPQDAvsDAAAA9AMI_AMAAAD0AwiBBAAAjAb0AyILDAAAhgYAIEgAAI4GACBJAACOBgAg-gMBAAAAAfsDAQAAAAT8AwEAAAAE_QMBAAAAAf4DAQAAAAH_AwEAAAABgAQBAAAAAYEEAQCNBgAhC_oDAQAAAAH7AwEAAAAE_AMBAAAABP0DAQAAAAH-AwEAAAAB_wMBAAAAAYAEAQAAAAGBBAEAjgYAIYIEAQAAAAGDBAEAAAABhAQBAAAAAQwBAACTBgAg7gMAAI8GADDvAwAAAwAQ8AMAAI8GADDxAwEAiAcAIfIDAQCIBwAh9AMAAJAG9AMi9QMBAJEGACH2AwEAkQYAIfcDAQCRBgAh-ANAAJIGACH5A0AAkgYAIQT6AwAAAPQDAvsDAAAA9AMI_AMAAAD0AwiBBAAAjAb0AyIL-gMBAAAAAfsDAQAAAAX8AwEAAAAF_QMBAAAAAf4DAQAAAAH_AwEAAAABgAQBAAAAAYEEAQCKBgAhggQBAAAAAYMEAQAAAAGEBAEAAAABCPoDQAAAAAH7A0AAAAAE_ANAAAAABP0DQAAAAAH-A0AAAAAB_wNAAAAAAYAEQAAAAAGBBEAAhwYAIRwCAACmBgAgBQAApwYAIA0AAKgGACAqAACpBgAgKwAAqgYAICwAAKsGACAtAACsBgAgLgAArQYAIC8AAK4GACAwAACvBgAgMQAAqwYAIDIAALAGACDuAwAAoQYAMO8DAABKABDwAwAAoQYAMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIYcEAQCiBgAhiAQBAKIGACGJBAEAogYAIYoEAQCRBgAhjAQAAKMGjAQijgQAAKQGjgQijwQBAJEGACGQBCAApQYAIZQFAABKACCVBQAASgAgCO4DAACUBgAw7wMAAOUFABDwAwAAlAYAMPEDAQCBBgAh8gMBAIEGACH4A0AAhAYAIYUEAQCVBgAhhgRAAIQGACEODAAAhgYAIEgAAI4GACBJAACOBgAg-gMBAAAAAfsDAQAAAAT8AwEAAAAE_QMBAAAAAf4DAQAAAAH_AwEAAAABgAQBAAAAAYEEAQCWBgAhggQBAAAAAYMEAQAAAAGEBAEAAAABDgwAAIYGACBIAACOBgAgSQAAjgYAIPoDAQAAAAH7AwEAAAAE_AMBAAAABP0DAQAAAAH-AwEAAAAB_wMBAAAAAYAEAQAAAAGBBAEAlgYAIYIEAQAAAAGDBAEAAAABhAQBAAAAAQ7uAwAAlwYAMO8DAADPBQAQ8AMAAJcGADDxAwEAgQYAIfgDQACEBgAh-QNAAIQGACGHBAEAlQYAIYgEAQCVBgAhiQQBAJUGACGKBAEAgwYAIYwEAACYBowEIo4EAACZBo4EIo8EAQCDBgAhkAQgAJoGACEHDAAAhgYAIEgAAKAGACBJAACgBgAg-gMAAACMBAL7AwAAAIwECPwDAAAAjAQIgQQAAJ8GjAQiBwwAAIYGACBIAACeBgAgSQAAngYAIPoDAAAAjgQC-wMAAACOBAj8AwAAAI4ECIEEAACdBo4EIgUMAACGBgAgSAAAnAYAIEkAAJwGACD6AyAAAAABgQQgAJsGACEFDAAAhgYAIEgAAJwGACBJAACcBgAg-gMgAAAAAYEEIACbBgAhAvoDIAAAAAGBBCAAnAYAIQcMAACGBgAgSAAAngYAIEkAAJ4GACD6AwAAAI4EAvsDAAAAjgQI_AMAAACOBAiBBAAAnQaOBCIE-gMAAACOBAL7AwAAAI4ECPwDAAAAjgQIgQQAAJ4GjgQiBwwAAIYGACBIAACgBgAgSQAAoAYAIPoDAAAAjAQC-wMAAACMBAj8AwAAAIwECIEEAACfBowEIgT6AwAAAIwEAvsDAAAAjAQI_AMAAACMBAiBBAAAoAaMBCIaAgAApgYAIAUAAKcGACANAACoBgAgKgAAqQYAICsAAKoGACAsAACrBgAgLQAArAYAIC4AAK0GACAvAACuBgAgMAAArwYAIDEAAKsGACAyAACwBgAg7gMAAKEGADDvAwAASgAQ8AMAAKEGADDxAwEAiAcAIfgDQACSBgAh-QNAAJIGACGHBAEAogYAIYgEAQCiBgAhiQQBAKIGACGKBAEAkQYAIYwEAACjBowEIo4EAACkBo4EIo8EAQCRBgAhkAQgAKUGACEL-gMBAAAAAfsDAQAAAAT8AwEAAAAE_QMBAAAAAf4DAQAAAAH_AwEAAAABgAQBAAAAAYEEAQCOBgAhggQBAAAAAYMEAQAAAAGEBAEAAAABBPoDAAAAjAQC-wMAAACMBAj8AwAAAIwECIEEAACgBowEIgT6AwAAAI4EAvsDAAAAjgQI_AMAAACOBAiBBAAAngaOBCIC-gMgAAAAAYEEIACcBgAhDgEAAJMGACDuAwAAjwYAMO8DAAADABDwAwAAjwYAMPEDAQCIBwAh8gMBAIgHACH0AwAAkAb0AyL1AwEAkQYAIfYDAQCRBgAh9wMBAJEGACH4A0AAkgYAIfkDQACSBgAhlAUAAAMAIJUFAAADACADkQQAAAUAIJIEAAAFACCTBAAABQAgA5EEAAAJACCSBAAACQAgkwQAAAkAIAORBAAAGQAgkgQAABkAIJMEAAAZACADkQQAADUAIJIEAAA1ACCTBAAANQAgA5EEAABGACCSBAAARgAgkwQAAEYAIAORBAAAZAAgkgQAAGQAIJMEAABkACADkQQAAH0AIJIEAAB9ACCTBAAAfQAgA5EEAAASACCSBAAAEgAgkwQAABIAIAORBAAAggEAIJIEAACCAQAgkwQAAIIBACADkQQAAIYBACCSBAAAhgEAIJMEAACGAQAgDO4DAACxBgAw7wMAALcFABDwAwAAsQYAMPEDAQCBBgAh-ANAAIQGACH5A0AAhAYAIZQEAQCBBgAhlQQBAIEGACGWBAIAsgYAIZcEEACzBgAhmAQgAJoGACGZBEAAtAYAIQ0MAACGBgAgSAAAhgYAIEkAAIYGACBaAAC6BgAgWwAAhgYAIPoDAgAAAAH7AwIAAAAE_AMCAAAABP0DAgAAAAH-AwIAAAAB_wMCAAAAAYAEAgAAAAGBBAIAuQYAIQ0MAACGBgAgSAAAuAYAIEkAALgGACBaAAC4BgAgWwAAuAYAIPoDEAAAAAH7AxAAAAAE_AMQAAAABP0DEAAAAAH-AxAAAAAB_wMQAAAAAYAEEAAAAAGBBBAAtwYAIQsMAACJBgAgSAAAtgYAIEkAALYGACD6A0AAAAAB-wNAAAAABfwDQAAAAAX9A0AAAAAB_gNAAAAAAf8DQAAAAAGABEAAAAABgQRAALUGACELDAAAiQYAIEgAALYGACBJAAC2BgAg-gNAAAAAAfsDQAAAAAX8A0AAAAAF_QNAAAAAAf4DQAAAAAH_A0AAAAABgARAAAAAAYEEQAC1BgAhCPoDQAAAAAH7A0AAAAAF_ANAAAAABf0DQAAAAAH-A0AAAAAB_wNAAAAAAYAEQAAAAAGBBEAAtgYAIQ0MAACGBgAgSAAAuAYAIEkAALgGACBaAAC4BgAgWwAAuAYAIPoDEAAAAAH7AxAAAAAE_AMQAAAABP0DEAAAAAH-AxAAAAAB_wMQAAAAAYAEEAAAAAGBBBAAtwYAIQj6AxAAAAAB-wMQAAAABPwDEAAAAAT9AxAAAAAB_gMQAAAAAf8DEAAAAAGABBAAAAABgQQQALgGACENDAAAhgYAIEgAAIYGACBJAACGBgAgWgAAugYAIFsAAIYGACD6AwIAAAAB-wMCAAAABPwDAgAAAAT9AwIAAAAB_gMCAAAAAf8DAgAAAAGABAIAAAABgQQCALkGACEI-gMIAAAAAfsDCAAAAAT8AwgAAAAE_QMIAAAAAf4DCAAAAAH_AwgAAAABgAQIAAAAAYEECAC6BgAhD-4DAAC7BgAw7wMAAKEFABDwAwAAuwYAMPEDAQCBBgAh-ANAAIQGACH5A0AAhAYAIZoEAQCBBgAhmwQBAJUGACGcBAEAgwYAIZ4EAAC8Bp4EIp8EAQCDBgAhoAQBAIMGACGhBAIAvQYAIaIEAgCyBgAhowQgAJoGACEHDAAAhgYAIEgAAMEGACBJAADBBgAg-gMAAACeBAL7AwAAAJ4ECPwDAAAAngQIgQQAAMAGngQiDQwAAIkGACBIAACJBgAgSQAAiQYAIFoAAL8GACBbAACJBgAg-gMCAAAAAfsDAgAAAAX8AwIAAAAF_QMCAAAAAf4DAgAAAAH_AwIAAAABgAQCAAAAAYEEAgC-BgAhDQwAAIkGACBIAACJBgAgSQAAiQYAIFoAAL8GACBbAACJBgAg-gMCAAAAAfsDAgAAAAX8AwIAAAAF_QMCAAAAAf4DAgAAAAH_AwIAAAABgAQCAAAAAYEEAgC-BgAhCPoDCAAAAAH7AwgAAAAF_AMIAAAABf0DCAAAAAH-AwgAAAAB_wMIAAAAAYAECAAAAAGBBAgAvwYAIQcMAACGBgAgSAAAwQYAIEkAAMEGACD6AwAAAJ4EAvsDAAAAngQI_AMAAACeBAiBBAAAwAaeBCIE-gMAAACeBAL7AwAAAJ4ECPwDAAAAngQIgQQAAMEGngQiC-4DAADCBgAw7wMAAIsFABDwAwAAwgYAMPEDAQCBBgAh-ANAAIQGACH5A0AAhAYAIZsEAQCVBgAhnAQBAIMGACGiBAIAsgYAIaMEIACaBgAhpAQBAIEGACEL7gMAAMMGADDvAwAA9QQAEPADAADDBgAw8QMBAIEGACH4A0AAhAYAIfkDQACEBgAhpQQBAIEGACGmBAEAgQYAIacEAQDEBgAhqAQBAIMGACGpBBAAxQYAIQsMAACJBgAgSAAAigYAIEkAAIoGACD6AwEAAAAB-wMBAAAABfwDAQAAAAX9AwEAAAAB_gMBAAAAAf8DAQAAAAGABAEAAAABgQQBAMgGACENDAAAiQYAIEgAAMcGACBJAADHBgAgWgAAxwYAIFsAAMcGACD6AxAAAAAB-wMQAAAABfwDEAAAAAX9AxAAAAAB_gMQAAAAAf8DEAAAAAGABBAAAAABgQQQAMYGACENDAAAiQYAIEgAAMcGACBJAADHBgAgWgAAxwYAIFsAAMcGACD6AxAAAAAB-wMQAAAABfwDEAAAAAX9AxAAAAAB_gMQAAAAAf8DEAAAAAGABBAAAAABgQQQAMYGACEI-gMQAAAAAfsDEAAAAAX8AxAAAAAF_QMQAAAAAf4DEAAAAAH_AxAAAAABgAQQAAAAAYEEEADHBgAhCwwAAIkGACBIAACKBgAgSQAAigYAIPoDAQAAAAH7AwEAAAAF_AMBAAAABf0DAQAAAAH-AwEAAAAB_wMBAAAAAYAEAQAAAAGBBAEAyAYAIQzuAwAAyQYAMO8DAADdBAAQ8AMAAMkGADDxAwEAgQYAIfgDQACEBgAh-QNAAIQGACGUBAEAgQYAIaoEAQCBBgAhqwQQAMUGACGsBEAAhAYAIa0EQAC0BgAhrwQAAMoGrwQiBwwAAIYGACBIAADMBgAgSQAAzAYAIPoDAAAArwQC-wMAAACvBAj8AwAAAK8ECIEEAADLBq8EIgcMAACGBgAgSAAAzAYAIEkAAMwGACD6AwAAAK8EAvsDAAAArwQI_AMAAACvBAiBBAAAywavBCIE-gMAAACvBAL7AwAAAK8ECPwDAAAArwQIgQQAAMwGrwQiCO4DAADNBgAw7wMAAMcEABDwAwAAzQYAMPEDAQCBBgAhogQCALIGACGmBAEAgQYAIbAEAQCVBgAhsQQgAJoGACEL7gMAAM4GADDvAwAAsQQAEPADAADOBgAw8QMBAIEGACH4A0AAhAYAIfkDQACEBgAhogQCALIGACGqBAEAgQYAIbIEAQCVBgAhtAQAAM8GtAQitQQQALMGACEHDAAAhgYAIEgAANEGACBJAADRBgAg-gMAAAC0BAL7AwAAALQECPwDAAAAtAQIgQQAANAGtAQiBwwAAIYGACBIAADRBgAgSQAA0QYAIPoDAAAAtAQC-wMAAAC0BAj8AwAAALQECIEEAADQBrQEIgT6AwAAALQEAvsDAAAAtAQI_AMAAAC0BAiBBAAA0Qa0BCIO7gMAANIGADDvAwAAmwQAEPADAADSBgAw8QMBAIEGACH4A0AAhAYAIfkDQACEBgAhmwQBAJUGACGcBAEAgwYAIaMEIACaBgAhpAQBAIEGACG2BBAAswYAIbcEAgC9BgAhuARAALQGACG5BEAAtAYAIQjuAwAA0wYAMO8DAACFBAAQ8AMAANMGADDxAwEAgQYAIfgDQACEBgAhugQBAIEGACG7BAEAgQYAIbwEEACzBgAhEu4DAADUBgAw7wMAAO8DABDwAwAA1AYAMPEDAQCBBgAh-ANAAIQGACH5A0AAhAYAIZQEAQCBBgAhrwQAANYGxgQivQQBAIEGACG-BBAAswYAIb8EAQCVBgAhwQQAANUGwQQiwgQBAIMGACHDBAEAgwYAIcQEAQCDBgAhxwQAANcGxwQjyARAALQGACHJBEAAtAYAIQcMAACGBgAgSAAA3QYAIEkAAN0GACD6AwAAAMEEAvsDAAAAwQQI_AMAAADBBAiBBAAA3AbBBCIHDAAAhgYAIEgAANsGACBJAADbBgAg-gMAAADGBAL7AwAAAMYECPwDAAAAxgQIgQQAANoGxgQiBwwAAIkGACBIAADZBgAgSQAA2QYAIPoDAAAAxwQD-wMAAADHBAn8AwAAAMcECYEEAADYBscEIwcMAACJBgAgSAAA2QYAIEkAANkGACD6AwAAAMcEA_sDAAAAxwQJ_AMAAADHBAmBBAAA2AbHBCME-gMAAADHBAP7AwAAAMcECfwDAAAAxwQJgQQAANkGxwQjBwwAAIYGACBIAADbBgAgSQAA2wYAIPoDAAAAxgQC-wMAAADGBAj8AwAAAMYECIEEAADaBsYEIgT6AwAAAMYEAvsDAAAAxgQI_AMAAADGBAiBBAAA2wbGBCIHDAAAhgYAIEgAAN0GACBJAADdBgAg-gMAAADBBAL7AwAAAMEECPwDAAAAwQQIgQQAANwGwQQiBPoDAAAAwQQC-wMAAADBBAj8AwAAAMEECIEEAADdBsEEIgvuAwAA3gYAMO8DAADZAwAQ8AMAAN4GADDxAwEAgQYAIfIDAQCBBgAh-ANAAIQGACGvBAAA4AbPBCK7BAEAgQYAIcoEQACEBgAhywRAALQGACHNBAAA3wbNBCIHDAAAhgYAIEgAAOQGACBJAADkBgAg-gMAAADNBAL7AwAAAM0ECPwDAAAAzQQIgQQAAOMGzQQiBwwAAIYGACBIAADiBgAgSQAA4gYAIPoDAAAAzwQC-wMAAADPBAj8AwAAAM8ECIEEAADhBs8EIgcMAACGBgAgSAAA4gYAIEkAAOIGACD6AwAAAM8EAvsDAAAAzwQI_AMAAADPBAiBBAAA4QbPBCIE-gMAAADPBAL7AwAAAM8ECPwDAAAAzwQIgQQAAOIGzwQiBwwAAIYGACBIAADkBgAgSQAA5AYAIPoDAAAAzQQC-wMAAADNBAj8AwAAAM0ECIEEAADjBs0EIgT6AwAAAM0EAvsDAAAAzQQI_AMAAADNBAiBBAAA5AbNBCIL7gMAAOUGADDvAwAAwwMAEPADAADlBgAw8QMBAIEGACHyAwEAgQYAIfgDQACEBgAhmwQBAJUGACHPBAEAlQYAIdEEAADmBtEEItIEAQDEBgAh0wRAALQGACEHDAAAhgYAIEgAAOgGACBJAADoBgAg-gMAAADRBAL7AwAAANEECPwDAAAA0QQIgQQAAOcG0QQiBwwAAIYGACBIAADoBgAgSQAA6AYAIPoDAAAA0QQC-wMAAADRBAj8AwAAANEECIEEAADnBtEEIgT6AwAAANEEAvsDAAAA0QQI_AMAAADRBAiBBAAA6AbRBCIL7gMAAOkGADDvAwAArQMAEPADAADpBgAw8QMBAIEGACH4A0AAhAYAIfkDQACEBgAhmwQBAJUGACGjBCAAmgYAIaQEAQDEBgAh1AQBAJUGACHVBEAAtAYAIQ3uAwAA6gYAMO8DAACVAwAQ8AMAAOoGADDxAwEAgQYAIfgDQACEBgAh-QNAAIQGACGaBAEAxAYAIZsEAQCVBgAhnAQBAIMGACGjBCAAmgYAIaQEAQCBBgAh1gQBAJUGACHYBAAA6wbYBCIHDAAAhgYAIEgAAO0GACBJAADtBgAg-gMAAADYBAL7AwAAANgECPwDAAAA2AQIgQQAAOwG2AQiBwwAAIYGACBIAADtBgAgSQAA7QYAIPoDAAAA2AQC-wMAAADYBAj8AwAAANgECIEEAADsBtgEIgT6AwAAANgEAvsDAAAA2AQI_AMAAADYBAiBBAAA7QbYBCIJ7gMAAO4GADDvAwAA_QIAEPADAADuBgAw8QMBAIEGACGUBAEAgQYAIa8EAADvBtsEItkEAQCBBgAh2wRAAIQGACHcBAEAxAYAIQcMAACGBgAgSAAA8QYAIEkAAPEGACD6AwAAANsEAvsDAAAA2wQI_AMAAADbBAiBBAAA8AbbBCIHDAAAhgYAIEgAAPEGACBJAADxBgAg-gMAAADbBAL7AwAAANsECPwDAAAA2wQIgQQAAPAG2wQiBPoDAAAA2wQC-wMAAADbBAj8AwAAANsECIEEAADxBtsEIg7uAwAA8gYAMO8DAADnAgAQ8AMAAPIGADDxAwEAgQYAIfgDQACEBgAh-QNAAIQGACGbBAEAlQYAIaQEAQCBBgAhrwQAAPMG4wQi3QQBAMQGACHeBAEAgwYAId8EQACEBgAh4ARAAIQGACHhBAEAgwYAIQcMAACGBgAgSAAA9QYAIEkAAPUGACD6AwAAAOMEAvsDAAAA4wQI_AMAAADjBAiBBAAA9AbjBCIHDAAAhgYAIEgAAPUGACBJAAD1BgAg-gMAAADjBAL7AwAAAOMECPwDAAAA4wQIgQQAAPQG4wQiBPoDAAAA4wQC-wMAAADjBAj8AwAAAOMECIEEAAD1BuMEIg7uAwAA9gYAMO8DAADPAgAQ8AMAAPYGADDxAwEAgQYAIfgDQACEBgAh-QNAAIQGACGQBCAAmgYAIaQEAQCBBgAh5AQAAPcG5AQi5QQBAJUGACHmBAEAlQYAIecEAQCVBgAh6ARAALQGACHpBEAAtAYAIQcMAACGBgAgSAAA-QYAIEkAAPkGACD6AwAAAOQEAvsDAAAA5AQI_AMAAADkBAiBBAAA-AbkBCIHDAAAhgYAIEgAAPkGACBJAAD5BgAg-gMAAADkBAL7AwAAAOQECPwDAAAA5AQIgQQAAPgG5AQiBPoDAAAA5AQC-wMAAADkBAj8AwAAAOQECIEEAAD5BuQEIg_uAwAA-gYAMO8DAAC5AgAQ8AMAAPoGADDxAwEAgQYAIfgDQACEBgAh-QNAAIQGACGvBAAA-wbvBCK9BAEAgQYAIb4EEACzBgAhvwQBAJUGACHIBEAAtAYAIeoEQACEBgAh6wRAAIQGACHsBEAAhAYAIe0EQACEBgAhBwwAAIYGACBIAAD9BgAgSQAA_QYAIPoDAAAA7wQC-wMAAADvBAj8AwAAAO8ECIEEAAD8Bu8EIgcMAACGBgAgSAAA_QYAIEkAAP0GACD6AwAAAO8EAvsDAAAA7wQI_AMAAADvBAiBBAAA_AbvBCIE-gMAAADvBAL7AwAAAO8ECPwDAAAA7wQIgQQAAP0G7wQiEO4DAAD-BgAw7wMAAKMCABDwAwAA_gYAMPEDAQCBBgAh-ANAAIQGACH5A0AAhAYAIZQEAQCBBgAhpAQBAIEGACGsBEAAtAYAIa8EAAD_BvAEIvAEQACEBgAh8QRAALQGACHyBEAAtAYAIfMEIACaBgAh9AQgAJoGACH1BCAAmgYAIQcMAACGBgAgSAAAgQcAIEkAAIEHACD6AwAAAPAEAvsDAAAA8AQI_AMAAADwBAiBBAAAgAfwBCIHDAAAhgYAIEgAAIEHACBJAACBBwAg-gMAAADwBAL7AwAAAPAECPwDAAAA8AQIgQQAAIAH8AQiBPoDAAAA8AQC-wMAAADwBAj8AwAAAPAECIEEAACBB_AEIg7uAwAAggcAMO8DAACNAgAQ8AMAAIIHADDxAwEAgQYAIfgDQACEBgAh-QNAAIQGACGbBAEAlQYAIa8EAACDB_0EIvYEAQCBBgAh9wQQALMGACH4BAIAvQYAIfkEQAC0BgAh-gRAALQGACH7BCAAmgYAIQcMAACGBgAgSAAAhQcAIEkAAIUHACD6AwAAAP0EAvsDAAAA_QQI_AMAAAD9BAiBBAAAhAf9BCIHDAAAhgYAIEgAAIUHACBJAACFBwAg-gMAAAD9BAL7AwAAAP0ECPwDAAAA_QQIgQQAAIQH_QQiBPoDAAAA_QQC-wMAAAD9BAj8AwAAAP0ECIEEAACFB_0EIgzuAwAAhgcAMO8DAAD3AQAQ8AMAAIYHADDxAwEAgQYAIfQDAACCBvQDIvgDQACEBgAh-QNAAIQGACGbBAEAlQYAIZwEAQCDBgAhowQgAJoGACH9BAEAlQYAIf4EAQCDBgAhDQ4AAIkHACDuAwAAhwcAMO8DAADkAQAQ8AMAAIcHADDxAwEAiAcAIfQDAACQBvQDIvgDQACSBgAh-QNAAJIGACGbBAEAogYAIZwEAQCRBgAhowQgAKUGACH9BAEAogYAIf4EAQCRBgAhCPoDAQAAAAH7AwEAAAAE_AMBAAAABP0DAQAAAAH-AwEAAAAB_wMBAAAAAYAEAQAAAAGBBAEAigcAIQORBAAAHQAgkgQAAB0AIJMEAAAdACAI-gMBAAAAAfsDAQAAAAT8AwEAAAAE_QMBAAAAAf4DAQAAAAH_AwEAAAABgAQBAAAAAYEEAQCKBwAhEO4DAACLBwAw7wMAAN4BABDwAwAAiwcAMPEDAQCBBgAh-ANAAIQGACH5A0AAhAYAIZQEAQCBBgAhqAQBAIMGACGtBEAAhAYAIa8EAACMB4IFIrUEEADFBgAh1gQBAIMGACH_BAEAgQYAIYAFAQCDBgAhggVAALQGACGDBQEAxAYAIQcMAACGBgAgSAAAjgcAIEkAAI4HACD6AwAAAIIFAvsDAAAAggUI_AMAAACCBQiBBAAAjQeCBSIHDAAAhgYAIEgAAI4HACBJAACOBwAg-gMAAACCBQL7AwAAAIIFCPwDAAAAggUIgQQAAI0HggUiBPoDAAAAggUC-wMAAACCBQj8AwAAAIIFCIEEAACOB4IFIg3uAwAAjwcAMO8DAADGAQAQ8AMAAI8HADDxAwEAgQYAIfgDQACEBgAh-QNAAIQGACGbBAEAlQYAIaMEIACaBgAhpAQBAIEGACG2BBAAswYAIYQFAQCVBgAhhQVAALQGACGGBQEAgwYAIQruAwAAkAcAMO8DAACwAQAQ8AMAAJAHADDxAwEAgQYAIfgDQACEBgAhvQQBAIEGACGHBQEAgQYAIYkFAACRB4kFIosFAACSB4sFIowFAQCDBgAhBwwAAIYGACBIAACWBwAgSQAAlgcAIPoDAAAAiQUC-wMAAACJBQj8AwAAAIkFCIEEAACVB4kFIgcMAACGBgAgSAAAlAcAIEkAAJQHACD6AwAAAIsFAvsDAAAAiwUI_AMAAACLBQiBBAAAkweLBSIHDAAAhgYAIEgAAJQHACBJAACUBwAg-gMAAACLBQL7AwAAAIsFCPwDAAAAiwUIgQQAAJMHiwUiBPoDAAAAiwUC-wMAAACLBQj8AwAAAIsFCIEEAACUB4sFIgcMAACGBgAgSAAAlgcAIEkAAJYHACD6AwAAAIkFAvsDAAAAiQUI_AMAAACJBQiBBAAAlQeJBSIE-gMAAACJBQL7AwAAAIkFCPwDAAAAiQUIgQQAAJYHiQUiAr0EAQAAAAHqBEAAAAABEgcAAJwHACAJAACdBwAgCwAArgYAIO4DAACYBwAw7wMAAJUBABDwAwAAmAcAMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIa8EAACaB-8EIr0EAQCIBwAhvgQQAJkHACG_BAEAogYAIcgEQACbBwAh6gRAAJIGACHrBEAAkgYAIewEQACSBgAh7QRAAJIGACEI-gMQAAAAAfsDEAAAAAT8AxAAAAAE_QMQAAAAAf4DEAAAAAH_AxAAAAABgAQQAAAAAYEEEAC4BgAhBPoDAAAA7wQC-wMAAADvBAj8AwAAAO8ECIEEAAD9Bu8EIgj6A0AAAAAB-wNAAAAABfwDQAAAAAX9A0AAAAAB_gNAAAAAAf8DQAAAAAGABEAAAAABgQRAALYGACEXBgAAkwYAIA0AAKgGACAQAAC5BwAgMwAA7QcAIDQAAK8GACDuAwAA6wcAMO8DAAAFABDwAwAA6wcAMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIZQEAQCIBwAhpAQBAIgHACGsBEAAmwcAIa8EAADsB_AEIvAEQACSBgAh8QRAAJsHACHyBEAAmwcAIfMEIAClBgAh9AQgAKUGACH1BCAApQYAIZQFAAAFACCVBQAABQAgA5EEAAANACCSBAAADQAgkwQAAA0AIAkBAACTBgAg7gMAAJ4HADDvAwAAhgEAEPADAACeBwAw8QMBAIgHACHyAwEAiAcAIfgDQACSBgAhhQQBAKIGACGGBEAAkgYAIQwHAACcBwAgNQAAkwYAIO4DAACfBwAw7wMAAIIBABDwAwAAnwcAMPEDAQCIBwAh-ANAAJIGACG9BAEAiAcAIYcFAQCIBwAhiQUAAKAHiQUiiwUAAKEHiwUijAUBAJEGACEE-gMAAACJBQL7AwAAAIkFCPwDAAAAiQUIgQQAAJYHiQUiBPoDAAAAiwUC-wMAAACLBQj8AwAAAIsFCIEEAACUB4sFIgwBAACTBgAg7gMAAKIHADDvAwAAfQAQ8AMAAKIHADDxAwEAiAcAIfIDAQCIBwAh-ANAAJIGACGbBAEAogYAIc8EAQCiBgAh0QQAAKMH0QQi0gQBAKQHACHTBEAAmwcAIQT6AwAAANEEAvsDAAAA0QQI_AMAAADRBAiBBAAA6AbRBCII-gMBAAAAAfsDAQAAAAX8AwEAAAAF_QMBAAAAAf4DAQAAAAH_AwEAAAABgAQBAAAAAYEEAQClBwAhCPoDAQAAAAH7AwEAAAAF_AMBAAAABf0DAQAAAAH-AwEAAAAB_wMBAAAAAYAEAQAAAAGBBAEApQcAIQwQAACnBwAg7gMAAKYHADDvAwAAagAQ8AMAAKYHADDxAwEAiAcAIfgDQACSBgAh-QNAAJIGACGbBAEAogYAIaMEIAClBgAhpAQBAKQHACHUBAEAogYAIdUEQACbBwAhGQUAAKcGACAPAADVBwAgEQAA0gcAIBIAANYHACAXAADMBwAgGAAA1wcAIBwAANgHACAlAADZBwAgJgAA2gcAIO4DAADTBwAw7wMAAB0AEPADAADTBwAw8QMBAIgHACH4A0AAkgYAIfkDQACSBgAhmwQBAKIGACGvBAAA1Af9BCL2BAEAiAcAIfcEEACZBwAh-AQCALgHACH5BEAAmwcAIfoEQACbBwAh-wQgAKUGACGUBQAAHQAglQUAAB0AIA8GAACTBgAgHQAAqwcAIB8AAKwHACDuAwAAqAcAMO8DAABkABDwAwAAqAcAMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIZQEAQCIBwAhqgQBAIgHACGrBBAAqQcAIawEQACSBgAhrQRAAJsHACGvBAAAqgevBCII-gMQAAAAAfsDEAAAAAX8AxAAAAAF_QMQAAAAAf4DEAAAAAH_AxAAAAABgAQQAAAAAYEEEADHBgAhBPoDAAAArwQC-wMAAACvBAj8AwAAAK8ECIEEAADMBq8EIhMQAAC5BwAgIwAAugcAICQAAKwGACDuAwAAtwcAMO8DAABNABDwAwAAtwcAMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIZsEAQCiBgAhnAQBAJEGACGjBCAApQYAIaQEAQCIBwAhtgQQAJkHACG3BAIAuAcAIbgEQACbBwAhuQRAAJsHACGUBQAATQAglQUAAE0AIAORBAAAWQAgkgQAAFkAIJMEAABZACACpQQBAAAAAaYEAQAAAAEOHgAAsAcAICAAAK8HACAhAACxBwAg7gMAAK4HADDvAwAAWQAQ8AMAAK4HADDxAwEAiAcAIfgDQACSBgAh-QNAAJIGACGlBAEAiAcAIaYEAQCIBwAhpwQBAKQHACGoBAEAkQYAIakEEACpBwAhEQYAAJMGACAdAACrBwAgHwAArAcAIO4DAACoBwAw7wMAAGQAEPADAACoBwAw8QMBAIgHACH4A0AAkgYAIfkDQACSBgAhlAQBAIgHACGqBAEAiAcAIasEEACpBwAhrARAAJIGACGtBEAAmwcAIa8EAACqB68EIpQFAABkACCVBQAAZAAgEB0AAKsHACAfAACsBwAgIgAAtgcAIO4DAAC0BwAw7wMAAFEAEPADAAC0BwAw8QMBAIgHACH4A0AAkgYAIfkDQACSBgAhogQCALMHACGqBAEAiAcAIbIEAQCiBgAhtAQAALUHtAQitQQQAJkHACGUBQAAUQAglQUAAFEAIAweAACwBwAgHwAArAcAIO4DAACyBwAw7wMAAFUAEPADAACyBwAw8QMBAIgHACGiBAIAswcAIaYEAQCIBwAhsAQBAKIGACGxBCAApQYAIZQFAABVACCVBQAAVQAgCh4AALAHACAfAACsBwAg7gMAALIHADDvAwAAVQAQ8AMAALIHADDxAwEAiAcAIaIEAgCzBwAhpgQBAIgHACGwBAEAogYAIbEEIAClBgAhCPoDAgAAAAH7AwIAAAAE_AMCAAAABP0DAgAAAAH-AwIAAAAB_wMCAAAAAYAEAgAAAAGBBAIAhgYAIQ4dAACrBwAgHwAArAcAICIAALYHACDuAwAAtAcAMO8DAABRABDwAwAAtAcAMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIaIEAgCzBwAhqgQBAIgHACGyBAEAogYAIbQEAAC1B7QEIrUEEACZBwAhBPoDAAAAtAQC-wMAAAC0BAj8AwAAALQECIEEAADRBrQEIgORBAAAVQAgkgQAAFUAIJMEAABVACAREAAAuQcAICMAALoHACAkAACsBgAg7gMAALcHADDvAwAATQAQ8AMAALcHADDxAwEAiAcAIfgDQACSBgAh-QNAAJIGACGbBAEAogYAIZwEAQCRBgAhowQgAKUGACGkBAEAiAcAIbYEEACZBwAhtwQCALgHACG4BEAAmwcAIbkEQACbBwAhCPoDAgAAAAH7AwIAAAAF_AMCAAAABf0DAgAAAAH-AwIAAAAB_wMCAAAAAYAEAgAAAAGBBAIAiQYAIRkFAACnBgAgDwAA1QcAIBEAANIHACASAADWBwAgFwAAzAcAIBgAANcHACAcAADYBwAgJQAA2QcAICYAANoHACDuAwAA0wcAMO8DAAAdABDwAwAA0wcAMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIZsEAQCiBgAhrwQAANQH_QQi9gQBAIgHACH3BBAAmQcAIfgEAgC4BwAh-QRAAJsHACH6BEAAmwcAIfsEIAClBgAhlAUAAB0AIJUFAAAdACADkQQAAFEAIJIEAABRACCTBAAAUQAgApQEAQAAAAH_BAEAAAABEwYAAJMGACAZAAC-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_AMAAADkBAiBBAAA-QbkBCIDkQQAACcAIJIEAAAnACCTBAAAJwAgFwUAAKcGACAPAADVBwAgEQAA0gcAIBIAANYHACAXAADMBwAgGAAA1wcAIBwAANgHACAlAADZBwAgJgAA2gcAIO4DAADTBwAw7wMAAB0AEPADAADTBwAw8QMBAIgHACH4A0AAkgYAIfkDQACSBgAhmwQBAKIGACGvBAAA1Af9BCL2BAEAiAcAIfcEEACZBwAh-AQCALgHACH5BEAAmwcAIfoEQACbBwAh-wQgAKUGACEE-gMAAAD9BAL7AwAAAP0ECPwDAAAA_QQIgQQAAIUH_QQiDw4AAIkHACDuAwAAhwcAMO8DAADkAQAQ8AMAAIcHADDxAwEAiAcAIfQDAACQBvQDIvgDQACSBgAh-QNAAJIGACGbBAEAogYAIZwEAQCRBgAhowQgAKUGACH9BAEAogYAIf4EAQCRBgAhlAUAAOQBACCVBQAA5AEAIAORBAAAIwAgkgQAACMAIJMEAAAjACADkQQAAC0AIJIEAAAtACCTBAAALQAgA5EEAABCACCSBAAAQgAgkwQAAEIAIAORBAAATQAgkgQAAE0AIJMEAABNACADkQQAAGoAIJIEAABqACCTBAAAagAgApQEAQAAAAHZBAEAAAABCwYAAJMGACApAADeBwAg7gMAANwHADDvAwAAGQAQ8AMAANwHADDxAwEAiAcAIZQEAQCIBwAhrwQAAN0H2wQi2QQBAIgHACHbBEAAkgYAIdwEAQCkBwAhBPoDAAAA2wQC-wMAAADbBAj8AwAAANsECIEEAADxBtsEIhMQAAC5BwAgJwAAzwcAICgAAKkGACDuAwAAzQcAMO8DAAAnABDwAwAAzQcAMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIZsEAQCiBgAhpAQBAIgHACGvBAAAzgfjBCLdBAEApAcAId4EAQCRBgAh3wRAAJIGACHgBEAAkgYAIeEEAQCRBgAhlAUAACcAIJUFAAAnACANAQAAkwYAIAoAAOIHACDuAwAA3wcAMO8DAAASABDwAwAA3wcAMPEDAQCIBwAh8gMBAIgHACH4A0AAkgYAIa8EAADhB88EIrsEAQCIBwAhygRAAJIGACHLBEAAmwcAIc0EAADgB80EIgT6AwAAAM0EAvsDAAAAzQQI_AMAAADNBAiBBAAA5AbNBCIE-gMAAADPBAL7AwAAAM8ECPwDAAAAzwQIgQQAAOIGzwQiFAcAAJwHACAJAACdBwAgCwAArgYAIO4DAACYBwAw7wMAAJUBABDwAwAAmAcAMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIa8EAACaB-8EIr0EAQCIBwAhvgQQAJkHACG_BAEAogYAIcgEQACbBwAh6gRAAJIGACHrBEAAkgYAIewEQACSBgAh7QRAAJIGACGUBQAAlQEAIJUFAACVAQAgAroEAQAAAAG7BAEAAAABCggAAOUHACAKAADiBwAg7gMAAOQHADDvAwAADQAQ8AMAAOQHADDxAwEAiAcAIfgDQACSBgAhugQBAIgHACG7BAEAiAcAIbwEEACZBwAhFwYAAJMGACAHAACcBwAgCQAAnQcAIO4DAADmBwAw7wMAAAkAEPADAADmBwAw8QMBAIgHACH4A0AAkgYAIfkDQACSBgAhlAQBAIgHACGvBAAA6AfGBCK9BAEAiAcAIb4EEACZBwAhvwQBAKIGACHBBAAA5wfBBCLCBAEAkQYAIcMEAQCRBgAhxAQBAJEGACHHBAAA6QfHBCPIBEAAmwcAIckEQACbBwAhlAUAAAkAIJUFAAAJACAVBgAAkwYAIAcAAJwHACAJAACdBwAg7gMAAOYHADDvAwAACQAQ8AMAAOYHADDxAwEAiAcAIfgDQACSBgAh-QNAAJIGACGUBAEAiAcAIa8EAADoB8YEIr0EAQCIBwAhvgQQAJkHACG_BAEAogYAIcEEAADnB8EEIsIEAQCRBgAhwwQBAJEGACHEBAEAkQYAIccEAADpB8cEI8gEQACbBwAhyQRAAJsHACEE-gMAAADBBAL7AwAAAMEECPwDAAAAwQQIgQQAAN0GwQQiBPoDAAAAxgQC-wMAAADGBAj8AwAAAMYECIEEAADbBsYEIgT6AwAAAMcEA_sDAAAAxwQJ_AMAAADHBAmBBAAA2QbHBCMClAQBAAAAAaQEAQAAAAEVBgAAkwYAIA0AAKgGACAQAAC5BwAgMwAA7QcAIDQAAK8GACDuAwAA6wcAMO8DAAAFABDwAwAA6wcAMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIZQEAQCIBwAhpAQBAIgHACGsBEAAmwcAIa8EAADsB_AEIvAEQACSBgAh8QRAAJsHACHyBEAAmwcAIfMEIAClBgAh9AQgAKUGACH1BCAApQYAIQT6AwAAAPAEAvsDAAAA8AQI_AMAAADwBAiBBAAAgQfwBCIDkQQAAJUBACCSBAAAlQEAIJMEAACVAQAgAAAAAAGZBQEAAAABAZkFAAAA9AMCAZkFAQAAAAEBmQVAAAAAAQVCAADGDwAgQwAAyQ8AIJYFAADHDwAglwUAAMgPACCcBQAAugUAIANCAADGDwAglgUAAMcPACCcBQAAugUAIA4CAACrCgAgBQAArAoAIA0AAK0KACAqAACuCgAgKwAArwoAICwAALAKACAtAACxCgAgLgAAsgoAIC8AALMKACAwAAC0CgAgMQAAsAoAIDIAALUKACCKBAAA7gcAII8EAADuBwAgAAAABUIAAMEPACBDAADEDwAglgUAAMIPACCXBQAAww8AIJwFAAC6BQAgA0IAAMEPACCWBQAAwg8AIJwFAAC6BQAgAAAAAZkFAAAAjAQCAZkFAAAAjgQCAZkFIAAAAAEHQgAAmgoAIEMAAJ0KACCWBQAAmwoAIJcFAACcCgAgmgUAAAMAIJsFAAADACCcBQAA6AUAIAtCAADICQAwQwAAzQkAMJYFAADJCQAwlwUAAMoJADCYBQAAywkAIJkFAADMCQAwmgUAAMwJADCbBQAAzAkAMJwFAADMCQAwnQUAAM4JADCeBQAAzwkAMAtCAACnCQAwQwAArAkAMJYFAACoCQAwlwUAAKkJADCYBQAAqgkAIJkFAACrCQAwmgUAAKsJADCbBQAAqwkAMJwFAACrCQAwnQUAAK0JADCeBQAArgkAMAtCAACYCQAwQwAAnQkAMJYFAACZCQAwlwUAAJoJADCYBQAAmwkAIJkFAACcCQAwmgUAAJwJADCbBQAAnAkAMJwFAACcCQAwnQUAAJ4JADCeBQAAnwkAMAtCAACICQAwQwAAjQkAMJYFAACJCQAwlwUAAIoJADCYBQAAiwkAIJkFAACMCQAwmgUAAIwJADCbBQAAjAkAMJwFAACMCQAwnQUAAI4JADCeBQAAjwkAMAtCAAD9CAAwQwAAgQkAMJYFAAD-CAAwlwUAAP8IADCYBQAAgAkAIJkFAACgCAAwmgUAAKAIADCbBQAAoAgAMJwFAACgCAAwnQUAAIIJADCeBQAAowgAMAtCAADcCAAwQwAA4QgAMJYFAADdCAAwlwUAAN4IADCYBQAA3wgAIJkFAADgCAAwmgUAAOAIADCbBQAA4AgAMJwFAADgCAAwnQUAAOIIADCeBQAA4wgAMAtCAADPCAAwQwAA1AgAMJYFAADQCAAwlwUAANEIADCYBQAA0ggAIJkFAADTCAAwmgUAANMIADCbBQAA0wgAMJwFAADTCAAwnQUAANUIADCeBQAA1ggAMAtCAAC_CAAwQwAAxAgAMJYFAADACAAwlwUAAMEIADCYBQAAwggAIJkFAADDCAAwmgUAAMMIADCbBQAAwwgAMJwFAADDCAAwnQUAAMUIADCeBQAAxggAMAtCAACvCAAwQwAAtAgAMJYFAACwCAAwlwUAALEIADCYBQAAsggAIJkFAACzCAAwmgUAALMIADCbBQAAswgAMJwFAACzCAAwnQUAALUIADCeBQAAtggAMAtCAACcCAAwQwAAoQgAMJYFAACdCAAwlwUAAJ4IADCYBQAAnwgAIJkFAACgCAAwmgUAAKAIADCbBQAAoAgAMJwFAACgCAAwnQUAAKIIADCeBQAAowgAMAtCAACQCAAwQwAAlQgAMJYFAACRCAAwlwUAAJIIADCYBQAAkwgAIJkFAACUCAAwmgUAAJQIADCbBQAAlAgAMJwFAACUCAAwnQUAAJYIADCeBQAAlwgAMATxAwEAAAAB-ANAAAAAAYUEAQAAAAGGBEAAAAABAgAAAIgBACBCAACbCAAgAwAAAIgBACBCAACbCAAgQwAAmggAIAE7AADADwAwCQEAAJMGACDuAwAAngcAMO8DAACGAQAQ8AMAAJ4HADDxAwEAAAAB8gMBAIgHACH4A0AAkgYAIYUEAQAAAAGGBEAAkgYAIQIAAACIAQAgOwAAmggAIAIAAACYCAAgOwAAmQgAIAjuAwAAlwgAMO8DAACYCAAQ8AMAAJcIADDxAwEAiAcAIfIDAQCIBwAh-ANAAJIGACGFBAEAogYAIYYEQACSBgAhCO4DAACXCAAw7wMAAJgIABDwAwAAlwgAMPEDAQCIBwAh8gMBAIgHACH4A0AAkgYAIYUEAQCiBgAhhgRAAJIGACEE8QMBAPIHACH4A0AA9QcAIYUEAQDyBwAhhgRAAPUHACEE8QMBAPIHACH4A0AA9QcAIYUEAQDyBwAhhgRAAPUHACEE8QMBAAAAAfgDQAAAAAGFBAEAAAABhgRAAAAAAQ4GAACuCAAgGQAArQgAIPEDAQAAAAH4A0AAAAAB-QNAAAAAAZQEAQAAAAGoBAEAAAABrQRAAAAAAa8EAAAAggUCtQQQAAAAAdYEAQAAAAH_BAEAAAABgAUBAAAAAYIFQAAAAAECAAAASAAgQgAArAgAIAMAAABIACBCAACsCAAgQwAAqQgAIAE7AAC_DwAwFAYAAJMGACAZAAC-BwAgGgAAvwcAIO4DAAC8BwAw7wMAAEYAEPADAAC8BwAw8QMBAAAAAfgDQACSBgAh-QNAAJIGACGUBAEAiAcAIagEAQCRBgAhrQRAAJIGACGvBAAAvQeCBSK1BBAAqQcAIdYEAQCRBgAh_wQBAIgHACGABQEAkQYAIYIFQACbBwAhgwUBAKQHACGPBQAAuwcAIAIAAABIACA7AACpCAAgAgAAAKQIACA7AAClCAAgEO4DAACjCAAw7wMAAKQIABDwAwAAowgAMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIZQEAQCIBwAhqAQBAJEGACGtBEAAkgYAIa8EAAC9B4IFIrUEEACpBwAh1gQBAJEGACH_BAEAiAcAIYAFAQCRBgAhggVAAJsHACGDBQEApAcAIRDuAwAAowgAMO8DAACkCAAQ8AMAAKMIADDxAwEAiAcAIfgDQACSBgAh-QNAAJIGACGUBAEAiAcAIagEAQCRBgAhrQRAAJIGACGvBAAAvQeCBSK1BBAAqQcAIdYEAQCRBgAh_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_ACBCAADbCAAgQwAA2ggAIAE7AACoDwAwDAEAAJMGACDuAwAAogcAMO8DAAB9ABDwAwAAogcAMPEDAQAAAAHyAwEAiAcAIfgDQACSBgAhmwQBAKIGACHPBAEAogYAIdEEAACjB9EEItIEAQCkBwAh0wRAAJsHACECAAAAfwAgOwAA2ggAIAIAAADXCAAgOwAA2AgAIAvuAwAA1ggAMO8DAADXCAAQ8AMAANYIADDxAwEAiAcAIfIDAQCIBwAh-ANAAJIGACGbBAEAogYAIc8EAQCiBgAh0QQAAKMH0QQi0gQBAKQHACHTBEAAmwcAIQvuAwAA1ggAMO8DAADXCAAQ8AMAANYIADDxAwEAiAcAIfIDAQCIBwAh-ANAAJIGACGbBAEAogYAIc8EAQCiBgAh0QQAAKMH0QQi0gQBAKQHACHTBEAAmwcAIQfxAwEA8gcAIfgDQAD1BwAhmwQBAPIHACHPBAEA8gcAIdEEAADZCNEEItIEAQD0BwAh0wRAAKgIACEBmQUAAADRBAIH8QMBAPIHACH4A0AA9QcAIZsEAQDyBwAhzwQBAPIHACHRBAAA2QjRBCLSBAEA9AcAIdMEQACoCAAhB_EDAQAAAAH4A0AAAAABmwQBAAAAAc8EAQAAAAHRBAAAANEEAtIEAQAAAAHTBEAAAAABCh0AAPsIACAfAAD8CAAg8QMBAAAAAfgDQAAAAAH5A0AAAAABqgQBAAAAAasEEAAAAAGsBEAAAAABrQRAAAAAAa8EAAAArwQCAgAAAGYAIEIAAPoIACADAAAAZgAgQgAA-ggAIEMAAOcIACABOwAApw8AMA8GAACTBgAgHQAAqwcAIB8AAKwHACDuAwAAqAcAMO8DAABkABDwAwAAqAcAMPEDAQAAAAH4A0AAkgYAIfkDQACSBgAhlAQBAIgHACGqBAEAiAcAIasEEACpBwAhrARAAJIGACGtBEAAmwcAIa8EAACqB68EIgIAAABmACA7AADnCAAgAgAAAOQIACA7AADlCAAgDO4DAADjCAAw7wMAAOQIABDwAwAA4wgAMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIZQEAQCIBwAhqgQBAIgHACGrBBAAqQcAIawEQACSBgAhrQRAAJsHACGvBAAAqgevBCIM7gMAAOMIADDvAwAA5AgAEPADAADjCAAw8QMBAIgHACH4A0AAkgYAIfkDQACSBgAhlAQBAIgHACGqBAEAiAcAIasEEACpBwAhrARAAJIGACGtBEAAmwcAIa8EAACqB68EIgjxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGqBAEA8gcAIasEEACmCAAhrARAAPUHACGtBEAAqAgAIa8EAADmCK8EIgGZBQAAAK8EAgodAADoCAAgHwAA6QgAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIaoEAQDyBwAhqwQQAKYIACGsBEAA9QcAIa0EQACoCAAhrwQAAOYIrwQiBUIAAJcPACBDAAClDwAglgUAAJgPACCXBQAApA8AIJwFAABPACALQgAA6ggAMEMAAO8IADCWBQAA6wgAMJcFAADsCAAwmAUAAO0IACCZBQAA7ggAMJoFAADuCAAwmwUAAO4IADCcBQAA7ggAMJ0FAADwCAAwngUAAPEIADAJHgAA-AgAICEAAPkIACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGmBAEAAAABpwQBAAAAAagEAQAAAAGpBBAAAAABAgAAAFsAIEIAAPcIACADAAAAWwAgQgAA9wgAIEMAAPQIACABOwAAow8AMA8eAACwBwAgIAAArwcAICEAALEHACDuAwAArgcAMO8DAABZABDwAwAArgcAMPEDAQAAAAH4A0AAkgYAIfkDQACSBgAhpQQBAIgHACGmBAEAiAcAIacEAQCkBwAhqAQBAJEGACGpBBAAqQcAIY4FAACtBwAgAgAAAFsAIDsAAPQIACACAAAA8ggAIDsAAPMIACAL7gMAAPEIADDvAwAA8ggAEPADAADxCAAw8QMBAIgHACH4A0AAkgYAIfkDQACSBgAhpQQBAIgHACGmBAEAiAcAIacEAQCkBwAhqAQBAJEGACGpBBAAqQcAIQvuAwAA8QgAMO8DAADyCAAQ8AMAAPEIADDxAwEAiAcAIfgDQACSBgAh-QNAAJIGACGlBAEAiAcAIaYEAQCIBwAhpwQBAKQHACGoBAEAkQYAIakEEACpBwAhB_EDAQDyBwAh-ANAAPUHACH5A0AA9QcAIaYEAQDyBwAhpwQBAPQHACGoBAEA9AcAIakEEACmCAAhCR4AAPUIACAhAAD2CAAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhpgQBAPIHACGnBAEA9AcAIagEAQD0BwAhqQQQAKYIACEFQgAAmw8AIEMAAKEPACCWBQAAnA8AIJcFAACgDwAgnAUAAFMAIAdCAACZDwAgQwAAng8AIJYFAACaDwAglwUAAJ0PACCaBQAAVQAgmwUAAFUAIJwFAABXACAJHgAA-AgAICEAAPkIACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGmBAEAAAABpwQBAAAAAagEAQAAAAGpBBAAAAABA0IAAJsPACCWBQAAnA8AIJwFAABTACADQgAAmQ8AIJYFAACaDwAgnAUAAFcAIAodAAD7CAAgHwAA_AgAIPEDAQAAAAH4A0AAAAAB-QNAAAAAAaoEAQAAAAGrBBAAAAABrARAAAAAAa0EQAAAAAGvBAAAAK8EAgNCAACXDwAglgUAAJgPACCcBQAATwAgBEIAAOoIADCWBQAA6wgAMJgFAADtCAAgnAUAAO4IADAOGQAArQgAIBoAAIcJACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGoBAEAAAABrQRAAAAAAa8EAAAAggUCtQQQAAAAAdYEAQAAAAH_BAEAAAABgAUBAAAAAYIFQAAAAAGDBQEAAAABAgAAAEgAIEIAAIYJACADAAAASAAgQgAAhgkAIEMAAIQJACABOwAAlg8AMAIAAABIACA7AACECQAgAgAAAKQIACA7AACDCQAgDPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIagEAQD0BwAhrQRAAPUHACGvBAAApwiCBSK1BBAApggAIdYEAQD0BwAh_wQBAPIHACGABQEA9AcAIYIFQACoCAAhgwUBAPQHACEOGQAAqggAIBoAAIUJACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGoBAEA9AcAIa0EQAD1BwAhrwQAAKcIggUitQQQAKYIACHWBAEA9AcAIf8EAQDyBwAhgAUBAPQHACGCBUAAqAgAIYMFAQD0BwAhB0IAAJEPACBDAACUDwAglgUAAJIPACCXBQAAkw8AIJoFAABKACCbBQAASgAgnAUAALoFACAOGQAArQgAIBoAAIcJACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGoBAEAAAABrQRAAAAAAa8EAAAAggUCtQQQAAAAAdYEAQAAAAH_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_BAEAogYAIcEEAADnB8EEIsIEAQAAAAHDBAEAAAABxAQBAAAAAccEAADpB8cEI8gEQACbBwAhyQRAAJsHACECAAAACwAgOwAAtAkAIAIAAACvCQAgOwAAsAkAIBLuAwAArgkAMO8DAACvCQAQ8AMAAK4JADDxAwEAiAcAIfgDQACSBgAh-QNAAJIGACGUBAEAiAcAIa8EAADoB8YEIr0EAQCIBwAhvgQQAJkHACG_BAEAogYAIcEEAADnB8EEIsIEAQCRBgAhwwQBAJEGACHEBAEAkQYAIccEAADpB8cEI8gEQACbBwAhyQRAAJsHACES7gMAAK4JADDvAwAArwkAEPADAACuCQAw8QMBAIgHACH4A0AAkgYAIfkDQACSBgAhlAQBAIgHACGvBAAA6AfGBCK9BAEAiAcAIb4EEACZBwAhvwQBAKIGACHBBAAA5wfBBCLCBAEAkQYAIcMEAQCRBgAhxAQBAJEGACHHBAAA6QfHBCPIBEAAmwcAIckEQACbBwAhDvEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIa8EAACyCcYEIr0EAQDyBwAhvgQQAJMJACG_BAEA8gcAIcEEAACxCcEEIsIEAQD0BwAhwwQBAPQHACHEBAEA9AcAIccEAACzCccEI8gEQACoCAAhyQRAAKgIACEBmQUAAADBBAIBmQUAAADGBAIBmQUAAADHBAMQBwAAtQkAIAkAALYJACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGvBAAAsgnGBCK9BAEA8gcAIb4EEACTCQAhvwQBAPIHACHBBAAAsQnBBCLCBAEA9AcAIcMEAQD0BwAhxAQBAPQHACHHBAAAswnHBCPIBEAAqAgAIckEQACoCAAhBUIAAPkOACBDAACCDwAglgUAAPoOACCXBQAAgQ8AIJwFAAAHACALQgAAtwkAMEMAALwJADCWBQAAuAkAMJcFAAC5CQAwmAUAALoJACCZBQAAuwkAMJoFAAC7CQAwmwUAALsJADCcBQAAuwkAMJ0FAAC9CQAwngUAAL4JADAFCgAAxAkAIPEDAQAAAAH4A0AAAAABuwQBAAAAAbwEEAAAAAECAAAADwAgQgAAwwkAIAMAAAAPACBCAADDCQAgQwAAwQkAIAE7AACADwAwCwgAAOUHACAKAADiBwAg7gMAAOQHADDvAwAADQAQ8AMAAOQHADDxAwEAAAAB-ANAAJIGACG6BAEAiAcAIbsEAQCIBwAhvAQQAJkHACGSBQAA4wcAIAIAAAAPACA7AADBCQAgAgAAAL8JACA7AADACQAgCO4DAAC-CQAw7wMAAL8JABDwAwAAvgkAMPEDAQCIBwAh-ANAAJIGACG6BAEAiAcAIbsEAQCIBwAhvAQQAJkHACEI7gMAAL4JADDvAwAAvwkAEPADAAC-CQAw8QMBAIgHACH4A0AAkgYAIboEAQCIBwAhuwQBAIgHACG8BBAAmQcAIQTxAwEA8gcAIfgDQAD1BwAhuwQBAPIHACG8BBAAkwkAIQUKAADCCQAg8QMBAPIHACH4A0AA9QcAIbsEAQDyBwAhvAQQAJMJACEFQgAA-w4AIEMAAP4OACCWBQAA_A4AIJcFAAD9DgAgnAUAAJcBACAFCgAAxAkAIPEDAQAAAAH4A0AAAAABuwQBAAAAAbwEEAAAAAEDQgAA-w4AIJYFAAD8DgAgnAUAAJcBACAQBwAAxgkAIAkAAMcJACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGvBAAAAMYEAr0EAQAAAAG-BBAAAAABvwQBAAAAAcEEAAAAwQQCwgQBAAAAAcMEAQAAAAHEBAEAAAABxwQAAADHBAPIBEAAAAAByQRAAAAAAQNCAAD5DgAglgUAAPoOACCcBQAABwAgBEIAALcJADCWBQAAuAkAMJgFAAC6CQAgnAUAALsJADAQDQAAmAoAIBAAAJYKACAzAACXCgAgNAAAmQoAIPEDAQAAAAH4A0AAAAAB-QNAAAAAAaQEAQAAAAGsBEAAAAABrwQAAADwBALwBEAAAAAB8QRAAAAAAfIEQAAAAAHzBCAAAAAB9AQgAAAAAfUEIAAAAAECAAAABwAgQgAAlQoAIAMAAAAHACBCAACVCgAgQwAA0wkAIAE7AAD4DgAwFgYAAJMGACANAACoBgAgEAAAuQcAIDMAAO0HACA0AACvBgAg7gMAAOsHADDvAwAABQAQ8AMAAOsHADDxAwEAAAAB-ANAAJIGACH5A0AAkgYAIZQEAQCIBwAhpAQBAIgHACGsBEAAmwcAIa8EAADsB_AEIvAEQACSBgAh8QRAAJsHACHyBEAAmwcAIfMEIAClBgAh9AQgAKUGACH1BCAApQYAIZMFAADqBwAgAgAAAAcAIDsAANMJACACAAAA0AkAIDsAANEJACAQ7gMAAM8JADDvAwAA0AkAEPADAADPCQAw8QMBAIgHACH4A0AAkgYAIfkDQACSBgAhlAQBAIgHACGkBAEAiAcAIawEQACbBwAhrwQAAOwH8AQi8ARAAJIGACHxBEAAmwcAIfIEQACbBwAh8wQgAKUGACH0BCAApQYAIfUEIAClBgAhEO4DAADPCQAw7wMAANAJABDwAwAAzwkAMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIZQEAQCIBwAhpAQBAIgHACGsBEAAmwcAIa8EAADsB_AEIvAEQACSBgAh8QRAAJsHACHyBEAAmwcAIfMEIAClBgAh9AQgAKUGACH1BCAApQYAIQzxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGkBAEA8gcAIawEQACoCAAhrwQAANIJ8AQi8ARAAPUHACHxBEAAqAgAIfIEQACoCAAh8wQgAIMIACH0BCAAgwgAIfUEIACDCAAhAZkFAAAA8AQCEA0AANYJACAQAADUCQAgMwAA1QkAIDQAANcJACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGkBAEA8gcAIawEQACoCAAhrwQAANIJ8AQi8ARAAPUHACHxBEAAqAgAIfIEQACoCAAh8wQgAIMIACH0BCAAgwgAIfUEIACDCAAhBUIAANoOACBDAAD2DgAglgUAANsOACCXBQAA9Q4AIJwFAAAfACALQgAA7gkAMEMAAPMJADCWBQAA7wkAMJcFAADwCQAwmAUAAPEJACCZBQAA8gkAMJoFAADyCQAwmwUAAPIJADCcBQAA8gkAMJ0FAAD0CQAwngUAAPUJADALQgAA4wkAMEMAAOcJADCWBQAA5AkAMJcFAADlCQAwmAUAAOYJACCZBQAAqwkAMJoFAACrCQAwmwUAAKsJADCcBQAAqwkAMJ0FAADoCQAwngUAAK4JADALQgAA2AkAMEMAANwJADCWBQAA2QkAMJcFAADaCQAwmAUAANsJACCZBQAAswgAMJoFAACzCAAwmwUAALMIADCcBQAAswgAMJ0FAADdCQAwngUAALYIADAHNQAA4gkAIPEDAQAAAAH4A0AAAAABhwUBAAAAAYkFAAAAiQUCiwUAAACLBQKMBQEAAAABAgAAAAEAIEIAAOEJACADAAAAAQAgQgAA4QkAIEMAAN8JACABOwAA9A4AMAIAAAABACA7AADfCQAgAgAAALcIACA7AADeCQAgBvEDAQDyBwAh-ANAAPUHACGHBQEA8gcAIYkFAAC5CIkFIosFAAC6CIsFIowFAQD0BwAhBzUAAOAJACDxAwEA8gcAIfgDQAD1BwAhhwUBAPIHACGJBQAAuQiJBSKLBQAAugiLBSKMBQEA9AcAIQVCAADvDgAgQwAA8g4AIJYFAADwDgAglwUAAPEOACCcBQAAugUAIAc1AADiCQAg8QMBAAAAAfgDQAAAAAGHBQEAAAABiQUAAACJBQKLBQAAAIsFAowFAQAAAAEDQgAA7w4AIJYFAADwDgAgnAUAALoFACAQBgAA7QkAIAkAAMcJACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGUBAEAAAABrwQAAADGBAK-BBAAAAABvwQBAAAAAcEEAAAAwQQCwgQBAAAAAcMEAQAAAAHEBAEAAAABxwQAAADHBAPIBEAAAAAByQRAAAAAAQIAAAALACBCAADsCQAgAwAAAAsAIEIAAOwJACBDAADqCQAgATsAAO4OADACAAAACwAgOwAA6gkAIAIAAACvCQAgOwAA6QkAIA7xAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGUBAEA8gcAIa8EAACyCcYEIr4EEACTCQAhvwQBAPIHACHBBAAAsQnBBCLCBAEA9AcAIcMEAQD0BwAhxAQBAPQHACHHBAAAswnHBCPIBEAAqAgAIckEQACoCAAhEAYAAOsJACAJAAC2CQAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhlAQBAPIHACGvBAAAsgnGBCK-BBAAkwkAIb8EAQDyBwAhwQQAALEJwQQiwgQBAPQHACHDBAEA9AcAIcQEAQD0BwAhxwQAALMJxwQjyARAAKgIACHJBEAAqAgAIQVCAADpDgAgQwAA7A4AIJYFAADqDgAglwUAAOsOACCcBQAAugUAIBAGAADtCQAgCQAAxwkAIPEDAQAAAAH4A0AAAAAB-QNAAAAAAZQEAQAAAAGvBAAAAMYEAr4EEAAAAAG_BAEAAAABwQQAAADBBALCBAEAAAABwwQBAAAAAcQEAQAAAAHHBAAAAMcEA8gEQAAAAAHJBEAAAAABA0IAAOkOACCWBQAA6g4AIJwFAAC6BQAgDQkAAJMKACALAACUCgAg8QMBAAAAAfgDQAAAAAH5A0AAAAABrwQAAADvBAK-BBAAAAABvwQBAAAAAcgEQAAAAAHqBEAAAAAB6wRAAAAAAewEQAAAAAHtBEAAAAABAgAAAJcBACBCAACSCgAgAwAAAJcBACBCAACSCgAgQwAA-QkAIAE7AADoDgAwEwcAAJwHACAJAACdBwAgCwAArgYAIO4DAACYBwAw7wMAAJUBABDwAwAAmAcAMPEDAQAAAAH4A0AAkgYAIfkDQACSBgAhrwQAAJoH7wQivQQBAIgHACG-BBAAmQcAIb8EAQCiBgAhyARAAJsHACHqBEAAkgYAIesEQACSBgAh7ARAAJIGACHtBEAAkgYAIY0FAACXBwAgAgAAAJcBACA7AAD5CQAgAgAAAPYJACA7AAD3CQAgD-4DAAD1CQAw7wMAAPYJABDwAwAA9QkAMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIa8EAACaB-8EIr0EAQCIBwAhvgQQAJkHACG_BAEAogYAIcgEQACbBwAh6gRAAJIGACHrBEAAkgYAIewEQACSBgAh7QRAAJIGACEP7gMAAPUJADDvAwAA9gkAEPADAAD1CQAw8QMBAIgHACH4A0AAkgYAIfkDQACSBgAhrwQAAJoH7wQivQQBAIgHACG-BBAAmQcAIb8EAQCiBgAhyARAAJsHACHqBEAAkgYAIesEQACSBgAh7ARAAJIGACHtBEAAkgYAIQvxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGvBAAA-AnvBCK-BBAAkwkAIb8EAQDyBwAhyARAAKgIACHqBEAA9QcAIesEQAD1BwAh7ARAAPUHACHtBEAA9QcAIQGZBQAAAO8EAg0JAAD6CQAgCwAA-wkAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIa8EAAD4Ce8EIr4EEACTCQAhvwQBAPIHACHIBEAAqAgAIeoEQAD1BwAh6wRAAPUHACHsBEAA9QcAIe0EQAD1BwAhC0IAAIcKADBDAACLCgAwlgUAAIgKADCXBQAAiQoAMJgFAACKCgAgmQUAALsJADCaBQAAuwkAMJsFAAC7CQAwnAUAALsJADCdBQAAjAoAMJ4FAAC-CQAwC0IAAPwJADBDAACACgAwlgUAAP0JADCXBQAA_gkAMJgFAAD_CQAgmQUAAMMIADCaBQAAwwgAMJsFAADDCAAwnAUAAMMIADCdBQAAgQoAMJ4FAADGCAAwCAEAAIYKACDxAwEAAAAB8gMBAAAAAfgDQAAAAAGvBAAAAM8EAsoEQAAAAAHLBEAAAAABzQQAAADNBAICAAAAFAAgQgAAhQoAIAMAAAAUACBCAACFCgAgQwAAgwoAIAE7AADnDgAwAgAAABQAIDsAAIMKACACAAAAxwgAIDsAAIIKACAH8QMBAPIHACHyAwEA8gcAIfgDQAD1BwAhrwQAAMoIzwQiygRAAPUHACHLBEAAqAgAIc0EAADJCM0EIggBAACECgAg8QMBAPIHACHyAwEA8gcAIfgDQAD1BwAhrwQAAMoIzwQiygRAAPUHACHLBEAAqAgAIc0EAADJCM0EIgVCAADiDgAgQwAA5Q4AIJYFAADjDgAglwUAAOQOACCcBQAAugUAIAgBAACGCgAg8QMBAAAAAfIDAQAAAAH4A0AAAAABrwQAAADPBALKBEAAAAABywRAAAAAAc0EAAAAzQQCA0IAAOIOACCWBQAA4w4AIJwFAAC6BQAgBQgAAJEKACDxAwEAAAAB-ANAAAAAAboEAQAAAAG8BBAAAAABAgAAAA8AIEIAAJAKACADAAAADwAgQgAAkAoAIEMAAI4KACABOwAA4Q4AMAIAAAAPACA7AACOCgAgAgAAAL8JACA7AACNCgAgBPEDAQDyBwAh-ANAAPUHACG6BAEA8gcAIbwEEACTCQAhBQgAAI8KACDxAwEA8gcAIfgDQAD1BwAhugQBAPIHACG8BBAAkwkAIQVCAADcDgAgQwAA3w4AIJYFAADdDgAglwUAAN4OACCcBQAACwAgBQgAAJEKACDxAwEAAAAB-ANAAAAAAboEAQAAAAG8BBAAAAABA0IAANwOACCWBQAA3Q4AIJwFAAALACANCQAAkwoAIAsAAJQKACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGvBAAAAO8EAr4EEAAAAAG_BAEAAAAByARAAAAAAeoEQAAAAAHrBEAAAAAB7ARAAAAAAe0EQAAAAAEEQgAAhwoAMJYFAACICgAwmAUAAIoKACCcBQAAuwkAMARCAAD8CQAwlgUAAP0JADCYBQAA_wkAIJwFAADDCAAwEA0AAJgKACAQAACWCgAgMwAAlwoAIDQAAJkKACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGkBAEAAAABrARAAAAAAa8EAAAA8AQC8ARAAAAAAfEEQAAAAAHyBEAAAAAB8wQgAAAAAfQEIAAAAAH1BCAAAAABA0IAANoOACCWBQAA2w4AIJwFAAAfACAEQgAA7gkAMJYFAADvCQAwmAUAAPEJACCcBQAA8gkAMARCAADjCQAwlgUAAOQJADCYBQAA5gkAIJwFAACrCQAwBEIAANgJADCWBQAA2QkAMJgFAADbCQAgnAUAALMIADAH8QMBAAAAAfQDAAAA9AMC9QMBAAAAAfYDAQAAAAH3AwEAAAAB-ANAAAAAAfkDQAAAAAECAAAA6AUAIEIAAJoKACADAAAAAwAgQgAAmgoAIEMAAJ4KACAJAAAAAwAgOwAAngoAIPEDAQDyBwAh9AMAAPMH9AMi9QMBAPQHACH2AwEA9AcAIfcDAQD0BwAh-ANAAPUHACH5A0AA9QcAIQfxAwEA8gcAIfQDAADzB_QDIvUDAQD0BwAh9gMBAPQHACH3AwEA9AcAIfgDQAD1BwAh-QNAAPUHACEDQgAAmgoAIJYFAACbCgAgnAUAAOgFACAEQgAAyAkAMJYFAADJCQAwmAUAAMsJACCcBQAAzAkAMARCAACnCQAwlgUAAKgJADCYBQAAqgkAIJwFAACrCQAwBEIAAJgJADCWBQAAmQkAMJgFAACbCQAgnAUAAJwJADAEQgAAiAkAMJYFAACJCQAwmAUAAIsJACCcBQAAjAkAMARCAAD9CAAwlgUAAP4IADCYBQAAgAkAIJwFAACgCAAwBEIAANwIADCWBQAA3QgAMJgFAADfCAAgnAUAAOAIADAEQgAAzwgAMJYFAADQCAAwmAUAANIIACCcBQAA0wgAMARCAAC_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_uAwAA7woAMO8DAADwCgAQ8AMAAO8KADDxAwEAiAcAIfgDQACSBgAh-QNAAJIGACGaBAEAiAcAIZsEAQCiBgAhnAQBAJEGACGeBAAAyAeeBCKfBAEAkQYAIaAEAQCRBgAhoQQCALgHACGiBAIAswcAIaMEIAClBgAhD-4DAADvCgAw7wMAAPAKABDwAwAA7woAMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIZoEAQCIBwAhmwQBAKIGACGcBAEAkQYAIZ4EAADIB54EIp8EAQCRBgAhoAQBAJEGACGhBAIAuAcAIaIEAgCzBwAhowQgAKUGACEL8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhmwQBAPIHACGcBAEA9AcAIZ4EAADCCp4EIp8EAQD0BwAhoAQBAPQHACGhBAIAwwoAIaIEAgCSCQAhowQgAIMIACEMFQAAxQoAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZsEAQDyBwAhnAQBAPQHACGeBAAAwgqeBCKfBAEA9AcAIaAEAQD0BwAhoQQCAMMKACGiBAIAkgkAIaMEIACDCAAhDBUAANAKACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGbBAEAAAABnAQBAAAAAZ4EAAAAngQCnwQBAAAAAaAEAQAAAAGhBAIAAAABogQCAAAAAaMEIAAAAAEDQgAAww4AIJYFAADEDgAgnAUAAB8AIARCAADoCgAwlgUAAOkKADCYBQAA6woAIJwFAADsCgAwBEIAANkKADCWBQAA2goAMJgFAADcCgAgnAUAAN0KADAAAAAAAAVCAAC-DgAgQwAAwQ4AIJYFAAC_DgAglwUAAMAOACCcBQAAZgAgA0IAAL4OACCWBQAAvw4AIJwFAABmACAAAAAAAAVCAAC5DgAgQwAAvA4AIJYFAAC6DgAglwUAALsOACCcBQAAugUAIANCAAC5DgAglgUAALoOACCcBQAAugUAIAAAAAAABUIAALMOACBDAAC3DgAglgUAALQOACCXBQAAtg4AIJwFAABTACALQgAAjAsAMEMAAJALADCWBQAAjQsAMJcFAACOCwAwmAUAAI8LACCZBQAA7ggAMJoFAADuCAAwmwUAAO4IADCcBQAA7ggAMJ0FAACRCwAwngUAAPEIADAJHgAA-AgAICAAAP0KACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGlBAEAAAABpgQBAAAAAagEAQAAAAGpBBAAAAABAgAAAFsAIEIAAJQLACADAAAAWwAgQgAAlAsAIEMAAJMLACABOwAAtQ4AMAIAAABbACA7AACTCwAgAgAAAPIIACA7AACSCwAgB_EDAQDyBwAh-ANAAPUHACH5A0AA9QcAIaUEAQDyBwAhpgQBAPIHACGoBAEA9AcAIakEEACmCAAhCR4AAPUIACAgAAD8CgAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhpQQBAPIHACGmBAEA8gcAIagEAQD0BwAhqQQQAKYIACEJHgAA-AgAICAAAP0KACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGlBAEAAAABpgQBAAAAAagEAQAAAAGpBBAAAAABA0IAALMOACCWBQAAtA4AIJwFAABTACAEQgAAjAsAMJYFAACNCwAwmAUAAI8LACCcBQAA7ggAMAAAAAAAAZkFAAAAtAQCBUIAAKwOACBDAACxDgAglgUAAK0OACCXBQAAsA4AIJwFAABPACALQgAAqQsAMEMAAK4LADCWBQAAqgsAMJcFAACrCwAwmAUAAKwLACCZBQAArQsAMJoFAACtCwAwmwUAAK0LADCcBQAArQsAMJ0FAACvCwAwngUAALALADALQgAAoAsAMEMAAKQLADCWBQAAoQsAMJcFAACiCwAwmAUAAKMLACCZBQAA7ggAMJoFAADuCAAwmwUAAO4IADCcBQAA7ggAMJ0FAAClCwAwngUAAPEIADAJIAAA_QoAICEAAPkIACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGlBAEAAAABpwQBAAAAAagEAQAAAAGpBBAAAAABAgAAAFsAIEIAAKgLACADAAAAWwAgQgAAqAsAIEMAAKcLACABOwAArw4AMAIAAABbACA7AACnCwAgAgAAAPIIACA7AACmCwAgB_EDAQDyBwAh-ANAAPUHACH5A0AA9QcAIaUEAQDyBwAhpwQBAPQHACGoBAEA9AcAIakEEACmCAAhCSAAAPwKACAhAAD2CAAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhpQQBAPIHACGnBAEA9AcAIagEAQD0BwAhqQQQAKYIACEJIAAA_QoAICEAAPkIACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGlBAEAAAABpwQBAAAAAagEAQAAAAGpBBAAAAABBR8AAJYLACDxAwEAAAABogQCAAAAAbAEAQAAAAGxBCAAAAABAgAAAFcAIEIAALQLACADAAAAVwAgQgAAtAsAIEMAALMLACABOwAArg4AMAoeAACwBwAgHwAArAcAIO4DAACyBwAw7wMAAFUAEPADAACyBwAw8QMBAAAAAaIEAgCzBwAhpgQBAIgHACGwBAEAogYAIbEEIAClBgAhAgAAAFcAIDsAALMLACACAAAAsQsAIDsAALILACAI7gMAALALADDvAwAAsQsAEPADAACwCwAw8QMBAIgHACGiBAIAswcAIaYEAQCIBwAhsAQBAKIGACGxBCAApQYAIQjuAwAAsAsAMO8DAACxCwAQ8AMAALALADDxAwEAiAcAIaIEAgCzBwAhpgQBAIgHACGwBAEAogYAIbEEIAClBgAhBPEDAQDyBwAhogQCAJIJACGwBAEA8gcAIbEEIACDCAAhBR8AAIsLACDxAwEA8gcAIaIEAgCSCQAhsAQBAPIHACGxBCAAgwgAIQUfAACWCwAg8QMBAAAAAaIEAgAAAAGwBAEAAAABsQQgAAAAAQNCAACsDgAglgUAAK0OACCcBQAATwAgBEIAAKkLADCWBQAAqgsAMJgFAACsCwAgnAUAAK0LADAEQgAAoAsAMJYFAAChCwAwmAUAAKMLACCcBQAA7ggAMAAAAAAABUIAAKUOACBDAACqDgAglgUAAKYOACCXBQAAqQ4AIJwFAAAfACALQgAAyQsAMEMAAM4LADCWBQAAygsAMJcFAADLCwAwmAUAAMwLACCZBQAAzQsAMJoFAADNCwAwmwUAAM0LADCcBQAAzQsAMJ0FAADPCwAwngUAANALADALQgAAwAsAMEMAAMQLADCWBQAAwQsAMJcFAADCCwAwmAUAAMMLACCZBQAA4AgAMJoFAADgCAAwmwUAAOAIADCcBQAA4AgAMJ0FAADFCwAwngUAAOMIADAKBgAAhAsAIB8AAPwIACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGUBAEAAAABqwQQAAAAAawEQAAAAAGtBEAAAAABrwQAAACvBAICAAAAZgAgQgAAyAsAIAMAAABmACBCAADICwAgQwAAxwsAIAE7AACoDgAwAgAAAGYAIDsAAMcLACACAAAA5AgAIDsAAMYLACAI8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhlAQBAPIHACGrBBAApggAIawEQAD1BwAhrQRAAKgIACGvBAAA5givBCIKBgAAgwsAIB8AAOkIACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGUBAEA8gcAIasEEACmCAAhrARAAPUHACGtBEAAqAgAIa8EAADmCK8EIgoGAACECwAgHwAA_AgAIPEDAQAAAAH4A0AAAAAB-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_AvjBCLeBAEA9AcAId8EQAD1BwAh4ARAAPUHACHhBAEA9AcAIQwQAAD9CwAgKAAA_wsAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZsEAQDyBwAhpAQBAPIHACGvBAAA_AvjBCLeBAEA9AcAId8EQAD1BwAh4ARAAPUHACHhBAEA9AcAIQwQAACJDAAgKAAAiwwAIPEDAQAAAAH4A0AAAAAB-QNAAAAAAZsEAQAAAAGkBAEAAAABrwQAAADjBALeBAEAAAAB3wRAAAAAAeAEQAAAAAHhBAEAAAABA0IAAIAOACCWBQAAgQ4AIJwFAAAfACAEQgAAkgwAMJYFAACTDAAwmAUAAJUMACCcBQAAlgwAMAAAAAAABUIAAPsNACBDAAD-DQAglgUAAPwNACCXBQAA_Q0AIJwFAAAHACADQgAA-w0AIJYFAAD8DQAgnAUAAAcAIAAAAAVCAAD2DQAgQwAA-Q0AIJYFAAD3DQAglwUAAPgNACCcBQAAugUAIANCAAD2DQAglgUAAPcNACCcBQAAugUAIAAAAAAAAZkFAAAA_QQCBUIAAOgNACBDAAD0DQAglgUAAOkNACCXBQAA8w0AIJwFAADhAQAgC0IAAJQNADBDAACYDQAwlgUAAJUNADCXBQAAlg0AMJgFAACXDQAgmQUAAMwJADCaBQAAzAkAMJsFAADMCQAwnAUAAMwJADCdBQAAmQ0AMJ4FAADPCQAwC0IAAIgNADBDAACNDQAwlgUAAIkNADCXBQAAig0AMJgFAACLDQAgmQUAAIwNADCaBQAAjA0AMJsFAACMDQAwnAUAAIwNADCdBQAAjg0AMJ4FAACPDQAwC0IAAP8MADBDAACDDQAwlgUAAIANADCXBQAAgQ0AMJgFAACCDQAgmQUAAJYMADCaBQAAlgwAMJsFAACWDAAwnAUAAJYMADCdBQAAhA0AMJ4FAACZDAAwC0IAAPMMADBDAAD4DAAwlgUAAPQMADCXBQAA9QwAMJgFAAD2DAAgmQUAAPcMADCaBQAA9wwAMJsFAAD3DAAwnAUAAPcMADCdBQAA-QwAMJ4FAAD6DAAwC0IAAOoMADBDAADuDAAwlgUAAOsMADCXBQAA7AwAMJgFAADtDAAgmQUAAN0KADCaBQAA3QoAMJsFAADdCgAwnAUAAN0KADCdBQAA7wwAMJ4FAADgCgAwC0IAANMMADBDAADYDAAwlgUAANQMADCXBQAA1QwAMJgFAADWDAAgmQUAANcMADCaBQAA1wwAMJsFAADXDAAwnAUAANcMADCdBQAA2QwAMJ4FAADaDAAwC0IAAMcMADBDAADMDAAwlgUAAMgMADCXBQAAyQwAMJgFAADKDAAgmQUAAMsMADCaBQAAywwAMJsFAADLDAAwnAUAAMsMADCdBQAAzQwAMJ4FAADODAAwC0IAALsMADBDAADADAAwlgUAALwMADCXBQAAvQwAMJgFAAC-DAAgmQUAAL8MADCaBQAAvwwAMJsFAAC_DAAwnAUAAL8MADCdBQAAwQwAMJ4FAADCDAAwB_EDAQAAAAH4A0AAAAAB-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_QwAIAIAAAD7DAAgOwAA_AwAIAvuAwAA-gwAMO8DAAD7DAAQ8AMAAPoMADDxAwEAiAcAIfgDQACSBgAh-QNAAJIGACGbBAEAogYAIZwEAQCRBgAhogQCALMHACGjBCAApQYAIaQEAQCIBwAhC-4DAAD6DAAw7wMAAPsMABDwAwAA-gwAMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIZsEAQCiBgAhnAQBAJEGACGiBAIAswcAIaMEIAClBgAhpAQBAIgHACEH8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhmwQBAPIHACGcBAEA9AcAIaIEAgCSCQAhowQgAIMIACEJFgAA1woAIBcAANgKACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGbBAEA8gcAIZwEAQD0BwAhogQCAJIJACGjBCAAgwgAIQkWAAD1CgAgFwAA9goAIPEDAQAAAAH4A0AAAAAB-QNAAAAAAZsEAQAAAAGcBAEAAAABogQCAAAAAaMEIAAAAAEMJwAAigwAICgAAIsMACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGbBAEAAAABrwQAAADjBALdBAEAAAAB3gQBAAAAAd8EQAAAAAHgBEAAAAAB4QQBAAAAAQIAAAApACBCAACHDQAgAwAAACkAIEIAAIcNACBDAACGDQAgATsAAOwNADACAAAAKQAgOwAAhg0AIAIAAACaDAAgOwAAhQ0AIArxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGbBAEA8gcAIa8EAAD8C-MEIt0EAQD0BwAh3gQBAPQHACHfBEAA9QcAIeAEQAD1BwAh4QQBAPQHACEMJwAA_gsAICgAAP8LACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGbBAEA8gcAIa8EAAD8C-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_DAAwAAAAC0IAAKoNADBDAACvDQAwlgUAAKsNADCXBQAArA0AMJgFAACtDQAgmQUAAK4NADCaBQAArg0AMJsFAACuDQAwnAUAAK4NADCdBQAAsA0AMJ4FAACxDQAwEgUAAJ4NACARAACgDQAgEgAAnw0AIBcAAKINACAYAAChDQAgHAAAow0AICUAAKQNACAmAAClDQAg8QMBAAAAAfgDQAAAAAH5A0AAAAABmwQBAAAAAa8EAAAA_QQC9wQQAAAAAfgEAgAAAAH5BEAAAAAB-gRAAAAAAfsEIAAAAAECAAAAHwAgQgAAtQ0AIAMAAAAfACBCAAC1DQAgQwAAtA0AIAE7AADnDQAwFwUAAKcGACAPAADVBwAgEQAA0gcAIBIAANYHACAXAADMBwAgGAAA1wcAIBwAANgHACAlAADZBwAgJgAA2gcAIO4DAADTBwAw7wMAAB0AEPADAADTBwAw8QMBAAAAAfgDQACSBgAh-QNAAJIGACGbBAEAogYAIa8EAADUB_0EIvYEAQCIBwAh9wQQAJkHACH4BAIAuAcAIfkEQACbBwAh-gRAAJsHACH7BCAApQYAIQIAAAAfACA7AAC0DQAgAgAAALINACA7AACzDQAgDu4DAACxDQAw7wMAALINABDwAwAAsQ0AMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIZsEAQCiBgAhrwQAANQH_QQi9gQBAIgHACH3BBAAmQcAIfgEAgC4BwAh-QRAAJsHACH6BEAAmwcAIfsEIAClBgAhDu4DAACxDQAw7wMAALINABDwAwAAsQ0AMPEDAQCIBwAh-ANAAJIGACH5A0AAkgYAIZsEAQCiBgAhrwQAANQH_QQi9gQBAIgHACH3BBAAmQcAIfgEAgC4BwAh-QRAAJsHACH6BEAAmwcAIfsEIAClBgAhCvEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZsEAQDyBwAhrwQAALEM_QQi9wQQAJMJACH4BAIAwwoAIfkEQACoCAAh-gRAAKgIACH7BCAAgwgAIRIFAACzDAAgEQAAtQwAIBIAALQMACAXAAC3DAAgGAAAtgwAIBwAALgMACAlAAC5DAAgJgAAugwAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZsEAQDyBwAhrwQAALEM_QQi9wQQAJMJACH4BAIAwwoAIfkEQACoCAAh-gRAAKgIACH7BCAAgwgAIRIFAACeDQAgEQAAoA0AIBIAAJ8NACAXAACiDQAgGAAAoQ0AIBwAAKMNACAlAACkDQAgJgAApQ0AIPEDAQAAAAH4A0AAAAAB-QNAAAAAAZsEAQAAAAGvBAAAAP0EAvcEEAAAAAH4BAIAAAAB-QRAAAAAAfoEQAAAAAH7BCAAAAABBEIAAKoNADCWBQAAqw0AMJgFAACtDQAgnAUAAK4NADAAAAAAAAAAAAAAAAVCAADiDQAgQwAA5Q0AIJYFAADjDQAglwUAAOQNACCcBQAAHwAgA0IAAOINACCWBQAA4w0AIJwFAAAfACAAAAAIBgAA-AcAIA0AAK0KACAQAADJDQAgMwAA4Q0AIDQAALQKACCsBAAA7gcAIPEEAADuBwAg8gQAAO4HACAADAUAAKwKACAPAADYDQAgEQAA1w0AIBIAANkNACAXAADVDQAgGAAA2g0AIBwAANsNACAlAADcDQAgJgAA3Q0AIPgEAADuBwAg-QQAAO4HACD6BAAA7gcAIAcQAADJDQAgIwAA0A0AICQAALEKACCcBAAA7gcAILcEAADuBwAguAQAAO4HACC5BAAA7gcAIAAFBgAA-AcAIB0AAMoNACAfAADLDQAgqwQAAO4HACCtBAAA7gcAIAMdAADKDQAgHwAAyw0AICIAAM8NACACHgAAzQ0AIB8AAMsNACAAAAQQAADJDQAgGwAAsAoAIIUFAADuBwAghgUAAO4HACAEEAAAyQ0AIBYAANQNACAXAADVDQAgnAQAAO4HACAGEwAA0g0AIBUAAK8KACCcBAAA7gcAIJ8EAADuBwAgoAQAAO4HACChBAAA7gcAIAAABBAAAMkNACARAADXDQAg6AQAAO4HACDpBAAA7gcAIAADDgAAtw0AIJwEAADuBwAg_gQAAO4HACAAAAAAAAYQAADJDQAgJwAA1g0AICgAAK4KACDdBAAA7gcAIN4EAADuBwAg4QQAAO4HACAEBwAAxw0AIAkAAMgNACALAACzCgAgyAQAAO4HACAJBgAA-AcAIAcAAMcNACAJAADIDQAgwgQAAO4HACDDBAAA7gcAIMQEAADuBwAgxwQAAO4HACDIBAAA7gcAIMkEAADuBwAgABMFAACeDQAgDwAAnQ0AIBEAAKANACASAACfDQAgFwAAog0AIBgAAKENACAlAACkDQAgJgAApQ0AIPEDAQAAAAH4A0AAAAAB-QNAAAAAAZsEAQAAAAGvBAAAAP0EAvYEAQAAAAH3BBAAAAAB-AQCAAAAAfkEQAAAAAH6BEAAAAAB-wQgAAAAAQIAAAAfACBCAADiDQAgAwAAAB0AIEIAAOINACBDAADmDQAgFQAAAB0AIAUAALMMACAPAACyDAAgEQAAtQwAIBIAALQMACAXAAC3DAAgGAAAtgwAICUAALkMACAmAAC6DAAgOwAA5g0AIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZsEAQDyBwAhrwQAALEM_QQi9gQBAPIHACH3BBAAkwkAIfgEAgDDCgAh-QRAAKgIACH6BEAAqAgAIfsEIACDCAAhEwUAALMMACAPAACyDAAgEQAAtQwAIBIAALQMACAXAAC3DAAgGAAAtgwAICUAALkMACAmAAC6DAAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhmwQBAPIHACGvBAAAsQz9BCL2BAEA8gcAIfcEEACTCQAh-AQCAMMKACH5BEAAqAgAIfoEQACoCAAh-wQgAIMIACEK8QMBAAAAAfgDQAAAAAH5A0AAAAABmwQBAAAAAa8EAAAA_QQC9wQQAAAAAfgEAgAAAAH5BEAAAAAB-gRAAAAAAfsEIAAAAAEJ8QMBAAAAAfQDAAAA9AMC-ANAAAAAAfkDQAAAAAGbBAEAAAABnAQBAAAAAaMEIAAAAAH9BAEAAAAB_gQBAAAAAQIAAADhAQAgQgAA6A0AIAzxAwEAAAAB-ANAAAAAAfkDQAAAAAGUBAEAAAABrARAAAAAAa8EAAAA8AQC8ARAAAAAAfEEQAAAAAHyBEAAAAAB8wQgAAAAAfQEIAAAAAH1BCAAAAABCvEDAQAAAAH4A0AAAAAB-QNAAAAAAZAEIAAAAAHkBAAAAOQEAuUEAQAAAAHmBAEAAAAB5wQBAAAAAegEQAAAAAHpBEAAAAABCvEDAQAAAAH4A0AAAAAB-QNAAAAAAZsEAQAAAAGvBAAAAOMEAt0EAQAAAAHeBAEAAAAB3wRAAAAAAeAEQAAAAAHhBAEAAAABB_EDAQAAAAH4A0AAAAAB-QNAAAAAAZsEAQAAAAGcBAEAAAABogQCAAAAAaMEIAAAAAEJ8QMBAAAAAfgDQAAAAAH5A0AAAAABmgQBAAAAAZsEAQAAAAGcBAEAAAABowQgAAAAAdYEAQAAAAHYBAAAANgEAgzxAwEAAAAB-ANAAAAAAfkDQAAAAAGUBAEAAAABqAQBAAAAAa0EQAAAAAGvBAAAAIIFArUEEAAAAAHWBAEAAAABgAUBAAAAAYIFQAAAAAGDBQEAAAABCfEDAQAAAAH4A0AAAAAB-QNAAAAAAZsEAQAAAAGjBCAAAAABtgQQAAAAAYQFAQAAAAGFBUAAAAABhgUBAAAAAQrxAwEAAAAB-ANAAAAAAfkDQAAAAAGbBAEAAAABnAQBAAAAAaMEIAAAAAG2BBAAAAABtwQCAAAAAbgEQAAAAAG5BEAAAAABB_EDAQAAAAH4A0AAAAAB-QNAAAAAAZsEAQAAAAGjBCAAAAAB1AQBAAAAAdUEQAAAAAEDAAAA5AEAIEIAAOgNACBDAAD1DQAgCwAAAOQBACA7AAD1DQAg8QMBAPIHACH0AwAA8wf0AyL4A0AA9QcAIfkDQAD1BwAhmwQBAPIHACGcBAEA9AcAIaMEIACDCAAh_QQBAPIHACH-BAEA9AcAIQnxAwEA8gcAIfQDAADzB_QDIvgDQAD1BwAh-QNAAPUHACGbBAEA8gcAIZwEAQD0BwAhowQgAIMIACH9BAEA8gcAIf4EAQD0BwAhFgIAAJ8KACANAAChCgAgKgAAogoAICsAAKMKACAsAACkCgAgLQAApQoAIC4AAKYKACAvAACnCgAgMAAAqAoAIDEAAKkKACAyAACqCgAg8QMBAAAAAfgDQAAAAAH5A0AAAAABhwQBAAAAAYgEAQAAAAGJBAEAAAABigQBAAAAAYwEAAAAjAQCjgQAAACOBAKPBAEAAAABkAQgAAAAAQIAAAC6BQAgQgAA9g0AIAMAAABKACBCAAD2DQAgQwAA-g0AIBgAAABKACACAACECAAgDQAAhggAICoAAIcIACArAACICAAgLAAAiQgAIC0AAIoIACAuAACLCAAgLwAAjAgAIDAAAI0IACAxAACOCAAgMgAAjwgAIDsAAPoNACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGHBAEA8gcAIYgEAQDyBwAhiQQBAPIHACGKBAEA9AcAIYwEAACBCIwEIo4EAACCCI4EIo8EAQD0BwAhkAQgAIMIACEWAgAAhAgAIA0AAIYIACAqAACHCAAgKwAAiAgAICwAAIkIACAtAACKCAAgLgAAiwgAIC8AAIwIACAwAACNCAAgMQAAjggAIDIAAI8IACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGHBAEA8gcAIYgEAQDyBwAhiQQBAPIHACGKBAEA9AcAIYwEAACBCIwEIo4EAACCCI4EIo8EAQD0BwAhkAQgAIMIACERBgAAqwwAIA0AAJgKACAQAACWCgAgNAAAmQoAIPEDAQAAAAH4A0AAAAAB-QNAAAAAAZQEAQAAAAGkBAEAAAABrARAAAAAAa8EAAAA8AQC8ARAAAAAAfEEQAAAAAHyBEAAAAAB8wQgAAAAAfQEIAAAAAH1BCAAAAABAgAAAAcAIEIAAPsNACADAAAABQAgQgAA-w0AIEMAAP8NACATAAAABQAgBgAAqgwAIA0AANYJACAQAADUCQAgNAAA1wkAIDsAAP8NACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGUBAEA8gcAIaQEAQDyBwAhrARAAKgIACGvBAAA0gnwBCLwBEAA9QcAIfEEQACoCAAh8gRAAKgIACHzBCAAgwgAIfQEIACDCAAh9QQgAIMIACERBgAAqgwAIA0AANYJACAQAADUCQAgNAAA1wkAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZQEAQDyBwAhpAQBAPIHACGsBEAAqAgAIa8EAADSCfAEIvAEQAD1BwAh8QRAAKgIACHyBEAAqAgAIfMEIACDCAAh9AQgAIMIACH1BCAAgwgAIRMFAACeDQAgDwAAnQ0AIBEAAKANACAXAACiDQAgGAAAoQ0AIBwAAKMNACAlAACkDQAgJgAApQ0AIPEDAQAAAAH4A0AAAAAB-QNAAAAAAZsEAQAAAAGvBAAAAP0EAvYEAQAAAAH3BBAAAAAB-AQCAAAAAfkEQAAAAAH6BEAAAAAB-wQgAAAAAQIAAAAfACBCAACADgAgCvEDAQAAAAH4A0AAAAAB-QNAAAAAAZsEAQAAAAGkBAEAAAABrwQAAADjBALeBAEAAAAB3wRAAAAAAeAEQAAAAAHhBAEAAAABAwAAAB0AIEIAAIAOACBDAACFDgAgFQAAAB0AIAUAALMMACAPAACyDAAgEQAAtQwAIBcAALcMACAYAAC2DAAgHAAAuAwAICUAALkMACAmAAC6DAAgOwAAhQ4AIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZsEAQDyBwAhrwQAALEM_QQi9gQBAPIHACH3BBAAkwkAIfgEAgDDCgAh-QRAAKgIACH6BEAAqAgAIfsEIACDCAAhEwUAALMMACAPAACyDAAgEQAAtQwAIBcAALcMACAYAAC2DAAgHAAAuAwAICUAALkMACAmAAC6DAAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhmwQBAPIHACGvBAAAsQz9BCL2BAEA8gcAIfcEEACTCQAh-AQCAMMKACH5BEAAqAgAIfoEQACoCAAh-wQgAIMIACEMEAAAngwAIPEDAQAAAAH4A0AAAAAB-QNAAAAAAZAEIAAAAAGkBAEAAAAB5AQAAADkBALlBAEAAAAB5gQBAAAAAecEAQAAAAHoBEAAAAAB6QRAAAAAAQIAAAAlACBCAACGDgAgEwUAAJ4NACAPAACdDQAgEgAAnw0AIBcAAKINACAYAAChDQAgHAAAow0AICUAAKQNACAmAAClDQAg8QMBAAAAAfgDQAAAAAH5A0AAAAABmwQBAAAAAa8EAAAA_QQC9gQBAAAAAfcEEAAAAAH4BAIAAAAB-QRAAAAAAfoEQAAAAAH7BCAAAAABAgAAAB8AIEIAAIgOACAF8QMBAAAAAZQEAQAAAAGvBAAAANsEAtsEQAAAAAHcBAEAAAABAwAAACMAIEIAAIYOACBDAACNDgAgDgAAACMAIBAAAJAMACA7AACNDgAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhkAQgAIMIACGkBAEA8gcAIeQEAACPDOQEIuUEAQDyBwAh5gQBAPIHACHnBAEA8gcAIegEQACoCAAh6QRAAKgIACEMEAAAkAwAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZAEIACDCAAhpAQBAPIHACHkBAAAjwzkBCLlBAEA8gcAIeYEAQDyBwAh5wQBAPIHACHoBEAAqAgAIekEQACoCAAhAwAAAB0AIEIAAIgOACBDAACQDgAgFQAAAB0AIAUAALMMACAPAACyDAAgEgAAtAwAIBcAALcMACAYAAC2DAAgHAAAuAwAICUAALkMACAmAAC6DAAgOwAAkA4AIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZsEAQDyBwAhrwQAALEM_QQi9gQBAPIHACH3BBAAkwkAIfgEAgDDCgAh-QRAAKgIACH6BEAAqAgAIfsEIACDCAAhEwUAALMMACAPAACyDAAgEgAAtAwAIBcAALcMACAYAAC2DAAgHAAAuAwAICUAALkMACAmAAC6DAAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhmwQBAPIHACGvBAAAsQz9BCL2BAEA8gcAIfcEEACTCQAh-AQCAMMKACH5BEAAqAgAIfoEQACoCAAh-wQgAIMIACEWAgAAnwoAIAUAAKAKACANAAChCgAgKwAAowoAICwAAKQKACAtAAClCgAgLgAApgoAIC8AAKcKACAwAACoCgAgMQAAqQoAIDIAAKoKACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGHBAEAAAABiAQBAAAAAYkEAQAAAAGKBAEAAAABjAQAAACMBAKOBAAAAI4EAo8EAQAAAAGQBCAAAAABAgAAALoFACBCAACRDgAgAwAAAEoAIEIAAJEOACBDAACVDgAgGAAAAEoAIAIAAIQIACAFAACFCAAgDQAAhggAICsAAIgIACAsAACJCAAgLQAAiggAIC4AAIsIACAvAACMCAAgMAAAjQgAIDEAAI4IACAyAACPCAAgOwAAlQ4AIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIYcEAQDyBwAhiAQBAPIHACGJBAEA8gcAIYoEAQD0BwAhjAQAAIEIjAQijgQAAIIIjgQijwQBAPQHACGQBCAAgwgAIRYCAACECAAgBQAAhQgAIA0AAIYIACArAACICAAgLAAAiQgAIC0AAIoIACAuAACLCAAgLwAAjAgAIDAAAI0IACAxAACOCAAgMgAAjwgAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIYcEAQDyBwAhiAQBAPIHACGJBAEA8gcAIYoEAQD0BwAhjAQAAIEIjAQijgQAAIIIjgQijwQBAPQHACGQBCAAgwgAIQoQAAD0CgAgFgAA9QoAIPEDAQAAAAH4A0AAAAAB-QNAAAAAAZsEAQAAAAGcBAEAAAABogQCAAAAAaMEIAAAAAGkBAEAAAABAgAAAC8AIEIAAJYOACADAAAALQAgQgAAlg4AIEMAAJoOACAMAAAALQAgEAAA1goAIBYAANcKACA7AACaDgAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhmwQBAPIHACGcBAEA9AcAIaIEAgCSCQAhowQgAIMIACGkBAEA8gcAIQoQAADWCgAgFgAA1woAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZsEAQDyBwAhnAQBAPQHACGiBAIAkgkAIaMEIACDCAAhpAQBAPIHACETBQAAng0AIA8AAJ0NACARAACgDQAgEgAAnw0AIBcAAKINACAYAAChDQAgHAAAow0AICUAAKQNACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGbBAEAAAABrwQAAAD9BAL2BAEAAAAB9wQQAAAAAfgEAgAAAAH5BEAAAAAB-gRAAAAAAfsEIAAAAAECAAAAHwAgQgAAmw4AIAMAAAAdACBCAACbDgAgQwAAnw4AIBUAAAAdACAFAACzDAAgDwAAsgwAIBEAALUMACASAAC0DAAgFwAAtwwAIBgAALYMACAcAAC4DAAgJQAAuQwAIDsAAJ8OACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGbBAEA8gcAIa8EAACxDP0EIvYEAQDyBwAh9wQQAJMJACH4BAIAwwoAIfkEQACoCAAh-gRAAKgIACH7BCAAgwgAIRMFAACzDAAgDwAAsgwAIBEAALUMACASAAC0DAAgFwAAtwwAIBgAALYMACAcAAC4DAAgJQAAuQwAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZsEAQDyBwAhrwQAALEM_QQi9gQBAPIHACH3BBAAkwkAIfgEAgDDCgAh-QRAAKgIACH6BEAAqAgAIfsEIACDCAAhFgIAAJ8KACAFAACgCgAgDQAAoQoAICoAAKIKACArAACjCgAgLAAApAoAIC0AAKUKACAvAACnCgAgMAAAqAoAIDEAAKkKACAyAACqCgAg8QMBAAAAAfgDQAAAAAH5A0AAAAABhwQBAAAAAYgEAQAAAAGJBAEAAAABigQBAAAAAYwEAAAAjAQCjgQAAACOBAKPBAEAAAABkAQgAAAAAQIAAAC6BQAgQgAAoA4AIAMAAABKACBCAACgDgAgQwAApA4AIBgAAABKACACAACECAAgBQAAhQgAIA0AAIYIACAqAACHCAAgKwAAiAgAICwAAIkIACAtAACKCAAgLwAAjAgAIDAAAI0IACAxAACOCAAgMgAAjwgAIDsAAKQOACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGHBAEA8gcAIYgEAQDyBwAhiQQBAPIHACGKBAEA9AcAIYwEAACBCIwEIo4EAACCCI4EIo8EAQD0BwAhkAQgAIMIACEWAgAAhAgAIAUAAIUIACANAACGCAAgKgAAhwgAICsAAIgIACAsAACJCAAgLQAAiggAIC8AAIwIACAwAACNCAAgMQAAjggAIDIAAI8IACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGHBAEA8gcAIYgEAQDyBwAhiQQBAPIHACGKBAEA9AcAIYwEAACBCIwEIo4EAACCCI4EIo8EAQD0BwAhkAQgAIMIACETBQAAng0AIA8AAJ0NACARAACgDQAgEgAAnw0AIBcAAKINACAYAAChDQAgHAAAow0AICYAAKUNACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGbBAEAAAABrwQAAAD9BAL2BAEAAAAB9wQQAAAAAfgEAgAAAAH5BEAAAAAB-gRAAAAAAfsEIAAAAAECAAAAHwAgQgAApQ4AIAfxAwEAAAAB-ANAAAAAAfkDQAAAAAGiBAIAAAABsgQBAAAAAbQEAAAAtAQCtQQQAAAAAQjxAwEAAAAB-ANAAAAAAfkDQAAAAAGUBAEAAAABqwQQAAAAAawEQAAAAAGtBEAAAAABrwQAAACvBAIDAAAAHQAgQgAApQ4AIEMAAKsOACAVAAAAHQAgBQAAswwAIA8AALIMACARAAC1DAAgEgAAtAwAIBcAALcMACAYAAC2DAAgHAAAuAwAICYAALoMACA7AACrDgAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhmwQBAPIHACGvBAAAsQz9BCL2BAEA8gcAIfcEEACTCQAh-AQCAMMKACH5BEAAqAgAIfoEQACoCAAh-wQgAIMIACETBQAAswwAIA8AALIMACARAAC1DAAgEgAAtAwAIBcAALcMACAYAAC2DAAgHAAAuAwAICYAALoMACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGbBAEA8gcAIa8EAACxDP0EIvYEAQDyBwAh9wQQAJMJACH4BAIAwwoAIfkEQACoCAAh-gRAAKgIACH7BCAAgwgAIQ0QAADVCwAgJAAA1wsAIPEDAQAAAAH4A0AAAAAB-QNAAAAAAZsEAQAAAAGcBAEAAAABowQgAAAAAaQEAQAAAAG2BBAAAAABtwQCAAAAAbgEQAAAAAG5BEAAAAABAgAAAE8AIEIAAKwOACAE8QMBAAAAAaIEAgAAAAGwBAEAAAABsQQgAAAAAQfxAwEAAAAB-ANAAAAAAfkDQAAAAAGlBAEAAAABpwQBAAAAAagEAQAAAAGpBBAAAAABAwAAAE0AIEIAAKwOACBDAACyDgAgDwAAAE0AIBAAAL0LACAkAAC_CwAgOwAAsg4AIPEDAQDyBwAh-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-ANAAPUHACH5A0AA9QcAIZsEAQDyBwAhrwQAALEM_QQi9gQBAPIHACH3BBAAkwkAIfgEAgDDCgAh-QRAAKgIACH6BEAAqAgAIfsEIACDCAAhCfEDAQAAAAH4A0AAAAAB-QNAAAAAAZsEAQAAAAGcBAEAAAABowQgAAAAAaQEAQAAAAHWBAEAAAAB2AQAAADYBAIDAAAAHQAgQgAAww4AIEMAAM4OACAVAAAAHQAgBQAAswwAIA8AALIMACARAAC1DAAgEgAAtAwAIBcAALcMACAcAAC4DAAgJQAAuQwAICYAALoMACA7AADODgAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhmwQBAPIHACGvBAAAsQz9BCL2BAEA8gcAIfcEEACTCQAh-AQCAMMKACH5BEAAqAgAIfoEQACoCAAh-wQgAIMIACETBQAAswwAIA8AALIMACARAAC1DAAgEgAAtAwAIBcAALcMACAcAAC4DAAgJQAAuQwAICYAALoMACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGbBAEA8gcAIa8EAACxDP0EIvYEAQDyBwAh9wQQAJMJACH4BAIAwwoAIfkEQACoCAAh-gRAAKgIACH7BCAAgwgAIQoQAAD0CgAgFwAA9goAIPEDAQAAAAH4A0AAAAAB-QNAAAAAAZsEAQAAAAGcBAEAAAABogQCAAAAAaMEIAAAAAGkBAEAAAABAgAAAC8AIEIAAM8OACAI8QMBAAAAAfgDQAAAAAH5A0AAAAABlAQBAAAAAZYEAgAAAAGXBBAAAAABmAQgAAAAAZkEQAAAAAEDAAAALQAgQgAAzw4AIEMAANQOACAMAAAALQAgEAAA1goAIBcAANgKACA7AADUDgAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhmwQBAPIHACGcBAEA9AcAIaIEAgCSCQAhowQgAIMIACGkBAEA8gcAIQoQAADWCgAgFwAA2AoAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZsEAQDyBwAhnAQBAPQHACGiBAIAkgkAIaMEIACDCAAhpAQBAPIHACEWAgAAnwoAIAUAAKAKACANAAChCgAgKgAAogoAICwAAKQKACAtAAClCgAgLgAApgoAIC8AAKcKACAwAACoCgAgMQAAqQoAIDIAAKoKACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGHBAEAAAABiAQBAAAAAYkEAQAAAAGKBAEAAAABjAQAAACMBAKOBAAAAI4EAo8EAQAAAAGQBCAAAAABAgAAALoFACBCAADVDgAgAwAAAEoAIEIAANUOACBDAADZDgAgGAAAAEoAIAIAAIQIACAFAACFCAAgDQAAhggAICoAAIcIACAsAACJCAAgLQAAiggAIC4AAIsIACAvAACMCAAgMAAAjQgAIDEAAI4IACAyAACPCAAgOwAA2Q4AIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIYcEAQDyBwAhiAQBAPIHACGJBAEA8gcAIYoEAQD0BwAhjAQAAIEIjAQijgQAAIIIjgQijwQBAPQHACGQBCAAgwgAIRYCAACECAAgBQAAhQgAIA0AAIYIACAqAACHCAAgLAAAiQgAIC0AAIoIACAuAACLCAAgLwAAjAgAIDAAAI0IACAxAACOCAAgMgAAjwgAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIYcEAQDyBwAhiAQBAPIHACGJBAEA8gcAIYoEAQD0BwAhjAQAAIEIjAQijgQAAIIIjgQijwQBAPQHACGQBCAAgwgAIRMPAACdDQAgEQAAoA0AIBIAAJ8NACAXAACiDQAgGAAAoQ0AIBwAAKMNACAlAACkDQAgJgAApQ0AIPEDAQAAAAH4A0AAAAAB-QNAAAAAAZsEAQAAAAGvBAAAAP0EAvYEAQAAAAH3BBAAAAAB-AQCAAAAAfkEQAAAAAH6BEAAAAAB-wQgAAAAAQIAAAAfACBCAADaDgAgEQYAAO0JACAHAADGCQAg8QMBAAAAAfgDQAAAAAH5A0AAAAABlAQBAAAAAa8EAAAAxgQCvQQBAAAAAb4EEAAAAAG_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-ANAAPUHACH5A0AA9QcAIZsEAQDyBwAhrwQAALEM_QQi9gQBAPIHACH3BBAAkwkAIfgEAgDDCgAh-QRAAKgIACH6BEAAqAgAIfsEIACDCAAhDPEDAQAAAAH4A0AAAAAB-QNAAAAAAaQEAQAAAAGsBEAAAAABrwQAAADwBALwBEAAAAAB8QRAAAAAAfIEQAAAAAHzBCAAAAAB9AQgAAAAAfUEIAAAAAERBgAAqwwAIBAAAJYKACAzAACXCgAgNAAAmQoAIPEDAQAAAAH4A0AAAAAB-QNAAAAAAZQEAQAAAAGkBAEAAAABrARAAAAAAa8EAAAA8AQC8ARAAAAAAfEEQAAAAAHyBEAAAAAB8wQgAAAAAfQEIAAAAAH1BCAAAAABAgAAAAcAIEIAAPkOACAOBwAApgwAIAsAAJQKACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGvBAAAAO8EAr0EAQAAAAG-BBAAAAABvwQBAAAAAcgEQAAAAAHqBEAAAAAB6wRAAAAAAewEQAAAAAHtBEAAAAABAgAAAJcBACBCAAD7DgAgAwAAAJUBACBCAAD7DgAgQwAA_w4AIBAAAACVAQAgBwAApQwAIAsAAPsJACA7AAD_DgAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhrwQAAPgJ7wQivQQBAPIHACG-BBAAkwkAIb8EAQDyBwAhyARAAKgIACHqBEAA9QcAIesEQAD1BwAh7ARAAPUHACHtBEAA9QcAIQ4HAAClDAAgCwAA-wkAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIa8EAAD4Ce8EIr0EAQDyBwAhvgQQAJMJACG_BAEA8gcAIcgEQACoCAAh6gRAAPUHACHrBEAA9QcAIewEQAD1BwAh7QRAAPUHACEE8QMBAAAAAfgDQAAAAAG7BAEAAAABvAQQAAAAAQMAAAAFACBCAAD5DgAgQwAAgw8AIBMAAAAFACAGAACqDAAgEAAA1AkAIDMAANUJACA0AADXCQAgOwAAgw8AIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZQEAQDyBwAhpAQBAPIHACGsBEAAqAgAIa8EAADSCfAEIvAEQAD1BwAh8QRAAKgIACHyBEAAqAgAIfMEIACDCAAh9AQgAIMIACH1BCAAgwgAIREGAACqDAAgEAAA1AkAIDMAANUJACA0AADXCQAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhlAQBAPIHACGkBAEA8gcAIawEQACoCAAhrwQAANIJ8AQi8ARAAPUHACHxBEAAqAgAIfIEQACoCAAh8wQgAIMIACH0BCAAgwgAIfUEIACDCAAhDvEDAQAAAAH4A0AAAAAB-QNAAAAAAa8EAAAAxgQCvQQBAAAAAb4EEAAAAAG_BAEAAAABwQQAAADBBALCBAEAAAABwwQBAAAAAcQEAQAAAAHHBAAAAMcEA8gEQAAAAAHJBEAAAAABDRAAAIkMACAnAACKDAAg8QMBAAAAAfgDQAAAAAH5A0AAAAABmwQBAAAAAaQEAQAAAAGvBAAAAOMEAt0EAQAAAAHeBAEAAAAB3wRAAAAAAeAEQAAAAAHhBAEAAAABAgAAACkAIEIAAIUPACADAAAAJwAgQgAAhQ8AIEMAAIkPACAPAAAAJwAgEAAA_QsAICcAAP4LACA7AACJDwAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhmwQBAPIHACGkBAEA8gcAIa8EAAD8C-MEIt0EAQD0BwAh3gQBAPQHACHfBEAA9QcAIeAEQAD1BwAh4QQBAPQHACENEAAA_QsAICcAAP4LACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGbBAEA8gcAIaQEAQDyBwAhrwQAAPwL4wQi3QQBAPQHACHeBAEA9AcAId8EQAD1BwAh4ARAAPUHACHhBAEA9AcAIQXxAwEAAAABrwQAAADbBALZBAEAAAAB2wRAAAAAAdwEAQAAAAENEwAAzwoAIPEDAQAAAAH4A0AAAAAB-QNAAAAAAZoEAQAAAAGbBAEAAAABnAQBAAAAAZ4EAAAAngQCnwQBAAAAAaAEAQAAAAGhBAIAAAABogQCAAAAAaMEIAAAAAECAAAAMwAgQgAAiw8AIAMAAAAxACBCAACLDwAgQwAAjw8AIA8AAAAxACATAADECgAgOwAAjw8AIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZoEAQDyBwAhmwQBAPIHACGcBAEA9AcAIZ4EAADCCp4EIp8EAQD0BwAhoAQBAPQHACGhBAIAwwoAIaIEAgCSCQAhowQgAIMIACENEwAAxAoAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZoEAQDyBwAhmwQBAPIHACGcBAEA9AcAIZ4EAADCCp4EIp8EAQD0BwAhoAQBAPQHACGhBAIAwwoAIaIEAgCSCQAhowQgAIMIACEI8QMBAAAAAfgDQAAAAAH5A0AAAAABlQQBAAAAAZYEAgAAAAGXBBAAAAABmAQgAAAAAZkEQAAAAAEWAgAAnwoAIAUAAKAKACANAAChCgAgKgAAogoAICsAAKMKACAsAACkCgAgLQAApQoAIC4AAKYKACAvAACnCgAgMAAAqAoAIDIAAKoKACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGHBAEAAAABiAQBAAAAAYkEAQAAAAGKBAEAAAABjAQAAACMBAKOBAAAAI4EAo8EAQAAAAGQBCAAAAABAgAAALoFACBCAACRDwAgAwAAAEoAIEIAAJEPACBDAACVDwAgGAAAAEoAIAIAAIQIACAFAACFCAAgDQAAhggAICoAAIcIACArAACICAAgLAAAiQgAIC0AAIoIACAuAACLCAAgLwAAjAgAIDAAAI0IACAyAACPCAAgOwAAlQ8AIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIYcEAQDyBwAhiAQBAPIHACGJBAEA8gcAIYoEAQD0BwAhjAQAAIEIjAQijgQAAIIIjgQijwQBAPQHACGQBCAAgwgAIRYCAACECAAgBQAAhQgAIA0AAIYIACAqAACHCAAgKwAAiAgAICwAAIkIACAtAACKCAAgLgAAiwgAIC8AAIwIACAwAACNCAAgMgAAjwgAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIYcEAQDyBwAhiAQBAPIHACGJBAEA8gcAIYoEAQD0BwAhjAQAAIEIjAQijgQAAIIIjgQijwQBAPQHACGQBCAAgwgAIQzxAwEAAAAB-ANAAAAAAfkDQAAAAAGoBAEAAAABrQRAAAAAAa8EAAAAggUCtQQQAAAAAdYEAQAAAAH_BAEAAAABgAUBAAAAAYIFQAAAAAGDBQEAAAABDRAAANULACAjAADWCwAg8QMBAAAAAfgDQAAAAAH5A0AAAAABmwQBAAAAAZwEAQAAAAGjBCAAAAABpAQBAAAAAbYEEAAAAAG3BAIAAAABuARAAAAAAbkEQAAAAAECAAAATwAgQgAAlw8AIAYeAACVCwAg8QMBAAAAAaIEAgAAAAGmBAEAAAABsAQBAAAAAbEEIAAAAAECAAAAVwAgQgAAmQ8AIAodAAC1CwAgIgAAtgsAIPEDAQAAAAH4A0AAAAAB-QNAAAAAAaIEAgAAAAGqBAEAAAABsgQBAAAAAbQEAAAAtAQCtQQQAAAAAQIAAABTACBCAACbDwAgAwAAAFUAIEIAAJkPACBDAACfDwAgCAAAAFUAIB4AAIoLACA7AACfDwAg8QMBAPIHACGiBAIAkgkAIaYEAQDyBwAhsAQBAPIHACGxBCAAgwgAIQYeAACKCwAg8QMBAPIHACGiBAIAkgkAIaYEAQDyBwAhsAQBAPIHACGxBCAAgwgAIQMAAABRACBCAACbDwAgQwAAog8AIAwAAABRACAdAACdCwAgIgAAngsAIDsAAKIPACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGiBAIAkgkAIaoEAQDyBwAhsgQBAPIHACG0BAAAnAu0BCK1BBAAkwkAIQodAACdCwAgIgAAngsAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIaIEAgCSCQAhqgQBAPIHACGyBAEA8gcAIbQEAACcC7QEIrUEEACTCQAhB_EDAQAAAAH4A0AAAAAB-QNAAAAAAaYEAQAAAAGnBAEAAAABqAQBAAAAAakEEAAAAAEDAAAATQAgQgAAlw8AIEMAAKYPACAPAAAATQAgEAAAvQsAICMAAL4LACA7AACmDwAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhmwQBAPIHACGcBAEA9AcAIaMEIACDCAAhpAQBAPIHACG2BBAAkwkAIbcEAgDDCgAhuARAAKgIACG5BEAAqAgAIQ0QAAC9CwAgIwAAvgsAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZsEAQDyBwAhnAQBAPQHACGjBCAAgwgAIaQEAQDyBwAhtgQQAJMJACG3BAIAwwoAIbgEQACoCAAhuQRAAKgIACEI8QMBAAAAAfgDQAAAAAH5A0AAAAABqgQBAAAAAasEEAAAAAGsBEAAAAABrQRAAAAAAa8EAAAArwQCB_EDAQAAAAH4A0AAAAABmwQBAAAAAc8EAQAAAAHRBAAAANEEAtIEAQAAAAHTBEAAAAABDgcAAKYMACAJAACTCgAg8QMBAAAAAfgDQAAAAAH5A0AAAAABrwQAAADvBAK9BAEAAAABvgQQAAAAAb8EAQAAAAHIBEAAAAAB6gRAAAAAAesEQAAAAAHsBEAAAAAB7QRAAAAAAQIAAACXAQAgQgAAqQ8AIAMAAACVAQAgQgAAqQ8AIEMAAK0PACAQAAAAlQEAIAcAAKUMACAJAAD6CQAgOwAArQ8AIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIa8EAAD4Ce8EIr0EAQDyBwAhvgQQAJMJACG_BAEA8gcAIcgEQACoCAAh6gRAAPUHACHrBEAA9QcAIewEQAD1BwAh7QRAAPUHACEOBwAApQwAIAkAAPoJACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGvBAAA-AnvBCK9BAEA8gcAIb4EEACTCQAhvwQBAPIHACHIBEAAqAgAIeoEQAD1BwAh6wRAAPUHACHsBEAA9QcAIe0EQAD1BwAhB_EDAQAAAAH4A0AAAAABrwQAAADPBAK7BAEAAAABygRAAAAAAcsEQAAAAAHNBAAAAM0EAhEGAACrDAAgDQAAmAoAIBAAAJYKACAzAACXCgAg8QMBAAAAAfgDQAAAAAH5A0AAAAABlAQBAAAAAaQEAQAAAAGsBEAAAAABrwQAAADwBALwBEAAAAAB8QRAAAAAAfIEQAAAAAHzBCAAAAAB9AQgAAAAAfUEIAAAAAECAAAABwAgQgAArw8AIAMAAAAFACBCAACvDwAgQwAAsw8AIBMAAAAFACAGAACqDAAgDQAA1gkAIBAAANQJACAzAADVCQAgOwAAsw8AIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZQEAQDyBwAhpAQBAPIHACGsBEAAqAgAIa8EAADSCfAEIvAEQAD1BwAh8QRAAKgIACHyBEAAqAgAIfMEIACDCAAh9AQgAIMIACH1BCAAgwgAIREGAACqDAAgDQAA1gkAIBAAANQJACAzAADVCQAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhlAQBAPIHACGkBAEA8gcAIawEQACoCAAhrwQAANIJ8AQi8ARAAPUHACHxBEAAqAgAIfIEQACoCAAh8wQgAIMIACH0BCAAgwgAIfUEIACDCAAhBvEDAQAAAAH4A0AAAAABvQQBAAAAAYkFAAAAiQUCiwUAAACLBQKMBQEAAAABFgIAAJ8KACAFAACgCgAgDQAAoQoAICoAAKIKACArAACjCgAgLQAApQoAIC4AAKYKACAvAACnCgAgMAAAqAoAIDEAAKkKACAyAACqCgAg8QMBAAAAAfgDQAAAAAH5A0AAAAABhwQBAAAAAYgEAQAAAAGJBAEAAAABigQBAAAAAYwEAAAAjAQCjgQAAACOBAKPBAEAAAABkAQgAAAAAQIAAAC6BQAgQgAAtQ8AIAsQAADDDQAg8QMBAAAAAfgDQAAAAAH5A0AAAAABmwQBAAAAAaMEIAAAAAGkBAEAAAABtgQQAAAAAYQFAQAAAAGFBUAAAAABhgUBAAAAAQIAAABEACBCAAC3DwAgAwAAAEoAIEIAALUPACBDAAC7DwAgGAAAAEoAIAIAAIQIACAFAACFCAAgDQAAhggAICoAAIcIACArAACICAAgLQAAiggAIC4AAIsIACAvAACMCAAgMAAAjQgAIDEAAI4IACAyAACPCAAgOwAAuw8AIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIYcEAQDyBwAhiAQBAPIHACGJBAEA8gcAIYoEAQD0BwAhjAQAAIEIjAQijgQAAIIIjgQijwQBAPQHACGQBCAAgwgAIRYCAACECAAgBQAAhQgAIA0AAIYIACAqAACHCAAgKwAAiAgAIC0AAIoIACAuAACLCAAgLwAAjAgAIDAAAI0IACAxAACOCAAgMgAAjwgAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIYcEAQDyBwAhiAQBAPIHACGJBAEA8gcAIYoEAQD0BwAhjAQAAIEIjAQijgQAAIIIjgQijwQBAPQHACGQBCAAgwgAIQMAAABCACBCAAC3DwAgQwAAvg8AIA0AAABCACAQAADCDQAgOwAAvg8AIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIZsEAQDyBwAhowQgAIMIACGkBAEA8gcAIbYEEACTCQAhhAUBAPIHACGFBUAAqAgAIYYFAQD0BwAhCxAAAMINACDxAwEA8gcAIfgDQAD1BwAh-QNAAPUHACGbBAEA8gcAIaMEIACDCAAhpAQBAPIHACG2BBAAkwkAIYQFAQDyBwAhhQVAAKgIACGGBQEA9AcAIQzxAwEAAAAB-ANAAAAAAfkDQAAAAAGUBAEAAAABqAQBAAAAAa0EQAAAAAGvBAAAAIIFArUEEAAAAAHWBAEAAAAB_wQBAAAAAYAFAQAAAAGCBUAAAAABBPEDAQAAAAH4A0AAAAABhQQBAAAAAYYEQAAAAAEWAgAAnwoAIAUAAKAKACANAAChCgAgKgAAogoAICsAAKMKACAsAACkCgAgLQAApQoAIC4AAKYKACAvAACnCgAgMAAAqAoAIDEAAKkKACDxAwEAAAAB-ANAAAAAAfkDQAAAAAGHBAEAAAABiAQBAAAAAYkEAQAAAAGKBAEAAAABjAQAAACMBAKOBAAAAI4EAo8EAQAAAAGQBCAAAAABAgAAALoFACBCAADBDwAgAwAAAEoAIEIAAMEPACBDAADFDwAgGAAAAEoAIAIAAIQIACAFAACFCAAgDQAAhggAICoAAIcIACArAACICAAgLAAAiQgAIC0AAIoIACAuAACLCAAgLwAAjAgAIDAAAI0IACAxAACOCAAgOwAAxQ8AIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIYcEAQDyBwAhiAQBAPIHACGJBAEA8gcAIYoEAQD0BwAhjAQAAIEIjAQijgQAAIIIjgQijwQBAPQHACGQBCAAgwgAIRYCAACECAAgBQAAhQgAIA0AAIYIACAqAACHCAAgKwAAiAgAICwAAIkIACAtAACKCAAgLgAAiwgAIC8AAIwIACAwAACNCAAgMQAAjggAIPEDAQDyBwAh-ANAAPUHACH5A0AA9QcAIYcEAQDyBwAhiAQBAPIHACGJBAEA8gcAIYoEAQD0BwAhjAQAAIEIjAQijgQAAIIIjgQijwQBAPQHACGQBCAAgwgAIRYFAACgCgAgDQAAoQoAICoAAKIKACArAACjCgAgLAAApAoAIC0AAKUKACAuAACmCgAgLwAApwoAIDAAAKgKACAxAACpCgAgMgAAqgoAIPEDAQAAAAH4A0AAAAAB-QNAAAAAAYcEAQAAAAGIBAEAAAABiQQBAAAAAYoEAQAAAAGMBAAAAIwEAo4EAAAAjgQCjwQBAAAAAZAEIAAAAAECAAAAugUAIEIAAMYPACADAAAASgAgQgAAxg8AIEMAAMoPACAYAAAASgAgBQAAhQgAIA0AAIYIACAqAACHCAAgKwAAiAgAICwAAIkIACAtAACKCAAgLgAAiwgAIC8AAIwIACAwAACNCAAgMQAAjggAIDIAAI8IACA7AADKDwAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhhwQBAPIHACGIBAEA8gcAIYkEAQDyBwAhigQBAPQHACGMBAAAgQiMBCKOBAAAggiOBCKPBAEA9AcAIZAEIACDCAAhFgUAAIUIACANAACGCAAgKgAAhwgAICsAAIgIACAsAACJCAAgLQAAiggAIC4AAIsIACAvAACMCAAgMAAAjQgAIDEAAI4IACAyAACPCAAg8QMBAPIHACH4A0AA9QcAIfkDQAD1BwAhhwQBAPIHACGIBAEA8gcAIYkEAQDyBwAhigQBAPQHACGMBAAAgQiMBCKOBAAAggiOBCKPBAEA9AcAIZAEIACDCAAhAgcAAjUAAwYGAAMMACoNmQEFEAANM5gBBzSaAQENAgQEBQgCDAApDQwFKhwLK3oULHsZLXwfLoABJy-BAQgwhAEBMYUBGTKJASgBAQADBAYAAwcAAgkQBgwACgIIAAUKAAcEBwACCREGCxUIDAAJAgEAAwoABwIJFgALFwABCRgAAgYAAykADAQMACYQAA0ndxAoeAsKBSICDAAlDwAOESwMEiYQF0EWGDASHEUYJVAbJm0kAgwADw4gDQEOIQADDAAREAANESoMARErAAQMABcQAA0WNBMXPRYDDAAVEwASFTgUAgYAAxQAEwEVOQACEAANEz4SAhY_ABdAAAMMABoQAA0bSRkDBgADGQAYGksDARtMAAQMACMQAA0jVBwkZx8EDAAiHQAbH2EeIlgdAwwAIR4AHB9cHgMeABwgAB8hXx0EBgADDAAgHQAbH10eAR9eAAEfYAACH2MAImIAAiNoACRpAAEQbg0IBW8AEXEAEnAAF3MAGHIAHHQAJXUAJnYAASh5AAEBAAMBAQADCwWKAQANiwEAKowBACuNAQAsjgEALY8BAC6QAQAvkQEAMJIBADGTAQAylAEAAw2cAQAzmwEANJ0BAAACBwACNQADAgcAAjUAAwMMAC9IADBJADEAAAADDAAvSAAwSQAxARAADQEQAA0FDAA2SAA5SQA6WgA3WwA4AAAAAAAFDAA2SAA5SQA6WgA3WwA4AwYAAxkAGBrTAQMDBgADGQAYGtkBAwUMAD9IAEJJAENaAEBbAEEAAAAAAAUMAD9IAEJJAENaAEBbAEEAAAMMAEhIAElJAEoAAAADDABISABJSQBKAQ8ADgEPAA4FDABPSABSSQBTWgBQWwBRAAAAAAAFDABPSABSSQBTWgBQWwBRAgYAAxAADQIGAAMQAA0DDABYSABZSQBaAAAAAwwAWEgAWUkAWgEHAAIBBwACBQwAX0gAYkkAY1oAYFsAYQAAAAAABQwAX0gAYkkAY1oAYFsAYQEQAA0BEAANAwwAaEgAaUkAagAAAAMMAGhIAGlJAGoCEAANJ9wCEAIQAA0n4gIQAwwAb0gAcEkAcQAAAAMMAG9IAHBJAHECBgADKQAMAgYAAykADAMMAHZIAHdJAHgAAAADDAB2SAB3SQB4AhAADROKAxICEAANE5ADEgMMAH1IAH5JAH8AAAADDAB9SAB-SQB_ARCiAw0BEKgDDQMMAIQBSACFAUkAhgEAAAADDACEAUgAhQFJAIYBAQEAAwEBAAMDDACLAUgAjAFJAI0BAAAAAwwAiwFIAIwBSQCNAQIBAAMKAAcCAQADCgAHAwwAkgFIAJMBSQCUAQAAAAMMAJIBSACTAUkAlAECBgADBwACAgYAAwcAAgUMAJkBSACcAUkAnQFaAJoBWwCbAQAAAAAABQwAmQFIAJwBSQCdAVoAmgFbAJsBAggABQoABwIIAAUKAAcFDACiAUgApQFJAKYBWgCjAVsApAEAAAAAAAUMAKIBSAClAUkApgFaAKMBWwCkAQEQAA0BEAANBQwAqwFIAK4BSQCvAVoArAFbAK0BAAAAAAAFDACrAUgArgFJAK8BWgCsAVsArQEBHQAbAR0AGwUMALQBSAC3AUkAuAFaALUBWwC2AQAAAAAABQwAtAFIALcBSQC4AVoAtQFbALYBAR4AHAEeABwFDAC9AUgAwAFJAMEBWgC-AVsAvwEAAAAAAAUMAL0BSADAAUkAwQFaAL4BWwC_AQIGAAMdABsCBgADHQAbBQwAxgFIAMkBSQDKAVoAxwFbAMgBAAAAAAAFDADGAUgAyQFJAMoBWgDHAVsAyAEDHgAcIAAfIeoEHQMeABwgAB8h8AQdBQwAzwFIANIBSQDTAVoA0AFbANEBAAAAAAAFDADPAUgA0gFJANMBWgDQAVsA0QEBEAANARAADQUMANgBSADbAUkA3AFaANkBWwDaAQAAAAAABQwA2AFIANsBSQDcAVoA2QFbANoBARMAEgETABIFDADhAUgA5AFJAOUBWgDiAVsA4wEAAAAAAAUMAOEBSADkAUkA5QFaAOIBWwDjAQIGAAMUABMCBgADFAATBQwA6gFIAO0BSQDuAVoA6wFbAOwBAAAAAAAFDADqAUgA7QFJAO4BWgDrAVsA7AEAAAMMAPMBSAD0AUkA9QEAAAADDADzAUgA9AFJAPUBAQEAAwEBAAMDDAD6AUgA-wFJAPwBAAAAAwwA-gFIAPsBSQD8AQEBAAMBAQADAwwAgQJIAIICSQCDAgAAAAMMAIECSACCAkkAgwI2AgE3ngEBOJ8BATmgAQE6oQEBPKMBAT2lASs-pgEsP6gBAUCqAStBqwEtRKwBAUWtAQFGrgErSrEBLkuyATJMswEYTbQBGE61ARhPtgEYULcBGFG5ARhSuwErU7wBM1S-ARhVwAErVsEBNFfCARhYwwEYWcQBK1zHATVdyAE7XskBGV_KARlgywEZYcwBGWLNARljzwEZZNEBK2XSATxm1QEZZ9cBK2jYAT1p2gEZatsBGWvcASts3wE-beABRG7iAQ5v4wEOcOYBDnHnAQ5y6AEOc-oBDnTsASt17QFFdu8BDnfxASt48gFGefMBDnr0AQ579QErfPgBR335AUt--gENf_sBDYAB_AENgQH9AQ2CAf4BDYMBgAINhAGCAiuFAYMCTIYBhQINhwGHAiuIAYgCTYkBiQINigGKAg2LAYsCK4wBjgJOjQGPAlSOAZACAo8BkQICkAGSAgKRAZMCApIBlAICkwGWAgKUAZgCK5UBmQJVlgGbAgKXAZ0CK5gBngJWmQGfAgKaAaACApsBoQIrnAGkAledAaUCW54BpgIHnwGnAgegAagCB6EBqQIHogGqAgejAawCB6QBrgIrpQGvAlymAbECB6cBswIrqAG0Al2pAbUCB6oBtgIHqwG3AiusAboCXq0BuwJkrgG8AhCvAb0CELABvgIQsQG_AhCyAcACELMBwgIQtAHEAiu1AcUCZbYBxwIQtwHJAiu4AcoCZrkBywIQugHMAhC7Ac0CK7wB0AJnvQHRAmu-AdICDL8B0wIMwAHUAgzBAdUCDMIB1gIMwwHYAgzEAdoCK8UB2wJsxgHeAgzHAeACK8gB4QJtyQHjAgzKAeQCDMsB5QIrzAHoAm7NAekCcs4B6gILzwHrAgvQAewCC9EB7QIL0gHuAgvTAfACC9QB8gIr1QHzAnPWAfUCC9cB9wIr2AH4AnTZAfkCC9oB-gIL2wH7AivcAf4Cdd0B_wJ53gGAAxbfAYEDFuABggMW4QGDAxbiAYQDFuMBhgMW5AGIAyvlAYkDeuYBjAMW5wGOAyvoAY8De-kBkQMW6gGSAxbrAZMDK-wBlgN87QGXA4AB7gGYAyTvAZkDJPABmgMk8QGbAyTyAZwDJPMBngMk9AGgAyv1AaEDgQH2AaQDJPcBpgMr-AGnA4IB-QGpAyT6AaoDJPsBqwMr_AGuA4MB_QGvA4cB_gGwAyf_AbEDJ4ACsgMngQKzAyeCArQDJ4MCtgMnhAK4AyuFArkDiAGGArsDJ4cCvQMriAK-A4kBiQK_AyeKAsADJ4sCwQMrjALEA4oBjQLFA44BjgLGAwiPAscDCJACyAMIkQLJAwiSAsoDCJMCzAMIlALOAyuVAs8DjwGWAtEDCJcC0wMrmALUA5ABmQLVAwiaAtYDCJsC1wMrnALaA5EBnQLbA5UBngLcAwWfAt0DBaAC3gMFoQLfAwWiAuADBaMC4gMFpALkAyulAuUDlgGmAucDBacC6QMrqALqA5cBqQLrAwWqAuwDBasC7QMrrALwA5gBrQLxA54BrgLyAwavAvMDBrAC9AMGsQL1AwayAvYDBrMC-AMGtAL6Ayu1AvsDnwG2Av0DBrcC_wMruAKABKABuQKBBAa6AoIEBrsCgwQrvAKGBKEBvQKHBKcBvgKIBBu_AokEG8ACigQbwQKLBBvCAowEG8MCjgQbxAKQBCvFApEEqAHGApMEG8cClQQryAKWBKkByQKXBBvKApgEG8sCmQQrzAKcBKoBzQKdBLABzgKeBBzPAp8EHNACoAQc0QKhBBzSAqIEHNMCpAQc1AKmBCvVAqcEsQHWAqkEHNcCqwQr2AKsBLIB2QKtBBzaAq4EHNsCrwQr3AKyBLMB3QKzBLkB3gK0BB3fArUEHeACtgQd4QK3BB3iArgEHeMCugQd5AK8BCvlAr0EugHmAr8EHecCwQQr6ALCBLsB6QLDBB3qAsQEHesCxQQr7ALIBLwB7QLJBMIB7gLKBB_vAssEH_ACzAQf8QLNBB_yAs4EH_MC0AQf9ALSBCv1AtMEwwH2AtUEH_cC1wQr-ALYBMQB-QLZBB_6AtoEH_sC2wQr_ALeBMUB_QLfBMsB_gLgBB7_AuEEHoAD4gQegQPjBB6CA-QEHoMD5gQehAPoBCuFA-kEzAGGA-wEHocD7gQriAPvBM0BiQPxBB6KA_IEHosD8wQrjAP2BM4BjQP3BNQBjgP4BBKPA_kEEpAD-gQSkQP7BBKSA_wEEpMD_gQSlAOABSuVA4EF1QGWA4MFEpcDhQUrmAOGBdYBmQOHBRKaA4gFEpsDiQUrnAOMBdcBnQONBd0BngOOBROfA48FE6ADkAUToQORBROiA5IFE6MDlAUTpAOWBSulA5cF3gGmA5kFE6cDmwUrqAOcBd8BqQOdBROqA54FE6sDnwUrrAOiBeABrQOjBeYBrgOkBRSvA6UFFLADpgUUsQOnBRSyA6gFFLMDqgUUtAOsBSu1A60F5wG2A68FFLcDsQUruAOyBegBuQOzBRS6A7QFFLsDtQUrvAO4BekBvQO5Be8BvgO7BQO_A7wFA8ADvgUDwQO_BQPCA8AFA8MDwgUDxAPEBSvFA8UF8AHGA8cFA8cDyQUryAPKBfEByQPLBQPKA8wFA8sDzQUrzAPQBfIBzQPRBfYBzgPSBSjPA9MFKNAD1AUo0QPVBSjSA9YFKNMD2AUo1APaBSvVA9sF9wHWA90FKNcD3wUr2APgBfgB2QPhBSjaA-IFKNsD4wUr3APmBfkB3QPnBf0B3gPpBQTfA-oFBOAD7AUE4QPtBQTiA-4FBOMD8AUE5APyBSvlA_MF_gHmA_UFBOcD9wUr6AP4Bf8B6QP5BQTqA_oFBOsD-wUr7AP-BYAC7QP_BYQC"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config2.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config2);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccessAuditLogScalarFieldEnum: () => AccessAuditLogScalarFieldEnum,
  AnyNull: () => AnyNull2,
  AssignmentScalarFieldEnum: () => AssignmentScalarFieldEnum,
  AssignmentSubmissionScalarFieldEnum: () => AssignmentSubmissionScalarFieldEnum,
  AttendanceScalarFieldEnum: () => AttendanceScalarFieldEnum,
  BatchScalarFieldEnum: () => BatchScalarFieldEnum,
  BatchScheduleScalarFieldEnum: () => BatchScheduleScalarFieldEnum,
  ChapterScalarFieldEnum: () => ChapterScalarFieldEnum,
  ClassSessionScalarFieldEnum: () => ClassSessionScalarFieldEnum,
  CourseScalarFieldEnum: () => CourseScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  EnrollmentScalarFieldEnum: () => EnrollmentScalarFieldEnum,
  JsonNull: () => JsonNull2,
  LessonProgressScalarFieldEnum: () => LessonProgressScalarFieldEnum,
  LessonScalarFieldEnum: () => LessonScalarFieldEnum,
  MaterialScalarFieldEnum: () => MaterialScalarFieldEnum,
  ModelName: () => ModelName,
  MonthlyInvoiceScalarFieldEnum: () => MonthlyInvoiceScalarFieldEnum,
  NoticeScalarFieldEnum: () => NoticeScalarFieldEnum,
  NotificationScalarFieldEnum: () => NotificationScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PaymentAllocationScalarFieldEnum: () => PaymentAllocationScalarFieldEnum,
  PaymentReminderScalarFieldEnum: () => PaymentReminderScalarFieldEnum,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  QuizAnswerScalarFieldEnum: () => QuizAnswerScalarFieldEnum,
  QuizAttemptScalarFieldEnum: () => QuizAttemptScalarFieldEnum,
  QuizOptionScalarFieldEnum: () => QuizOptionScalarFieldEnum,
  QuizQuestionScalarFieldEnum: () => QuizQuestionScalarFieldEnum,
  QuizScalarFieldEnum: () => QuizScalarFieldEnum,
  RefreshSessionScalarFieldEnum: () => RefreshSessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  StudentProfileScalarFieldEnum: () => StudentProfileScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.10.1",
  engine: "d1b3f377ca835d73fd50954a5e22128b9ebdd6b8"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  AccessAuditLog: "AccessAuditLog",
  Assignment: "Assignment",
  AssignmentSubmission: "AssignmentSubmission",
  Course: "Course",
  Batch: "Batch",
  Enrollment: "Enrollment",
  MonthlyInvoice: "MonthlyInvoice",
  BatchSchedule: "BatchSchedule",
  ClassSession: "ClassSession",
  Attendance: "Attendance",
  Material: "Material",
  Notice: "Notice",
  Notification: "Notification",
  PaymentReminder: "PaymentReminder",
  Payment: "Payment",
  PaymentAllocation: "PaymentAllocation",
  Quiz: "Quiz",
  QuizQuestion: "QuizQuestion",
  QuizOption: "QuizOption",
  QuizAttempt: "QuizAttempt",
  QuizAnswer: "QuizAnswer",
  Chapter: "Chapter",
  Lesson: "Lesson",
  LessonProgress: "LessonProgress",
  User: "User",
  RefreshSession: "RefreshSession",
  StudentProfile: "StudentProfile"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var AccessAuditLogScalarFieldEnum = {
  id: "id",
  enrollmentId: "enrollmentId",
  adminId: "adminId",
  accessType: "accessType",
  action: "action",
  reason: "reason",
  createdAt: "createdAt"
};
var AssignmentScalarFieldEnum = {
  id: "id",
  batchId: "batchId",
  title: "title",
  instructions: "instructions",
  totalMarks: "totalMarks",
  dueAt: "dueAt",
  attachmentUrl: "attachmentUrl",
  isPublished: "isPublished",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AssignmentSubmissionScalarFieldEnum = {
  id: "id",
  assignmentId: "assignmentId",
  studentId: "studentId",
  answerText: "answerText",
  fileUrl: "fileUrl",
  marks: "marks",
  feedback: "feedback",
  status: "status",
  submittedAt: "submittedAt",
  reviewedAt: "reviewedAt",
  reviewedBy: "reviewedBy",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CourseScalarFieldEnum = {
  id: "id",
  title: "title",
  slug: "slug",
  classLevel: "classLevel",
  description: "description",
  thumbnailUrl: "thumbnailUrl",
  isPublished: "isPublished",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BatchScalarFieldEnum = {
  id: "id",
  courseId: "courseId",
  title: "title",
  monthlyFee: "monthlyFee",
  capacity: "capacity",
  startDate: "startDate",
  endDate: "endDate",
  enrollmentOpen: "enrollmentOpen",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var EnrollmentScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  batchId: "batchId",
  status: "status",
  enrolledAt: "enrolledAt",
  startedAt: "startedAt",
  endedAt: "endedAt",
  recordedAccessUntil: "recordedAccessUntil",
  liveAccessEnabled: "liveAccessEnabled",
  materialAccessEnabled: "materialAccessEnabled",
  assignmentAccessEnabled: "assignmentAccessEnabled",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MonthlyInvoiceScalarFieldEnum = {
  id: "id",
  enrollmentId: "enrollmentId",
  billingMonth: "billingMonth",
  periodStart: "periodStart",
  periodEnd: "periodEnd",
  amount: "amount",
  currency: "currency",
  dueDate: "dueDate",
  status: "status",
  paidAt: "paidAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BatchScheduleScalarFieldEnum = {
  id: "id",
  batchId: "batchId",
  dayOfWeek: "dayOfWeek",
  startTime: "startTime",
  endTime: "endTime",
  timezone: "timezone",
  effectiveFrom: "effectiveFrom",
  effectiveUntil: "effectiveUntil",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ClassSessionScalarFieldEnum = {
  id: "id",
  batchId: "batchId",
  scheduleId: "scheduleId",
  title: "title",
  topic: "topic",
  startsAt: "startsAt",
  endsAt: "endsAt",
  meetUrl: "meetUrl",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AttendanceScalarFieldEnum = {
  id: "id",
  sessionId: "sessionId",
  studentId: "studentId",
  status: "status",
  markedAt: "markedAt",
  markedBy: "markedBy"
};
var MaterialScalarFieldEnum = {
  id: "id",
  batchId: "batchId",
  chapterId: "chapterId",
  title: "title",
  description: "description",
  fileUrl: "fileUrl",
  fileType: "fileType",
  isPublished: "isPublished",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var NoticeScalarFieldEnum = {
  id: "id",
  batchId: "batchId",
  title: "title",
  content: "content",
  publishedAt: "publishedAt",
  isPublished: "isPublished",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var NotificationScalarFieldEnum = {
  id: "id",
  userId: "userId",
  title: "title",
  message: "message",
  type: "type",
  relatedEntityId: "relatedEntityId",
  readAt: "readAt",
  createdAt: "createdAt"
};
var PaymentReminderScalarFieldEnum = {
  id: "id",
  invoiceId: "invoiceId",
  userId: "userId",
  scheduledAt: "scheduledAt",
  sentAt: "sentAt",
  channel: "channel",
  status: "status",
  createdAt: "createdAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  enrollmentId: "enrollmentId",
  amount: "amount",
  currency: "currency",
  provider: "provider",
  transactionId: "transactionId",
  gatewayTransactionId: "gatewayTransactionId",
  idempotencyKey: "idempotencyKey",
  status: "status",
  paymentMethod: "paymentMethod",
  paidAt: "paidAt",
  validatedAt: "validatedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PaymentAllocationScalarFieldEnum = {
  id: "id",
  paymentId: "paymentId",
  invoiceId: "invoiceId",
  allocatedAmount: "allocatedAmount",
  createdAt: "createdAt"
};
var QuizScalarFieldEnum = {
  id: "id",
  batchId: "batchId",
  title: "title",
  description: "description",
  totalMarks: "totalMarks",
  durationMinutes: "durationMinutes",
  startAt: "startAt",
  endAt: "endAt",
  isPublished: "isPublished",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var QuizQuestionScalarFieldEnum = {
  id: "id",
  quizId: "quizId",
  questionText: "questionText",
  questionType: "questionType",
  marks: "marks",
  sortOrder: "sortOrder",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var QuizOptionScalarFieldEnum = {
  id: "id",
  questionId: "questionId",
  optionText: "optionText",
  isCorrect: "isCorrect",
  sortOrder: "sortOrder"
};
var QuizAttemptScalarFieldEnum = {
  id: "id",
  quizId: "quizId",
  studentId: "studentId",
  score: "score",
  startedAt: "startedAt",
  submittedAt: "submittedAt",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var QuizAnswerScalarFieldEnum = {
  id: "id",
  attemptId: "attemptId",
  questionId: "questionId",
  selectedOptionId: "selectedOptionId",
  answerText: "answerText",
  awardedMarks: "awardedMarks",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ChapterScalarFieldEnum = {
  id: "id",
  batchId: "batchId",
  title: "title",
  description: "description",
  sortOrder: "sortOrder",
  isPublished: "isPublished",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var LessonScalarFieldEnum = {
  id: "id",
  chapterId: "chapterId",
  title: "title",
  description: "description",
  videoProvider: "videoProvider",
  videoId: "videoId",
  videoUrl: "videoUrl",
  durationSeconds: "durationSeconds",
  sortOrder: "sortOrder",
  isPublished: "isPublished",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var LessonProgressScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  lessonId: "lessonId",
  watchedSeconds: "watchedSeconds",
  completionPercentage: "completionPercentage",
  isCompleted: "isCompleted",
  lastWatchedAt: "lastWatchedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  fullName: "fullName",
  email: "email",
  passwordHash: "passwordHash",
  phone: "phone",
  role: "role",
  authProvider: "authProvider",
  googleId: "googleId",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var RefreshSessionScalarFieldEnum = {
  id: "id",
  tokenHash: "tokenHash",
  userId: "userId",
  expiresAt: "expiresAt",
  createdAt: "createdAt"
};
var StudentProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  classLevel: "classLevel",
  schoolName: "schoolName",
  guardianName: "guardianName",
  guardianPhone: "guardianPhone",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var UserRole = {
  ADMIN: "ADMIN",
  STUDENT: "STUDENT"
};
var AuthProvider = {
  CREDENTIAL: "CREDENTIAL",
  GOOGLE: "GOOGLE"
};

// src/generated/prisma/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/utils/httpError.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
  statusCode;
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  if (error instanceof HttpError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Invalid database operation.";
  } else if (error instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      statusCode = httpStatus.CONFLICT;
      message = "A record with the provided unique value already exists.";
    } else if (error.code === "P2003") {
      statusCode = httpStatus.BAD_REQUEST;
      message = "A related record does not exist.";
    } else if (error.code === "P2025") {
      statusCode = httpStatus.NOT_FOUND;
      message = "The requested record was not found.";
    }
  } else if (error instanceof prismaNamespace_exports.PrismaClientInitializationError || error instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.SERVICE_UNAVAILABLE;
    message = "The database is temporarily unavailable.";
  } else if (error instanceof Error) {
    console.error(error);
  } else {
    console.error("An unknown error occurred:", error);
  }
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
};

// src/app/middleware/notFoundPage.ts
var notFound = (req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Route not found",
    path: req.originalUrl
  });
};

// src/app/modules/auth/auth.route.ts
import { Router } from "express";

// src/app/middleware/auth.ts
import httpStatus2 from "http-status";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};
var verifyToken = (accessToken, secret) => {
  try {
    const verifiedToken = jwt.verify(accessToken, secret);
    if (typeof verifiedToken === "string") {
      return {
        success: false,
        error: "Invalid token"
      };
    }
    return {
      success: true,
      data: verifiedToken
    };
  } catch {
    return {
      success: false,
      error: "Invalid token"
    };
  }
};
var jwtUtils = {
  createToken,
  verifyToken
};

// src/app/utils/catchAsync.ts
var catchAsync = (handler) => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

// src/app/middleware/auth.ts
var auth = (...requiredRoles) => {
  return catchAsync(async (req, res, next) => {
    const authorization = req.headers.authorization;
    const token = req.cookies?.accessToken ?? (authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : authorization);
    if (!token) {
      throw new HttpError(
        httpStatus2.UNAUTHORIZED,
        "Access denied. No token provided."
      );
    }
    if (!config_default.jwtSecret) {
      throw new Error("JWT_SECRET is not configured.");
    }
    const verifiedToken = jwtUtils.verifyToken(token, config_default.jwtSecret);
    if (!verifiedToken.success) {
      throw new HttpError(httpStatus2.UNAUTHORIZED, verifiedToken.error);
    }
    const payload = verifiedToken.data;
    if (typeof payload !== "object" || payload === null || typeof payload.id !== "string" || !payload.id || payload.tokenType !== "access") {
      throw new HttpError(httpStatus2.UNAUTHORIZED, "Invalid token.");
    }
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true
      }
    });
    if (!user) {
      throw new HttpError(httpStatus2.UNAUTHORIZED, "User not found.");
    }
    if (!user.isActive) {
      throw new HttpError(httpStatus2.FORBIDDEN, "User is inactive.");
    }
    if (requiredRoles.length && !requiredRoles.includes(user.role)) {
      throw new HttpError(
        httpStatus2.FORBIDDEN,
        "Forbidden. You don't have permission to access this resource."
      );
    }
    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    };
    next();
  });
};

// src/app/modules/auth/auth.controller.ts
import httpStatus5 from "http-status";

// src/app/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta || void 0
  });
};

// src/app/modules/auth/auth.service.ts
import bcrypt from "bcryptjs";
import { createHash, randomBytes, randomInt } from "crypto";
import ejs from "ejs";
import httpStatus3 from "http-status";

// src/app/lib/googleAuth.ts
import { OAuth2Client } from "google-auth-library";
var googleClient = new OAuth2Client({
  client_id: config_default.google_client_id
});

// src/app/lib/nodemailer.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config_default.smtp_user,
    pass: config_default.smtp_password
  }
});

// src/app/lib/redis.ts
import { createClient } from "redis";
var redisClient = createClient({
  username: config_default.redis_user,
  password: config_default.redis_password,
  socket: {
    host: config_default.redis_host,
    port: Number(config_default.redis_port)
  }
});

// src/app/modules/auth/auth.service.ts
import path3 from "path";
var PASSWORD_SALT_ROUNDS = 12;
var ACCESS_TOKEN_TTL = "15m";
var REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1e3;
var REGISTRATION_OTP_TTL_SECONDS = 5 * 60;
var PASSWORD_RESET_OTP_TTL_SECONDS = 5 * 60;
var publicUserSelect = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true
};
function getJwtSecret() {
  if (!config_default.jwtSecret) {
    throw new Error("JWT_SECRET is not configured.");
  }
  return config_default.jwtSecret;
}
function createAuthResult(user, jwtSecret, refreshToken) {
  return {
    user,
    accessToken: jwtUtils.createToken(
      { id: user.id, tokenType: "access" },
      jwtSecret,
      ACCESS_TOKEN_TTL
    ),
    refreshToken
  };
}
function createRefreshToken() {
  return randomBytes(32).toString("hex");
}
function hashRefreshToken(refreshToken) {
  return createHash("sha256").update(refreshToken).digest("hex");
}
function getRefreshTokenExpiry() {
  return new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
}
function getRegistrationKeys(email) {
  return {
    otpKey: `user-registration-otp:${email}`,
    dataKey: `user-registration-data:${email}`
  };
}
function getPasswordResetKey(email) {
  return `password-reset-otp:${email}`;
}
async function sendWelcomeEmail(user) {
  const templatePath = path3.join(
    process.cwd(),
    "src/app/templates/welcome-user.ejs"
  );
  const html = await ejs.renderFile(templatePath, {
    fullName: user.fullName
  });
  await transporter.sendMail({
    from: config_default.email_sender,
    to: user.email,
    subject: "Welcome to Math Solution",
    html
  });
}
async function register(input) {
  const email = input.email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new HttpError(
      httpStatus3.CONFLICT,
      "User with this email already exists."
    );
  }
  const passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);
  const otp = randomInt(1e5, 1e6).toString();
  const { otpKey, dataKey } = getRegistrationKeys(email);
  const pendingRegistration = {
    fullName: input.fullName,
    email,
    passwordHash,
    phone: input.phone
  };
  await redisClient.set(otpKey, otp, {
    expiration: { type: "EX", value: REGISTRATION_OTP_TTL_SECONDS }
  });
  await redisClient.set(dataKey, JSON.stringify(pendingRegistration), {
    expiration: { type: "EX", value: REGISTRATION_OTP_TTL_SECONDS }
  });
  const templatePath = path3.join(
    process.cwd(),
    "src/app/templates/registration-user-otp.ejs"
  );
  const html = await ejs.renderFile(templatePath, {
    fullName: input.fullName,
    email,
    otp,
    expirationMinutes: REGISTRATION_OTP_TTL_SECONDS / 60
  });
  await transporter.sendMail({
    from: config_default.email_sender,
    to: email,
    subject: "Email Verification",
    html
  });
}
async function verifyRegistration(input) {
  const email = input.email.trim().toLowerCase();
  const { otpKey, dataKey } = getRegistrationKeys(email);
  const [storedOtp, storedData] = await Promise.all([
    redisClient.get(otpKey),
    redisClient.get(dataKey)
  ]);
  if (!storedOtp || !storedData || storedOtp !== input.otp) {
    throw new HttpError(
      httpStatus3.UNAUTHORIZED,
      "The verification code is invalid or has expired."
    );
  }
  const pendingRegistration = JSON.parse(storedData);
  if (typeof pendingRegistration.fullName !== "string" || pendingRegistration.email !== email || typeof pendingRegistration.passwordHash !== "string") {
    throw new HttpError(
      httpStatus3.INTERNAL_SERVER_ERROR,
      "Pending registration data is invalid."
    );
  }
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    await redisClient.del([otpKey, dataKey]);
    throw new HttpError(
      httpStatus3.CONFLICT,
      "User with this email already exists."
    );
  }
  const user = await prisma.user.create({
    data: {
      fullName: pendingRegistration.fullName,
      email,
      passwordHash: pendingRegistration.passwordHash,
      phone: pendingRegistration.phone,
      role: UserRole.STUDENT
    },
    select: publicUserSelect
  });
  await redisClient.del([otpKey, dataKey]);
  await sendWelcomeEmail(user);
}
async function login(input) {
  const jwtSecret = getJwtSecret();
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      ...publicUserSelect,
      passwordHash: true,
      isActive: true
    }
  });
  if (!user || !await bcrypt.compare(input.password, user.passwordHash)) {
    throw new HttpError(httpStatus3.UNAUTHORIZED, "Invalid email or password.");
  }
  if (!user.isActive) {
    throw new HttpError(httpStatus3.FORBIDDEN, "User is inactive.");
  }
  const refreshToken = createRefreshToken();
  await prisma.refreshSession.create({
    data: {
      tokenHash: hashRefreshToken(refreshToken),
      userId: user.id,
      expiresAt: getRefreshTokenExpiry()
    }
  });
  const safeUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt
  };
  return createAuthResult(safeUser, jwtSecret, refreshToken);
}
async function googleLogin(input) {
  const jwtSecret = getJwtSecret();
  if (!config_default.google_client_id) {
    throw new Error("GOOGLE_CLIENT_ID is not configured.");
  }
  let googlePayload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: input.idToken,
      audience: config_default.google_client_id
    });
    googlePayload = ticket.getPayload();
  } catch {
    throw new HttpError(
      httpStatus3.UNAUTHORIZED,
      "Invalid or expired Google ID token."
    );
  }
  if (!googlePayload?.email || googlePayload.email_verified !== true) {
    throw new HttpError(
      httpStatus3.UNAUTHORIZED,
      "A Google account with a verified email is required."
    );
  }
  const email = googlePayload.email.trim().toLowerCase();
  const fullName = googlePayload.name?.trim() || email.slice(0, email.indexOf("@"));
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  });
  const isNewUser = existingUser === null;
  const passwordHash = await bcrypt.hash(
    randomBytes(32).toString("hex"),
    PASSWORD_SALT_ROUNDS
  );
  const user = await prisma.user.upsert({
    where: { email },
    create: {
      fullName,
      email,
      passwordHash,
      role: UserRole.STUDENT,
      authProvider: AuthProvider.GOOGLE,
      googleId: googlePayload.sub
    },
    update: {},
    select: {
      ...publicUserSelect,
      isActive: true,
      authProvider: true,
      googleId: true
    }
  });
  if (user.role !== UserRole.STUDENT) {
    throw new HttpError(
      httpStatus3.FORBIDDEN,
      "Google login is only available for student accounts."
    );
  }
  if (!user.isActive) {
    throw new HttpError(httpStatus3.FORBIDDEN, "User is inactive.");
  }
  if (user.authProvider === AuthProvider.GOOGLE && user.googleId !== googlePayload.sub || user.googleId && user.googleId !== googlePayload.sub) {
    throw new HttpError(
      httpStatus3.CONFLICT,
      "This email is already linked to a different Google account."
    );
  }
  if (!user.googleId) {
    await prisma.user.update({
      where: { id: user.id },
      data: { googleId: googlePayload.sub }
    });
  }
  const safeUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt
  };
  const refreshToken = createRefreshToken();
  await prisma.refreshSession.create({
    data: {
      tokenHash: hashRefreshToken(refreshToken),
      userId: user.id,
      expiresAt: getRefreshTokenExpiry()
    }
  });
  if (isNewUser) {
    await sendWelcomeEmail(user);
  }
  return createAuthResult(safeUser, jwtSecret, refreshToken);
}
async function forgotPassword(input) {
  const email = input.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      email: true,
      fullName: true,
      isActive: true,
      authProvider: true
    }
  });
  if (!user || !user.isActive || user.authProvider === AuthProvider.GOOGLE) {
    return;
  }
  const otp = randomInt(1e5, 1e6).toString();
  const key = getPasswordResetKey(user.email);
  await redisClient.set(key, otp, {
    expiration: { type: "EX", value: PASSWORD_RESET_OTP_TTL_SECONDS }
  });
  const templatePath = path3.join(
    process.cwd(),
    "src/app/templates/forgot-password-otp.ejs"
  );
  const html = await ejs.renderFile(templatePath, {
    fullName: user.fullName,
    otp,
    expirationMinutes: PASSWORD_RESET_OTP_TTL_SECONDS / 60
  });
  await transporter.sendMail({
    from: config_default.email_sender,
    to: user.email,
    subject: "Password Reset",
    html
  });
}
async function resetPassword(input) {
  const email = input.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      fullName: true,
      isActive: true,
      authProvider: true
    }
  });
  if (!user || !user.isActive) {
    throw new HttpError(
      httpStatus3.BAD_REQUEST,
      "The password reset code is invalid or has expired."
    );
  }
  if (user.authProvider === AuthProvider.GOOGLE) {
    throw new HttpError(
      httpStatus3.BAD_REQUEST,
      "Google accounts cannot reset their password."
    );
  }
  const key = getPasswordResetKey(user.email);
  const storedOtp = await redisClient.get(key);
  if (!storedOtp || storedOtp !== input.otp) {
    throw new HttpError(
      httpStatus3.BAD_REQUEST,
      "The password reset code is invalid or has expired."
    );
  }
  const passwordHash = await bcrypt.hash(
    input.newPassword,
    PASSWORD_SALT_ROUNDS
  );
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    }),
    prisma.refreshSession.deleteMany({ where: { userId: user.id } })
  ]);
  await redisClient.del(key);
  const templatePath = path3.join(
    process.cwd(),
    "src/app/templates/reset-password-success.ejs"
  );
  const html = await ejs.renderFile(templatePath, {
    fullName: user.fullName
  });
  await transporter.sendMail({
    from: config_default.email_sender,
    to: user.email,
    subject: "Password Changed",
    html
  });
}
async function refreshTokens(refreshToken) {
  const jwtSecret = getJwtSecret();
  const tokenHash = hashRefreshToken(refreshToken);
  const now = /* @__PURE__ */ new Date();
  const session = await prisma.refreshSession.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: {
          ...publicUserSelect,
          isActive: true
        }
      }
    }
  });
  if (!session) {
    throw new HttpError(httpStatus3.UNAUTHORIZED, "Invalid refresh token.");
  }
  if (session.expiresAt <= now) {
    await prisma.refreshSession.deleteMany({ where: { id: session.id } });
    throw new HttpError(httpStatus3.UNAUTHORIZED, "Refresh token has expired.");
  }
  if (!session.user.isActive) {
    await prisma.refreshSession.deleteMany({ where: { id: session.id } });
    throw new HttpError(httpStatus3.FORBIDDEN, "User is inactive.");
  }
  const nextRefreshToken = createRefreshToken();
  await prisma.$transaction(async (tx) => {
    const deleted = await tx.refreshSession.deleteMany({
      where: {
        id: session.id,
        tokenHash,
        expiresAt: { gt: now }
      }
    });
    if (deleted.count !== 1) {
      throw new HttpError(
        httpStatus3.UNAUTHORIZED,
        "Refresh token was already used."
      );
    }
    await tx.refreshSession.create({
      data: {
        tokenHash: hashRefreshToken(nextRefreshToken),
        userId: session.userId,
        expiresAt: getRefreshTokenExpiry()
      }
    });
  });
  const user = {
    id: session.user.id,
    fullName: session.user.fullName,
    email: session.user.email,
    phone: session.user.phone,
    role: session.user.role,
    createdAt: session.user.createdAt
  };
  return createAuthResult(user, jwtSecret, nextRefreshToken);
}
async function revokeRefreshToken(refreshToken) {
  await prisma.refreshSession.deleteMany({
    where: { tokenHash: hashRefreshToken(refreshToken) }
  });
}

// src/app/modules/auth/auth.validation.ts
import httpStatus4 from "http-status";
var MAX_PASSWORD_BYTES = 72;
function getObjectBody(body) {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new HttpError(httpStatus4.BAD_REQUEST, "Request body must be an object.");
  }
  return body;
}
function validateEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new HttpError(httpStatus4.BAD_REQUEST, "A valid email is required.");
  }
  return normalizedEmail;
}
function validateRegisterInput(body) {
  const input = getObjectBody(body);
  const fullName = typeof input.fullName === "string" ? input.fullName.trim() : "";
  const email = typeof input.email === "string" ? input.email : "";
  const password = typeof input.password === "string" ? input.password : "";
  if (fullName.length < 2 || fullName.length > 100) {
    throw new HttpError(
      httpStatus4.BAD_REQUEST,
      "Full name must be between 2 and 100 characters."
    );
  }
  if (password.length < 8 || Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES) {
    throw new HttpError(
      httpStatus4.BAD_REQUEST,
      "Password must be at least 8 characters and no more than 72 bytes."
    );
  }
  let phone;
  if (input.phone !== void 0) {
    if (typeof input.phone !== "string") {
      throw new HttpError(httpStatus4.BAD_REQUEST, "Phone must be a string.");
    }
    phone = input.phone.trim() || void 0;
    if (phone && phone.length > 32) {
      throw new HttpError(
        httpStatus4.BAD_REQUEST,
        "Phone must be no more than 32 characters."
      );
    }
  }
  return { fullName, email: validateEmail(email), password, phone };
}
function validateLoginInput(body) {
  const input = getObjectBody(body);
  const email = typeof input.email === "string" ? input.email : "";
  const password = typeof input.password === "string" ? input.password : "";
  if (!password || Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES) {
    throw new HttpError(
      httpStatus4.UNAUTHORIZED,
      "Invalid email or password."
    );
  }
  return { email: validateEmail(email), password };
}
function validateGoogleLoginInput(body) {
  const input = getObjectBody(body);
  const idToken = typeof input.idToken === "string" ? input.idToken.trim() : "";
  if (!idToken || idToken.length > 8192) {
    throw new HttpError(
      httpStatus4.BAD_REQUEST,
      "A valid Google ID token is required."
    );
  }
  return { idToken };
}
function validateForgotPasswordInput(body) {
  const input = getObjectBody(body);
  const email = typeof input.email === "string" ? input.email : "";
  return { email: validateEmail(email) };
}
function validateResetPasswordInput(body) {
  const input = getObjectBody(body);
  const email = typeof input.email === "string" ? input.email : "";
  const otp = typeof input.otp === "string" ? input.otp : "";
  const newPassword = typeof input.newPassword === "string" ? input.newPassword : "";
  if (!/^\d{6}$/.test(otp)) {
    throw new HttpError(
      httpStatus4.BAD_REQUEST,
      "A six-digit password reset code is required."
    );
  }
  if (newPassword.length < 8 || Buffer.byteLength(newPassword, "utf8") > MAX_PASSWORD_BYTES) {
    throw new HttpError(
      httpStatus4.BAD_REQUEST,
      "Password must be at least 8 characters and no more than 72 bytes."
    );
  }
  return { email: validateEmail(email), otp, newPassword };
}
function validateRegistrationVerification(body) {
  const input = getObjectBody(body);
  const email = typeof input.email === "string" ? input.email : "";
  const otp = typeof input.otp === "string" ? input.otp : "";
  if (!/^\d{6}$/.test(otp)) {
    throw new HttpError(
      httpStatus4.BAD_REQUEST,
      "A six-digit verification code is required."
    );
  }
  return { email: validateEmail(email), otp };
}
function validateRefreshToken(token) {
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) {
    throw new HttpError(
      httpStatus4.UNAUTHORIZED,
      "A valid refresh token is required."
    );
  }
  return token;
}

// src/app/modules/auth/auth.controller.ts
var cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/"
};
var ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1e3;
var REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1e3;
function sendAuthenticatedResponse(res, statusCode, message, result) {
  res.cookie("accessToken", result.accessToken, {
    ...cookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE
  });
  res.cookie("refreshToken", result.refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE
  });
  sendResponse(res, {
    success: true,
    statusCode,
    message,
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    }
  });
}
var register2 = catchAsync(async (req, res) => {
  const input = validateRegisterInput(req.body);
  await register(input);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.ACCEPTED,
    message: "Verification code sent to your email.",
    data: null
  });
});
var verifyRegistration2 = catchAsync(async (req, res) => {
  const input = validateRegistrationVerification(req.body);
  await verifyRegistration(input);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.CREATED,
    message: "Account created successfully. Please log in to continue.",
    data: null
  });
});
var login2 = catchAsync(async (req, res) => {
  const input = validateLoginInput(req.body);
  const result = await login(input);
  sendAuthenticatedResponse(
    res,
    httpStatus5.OK,
    "Logged in successfully.",
    result
  );
});
var googleLogin2 = catchAsync(async (req, res) => {
  const input = validateGoogleLoginInput(req.body);
  const result = await googleLogin(input);
  sendAuthenticatedResponse(
    res,
    httpStatus5.OK,
    "Logged in with Google successfully.",
    result
  );
});
var forgotPassword2 = catchAsync(async (req, res) => {
  const input = validateForgotPasswordInput(req.body);
  await forgotPassword(input);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.ACCEPTED,
    message: "If the account can reset its password, a code will be emailed.",
    data: null
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  const input = validateResetPasswordInput(req.body);
  await resetPassword(input);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.OK,
    message: "Password reset successfully.",
    data: null
  });
});
var logout = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (typeof refreshToken === "string") {
    await revokeRefreshToken(refreshToken);
  }
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.OK,
    message: "Logged out successfully.",
    data: null
  });
});
var refreshTokens2 = catchAsync(async (req, res) => {
  const refreshToken = validateRefreshToken(req.cookies?.refreshToken);
  const result = await refreshTokens(refreshToken);
  sendAuthenticatedResponse(
    res,
    httpStatus5.OK,
    "Tokens refreshed successfully.",
    result
  );
});
var getCurrentUser = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new HttpError(httpStatus5.UNAUTHORIZED, "Authentication required.");
  }
  sendResponse(res, {
    success: true,
    statusCode: httpStatus5.OK,
    message: "Current user retrieved successfully.",
    data: { user: req.user }
  });
});
var authController = {
  register: register2,
  verifyRegistration: verifyRegistration2,
  login: login2,
  googleLogin: googleLogin2,
  forgotPassword: forgotPassword2,
  resetPassword: resetPassword2,
  logout,
  getCurrentUser,
  refreshTokens: refreshTokens2
};

// src/app/modules/auth/auth.route.ts
var router = Router();
router.post("/register", authController.register);
router.post("/verify-registration", authController.verifyRegistration);
router.post("/login", authController.login);
router.post("/google-login", authController.googleLogin);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/refresh", authController.refreshTokens);
router.post("/logout", authController.logout);
router.get("/me", auth(), authController.getCurrentUser);
var auth_route_default = router;

// src/app/modules/platform/platform.route.ts
import { Router as Router2 } from "express";

// src/app/modules/platform/platform.controller.ts
import httpStatus6 from "http-status";

// src/app/modules/platform/platform.service.ts
var listChapters = (batchId) => prisma.chapter.findMany({
  where: { batchId },
  orderBy: { sortOrder: "asc" },
  include: { lessons: true }
});
var createChapter = (batchId, data) => prisma.chapter.create({ data: { ...data, batchId } });
var updateChapter = (id, data) => prisma.chapter.update({ where: { id }, data });
var deleteChapter = (id) => prisma.chapter.delete({ where: { id } });
var listLessons = (chapterId) => prisma.lesson.findMany({
  where: { chapterId },
  orderBy: { sortOrder: "asc" }
});
var createLesson = (chapterId, data) => prisma.lesson.create({ data: { ...data, chapterId } });
var updateLesson = (id, data) => prisma.lesson.update({ where: { id }, data });
var deleteLesson = (id) => prisma.lesson.delete({ where: { id } });
var getLessonProgress = (studentId, lessonId) => prisma.lessonProgress.findUnique({
  where: { studentId_lessonId: { studentId, lessonId } }
});
var updateLessonProgress = (studentId, lessonId, data) => prisma.lessonProgress.upsert({
  where: { studentId_lessonId: { studentId, lessonId } },
  create: { ...data, studentId, lessonId },
  update: data
});
var listMaterials = (batchId) => prisma.material.findMany({ where: { batchId } });
var createMaterial = (batchId, data) => prisma.material.create({ data: { ...data, batchId } });
var updateMaterial = (id, data) => prisma.material.update({ where: { id }, data });
var deleteMaterial = (id) => prisma.material.delete({ where: { id } });
var listSchedules = (batchId) => prisma.batchSchedule.findMany({ where: { batchId } });
var createSchedule = (batchId, data) => prisma.batchSchedule.create({ data: { ...data, batchId } });
var listSessions = (batchId) => prisma.classSession.findMany({
  where: { batchId },
  orderBy: { startsAt: "asc" }
});
var createSession = (batchId, data) => prisma.classSession.create({ data: { ...data, batchId } });
var updateSession = (id, data) => prisma.classSession.update({ where: { id }, data });
var listAttendance = (sessionId) => prisma.attendance.findMany({
  where: { sessionId },
  include: { student: true }
});
var markAttendance = (sessionId, markedBy, data) => prisma.attendance.upsert({
  where: {
    sessionId_studentId: { sessionId, studentId: data.studentId }
  },
  create: { ...data, sessionId, markedBy },
  update: { status: data.status, markedBy }
});
var listAssignments = (batchId) => prisma.assignment.findMany({ where: { batchId } });
var createAssignment = (batchId, data) => prisma.assignment.create({ data: { ...data, batchId } });
var updateAssignment = (id, data) => prisma.assignment.update({ where: { id }, data });
var deleteAssignment = (id) => prisma.assignment.delete({ where: { id } });
var submitAssignment = (assignmentId, studentId, data) => prisma.assignmentSubmission.upsert({
  where: { assignmentId_studentId: { assignmentId, studentId } },
  create: { ...data, assignmentId, studentId },
  update: { ...data, status: "SUBMITTED" }
});
var listSubmissions = (assignmentId) => prisma.assignmentSubmission.findMany({
  where: { assignmentId },
  include: { student: true }
});
var reviewSubmission = (id, reviewerId, data) => prisma.assignmentSubmission.update({
  where: { id },
  data: {
    ...data,
    status: "REVIEWED",
    reviewedAt: /* @__PURE__ */ new Date(),
    reviewedBy: reviewerId
  }
});
var listQuizzes = (batchId) => prisma.quiz.findMany({
  where: { batchId },
  include: { questions: { include: { options: true } } }
});
var createQuiz = (batchId, data) => {
  const { questions, ...quiz } = data;
  return prisma.quiz.create({
    data: {
      ...quiz,
      batchId,
      questions: questions?.length ? {
        create: questions.map((question) => ({
          ...question,
          options: question.options?.length ? { create: question.options } : void 0
        }))
      } : void 0
    }
  });
};
var updateQuiz = (id, data) => prisma.quiz.update({ where: { id }, data });
var startQuizAttempt = (quizId, studentId) => prisma.quizAttempt.create({ data: { quizId, studentId } });
var getQuizAttempt = (id) => prisma.quizAttempt.findUnique({
  where: { id },
  include: {
    quiz: { include: { questions: { include: { options: true } } } }
  }
});
var saveQuizAnswer = (attemptId, questionId, selectedOptionId, answerText, awardedMarks) => prisma.quizAnswer.upsert({
  where: { attemptId_questionId: { attemptId, questionId } },
  create: {
    attemptId,
    questionId,
    selectedOptionId,
    answerText,
    awardedMarks
  },
  update: { selectedOptionId, answerText, awardedMarks }
});
var finishQuizAttempt = (id, score) => prisma.quizAttempt.update({
  where: { id },
  data: { score, submittedAt: /* @__PURE__ */ new Date(), status: "SUBMITTED" }
});
var submitQuizAttempt = async (id, studentId, input) => {
  const attempt = await getQuizAttempt(id);
  if (!attempt || attempt.studentId !== studentId) return null;
  let score = 0;
  for (const answer of input.answers ?? []) {
    const question = attempt.quiz.questions.find(
      (item) => item.id === answer.questionId
    );
    const correct = question?.options.find(
      (option) => option.isCorrect && option.id === answer.selectedOptionId
    );
    const awardedMarks = correct && question ? Number(question.marks) : 0;
    score += awardedMarks;
    await saveQuizAnswer(
      attempt.id,
      answer.questionId,
      answer.selectedOptionId,
      answer.answerText,
      awardedMarks
    );
  }
  return finishQuizAttempt(attempt.id, score);
};
var listQuizAttemptsForStudent = (studentId) => prisma.quizAttempt.findMany({
  where: { studentId },
  include: { quiz: true, answers: true }
});
var listNotices = (batchId) => prisma.notice.findMany({
  where: { batchId, isPublished: true },
  orderBy: { publishedAt: "desc" }
});
var createNotice = (data) => prisma.notice.create({ data });
var updateNotice = (id, data) => prisma.notice.update({ where: { id }, data });
var deleteNotice = (id) => prisma.notice.delete({ where: { id } });
var listNotificationsForUser = (userId) => prisma.notification.findMany({
  where: { userId },
  orderBy: { createdAt: "desc" }
});
var markNotificationRead = (id, userId) => prisma.notification.updateMany({
  where: { id, userId },
  data: { readAt: /* @__PURE__ */ new Date() }
});

// src/app/modules/platform/platform.controller.ts
var respond = (message, action, statusCode = httpStatus6.OK) => catchAsync(async (req, res) => {
  const data = await action(req);
  sendResponse(res, { success: true, statusCode, message, data });
});
var param = (req, name) => {
  const value = req.params[name];
  return typeof value === "string" ? value : "";
};
var requireUser = (req) => {
  if (!req.user) {
    throw new HttpError(
      httpStatus6.UNAUTHORIZED,
      "Authentication required."
    );
  }
  return req.user;
};
var listChapters2 = respond(
  "Chapters retrieved successfully.",
  (req) => listChapters(param(req, "batchId"))
);
var createChapter2 = respond(
  "Chapter created successfully.",
  (req) => createChapter(
    param(req, "batchId"),
    req.body
  ),
  httpStatus6.CREATED
);
var updateChapter2 = respond(
  "Chapter updated successfully.",
  (req) => updateChapter(param(req, "id"), req.body)
);
var deleteChapter2 = respond(
  "Chapter deleted successfully.",
  (req) => deleteChapter(param(req, "id"))
);
var listLessons2 = respond(
  "Lessons retrieved successfully.",
  (req) => listLessons(param(req, "chapterId"))
);
var createLesson2 = respond(
  "Lesson created successfully.",
  (req) => createLesson(
    param(req, "chapterId"),
    req.body
  ),
  httpStatus6.CREATED
);
var updateLesson2 = respond(
  "Lesson updated successfully.",
  (req) => updateLesson(param(req, "id"), req.body)
);
var deleteLesson2 = respond(
  "Lesson deleted successfully.",
  (req) => deleteLesson(param(req, "id"))
);
var getLessonProgress2 = respond(
  "Lesson progress retrieved successfully.",
  (req) => getLessonProgress(
    requireUser(req).id,
    param(req, "lessonId")
  )
);
var updateLessonProgress2 = respond(
  "Lesson progress updated successfully.",
  (req) => updateLessonProgress(
    requireUser(req).id,
    param(req, "lessonId"),
    req.body
  )
);
var listMaterials2 = respond(
  "Materials retrieved successfully.",
  (req) => listMaterials(param(req, "batchId"))
);
var createMaterial2 = respond(
  "Material created successfully.",
  (req) => createMaterial(
    param(req, "batchId"),
    req.body
  ),
  httpStatus6.CREATED
);
var updateMaterial2 = respond(
  "Material updated successfully.",
  (req) => updateMaterial(
    param(req, "id"),
    req.body
  )
);
var deleteMaterial2 = respond(
  "Material deleted successfully.",
  (req) => deleteMaterial(param(req, "id"))
);
var listSchedules2 = respond(
  "Schedules retrieved successfully.",
  (req) => listSchedules(param(req, "batchId"))
);
var createSchedule2 = respond(
  "Schedule created successfully.",
  (req) => createSchedule(
    param(req, "batchId"),
    req.body
  ),
  httpStatus6.CREATED
);
var listSessions2 = respond(
  "Sessions retrieved successfully.",
  (req) => listSessions(param(req, "batchId"))
);
var createSession2 = respond(
  "Session created successfully.",
  (req) => createSession(
    param(req, "batchId"),
    req.body
  ),
  httpStatus6.CREATED
);
var updateSession2 = respond(
  "Session updated successfully.",
  (req) => updateSession(
    param(req, "id"),
    req.body
  )
);
var listAttendance2 = respond(
  "Attendance retrieved successfully.",
  (req) => listAttendance(param(req, "sessionId"))
);
var markAttendance2 = respond(
  "Attendance marked successfully.",
  (req) => markAttendance(
    param(req, "sessionId"),
    requireUser(req).id,
    req.body
  )
);
var listAssignments2 = respond(
  "Assignments retrieved successfully.",
  (req) => listAssignments(param(req, "batchId"))
);
var createAssignment2 = respond(
  "Assignment created successfully.",
  (req) => createAssignment(
    param(req, "batchId"),
    req.body
  ),
  httpStatus6.CREATED
);
var updateAssignment2 = respond(
  "Assignment updated successfully.",
  (req) => updateAssignment(
    param(req, "id"),
    req.body
  )
);
var deleteAssignment2 = respond(
  "Assignment deleted successfully.",
  (req) => deleteAssignment(param(req, "id"))
);
var submitAssignment2 = respond(
  "Assignment submitted successfully.",
  (req) => submitAssignment(
    param(req, "assignmentId"),
    requireUser(req).id,
    req.body
  ),
  httpStatus6.CREATED
);
var listSubmissions2 = respond(
  "Submissions retrieved successfully.",
  (req) => listSubmissions(param(req, "assignmentId"))
);
var reviewSubmission2 = respond(
  "Submission reviewed successfully.",
  (req) => reviewSubmission(
    param(req, "id"),
    requireUser(req).id,
    req.body
  )
);
var listQuizzes2 = respond(
  "Quizzes retrieved successfully.",
  (req) => listQuizzes(param(req, "batchId"))
);
var createQuiz2 = respond(
  "Quiz created successfully.",
  (req) => createQuiz(
    param(req, "batchId"),
    req.body
  ),
  httpStatus6.CREATED
);
var updateQuiz2 = respond(
  "Quiz updated successfully.",
  (req) => updateQuiz(param(req, "id"), req.body)
);
var startQuizAttempt2 = respond(
  "Quiz attempt started successfully.",
  (req) => startQuizAttempt(
    param(req, "quizId"),
    requireUser(req).id
  ),
  httpStatus6.CREATED
);
var submitQuizAttempt2 = respond("Quiz submitted successfully.", async (req) => {
  const attempt = await submitQuizAttempt(
    param(req, "attemptId"),
    requireUser(req).id,
    req.body
  );
  if (!attempt) {
    throw new HttpError(httpStatus6.NOT_FOUND, "Quiz attempt not found.");
  }
  return attempt;
});
var listMyQuizAttempts = respond(
  "Quiz attempts retrieved successfully.",
  (req) => listQuizAttemptsForStudent(requireUser(req).id)
);
var listNotices2 = respond(
  "Notices retrieved successfully.",
  (req) => listNotices(param(req, "batchId"))
);
var createNotice2 = respond(
  "Notice created successfully.",
  (req) => createNotice(req.body),
  httpStatus6.CREATED
);
var updateNotice2 = respond(
  "Notice updated successfully.",
  (req) => updateNotice(param(req, "id"), req.body)
);
var deleteNotice2 = respond(
  "Notice deleted successfully.",
  (req) => deleteNotice(param(req, "id"))
);
var listMyNotifications = respond(
  "Notifications retrieved successfully.",
  (req) => listNotificationsForUser(requireUser(req).id)
);
var markNotificationRead2 = respond(
  "Notification marked as read.",
  (req) => markNotificationRead(
    param(req, "id"),
    requireUser(req).id
  )
);
var platformController = {
  listChapters: listChapters2,
  createChapter: createChapter2,
  updateChapter: updateChapter2,
  deleteChapter: deleteChapter2,
  listLessons: listLessons2,
  createLesson: createLesson2,
  updateLesson: updateLesson2,
  deleteLesson: deleteLesson2,
  getLessonProgress: getLessonProgress2,
  updateLessonProgress: updateLessonProgress2,
  listMaterials: listMaterials2,
  createMaterial: createMaterial2,
  updateMaterial: updateMaterial2,
  deleteMaterial: deleteMaterial2,
  listSchedules: listSchedules2,
  createSchedule: createSchedule2,
  listSessions: listSessions2,
  createSession: createSession2,
  updateSession: updateSession2,
  listAttendance: listAttendance2,
  markAttendance: markAttendance2,
  listAssignments: listAssignments2,
  createAssignment: createAssignment2,
  updateAssignment: updateAssignment2,
  deleteAssignment: deleteAssignment2,
  submitAssignment: submitAssignment2,
  listSubmissions: listSubmissions2,
  reviewSubmission: reviewSubmission2,
  listQuizzes: listQuizzes2,
  createQuiz: createQuiz2,
  updateQuiz: updateQuiz2,
  startQuizAttempt: startQuizAttempt2,
  submitQuizAttempt: submitQuizAttempt2,
  listMyQuizAttempts,
  listNotices: listNotices2,
  createNotice: createNotice2,
  updateNotice: updateNotice2,
  deleteNotice: deleteNotice2,
  listMyNotifications,
  markNotificationRead: markNotificationRead2
};

// src/app/modules/platform/platform.route.ts
var router2 = Router2();
var adminOnly = auth(UserRole.ADMIN);
router2.get("/batches/:batchId/chapters", platformController.listChapters);
router2.post("/batches/:batchId/chapters", adminOnly, platformController.createChapter);
router2.patch("/chapters/:id", adminOnly, platformController.updateChapter);
router2.delete("/chapters/:id", adminOnly, platformController.deleteChapter);
router2.get("/chapters/:chapterId/lessons", platformController.listLessons);
router2.post("/chapters/:chapterId/lessons", adminOnly, platformController.createLesson);
router2.patch("/lessons/:id", adminOnly, platformController.updateLesson);
router2.delete("/lessons/:id", adminOnly, platformController.deleteLesson);
router2.get("/lessons/:lessonId/progress", auth(), platformController.getLessonProgress);
router2.put("/lessons/:lessonId/progress", auth(), platformController.updateLessonProgress);
router2.get("/batches/:batchId/materials", platformController.listMaterials);
router2.post("/batches/:batchId/materials", adminOnly, platformController.createMaterial);
router2.patch("/materials/:id", adminOnly, platformController.updateMaterial);
router2.delete("/materials/:id", adminOnly, platformController.deleteMaterial);
router2.get("/batches/:batchId/schedules", platformController.listSchedules);
router2.post("/batches/:batchId/schedules", adminOnly, platformController.createSchedule);
router2.get("/batches/:batchId/sessions", platformController.listSessions);
router2.post("/batches/:batchId/sessions", adminOnly, platformController.createSession);
router2.patch("/sessions/:id", adminOnly, platformController.updateSession);
router2.get("/sessions/:sessionId/attendance", adminOnly, platformController.listAttendance);
router2.put("/sessions/:sessionId/attendance", adminOnly, platformController.markAttendance);
router2.get("/batches/:batchId/assignments", platformController.listAssignments);
router2.post("/batches/:batchId/assignments", adminOnly, platformController.createAssignment);
router2.patch("/assignments/:id", adminOnly, platformController.updateAssignment);
router2.delete("/assignments/:id", adminOnly, platformController.deleteAssignment);
router2.post("/assignments/:assignmentId/submissions", auth(), platformController.submitAssignment);
router2.get("/assignments/:assignmentId/submissions", adminOnly, platformController.listSubmissions);
router2.patch("/submissions/:id", adminOnly, platformController.reviewSubmission);
router2.get("/batches/:batchId/quizzes", platformController.listQuizzes);
router2.post("/batches/:batchId/quizzes", adminOnly, platformController.createQuiz);
router2.patch("/quizzes/:id", adminOnly, platformController.updateQuiz);
router2.post("/quizzes/:quizId/attempts", auth(), platformController.startQuizAttempt);
router2.post("/quiz-attempts/:attemptId/submit", auth(), platformController.submitQuizAttempt);
router2.get("/quiz-attempts/me", auth(), platformController.listMyQuizAttempts);
router2.get("/batches/:batchId/notices", platformController.listNotices);
router2.post("/notices", adminOnly, platformController.createNotice);
router2.patch("/notices/:id", adminOnly, platformController.updateNotice);
router2.delete("/notices/:id", adminOnly, platformController.deleteNotice);
router2.get("/notifications/me", auth(), platformController.listMyNotifications);
router2.patch("/notifications/:id/read", auth(), platformController.markNotificationRead);
var platform_route_default = router2;

// src/app/modules/enrollment/enrollment.route.ts
import { Router as Router3 } from "express";

// src/app/modules/enrollment/enrollment.controller.ts
import httpStatus7 from "http-status";

// src/app/modules/enrollment/enrollment.service.ts
var createEnrollment = (studentId, batchId) => prisma.enrollment.create({
  data: { batchId, studentId, status: "PENDING" }
});
var listEnrollmentsForStudent = (studentId) => prisma.enrollment.findMany({
  where: { studentId },
  include: { batch: { include: { course: true } } }
});
var listEnrollments = () => prisma.enrollment.findMany({
  include: { student: true, batch: { include: { course: true } } }
});
var updateEnrollment = (id, data) => prisma.enrollment.update({ where: { id }, data });
var createAccessLog = (adminId, data) => prisma.accessAuditLog.create({ data: { ...data, adminId } });
var listAccessLogs = (enrollmentId) => prisma.accessAuditLog.findMany({
  where: { enrollmentId },
  orderBy: { createdAt: "desc" }
});

// src/app/modules/enrollment/enrollment.controller.ts
var respond2 = (message, action, statusCode = httpStatus7.OK) => catchAsync(async (req, res) => {
  const data = await action(req);
  sendResponse(res, { success: true, statusCode, message, data });
});
var param2 = (req, name) => {
  const value = req.params[name];
  return typeof value === "string" ? value : "";
};
var requireUser2 = (req) => {
  if (!req.user) {
    throw new HttpError(
      httpStatus7.UNAUTHORIZED,
      "Authentication required."
    );
  }
  return req.user;
};
var createEnrollment2 = respond2(
  "Enrollment created successfully.",
  (req) => createEnrollment(requireUser2(req).id, req.body.batchId),
  httpStatus7.CREATED
);
var listMyEnrollments = respond2(
  "Enrollments retrieved successfully.",
  (req) => listEnrollmentsForStudent(requireUser2(req).id)
);
var listEnrollments2 = respond2(
  "Enrollments retrieved successfully.",
  () => listEnrollments()
);
var updateEnrollment2 = respond2(
  "Enrollment updated successfully.",
  (req) => updateEnrollment(
    param2(req, "id"),
    req.body
  )
);
var createAccessLog2 = respond2(
  "Access log created successfully.",
  (req) => createAccessLog(
    requireUser2(req).id,
    req.body
  ),
  httpStatus7.CREATED
);
var listAccessLogs2 = respond2(
  "Access logs retrieved successfully.",
  (req) => listAccessLogs(param2(req, "enrollmentId"))
);
var enrollmentController = {
  createEnrollment: createEnrollment2,
  listMyEnrollments,
  listEnrollments: listEnrollments2,
  updateEnrollment: updateEnrollment2,
  createAccessLog: createAccessLog2,
  listAccessLogs: listAccessLogs2
};

// src/app/modules/enrollment/enrollment.route.ts
var router3 = Router3();
var adminOnly2 = auth(UserRole.ADMIN);
router3.post("/enrollments", auth(), enrollmentController.createEnrollment);
router3.get("/enrollments/me", auth(), enrollmentController.listMyEnrollments);
router3.get("/enrollments", adminOnly2, enrollmentController.listEnrollments);
router3.patch("/enrollments/:id", adminOnly2, enrollmentController.updateEnrollment);
router3.post("/access-logs", adminOnly2, enrollmentController.createAccessLog);
router3.get(
  "/enrollments/:enrollmentId/access-logs",
  adminOnly2,
  enrollmentController.listAccessLogs
);
var enrollment_route_default = router3;

// src/app/modules/courses/courses.route.ts
import { Router as Router4 } from "express";

// src/app/modules/courses/courses.controller.ts
import httpStatus8 from "http-status";

// src/app/modules/courses/courses.service.ts
var listCourses = (classLevel, includeUnpublished = false) => prisma.course.findMany({
  where: {
    isPublished: includeUnpublished ? void 0 : true,
    classLevel
  },
  include: { batches: true }
});
var createCourse = (data) => prisma.course.create({ data });
var getCourse = (slug) => prisma.course.findUnique({ where: { slug }, include: { batches: true } });
var updateCourse = (id, data) => prisma.course.update({ where: { id }, data });
var deleteCourse = (id) => prisma.course.delete({ where: { id } });
var listBatches = (courseId) => prisma.batch.findMany({
  where: { courseId },
  include: { course: true }
});
var createBatch = (data) => prisma.batch.create({ data });
var getBatch = (id) => prisma.batch.findUnique({
  where: { id },
  include: { course: true, schedules: true, chapters: true }
});
var updateBatch = (id, data) => prisma.batch.update({ where: { id }, data });
var deleteBatch = (id) => prisma.batch.delete({ where: { id } });

// src/app/modules/courses/courses.controller.ts
var respond3 = (message, action, statusCode = httpStatus8.OK) => catchAsync(async (req, res) => {
  const data = await action(req);
  sendResponse(res, { success: true, statusCode, message, data });
});
var param3 = (req, name) => {
  const value = req.params[name];
  return typeof value === "string" ? value : "";
};
var listCourses2 = respond3(
  "Courses retrieved successfully.",
  (req) => listCourses(
    typeof req.query.classLevel === "string" ? req.query.classLevel : void 0,
    req.query.all === "true"
  )
);
var createCourse2 = respond3(
  "Course created successfully.",
  (req) => createCourse(req.body),
  httpStatus8.CREATED
);
var getCourse2 = respond3("Course retrieved successfully.", async (req) => {
  const course = await getCourse(param3(req, "slug"));
  if (!course) throw new HttpError(httpStatus8.NOT_FOUND, "Course not found.");
  return course;
});
var updateCourse2 = respond3(
  "Course updated successfully.",
  (req) => updateCourse(param3(req, "id"), req.body)
);
var deleteCourse2 = respond3(
  "Course deleted successfully.",
  (req) => deleteCourse(param3(req, "id"))
);
var listBatches2 = respond3(
  "Batches retrieved successfully.",
  (req) => listBatches(
    typeof req.query.courseId === "string" ? req.query.courseId : void 0
  )
);
var createBatch2 = respond3(
  "Batch created successfully.",
  (req) => createBatch(req.body),
  httpStatus8.CREATED
);
var getBatch2 = respond3(
  "Batch retrieved successfully.",
  (req) => getBatch(param3(req, "id"))
);
var updateBatch2 = respond3(
  "Batch updated successfully.",
  (req) => updateBatch(param3(req, "id"), req.body)
);
var deleteBatch2 = respond3(
  "Batch deleted successfully.",
  (req) => deleteBatch(param3(req, "id"))
);
var coursesController = {
  listCourses: listCourses2,
  createCourse: createCourse2,
  getCourse: getCourse2,
  updateCourse: updateCourse2,
  deleteCourse: deleteCourse2,
  listBatches: listBatches2,
  createBatch: createBatch2,
  getBatch: getBatch2,
  updateBatch: updateBatch2,
  deleteBatch: deleteBatch2
};

// src/app/modules/courses/courses.route.ts
var router4 = Router4();
var adminOnly3 = auth(UserRole.ADMIN);
router4.get("/courses", coursesController.listCourses);
router4.post("/courses", adminOnly3, coursesController.createCourse);
router4.get("/courses/:slug", coursesController.getCourse);
router4.patch("/courses/:id", adminOnly3, coursesController.updateCourse);
router4.delete("/courses/:id", adminOnly3, coursesController.deleteCourse);
router4.get("/batches", coursesController.listBatches);
router4.post("/batches", adminOnly3, coursesController.createBatch);
router4.get("/batches/:id", coursesController.getBatch);
router4.patch("/batches/:id", adminOnly3, coursesController.updateBatch);
router4.delete("/batches/:id", adminOnly3, coursesController.deleteBatch);
var courses_route_default = router4;

// src/app/modules/users/users.route.ts
import { Router as Router5 } from "express";

// src/app/modules/users/users.controller.ts
import httpStatus9 from "http-status";

// src/app/modules/users/users.service.ts
var getStudentProfile = (userId) => prisma.studentProfile.findUnique({ where: { userId } });
var upsertStudentProfile = (userId, input) => prisma.studentProfile.upsert({
  where: { userId },
  create: {
    userId,
    classLevel: input.classLevel,
    schoolName: input.schoolName,
    guardianName: input.guardianName,
    guardianPhone: input.guardianPhone
  },
  update: {
    classLevel: input.classLevel,
    schoolName: input.schoolName,
    guardianName: input.guardianName,
    guardianPhone: input.guardianPhone
  }
});

// src/app/modules/users/users.controller.ts
var requireUserId = (req) => {
  if (!req.user) {
    throw new HttpError(
      httpStatus9.UNAUTHORIZED,
      "Authentication required."
    );
  }
  return req.user.id;
};
var getMyStudentProfile = catchAsync(async (req, res) => {
  const profile = await getStudentProfile(requireUserId(req));
  sendResponse(res, {
    success: true,
    statusCode: httpStatus9.OK,
    message: "Student profile retrieved successfully.",
    data: profile
  });
});
var upsertMyStudentProfile = catchAsync(
  async (req, res) => {
    const profile = await upsertStudentProfile(
      requireUserId(req),
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus9.OK,
      message: "Student profile saved successfully.",
      data: profile
    });
  }
);
var usersController = {
  getMyStudentProfile,
  upsertMyStudentProfile
};

// src/app/modules/users/users.route.ts
var router5 = Router5();
var studentOnly = auth(UserRole.STUDENT);
router5.get("/profile/me", studentOnly, usersController.getMyStudentProfile);
router5.put("/profile/me", studentOnly, usersController.upsertMyStudentProfile);
var users_route_default = router5;

// src/app/modules/payments/payments.route.ts
import { Router as Router6 } from "express";

// src/app/modules/payments/payments.controller.ts
import httpStatus10 from "http-status";

// src/app/modules/payments/payments.service.ts
var listInvoices = (enrollmentId) => prisma.monthlyInvoice.findMany({ where: { enrollmentId } });
var createInvoice = (data) => prisma.monthlyInvoice.create({ data });
var updateInvoice = (id, data) => prisma.monthlyInvoice.update({ where: { id }, data });
var listPaymentsForStudent = (studentId) => prisma.payment.findMany({
  where: { studentId },
  include: { allocations: true }
});
var createPayment = (studentId, data) => prisma.payment.create({ data: { ...data, studentId } });
var updatePayment = (id, data) => prisma.payment.update({ where: { id }, data });

// src/app/modules/payments/payments.controller.ts
var respond4 = (message, action, statusCode = httpStatus10.OK) => catchAsync(async (req, res) => {
  const data = await action(req);
  sendResponse(res, { success: true, statusCode, message, data });
});
var param4 = (req, name) => {
  const value = req.params[name];
  return typeof value === "string" ? value : "";
};
var requireUserId2 = (req) => {
  if (!req.user) {
    throw new HttpError(
      httpStatus10.UNAUTHORIZED,
      "Authentication required."
    );
  }
  return req.user.id;
};
var listInvoices2 = respond4("Invoices retrieved successfully.", (req) => {
  requireUserId2(req);
  return listInvoices(param4(req, "enrollmentId"));
});
var createInvoice2 = respond4(
  "Invoice created successfully.",
  (req) => createInvoice(req.body),
  httpStatus10.CREATED
);
var updateInvoice2 = respond4(
  "Invoice updated successfully.",
  (req) => updateInvoice(param4(req, "id"), req.body)
);
var listMyPayments = respond4(
  "Payments retrieved successfully.",
  (req) => listPaymentsForStudent(requireUserId2(req))
);
var createPayment2 = respond4(
  "Payment initiated successfully.",
  (req) => createPayment(
    requireUserId2(req),
    req.body
  ),
  httpStatus10.CREATED
);
var updatePayment2 = respond4(
  "Payment updated successfully.",
  (req) => updatePayment(param4(req, "id"), req.body)
);
var paymentsController = {
  listInvoices: listInvoices2,
  createInvoice: createInvoice2,
  updateInvoice: updateInvoice2,
  listMyPayments,
  createPayment: createPayment2,
  updatePayment: updatePayment2
};

// src/app/modules/payments/payments.route.ts
var router6 = Router6();
var adminOnly4 = auth(UserRole.ADMIN);
router6.get(
  "/enrollments/:enrollmentId/invoices",
  auth(),
  paymentsController.listInvoices
);
router6.post("/invoices", adminOnly4, paymentsController.createInvoice);
router6.patch("/invoices/:id", adminOnly4, paymentsController.updateInvoice);
router6.get("/payments/me", auth(), paymentsController.listMyPayments);
router6.post("/payments", auth(), paymentsController.createPayment);
router6.patch("/payments/:id", adminOnly4, paymentsController.updatePayment);
var payments_route_default = router6;

// src/app.ts
var app = express();
app.use(
  cors({
    origin: config_default.appUrl ?? false,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get(
  "/",
  (_req, res) => res.status(200).json({
    message: "api is running"
  })
);
app.use("/api/auth", auth_route_default);
app.use("/api", platform_route_default);
app.use("/api", enrollment_route_default);
app.use("/api", courses_route_default);
app.use("/api", users_route_default);
app.use("/api", payments_route_default);
app.use(notFound);
app.use(globalErrorHandler);
var app_default = app;

// src/server.ts
import "dotenv/config";
var PORT = config_default.port;
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    await redisClient.connect();
    console.log("Redis Connected Successfully.");
    await transporter.verify();
    console.log("Nodemailer Connected Successfully.");
    app_default.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error starting server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
