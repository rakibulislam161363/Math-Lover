import httpStatus from "http-status";
import { Prisma } from "../../../generated/prisma/client";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { HttpError } from "../../utils/httpError";
import {
  CreateInvoiceInput,
  PaymentDecisionInput,
  SubmitPaymentInput,
  UpdateInvoiceInput,
} from "./payments.interface";

export const getPaymentInstructions = () => ({
  provider: "BKASH",
  praNumber: config.bkashPraNumber || null,
  qrCodeUrl: config.bkashQrCodeUrl || null,
  configured: Boolean(config.bkashPraNumber),
});

const paymentInclude = {
  allocations: {
    include: {
      invoice: {
        select: { id: true, billingMonth: true, amount: true, status: true },
      },
    },
  },
  verifications: {
    include: { admin: { select: { id: true, fullName: true } } },
    orderBy: { createdAt: "desc" as const },
  },
};

const adminPaymentInclude = {
  ...paymentInclude,
  student: { select: { id: true, fullName: true, email: true, phone: true } },
  enrollment: {
    select: {
      id: true,
      batch: {
        select: { id: true, title: true, course: { select: { title: true } } },
      },
    },
  },
};

const createInvoiceForEnrollment = async (
  data: CreateInvoiceInput,
  studentId?: string,
) => {
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      id: data.enrollmentId,
      ...(studentId ? { studentId } : {}),
      status: { in: ["PENDING", "ACTIVE"] },
    },
    select: {
      id: true,
      batch: { select: { monthlyFee: true } },
    },
  });

  if (!enrollment) {
    throw new HttpError(
      studentId ? httpStatus.NOT_FOUND : httpStatus.BAD_REQUEST,
      studentId
        ? "Enrollment not found."
        : "A pending or active enrollment is required.",
    );
  }

  const [year, month] = data.billingMonth.split("-").map(Number);
  const billingMonth = new Date(Date.UTC(year, month - 1, 1));
  const periodStart = billingMonth;
  const periodEnd = new Date(Date.UTC(year, month, 0));
  const dueDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  return prisma.monthlyInvoice.create({
    data: {
      enrollmentId: enrollment.id,
      billingMonth,
      periodStart,
      periodEnd,
      dueDate,
      amount: enrollment.batch.monthlyFee,
    },
  });
};

export const listInvoices = (enrollmentId: string, studentId: string) =>
  prisma.monthlyInvoice.findMany({
    where: { enrollmentId, enrollment: { studentId } },
    include: {
      allocations: {
        include: {
          payment: {
            select: { id: true, status: true, transactionId: true },
          },
        },
      },
    },
    orderBy: { billingMonth: "desc" },
  });

export const createInvoice = (
  studentId: string,
  data: CreateInvoiceInput,
) => createInvoiceForEnrollment(data, studentId);

export const createInvoiceAsAdmin = (data: CreateInvoiceInput) =>
  createInvoiceForEnrollment(data);

export const updateInvoice = async (id: string, data: UpdateInvoiceInput) => {
  const invoice = await prisma.monthlyInvoice.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!invoice) {
    throw new HttpError(httpStatus.NOT_FOUND, "Invoice not found.");
  }
  if (invoice.status === "PAID" || invoice.status === "CANCELLED") {
    throw new HttpError(
      httpStatus.CONFLICT,
      "A paid or cancelled invoice cannot be updated.",
    );
  }

  return prisma.monthlyInvoice.update({ where: { id }, data });
};

export const listPaymentsForStudent = (studentId: string) =>
  prisma.payment.findMany({
    where: { studentId },
    include: paymentInclude,
    orderBy: { createdAt: "desc" },
  });

