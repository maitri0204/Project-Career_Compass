import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import { connectDB } from "./config/db";
import routes from "./routes/index";
import { errorHandler, notFound } from "./middleware/errorHandler";

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api", routes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${ENV.PORT}`);
    console.log(`📦 Environment: ${ENV.NODE_ENV}`);
  });
};

start();
