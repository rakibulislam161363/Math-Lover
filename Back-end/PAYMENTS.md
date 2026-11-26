# Manual bKash Payment Flow

This flow collects bKash Send Money details and requires an administrator to
verify each transaction in the bKash Merchant App. A submitted TrxID is never
treated as proof of payment by itself.

## Configuration

Set these values in the backend environment:

- `BKASH_PRA_NUMBER` — the public bKash payment receiving number. Payment
  submission stays disabled until this is configured.
- `BKASH_QR_CODE_URL` — optional public URL for the account's QR code.
- `FRONTEND_URL` — allowed browser origin when `APP_URL` is not set.

The frontend uses `NEXT_PUBLIC_API_URL`, defaulting to
`http://localhost:5000/api`.

## Student endpoints

- `GET /api/payments/instructions`
- `GET /api/enrollments/me`
- `POST /api/enrollments` with `{ "batchId": "..." }`
- `POST /api/enrollments/:enrollmentId/invoices` with `{ "billingMonth": "YYYY-MM" }`
- `GET /api/enrollments/:enrollmentId/invoices`
- `POST /api/payments` with `{ "invoiceId": "...", "senderNumber": "01...", "transactionId": "..." }`
- `GET /api/payments/me`

Invoice amounts are calculated from the batch fee by the backend. The payment
request does not accept a client-supplied amount.

## Admin endpoints

- `GET /api/payments/admin/pending`
- `GET /api/payments/admin/history`
- `PATCH /api/payments/admin/:id/decision` with either
  `{ "decision": "APPROVED" }` or
  `{ "decision": "REJECTED", "reason": "..." }`

Approve only after checking the sender, exact amount, and TrxID in the Merchant
App. Payment, invoice, enrollment access, and verification audit changes are
committed together.

## Database

Apply the pending Prisma migration from `Back-end` after confirming the target
database:

```powershell
npm.cmd exec -- prisma migrate deploy
```
