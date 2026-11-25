import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { HttpError } from "../../utils/httpError";
import { sendResponse } from "../../utils/sendResponse";
import * as paymentsService from "./payments.service";
import {
  InvoiceCreateInput,
  InvoiceUpdateInput,
  PaymentCreateInput,
  PaymentUpdateInput,
} from "./payments.interface"

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
    throw new HttpError(
      httpStatus.UNAUTHORIZED,
      "Authentication required.",
    );
  }
  return req.user.id
};

const listInvoices = respond("Invoices retrieved successfully.", (req) => {
  requireUserId(req);
  return paymentsService.listInvoices(param(req, "enrollmentId"));
});
const createInvoice = respond(
  "Invoice created successfully.",
  (req) => paymentsService.createInvoice(req.body as InvoiceCreateInput),
  httpStatus.CREATED,
);
const updateInvoice = respond("Invoice updated successfully.", (req) =>
  paymentsService.updateInvoice(param(req, "id"), req.body as InvoiceUpdateInput),
);
const listMyPayments = respond("Payments retrieved successfully.", (req) =>
  paymentsService.listPaymentsForStudent(requireUserId(req)),
);
const createPayment = respond(
  "Payment initiated successfully.",
  (req) =>
    paymentsService.createPayment(
      requireUserId(req),
      req.body as PaymentCreateInput,
    ),
  httpStatus.CREATED,
);
const updatePayment = respond("Payment updated successfully.", (req) =>
  paymentsService.updatePayment(param(req, "id"), req.body as PaymentUpdateInput),
);

export const paymentsController = {
  listInvoices,
  createInvoice,
  updateInvoice,
  listMyPayments,
  createPayment,
  updatePayment,
};
