import { rateLimit } from "express-rate-limit";

const jsonLimitMessage = (message) => ({ message });

const createRateLimiter = ({ windowMs, limit, message, skip }) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    skip,
    handler: (_req, res) => res.status(429).json(jsonLimitMessage(message)),
  });

const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  limit: 120,
  message: "Demasiadas solicitudes. Intentá de nuevo en un minuto.",
});

const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: "Demasiados intentos de inicio de sesión. Esperá 15 minutos antes de reintentar.",
});

const registrationRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  message: "Demasiados intentos de registro. Intentá de nuevo más tarde.",
});

const uploadRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  limit: 10,
  message: "Demasiadas operaciones sobre archivos. Intentá de nuevo en un minuto.",
  skip: (req) => req.method === "GET",
});

export {
  apiRateLimiter,
  loginRateLimiter,
  registrationRateLimiter,
  uploadRateLimiter,
};
