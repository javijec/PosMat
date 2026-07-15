import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import process from "node:process";
import { apiRateLimiter } from "./middleware/rateLimit.js";
import authRouter from "./routes/auth.routes.js";
import authorizedEmailsRouter from "./routes/authorizedEmails.routes.js";
import healthRouter from "./routes/health.routes.js";
import coursesRouter from "./routes/courses.routes.js";
import contentRouter from "./routes/content.routes.js";
import uploadsRouter from "./routes/uploads.routes.js";

const app = express();

// The production API runs behind one reverse-proxy hop. This preserves the
// visitor's IP address for rate limiting instead of treating every request as
// the proxy. Set TRUST_PROXY=0 when exposing the API directly in development.
const trustProxy = Number.parseInt(process.env.TRUST_PROXY || "1", 10);
app.set("trust proxy", Number.isNaN(trustProxy) ? 1 : trustProxy);

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : true;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "8mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api", apiRateLimiter);

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/authorized-emails", authorizedEmailsRouter);
app.use("/api/content", contentRouter);
app.use("/api/uploads", uploadsRouter);
app.use("/api/courses", coursesRouter);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.statusCode || 500).json({
    message: error.message || "Internal server error",
  });
});

export default app;
