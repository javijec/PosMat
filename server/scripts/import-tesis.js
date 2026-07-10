import "dotenv/config";
import { Buffer } from "node:buffer";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import initSqlJs from "sql.js";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

const defaultSourcePath = path.resolve(__dirname, "../data/tesis.db");
const publicTesisDirectory = path.resolve(__dirname, "../../public/tesis");
const publicTesisUrl = "https://posmat.fi.mdp.edu.ar/api/uploads/tesis";

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
    url: `${publicTesisUrl}/tesis-${row.id}.pdf`,
    tag: valueOrEmpty(row.type).toLowerCase(),
  };
};

const getArguments = () => {
  const args = process.argv.slice(2);
  const sourcePath = args.find((argument) => !argument.startsWith("-"));
  return {
    sourcePath: sourcePath ?? defaultSourcePath,
    apply: args.includes("--apply"),
    downloadOnly: args.includes("--download-only"),
  };
};

const downloadPdf = async (row) => {
  const fileName = `tesis-${row.id}.pdf`;
  const destination = path.join(publicTesisDirectory, fileName);

  try {
    const existingFile = await fs.stat(destination);
    if (existingFile.size > 0) return { fileName, status: "existente" };
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const response = await fetch(row.pdf_url, { signal: AbortSignal.timeout(60_000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const file = Buffer.from(await response.arrayBuffer());
  if (!file.length) throw new Error("archivo vacío");

  const temporaryFile = `${destination}.part`;
  await fs.writeFile(temporaryFile, file);
  await fs.rename(temporaryFile, destination);
  return { fileName, status: "descargado" };
};

const downloadPdfs = async (rows) => {
  await fs.mkdir(publicTesisDirectory, { recursive: true });
  const results = [];
  const failures = [];

  for (const row of rows) {
    try {
      results.push(await downloadPdf(row));
    } catch (error) {
      failures.push({ id: row.id, url: row.pdf_url, error: error.message });
    }
  }

  await fs.writeFile(
    path.join(publicTesisDirectory, "reporte-descarga.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), results, failures }, null, 2)
  );

  if (failures.length) {
    throw new Error(`${failures.length} PDF(s) no se descargaron. Ver public/tesis/reporte-descarga.json.`);
  }

  const downloadedCount = results.filter(({ status }) => status === "descargado").length;
  console.log(`PDFs listos: ${results.length} (${downloadedCount} nuevos).`);
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
  const { sourcePath, apply, downloadOnly } = getArguments();
  const resolvedPath = path.resolve(sourcePath);
  const rows = await readTesis(resolvedPath);
  const tesis = rows.map(toTesisData);

  console.log(`Fuente validada: ${tesis.length} tesis (${resolvedPath}).`);

  if (!apply && !downloadOnly) {
    console.log("Vista previa terminada. Agregá --apply para reemplazar tesis en PostgreSQL.");
    return;
  }

  await downloadPdfs(rows);
  if (downloadOnly) return;

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
