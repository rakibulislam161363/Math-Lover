import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/auth";
import { paymentsController } from "./payments.controller";

const router = Router();
const adminOnly = auth(UserRole.ADMIN);

router.get(
  "/enrollments/:enrollmentId/invoices",
  auth(),
  paymentsController.listInvoices,
);
router.post("/invoices", adminOnly, paymentsController.createInvoice);
router.patch("/invoices/:id", adminOnly, paymentsController.updateInvoice);
router.get("/payments/me", auth(), paymentsController.listMyPayments);
router.post("/payments", auth(), paymentsController.createPayment);
router.patch("/payments/:id", adminOnly, paymentsController.updatePayment);

export default router;
