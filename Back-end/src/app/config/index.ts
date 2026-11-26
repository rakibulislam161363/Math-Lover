import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  port: Number(process.env.PORT ?? 5000),
  appUrl: process.env.APP_URL ?? process.env.FRONTEND_URL,
  jwtSecret: process.env.JWT_SECRET,
  google_client_id: process.env.GOOGLE_CLIENT_ID!,
  redis_user: process.env.REDIS_USER!,
	redis_password: process.env.REDIS_PASSWORD!,
	redis_host: process.env.REDIS_HOST!,
	redis_port: process.env.REDIS_PORT!,
  smtp_user: process.env.SMTP_USER!,
	smtp_password: process.env.SMTP_PASSWORD!,
	email_sender: process.env.EMAIL_SENDER!,
  bkashPraNumber: process.env.BKASH_PRA_NUMBER?.trim(),
  bkashQrCodeUrl: process.env.BKASH_QR_CODE_URL?.trim(),
}

export default config;