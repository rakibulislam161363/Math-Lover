import { prisma } from "../../lib/prisma";
import {
  InvoiceCreateInput,
  InvoiceUpdateInput,
  PaymentCreateInput,
  PaymentUpdateInput,
} from "./payments.interface";

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

export const createPayment = (
  studentId: string,
  data: PaymentCreateInput,
) => prisma.payment.create({ data: { ...data, studentId } });

export const updatePayment = (id: string, data: PaymentUpdateInput) =>
  prisma.payment.update({ where: { id }, data });
