import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import initSqlJs from "sql.js";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

const usage = `Uso: npm run import:tesis -- /ruta/tesis.db --apply

Sin --apply solo valida archivo y muestra cantidad.\n`;

const requiredColumns = [
  "id",
  "type",
  "year",
  "author",
  "title",
  "director",
  "codirector",
  "jury",
  "abstract_es",
  "abstract_en",
  "pdf_url",
];

const valueOrEmpty = (value) => (value == null ? "" : String(value).trim());

// El separador real antecede a un nuevo jurado. Algunos nombres de instituciones
// también incluyen `;`, por lo que un split simple cortaría datos válidos.
const jurorSeparator = /;\s*(?=(?:Dr|Dra|Ing|Prof|Lic|Mg|Mgs|Esp)\.?\s)/i;

const splitJurors = (jury) => {
  const jurors = valueOrEmpty(jury)
    .split(jurorSeparator)
    .map((juror) => juror.trim())
    .filter(Boolean);

  if (jurors.length > 3) {
    throw new Error(`Se detectaron más de tres jurados: ${valueOrEmpty(jury)}`);
  }

  return jurors;
};

const toTesisData = (row) => {
  const [juror_1 = "", juror_2 = "", juror_3 = ""] = splitJurors(row.jury);

  return {
    year: Number(row.year) || null,
    name: valueOrEmpty(row.author),
    title: valueOrEmpty(row.title),
    director: valueOrEmpty(row.director),
    co_director: valueOrEmpty(row.codirector),
    juror_1,
    juror_2,
    juror_3,
    summary_es: valueOrEmpty(row.abstract_es),
    abstract_en: valueOrEmpty(row.abstract_en),
    url: valueOrEmpty(row.pdf_url),
    tag: valueOrEmpty(row.type).toLowerCase(),
  };
};

const getArguments = () => {
  const args = process.argv.slice(2);
  const sourcePath = args.find((argument) => !argument.startsWith("-"));
  return { sourcePath, apply: args.includes("--apply") };
};

const readTesis = async (sourcePath) => {
  const SQL = await initSqlJs({
    locateFile: (file) => path.resolve(__dirname, "../node_modules/sql.js/dist", file),
  });
  const database = new SQL.Database(await fs.readFile(sourcePath));

  try {
    const columns = database.exec("PRAGMA table_info(tesis)")[0]?.values.map(([, name]) => name) ?? [];
    const missingColumns = requiredColumns.filter((column) => !columns.includes(column));

    if (missingColumns.length) {
      throw new Error(`Tabla tesis sin columnas requeridas: ${missingColumns.join(", ")}`);
    }

    const result = database.exec(`SELECT ${requiredColumns.join(", ")} FROM tesis ORDER BY id`)[0];
    const rows = (result?.values ?? []).map((values) =>
      Object.fromEntries(result.columns.map((column, index) => [column, values[index]]))
    );

    if (!rows.length) throw new Error("Base fuente sin tesis.");
    if (rows.some((row) => !valueOrEmpty(row.title) || !valueOrEmpty(row.author))) {
      throw new Error("Hay tesis sin título o autor.");
    }

    return rows;
  } finally {
    database.close();
  }
};

const main = async () => {
  const { sourcePath, apply } = getArguments();
  if (!sourcePath) throw new Error(usage);

  const resolvedPath = path.resolve(sourcePath);
  const rows = await readTesis(resolvedPath);
  const tesis = rows.map(toTesisData);

  console.log(`Fuente validada: ${tesis.length} tesis (${resolvedPath}).`);

  if (!apply) {
    console.log("Vista previa terminada. Agregá --apply para reemplazar tesis en PostgreSQL.");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.contentEntry.deleteMany({ where: { collectionName: "tesis" } });
    await tx.contentEntry.createMany({
      data: tesis.map((data, index) => ({
        collectionName: "tesis",
        slug: `tesis-${rows[index].id}`,
        data,
      })),
    });
  });

  const importedCount = await prisma.contentEntry.count({ where: { collectionName: "tesis" } });
  if (importedCount !== tesis.length) {
    throw new Error(`Verificación falló: esperadas ${tesis.length}, importadas ${importedCount}.`);
  }

  console.log(`Importación terminada: ${importedCount} tesis.`);
};

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
