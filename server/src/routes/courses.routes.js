import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";

const router = Router();

const professorSchema = z.object({
  nombre: z.string().min(1, "El nombre del profesor es obligatorio"),
  email: z.string().email("Email inválido").or(z.literal("")).optional().default(""),
});

const courseInputSchema = z
  .object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    año: z.coerce.number().int().optional(),
    anio: z.coerce.number().int().optional(),
    semestre: z.coerce.number().int().min(1).max(2),
    horasTeoricas: z.string().optional().default(""),
    horasPracticas: z.string().optional().default(""),
    horasTP: z.string().optional().default(""),
    uvacs: z.string().optional().default(""),
    fechaInicio: z.string().optional().nullable(),
    lugar: z.string().optional().nullable(),
    duracion: z.string().optional().nullable(),
    horario: z.string().optional().nullable(),
    humanistico: z.coerce.boolean().optional().default(false),
    profesores: z.array(professorSchema).optional().default([]),
  })
  .transform((data) => ({
    nombre: data.nombre,
    anio: data.anio ?? data.año ?? new Date().getFullYear(),
    semestre: data.semestre,
    horasTeoricas: data.horasTeoricas ?? "",
    horasPracticas: data.horasPracticas ?? "",
    horasTP: data.horasTP ?? "",
    uvacs: data.uvacs ?? "",
    fechaInicio: data.fechaInicio || null,
    lugar: data.lugar || null,
    duracion: data.duracion || null,
    horario: data.horario || null,
    humanistico: data.humanistico ?? false,
    profesores: data.profesores ?? [],
  }));

const toCourseResponse = (course) => ({
  ...course,
  año: course.anio,
});

router.get("/", async (_req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: [{ anio: "desc" }, { semestre: "asc" }, { nombre: "asc" }],
    });

    res.json(courses.map(toCourseResponse));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
    });

    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(toCourseResponse(course));
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const data = courseInputSchema.parse(req.body);
    const course = await prisma.course.create({ data });
    res.status(201).json(toCourseResponse(course));
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const data = courseInputSchema.parse(req.body);
    const course = await prisma.course.update({
      where: { id: req.params.id },
      data,
    });

    res.json(toCourseResponse(course));
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.course.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
