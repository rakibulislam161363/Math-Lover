import { ClassLevel } from "../../../generated/prisma/enums";

export interface StudentProfileInput {
  classLevel: ClassLevel;
  schoolName?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
}
