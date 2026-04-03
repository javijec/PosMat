import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import authorizedEmailsRouter from "./routes/authorizedEmails.routes.js";
import healthRouter from "./routes/health.routes.js";
import coursesRouter from "./routes/courses.routes.js";
import contentRouter from "./routes/content.routes.js";

const app = express();

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

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/authorized-emails", authorizedEmailsRouter);
app.use("/api/content", contentRouter);
app.use("/api/courses", coursesRouter);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.statusCode || 500).json({
    message: error.message || "Internal server error",
  });
});

export default app;
