export type CreateInvoiceInput = {
  enrollmentId: string;
  billingMonth: string;
};

export type UpdateInvoiceInput = {
  dueDate: Date;
};

export type SubmitPaymentInput = {
  invoiceId: string;
  senderNumber: string;
  transactionId: string;
};

export type PaymentDecisionInput = {
  decision: "APPROVED" | "REJECTED";
  reason?: string;
};
