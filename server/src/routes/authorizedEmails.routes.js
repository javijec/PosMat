import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const router = Router();

const emailSchema = z.object({
  email: z.string().email(),
});

const normalizeEmail = (email) => email.trim().toLowerCase();

router.get("/", async (_req, res, next) => {
  try {
    const authorizedEmails = await prisma.authorizedEmail.findMany({
      orderBy: { createdAt: "asc" },
    });

    res.json(authorizedEmails);
  } catch (error) {
    next(error);
  }
});

router.get("/check", async (req, res, next) => {
  try {
    const email = String(req.query.email || "").trim().toLowerCase();

    if (!email) {
      return res.json({ authorized: false });
    }

    const authorizedEmail = await prisma.authorizedEmail.findUnique({
      where: { email },
    });

    return res.json({ authorized: Boolean(authorizedEmail) });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const authorizedEmail = await prisma.authorizedEmail.findUnique({
      where: { id: req.params.id },
    });

    if (!authorizedEmail) {
      return res.status(404).json({ message: "Email no encontrado" });
    }

    return res.json(authorizedEmail);
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { email } = emailSchema.parse(req.body);
    const normalizedEmail = normalizeEmail(email);

    const created = await prisma.authorizedEmail.create({
      data: { email: normalizedEmail },
    });

    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { email } = emailSchema.parse(req.body);
    const normalizedEmail = normalizeEmail(email);

    const updated = await prisma.authorizedEmail.update({
      where: { id: req.params.id },
      data: { email: normalizedEmail },
    });

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.authorizedEmail.delete({
      where: { id: req.params.id },
    });

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
