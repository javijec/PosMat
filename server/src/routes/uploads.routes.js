import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { Router } from "express";
import multer from "multer";
import { uploadRateLimiter } from "../middleware/rateLimit.js";
import { getTokenFromRequest, verifyAuthToken } from "../utils/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();
router.use(uploadRateLimiter);
const filesDirectory = process.env.TESIS_FILES_DIR || path.resolve(__dirname, "../../../public/tesis-pdfs");
const resourcesDirectory = process.env.RESOURCES_FILES_DIR || path.resolve(__dirname, "../../../public/resource-files");
const publicSiteUrl = (process.env.PUBLIC_SITE_URL || "https://posmat.fi.mdp.edu.ar").replace(/\/$/, "");
const validFileName = /^tesis-[a-zA-Z0-9-]+\.pdf$/;
const validResourceFileName = /^resource-[a-zA-Z0-9-]+\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip)$/i;
const resourceExtensions = new Set(["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "zip"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => callback(null, file.mimetype === "application/pdf"),
});

const resourceUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).slice(1).toLowerCase();
    callback(null, resourceExtensions.has(extension));
  },
});

const requireAdmin = (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return res.status(401).json({ message: "Autenticación requerida" });

    const user = verifyAuthToken(token);
    if (user.role !== "admin") return res.status(403).json({ message: "Permisos insuficientes" });

    return next();
  } catch {
    return res.status(401).json({ message: "Sesión inválida o vencida" });
  }
};

router.get("/tesis/:fileName", async (req, res, next) => {
  if (!validFileName.test(req.params.fileName)) {
    return res.status(404).json({ message: "Archivo no encontrado" });
  }

  try {
    await fs.access(path.join(filesDirectory, req.params.fileName));
    return res.type("application/pdf").sendFile(req.params.fileName, { root: filesDirectory });
  } catch (error) {
    if (error.code === "ENOENT") return res.status(404).json({ message: "Archivo no encontrado" });
    return next(error);
  }
});

router.post("/tesis", requireAdmin, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Seleccioná un archivo PDF" });
    const tesisId = String(req.body.tesisId || "");
    if (!/^[a-zA-Z0-9_-]{6,64}$/.test(tesisId)) {
      return res.status(400).json({ message: "Identificador de tesis inválido" });
    }
    if (!req.file.buffer.subarray(0, 4).equals(Buffer.from("%PDF"))) {
      return res.status(400).json({ message: "El archivo no es un PDF válido" });
    }

    await fs.mkdir(filesDirectory, { recursive: true });
    const fileName = `tesis-${tesisId}.pdf`;
    const targetPath = path.join(filesDirectory, fileName);
    const temporaryPath = `${targetPath}.part`;
    await fs.writeFile(temporaryPath, req.file.buffer);
    await fs.rename(temporaryPath, targetPath);

    return res.status(201).json({ url: `${publicSiteUrl}/api/uploads/tesis/${fileName}` });
  } catch (error) {
    return next(error);
  }
});

router.delete("/tesis/:fileName", requireAdmin, async (req, res, next) => {
  if (!validFileName.test(req.params.fileName)) {
    return res.status(404).json({ message: "Archivo no encontrado" });
  }

  try {
    await fs.unlink(path.join(filesDirectory, req.params.fileName));
    return res.status(204).send();
  } catch (error) {
    if (error.code === "ENOENT") return res.status(404).json({ message: "Archivo no encontrado" });
    return next(error);
  }
});

router.get("/resources/:fileName", async (req, res, next) => {
  if (!validResourceFileName.test(req.params.fileName)) {
    return res.status(404).json({ message: "Archivo no encontrado" });
  }

  try {
    await fs.access(path.join(resourcesDirectory, req.params.fileName));
    return res.download(path.join(resourcesDirectory, req.params.fileName));
  } catch (error) {
    if (error.code === "ENOENT") return res.status(404).json({ message: "Archivo no encontrado" });
    return next(error);
  }
});

router.post("/resources", requireAdmin, resourceUpload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Seleccioná un PDF, documento, planilla, presentación o ZIP" });
    }

    const extension = path.extname(req.file.originalname).slice(1).toLowerCase();
    if (!resourceExtensions.has(extension)) {
      return res.status(400).json({ message: "Tipo de archivo no permitido" });
    }

    await fs.mkdir(resourcesDirectory, { recursive: true });
    const fileName = `resource-${randomUUID()}.${extension}`;
    const targetPath = path.join(resourcesDirectory, fileName);
    const temporaryPath = `${targetPath}.part`;
    await fs.writeFile(temporaryPath, req.file.buffer);
    await fs.rename(temporaryPath, targetPath);

    return res.status(201).json({
      url: `${publicSiteUrl}/api/uploads/resources/${fileName}`,
      fileName,
    });
  } catch (error) {
    return next(error);
  }
});

router.delete("/resources/:fileName", requireAdmin, async (req, res, next) => {
  if (!validResourceFileName.test(req.params.fileName)) {
    return res.status(404).json({ message: "Archivo no encontrado" });
  }

  try {
    await fs.unlink(path.join(resourcesDirectory, req.params.fileName));
    return res.status(204).send();
  } catch (error) {
    if (error.code === "ENOENT") return res.status(204).send();
    return next(error);
  }
});

export default router;
