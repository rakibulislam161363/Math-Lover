import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validateRequest";
import { paymentsController } from "./payments.controller";
import {
  createEnrollmentInvoiceValidationSchema,
  createInvoiceValidationSchema,
  enrollmentIdParamsSchema,
  invoiceIdParamsSchema,
  paymentDecisionValidationSchema,
  paymentIdParamsSchema,
  submitPaymentValidationSchema,
  updateInvoiceValidationSchema,
} from "./payments.validation";

const router = Router();
const adminOnly = auth(UserRole.ADMIN);
const studentOnly = auth(UserRole.STUDENT);

router.get(
  "/enrollments/:enrollmentId/invoices",
  studentOnly,
  validateRequest(enrollmentIdParamsSchema, "params"),
  paymentsController.listInvoices,
);
router.post(
  "/enrollments/:enrollmentId/invoices",
  studentOnly,
  validateRequest(enrollmentIdParamsSchema, "params"),
  validateRequest(createEnrollmentInvoiceValidationSchema),
  paymentsController.createStudentInvoice,
);
router.post(
  "/invoices",
  adminOnly,
  validateRequest(createInvoiceValidationSchema),
  paymentsController.createAdminInvoice,
);
router.patch(
  "/invoices/:id",
  adminOnly,
  validateRequest(invoiceIdParamsSchema, "params"),
  validateRequest(updateInvoiceValidationSchema),
  paymentsController.updateInvoice,
);
router.get(
  "/payments/instructions",
  studentOnly,
  paymentsController.getPaymentInstructions,
);
router.get("/payments/me", studentOnly, paymentsController.listMyPayments);
router.post(
  "/payments",
  studentOnly,
  validateRequest(submitPaymentValidationSchema),
  paymentsController.submitPayment,
);
router.get(
  "/payments/admin/pending",
  adminOnly,
  paymentsController.listPendingPayments,
);
router.get(
  "/payments/admin/history",
  adminOnly,
  paymentsController.listPaymentVerificationHistory,
);
router.patch(
  "/payments/admin/:id/decision",
  adminOnly,
  validateRequest(paymentIdParamsSchema, "params"),
  validateRequest(paymentDecisionValidationSchema),
  paymentsController.decidePayment,
);

export default router;
