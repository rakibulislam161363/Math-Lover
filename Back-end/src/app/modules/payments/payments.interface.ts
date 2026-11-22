import { Prisma } from "../../../generated/prisma/client";

export type InvoiceCreateInput = Prisma.MonthlyInvoiceUncheckedCreateInput;
export type InvoiceUpdateInput = Prisma.MonthlyInvoiceUncheckedUpdateInput;
export type PaymentCreateInput = Omit<
  Prisma.PaymentUncheckedCreateInput,
  "studentId"
>;
export type PaymentUpdateInput = Prisma.PaymentUncheckedUpdateInput;
