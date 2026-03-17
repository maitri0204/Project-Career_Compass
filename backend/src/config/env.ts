import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = ["MONGO_URI"] as const;

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const ENV = {
  PORT: process.env.PORT || "5000",
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI as string,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
};
