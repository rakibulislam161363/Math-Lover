CREATE TYPE "PaymentVerificationDecision" AS ENUM ('APPROVED', 'REJECTED');

ALTER TABLE "Payment"
ADD COLUMN "senderNumber" VARCHAR(20);

CREATE TABLE "PaymentVerification" (
    "id" UUID NOT NULL,
    "paymentId" UUID NOT NULL,
    "adminId" UUID NOT NULL,
    "decision" "PaymentVerificationDecision" NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentVerification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PaymentVerification_paymentId_createdAt_idx"
ON "PaymentVerification"("paymentId", "createdAt");

CREATE INDEX "PaymentVerification_adminId_createdAt_idx"
ON "PaymentVerification"("adminId", "createdAt");

ALTER TABLE "PaymentVerification"
ADD CONSTRAINT "PaymentVerification_paymentId_fkey"
FOREIGN KEY ("paymentId") REFERENCES "Payment"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PaymentVerification"
ADD CONSTRAINT "PaymentVerification_adminId_fkey"
FOREIGN KEY ("adminId") REFERENCES "User"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