export const submitPayment = async (
  studentId: string,
  data: SubmitPaymentInput,
) => {
  if (!config.bkashPraNumber) {
    throw new HttpError(
      httpStatus.SERVICE_UNAVAILABLE,
      "Payment instructions are not configured.",
    );
  }

  return prisma.$transaction(
    async (tx) => {
      const invoice = await tx.monthlyInvoice.findUnique({
        where: { id: data.invoiceId },
        include: {
          enrollment: {
            select: { id: true, studentId: true, status: true },
          },
        },
      });

      if (!invoice || invoice.enrollment.studentId !== studentId) {
        throw new HttpError(httpStatus.NOT_FOUND, "Invoice not found.");
      }
      if (
        !["PENDING", "PARTIALLY_PAID", "OVERDUE"].includes(invoice.status) ||
        !["PENDING", "ACTIVE"].includes(invoice.enrollment.status)
      ) {
        throw new HttpError(
          httpStatus.CONFLICT,
          "This invoice cannot accept a payment.",
        );
      }

      const existingPending = await tx.payment.findFirst({
        where: {
          status: "PENDING",
          allocations: { some: { invoiceId: invoice.id } },
        },
        select: { id: true },
      });
      if (existingPending) {
        throw new HttpError(
          httpStatus.CONFLICT,
          "A payment for this invoice is already awaiting verification.",
        );
      }

      const paid = await tx.paymentAllocation.aggregate({
        where: { invoiceId: invoice.id, payment: { status: "SUCCESS" } },
        _sum: { allocatedAmount: true },
      });
      const remainingAmount = invoice.amount.minus(
        paid._sum.allocatedAmount ?? new Prisma.Decimal(0),
      );
      if (remainingAmount.lte(0)) {
        throw new HttpError(httpStatus.CONFLICT, "This invoice is already paid.");
      }

      return tx.payment.create({
        data: {
          studentId,
          enrollmentId: invoice.enrollment.id,
          amount: remainingAmount,
          currency: invoice.currency,
          provider: "BKASH",
          paymentMethod: "MOBILE_BANKING",
          status: "PENDING",
          senderNumber: data.senderNumber,
          transactionId: data.transactionId.toUpperCase(),
          allocations: {
            create: {
              invoiceId: invoice.id,
              allocatedAmount: remainingAmount,
            },
          },
        },
        include: paymentInclude,
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
};

export const listPendingPayments = () =>
  prisma.payment.findMany({
    where: { status: "PENDING" },
    include: adminPaymentInclude,
    orderBy: { createdAt: "asc" },
  });

export const listPaymentVerificationHistory = () =>
  prisma.payment.findMany({
    where: { verifications: { some: {} } },
    include: adminPaymentInclude,
    orderBy: { validatedAt: "desc" },
  });

export const decidePayment = async (
  paymentId: string,
  adminId: string,
  data: PaymentDecisionInput,
) =>
  prisma.$transaction(
    async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId },
        include: { allocations: { include: { invoice: true } } },
      });
      if (!payment) {
        throw new HttpError(httpStatus.NOT_FOUND, "Payment not found.");
      }
      if (payment.status !== "PENDING") {
        throw new HttpError(
          httpStatus.CONFLICT,
          "This payment has already been reviewed.",
        );
      }
      if (payment.allocations.length !== 1) {
        throw new HttpError(
          httpStatus.CONFLICT,
          "Payment must be linked to exactly one invoice.",
        );
      }

      const now = new Date();
      const status = data.decision === "APPROVED" ? "SUCCESS" : "FAILED";
      const changed = await tx.payment.updateMany({
        where: { id: paymentId, status: "PENDING" },
        data: {
          status,
          validatedAt: now,
          paidAt: data.decision === "APPROVED" ? now : null,
        },
      });
      if (changed.count !== 1) {
        throw new HttpError(
          httpStatus.CONFLICT,
          "This payment has already been reviewed.",
        );
      }

      await tx.paymentVerification.create({
        data: {
          paymentId,
          adminId,
          decision: data.decision,
          reason: data.reason,
        },
      });

      const allocation = payment.allocations[0];
      if (data.decision === "REJECTED") {
        return tx.payment.findUniqueOrThrow({
          where: { id: paymentId },
          include: adminPaymentInclude,
        });
      } else {
        const invoice = allocation.invoice;
        const paid = await tx.paymentAllocation.aggregate({
          where: { invoiceId: invoice.id, payment: { status: "SUCCESS" } },
          _sum: { allocatedAmount: true },
        });
        const invoicePaid = (paid._sum.allocatedAmount ?? new Prisma.Decimal(0))
          .gte(invoice.amount);

        await tx.monthlyInvoice.update({
          where: { id: invoice.id },
          data: {
            status: invoicePaid ? "PAID" : "PARTIALLY_PAID",
            paidAt: invoicePaid ? now : null,
          },
        });

        if (invoicePaid) {
          const enrollment = await tx.enrollment.findUnique({
            where: { id: payment.enrollmentId },
            select: { status: true, startedAt: true },
          });
          if (enrollment?.status === "PENDING") {
            await tx.enrollment.update({
              where: { id: payment.enrollmentId },
              data: {
                status: "ACTIVE",
                startedAt: enrollment.startedAt ?? now,
              },
            });
            await tx.accessAuditLog.createMany({
              data: (
                ["RECORDED", "LIVE", "MATERIAL", "ASSIGNMENT"] as const
              ).map((accessType) => ({
                enrollmentId: payment.enrollmentId,
                adminId,
                accessType,
                action: "GRANTED" as const,
                reason: "Enrollment activated after verified invoice payment.",
              })),
            });
          }
        }
      }

      return tx.payment.findUniqueOrThrow({
        where: { id: paymentId },
        include: adminPaymentInclude,
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
