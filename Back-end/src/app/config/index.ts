import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  port: Number(process.env.PORT ?? 5000),
  appUrl: process.env.APP_URL,
  jwtSecret: process.env.JWT_SECRET,
}

export default config;