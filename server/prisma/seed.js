import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toCourseInput = (course) => ({
  nombre: course.nombre ?? "",
  anio: Number(course.año ?? course.anio ?? new Date().getFullYear()),
  semestre: Number(course.semestre ?? 1),
  horasTeoricas: String(course.horasTeoricas ?? ""),
  horasPracticas: String(course.horasPracticas ?? ""),
  horasTP: String(course.horasTP ?? ""),
  uvacs: String(course.uvacs ?? ""),
  fechaInicio: course.fechaInicio || null,
  lugar: course.lugar || null,
  duracion: course.duracion || null,
  horario: course.horario || null,
  humanistico: Boolean(course.humanistico),
  profesores: Array.isArray(course.profesores) ? course.profesores : [],
});

const toSlug = (value) =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

async function main() {
  const dataPath = path.resolve(__dirname, "../../src/files/courses.json");
  const raw = await fs.readFile(dataPath, "utf-8");
  const courses = JSON.parse(raw);

  for (const course of courses) {
    const data = toCourseInput(course);
    const slug = toSlug(`${data.nombre}-${data.anio}-${data.semestre}`);
    const contentData = {
      ...course,
      año: data.anio,
      semestre: data.semestre,
      humanistico: data.humanistico,
      profesores: data.profesores,
    };

    await prisma.course.upsert({
      where: {
        nombre_anio_semestre: {
          nombre: data.nombre,
          anio: data.anio,
          semestre: data.semestre,
        },
      },
      update: data,
      create: data,
    });

    await prisma.contentEntry.upsert({
      where: {
        collectionName_slug: {
          collectionName: "courses",
          slug,
        },
      },
      update: {
        data: contentData,
      },
      create: {
        collectionName: "courses",
        slug,
        data: contentData,
      },
    });
  }

  console.log(`Seed completed: ${courses.length} courses processed.`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
