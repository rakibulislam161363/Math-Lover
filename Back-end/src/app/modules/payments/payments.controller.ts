import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { HttpError } from "../../utils/httpError";
import { sendResponse } from "../../utils/sendResponse";
import * as paymentsService from "./payments.service";
import {
  CreateInvoiceInput,
  PaymentDecisionInput,
  SubmitPaymentInput,
  UpdateInvoiceInput,
} from "./payments.interface";

type ControllerAction = (req: Request) => Promise<unknown>;

const respond = (
  message: string,
  action: ControllerAction,
  statusCode: number = httpStatus.OK,
) =>
  catchAsync(async (req: Request, res: Response) => {
    const data = await action(req);
    sendResponse(res, { success: true, statusCode, message, data });
  });

const param = (req: Request, name: string): string => {
  const value = req.params[name];
  return typeof value === "string" ? value : "";
};

const requireUserId = (req: Request): string => {
  if (!req.user) {
    throw new HttpError(httpStatus.UNAUTHORIZED, "Authentication required.");
  }
  return req.user.id;
};

const listInvoices = respond("Invoices retrieved successfully.", (req) =>
  paymentsService.listInvoices(
    param(req, "enrollmentId"),
    requireUserId(req),
  ),
);

const getPaymentInstructions = respond(
  "Payment instructions retrieved successfully.",
  () => Promise.resolve(paymentsService.getPaymentInstructions()),
);

const createStudentInvoice = respond(
  "Invoice created successfully.",
  (req) =>
    paymentsService.createInvoice(requireUserId(req), {
      ...req.body,
      enrollmentId: param(req, "enrollmentId"),
    } as CreateInvoiceInput),
  httpStatus.CREATED,
);

const createAdminInvoice = respond(
  "Invoice created successfully.",
  (req) =>
    paymentsService.createInvoiceAsAdmin(req.body as CreateInvoiceInput),
  httpStatus.CREATED,
);

const updateInvoice = respond("Invoice updated successfully.", (req) =>
  paymentsService.updateInvoice(
    param(req, "id"),
    req.body as UpdateInvoiceInput,
  ),
);

const listMyPayments = respond("Payments retrieved successfully.", (req) =>
  paymentsService.listPaymentsForStudent(requireUserId(req)),
);

const submitPayment = respond(
  "Payment submitted for verification.",
  (req) =>
    paymentsService.submitPayment(
      requireUserId(req),
      req.body as SubmitPaymentInput,
    ),
  httpStatus.CREATED,
);

const listPendingPayments = respond(
  "Pending payments retrieved successfully.",
  () => paymentsService.listPendingPayments(),
);

const listPaymentVerificationHistory = respond(
  "Payment verification history retrieved successfully.",
  () => paymentsService.listPaymentVerificationHistory(),
);

const decidePayment = respond("Payment review saved successfully.", (req) =>
  paymentsService.decidePayment(
    param(req, "id"),
    requireUserId(req),
    req.body as PaymentDecisionInput,
  ),
);

export const paymentsController = {
  listInvoices,
  getPaymentInstructions,
  createStudentInvoice,
  createAdminInvoice,
  updateInvoice,
  listMyPayments,
  submitPayment,
  listPendingPayments,
  listPaymentVerificationHistory,
  decidePayment,
};
