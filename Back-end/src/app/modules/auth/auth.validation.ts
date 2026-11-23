import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .max(254)
  .email("A valid email is required.")
  .transform((email) => email.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .refine(
    (password) => Buffer.byteLength(password, "utf8") <= 72,
    "Password must be no more than 72 bytes.",
  );

const verificationCodeSchema = z
  .string()
  .regex(/^\d{6}$/, "A six-digit verification code is required.");

export const registerValidationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be between 2 and 100 characters.")
    .max(100, "Full name must be between 2 and 100 characters."),
  email: emailSchema,
  password: passwordSchema,
  phone: z
    .string()
    .trim()
    .max(32, "Phone must be no more than 32 characters.")
    .optional()
    .transform((phone) => phone || undefined),
});

export const verifyRegistrationValidationSchema = z.object({
  email: emailSchema,
  otp: verificationCodeSchema,
});

export const loginValidationSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, "Invalid email or password.")
    .refine(
      (password) => Buffer.byteLength(password, "utf8") <= 72,
      "Invalid email or password.",
    ),
});

export const googleLoginValidationSchema = z.object({
  idToken: z
    .string()
    .trim()
    .min(1, "A valid Google ID token is required.")
    .max(8192, "A valid Google ID token is required."),
});

export const forgotPasswordValidationSchema = z.object({
  email: emailSchema,
});

export const resetPasswordValidationSchema = z.object({
  email: emailSchema,
  otp: verificationCodeSchema,
  newPassword: passwordSchema,
});

export const setPasswordValidationSchema = z.object({
  newPassword: passwordSchema,
});

export const refreshTokenValidationSchema = z.object({
  refreshToken: z
    .string()
    .regex(/^[a-f0-9]{64}$/i, "A valid refresh token is required."),
});
