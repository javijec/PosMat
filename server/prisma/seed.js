import "dotenv/config";
import bcrypt from "bcryptjs";
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

const seedGenericCollection = async (fileName, collectionName) => {
  const dataPath = path.resolve(__dirname, `../../src/files/${fileName}`);
  const raw = await fs.readFile(dataPath, "utf-8");
  const items = JSON.parse(raw);

  for (const [index, item] of items.entries()) {
    const baseSlug = item.id || item.email || item.nombre || item.titulo || item.title || `${collectionName}-${index + 1}`;
    const slug = toSlug(baseSlug);

    await prisma.contentEntry.upsert({
      where: {
        collectionName_slug: {
          collectionName,
          slug,
        },
      },
      update: {
        data: item,
      },
      create: {
        collectionName,
        slug,
        data: item,
      },
    });
  }

  return items.length;
};

const seedCourses = async () => {
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

  return courses.length;
};

const seedInitialAdmin = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!email || !password) {
    return false;
  }

  await prisma.authorizedEmail.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash,
      role: "admin",
    },
  });

  return true;
};

async function main() {
  const coursesCount = await seedCourses();
  const genericCollections = [
    ["faqs.json", "faq"],
    ["links.json", "links"],
    ["professors.json", "professors"],
    ["rules.json", "rules"],
    ["students.json", "students"],
    ["tesis.json", "tesis"],
  ];

  let genericCount = 0;
  for (const [fileName, collectionName] of genericCollections) {
    genericCount += await seedGenericCollection(fileName, collectionName);
  }

  const adminCreated = await seedInitialAdmin();

  console.log(
    `Seed completed: ${coursesCount} courses and ${genericCount} generic content items processed.`
  );

  if (adminCreated) {
    console.log("Admin user seeded from ADMIN_EMAIL / ADMIN_PASSWORD.");
  }
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
