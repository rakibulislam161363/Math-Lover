import { prisma } from "../../lib/prisma";
import { StudentProfileInput } from "./users.interface";

export const getStudentProfile = (userId: string) =>
  prisma.studentProfile.findUnique({ where: { userId } });

export const upsertStudentProfile = (
  userId: string,
  input: StudentProfileInput,
) =>
  prisma.studentProfile.upsert({
    where: { userId },
    create: {
      userId,
      classLevel: input.classLevel,
      schoolName: input.schoolName,
      guardianName: input.guardianName,
      guardianPhone: input.guardianPhone,
    },
    update: {
      classLevel: input.classLevel,
      schoolName: input.schoolName,
      guardianName: input.guardianName,
      guardianPhone: input.guardianPhone,
    },
  });
