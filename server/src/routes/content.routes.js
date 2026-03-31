import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const router = Router();
const contentSchema = z.object({}).catchall(z.any());

const isPlainObject = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toEntryResponse = (entry) => ({
  id: entry.id,
  ...(isPlainObject(entry.data) ? entry.data : { value: entry.data }),
});

router.get("/:collectionName", async (req, res, next) => {
  try {
    const entries = await prisma.contentEntry.findMany({
      where: { collectionName: req.params.collectionName },
      orderBy: [{ createdAt: "asc" }],
    });

    res.json(entries.map(toEntryResponse));
  } catch (error) {
    next(error);
  }
});

router.get("/:collectionName/:id", async (req, res, next) => {
  try {
    const entry = await prisma.contentEntry.findFirst({
      where: {
        id: req.params.id,
        collectionName: req.params.collectionName,
      },
    });

    if (!entry) {
      return res.status(404).json({ message: "Elemento no encontrado" });
    }

    return res.json(toEntryResponse(entry));
  } catch (error) {
    return next(error);
  }
});

router.post("/:collectionName", async (req, res, next) => {
  try {
    const data = contentSchema.parse(req.body);
    const entry = await prisma.contentEntry.create({
      data: {
        collectionName: req.params.collectionName,
        data,
      },
    });

    res.status(201).json(toEntryResponse(entry));
  } catch (error) {
    next(error);
  }
});

router.put("/:collectionName/:id", async (req, res, next) => {
  try {
    const data = contentSchema.parse(req.body);
    const existingEntry = await prisma.contentEntry.findFirst({
      where: {
        id: req.params.id,
        collectionName: req.params.collectionName,
      },
    });

    if (!existingEntry) {
      return res.status(404).json({ message: "Elemento no encontrado" });
    }

    const mergedData = {
      ...(isPlainObject(existingEntry.data) ? existingEntry.data : {}),
      ...data,
    };

    const entry = await prisma.contentEntry.update({
      where: { id: req.params.id },
      data: { data: mergedData },
    });

    return res.json(toEntryResponse(entry));
  } catch (error) {
    return next(error);
  }
});

router.delete("/:collectionName/:id", async (req, res, next) => {
  try {
    const existingEntry = await prisma.contentEntry.findFirst({
      where: {
        id: req.params.id,
        collectionName: req.params.collectionName,
      },
    });

    if (!existingEntry) {
      return res.status(404).json({ message: "Elemento no encontrado" });
    }

    await prisma.contentEntry.delete({
      where: { id: req.params.id },
    });

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default router;
