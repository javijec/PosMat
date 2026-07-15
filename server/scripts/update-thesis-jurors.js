import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { PrismaClient } from "@prisma/client";

const usage = `
Uso:
  node scripts/update-thesis-jurors.js /ruta/tesis-corregidas.db
  node scripts/update-thesis-jurors.js /ruta/tesis-corregidas.db --apply

Sin --apply el script sólo informa qué cambios haría.
`;

const [databaseFile, ...flags] = process.argv.slice(2);
const apply = flags.includes("--apply");

if (databaseFile === "--help" || databaseFile === "-h") {
  console.log(usage.trim());
  process.exit(0);
}

if (!databaseFile || flags.some((flag) => flag !== "--apply")) {
  console.error(usage.trim());
  process.exit(1);
}

const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const buildKey = (title, author, year) =>
  `${normalize(title)}|${normalize(author)}|${String(year ?? "")}`;

const addToIndex = (index, key, entry) => {
  const matches = index.get(key) ?? [];
  matches.push(entry);
  index.set(key, matches);
};

const uniqueMatch = (index, key) => {
  const matches = index.get(key) ?? [];
  return matches.length === 1 ? matches[0] : null;
};

const findMatchingThesis = (source, indexes) =>
  uniqueMatch(indexes.full, buildKey(source.title, source.author, source.year)) ??
  uniqueMatch(indexes.titleYear, buildKey(source.title, "", source.year)) ??
  uniqueMatch(indexes.authorYear, buildKey("", source.author, source.year));

const sourcePath = path.resolve(databaseFile);
await fs.access(sourcePath);

const sourceDb = new DatabaseSync(sourcePath, { readOnly: true });
const sourceRows = sourceDb
  .prepare("SELECT id, type, year, author, title, jury FROM tesis")
  .all();
sourceDb.close();

const prisma = new PrismaClient();

try {
  const entries = await prisma.contentEntry.findMany({
    where: { collectionName: "tesis" },
  });

  const indexes = {
    full: new Map(),
    titleYear: new Map(),
    authorYear: new Map(),
  };

  for (const entry of entries) {
    const thesis = entry.data;
    addToIndex(indexes.full, buildKey(thesis.title, thesis.name, thesis.year), entry);
    addToIndex(indexes.titleYear, buildKey(thesis.title, "", thesis.year), entry);
    addToIndex(indexes.authorYear, buildKey("", thesis.name, thesis.year), entry);
  }

  const updates = [];
  const unmatched = [];

  for (const source of sourceRows) {
    const entry = findMatchingThesis(source, indexes);

    if (!entry) {
      unmatched.push(source);
      continue;
    }

    const jurors = source.jury ?? "";
    const current = entry.data;

    // juror_1..3 have precedence in the UI. Clear only those legacy jury fields
    // so the corrected `jurors` value is always shown, without changing thesis data.
    const data = {
      ...current,
      jurors,
      juror_1: "",
      juror_2: "",
      juror_3: "",
    };

    const changed =
      current.jurors !== jurors ||
      Boolean(current.juror_1 || current.juror_2 || current.juror_3);

    if (changed) {
      updates.push({ id: entry.id, data, title: current.title });
    }
  }

  console.log(`Archivo origen: ${sourceRows.length} tesis`);
  console.log(`Tesis existentes en el servidor: ${entries.length}`);
  console.log(`Jurados a actualizar: ${updates.length}`);
  console.log(`Sin coincidencia segura: ${unmatched.length}`);

  if (unmatched.length) {
    console.log("\nPrimeras tesis sin coincidencia:");
    for (const thesis of unmatched.slice(0, 10)) {
      console.log(`- ${thesis.year} · ${thesis.author} · ${thesis.title}`);
    }
  }

  if (!apply) {
    console.log("\nVista previa: no se modificó la base. Volvé a ejecutarlo con --apply para confirmar.");
    process.exitCode = 0;
  } else {
    await prisma.$transaction(
      updates.map(({ id, data }) =>
        prisma.contentEntry.update({ where: { id }, data: { data } })
      )
    );
    console.log(`\nListo: se actualizaron únicamente los jurados de ${updates.length} tesis.`);
  }
} finally {
  await prisma.$disconnect();
}
