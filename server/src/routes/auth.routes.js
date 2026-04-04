import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import {
  clearAuthCookie,
  getTokenFromRequest,
  sanitizeUser,
  setAuthCookie,
  signAuthToken,
  verifyAuthToken,
} from "../utils/auth.js";

const router = Router();

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

const normalizeEmail = (email) => email.trim().toLowerCase();

const isAuthorizedEmail = async (email) => {
  const normalizedEmail = normalizeEmail(email);

  const directMatch = await prisma.authorizedEmail.findUnique({
    where: { email: normalizedEmail },
  });

  if (directMatch) {
    return true;
  }

  const legacyEntries = await prisma.contentEntry.findMany({
    where: { collectionName: "authorizedEmails" },
  });

  return legacyEntries.some(
    (entry) =>
      typeof entry.data === "object" &&
      entry.data !== null &&
      entry.data.email?.toLowerCase?.() === normalizedEmail
  );
};

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = authSchema.parse(req.body);
    const normalizedEmail = normalizeEmail(email);

    const userCount = await prisma.user.count();
    const allowFirstUserBootstrap = userCount === 0;
    const authorized = await isAuthorizedEmail(normalizedEmail);

    if (!authorized && !allowFirstUserBootstrap) {
      return res.status(403).json({
        message: "Email no autorizado. Contacta al administrador.",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Ya existe un usuario con ese email.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
      },
    });

    if (allowFirstUserBootstrap) {
      await prisma.authorizedEmail.upsert({
        where: { email: normalizedEmail },
        update: {},
        create: { email: normalizedEmail },
      });
    }

    const token = signAuthToken(user);
    setAuthCookie(res, token);

    return res.status(201).json(sanitizeUser(user));
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = authSchema.parse(req.body);
    const normalizedEmail = normalizeEmail(email);

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const authorized = await isAuthorizedEmail(normalizedEmail);
    if (!authorized) {
      clearAuthCookie(res);
      return res.status(403).json({
        message: "Email no autorizado. Contacta al administrador.",
      });
    }

    const token = signAuthToken(user);
    setAuthCookie(res, token);

    return res.json(sanitizeUser(user));
  } catch (error) {
    return next(error);
  }
});

router.get("/me", async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ message: "No autenticado." });
    }

    const payload = verifyAuthToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      clearAuthCookie(res);
      return res.status(401).json({ message: "Sesión inválida." });
    }

    return res.json(sanitizeUser(user));
  } catch (error) {
    clearAuthCookie(res);
    return res.status(401).json({ message: "Sesión inválida." });
  }
});

router.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  res.status(204).send();
});

router.post("/change-password", async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ message: "No autenticado." });
    }

    const payload = verifyAuthToken(token);
    const { currentPassword, newPassword } = changePasswordSchema.parse(
      req.body
    );

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      clearAuthCookie(res);
      return res.status(401).json({ message: "Sesión inválida." });
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(400).json({
        message: "La contraseña actual es incorrecta.",
      });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    return res.status(204).send();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      clearAuthCookie(res);
      return res.status(401).json({ message: "Sesión inválida." });
    }

    return next(error);
  }
});

export default router;
