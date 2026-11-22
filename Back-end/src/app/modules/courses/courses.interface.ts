import { Prisma } from "../../../generated/prisma/client";
import { ClassLevel } from "../../../generated/prisma/enums";

export type CourseClassLevel = ClassLevel;
export type CourseCreateInput = Prisma.CourseUncheckedCreateInput;
export type CourseUpdateInput = Prisma.CourseUncheckedUpdateInput;
export type BatchCreateInput = Prisma.BatchUncheckedCreateInput;
export type BatchUpdateInput = Prisma.BatchUncheckedUpdateInput;
