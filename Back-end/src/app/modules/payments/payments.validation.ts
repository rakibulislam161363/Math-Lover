import { z } from "zod";

const uuidSchema = z.uuid();

export const enrollmentIdParamsSchema = z.object({
  enrollmentId: uuidSchema,
});

export const invoiceIdParamsSchema = z.object({
  id: uuidSchema,
});

export const paymentIdParamsSchema = z.object({
  id: uuidSchema,
});

const billingMonthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use YYYY-MM for the billing month.");

export const createInvoiceValidationSchema = z.object({
  enrollmentId: uuidSchema,
  billingMonth: billingMonthSchema,
});

export const createEnrollmentInvoiceValidationSchema = z.object({
  billingMonth: billingMonthSchema,
});

export const updateInvoiceValidationSchema = z.object({
  dueDate: z.iso.datetime().transform((value) => new Date(value)),
});

export const submitPaymentValidationSchema = z.object({
  invoiceId: uuidSchema,
  senderNumber: z
    .string()
    .trim()
    .regex(/^01[3-9]\d{8}$/, "Enter a valid Bangladeshi mobile number."),
  transactionId: z
    .string()
    .trim()
    .min(5)
    .max(64)
    .regex(/^[A-Za-z0-9]+$/, "TrxID must contain only letters and numbers."),
});

export const paymentDecisionValidationSchema = z
  .object({
    decision: z.enum(["APPROVED", "REJECTED"]),
    reason: z.string().trim().min(1).max(1000).optional(),
  })
  .refine(
    (data) => data.decision !== "REJECTED" || Boolean(data.reason),
    {
      message: "A reason is required when rejecting a payment.",
      path: ["reason"],
    },
  );
