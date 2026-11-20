import { UserRole } from "../../../generated/prisma/enums";

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  createdAt: Date;
}

export interface AuthResult {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}