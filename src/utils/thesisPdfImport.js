import * as pdfjsLib from "pdfjs-dist";

const EMPTY_THESIS_FORM = {
  name: "",
  title: "",
  year: "",
  tag: "",
  degree_title: "",
  url: "",
  director: "",
  co_director: "",
  workplace: "",
  defense_date: "",
  juror_1: "",
  juror_2: "",
  juror_3: "",
  summary_es: "",
  abstract_en: "",
};

const normalizeWhitespace = (value) =>
  value
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

const compactBrokenWords = (value) =>
  value
    .replace(/([A-Za-zÁÉÍÓÚáéíóúÑñÜü])\s(?=[A-Za-zÁÉÍÓÚáéíóúÑñÜü]\b)/g, "$1")
    .replace(/\b(\d)\s+(?=\d\b)/g, "$1")
    .replace(/\s*-\s*/g, "-")
    .replace(/\bDr a\./g, "Dra.")
    .replace(/\bDr \./g, "Dr.")
    .replace(/\bCo-director a\b/gi, "Co-directora")
    .replace(/\bDoctor a\b/gi, "Doctora")
    .replace(/\bMagister\b/gi, "Magíster");

const removePageMarkers = (value) =>
  value.replace(/^\s*--\s*\d+\s+of\s+\d+\s*--\s*$/gim, "");

const enforceFieldBoundaries = (value) =>
  value
    .replace(
      /\s+(?=(Tesista:|Título al que aspira:|Tema:|Título:|Director de tesis:|Director:|Co-director[a]?:|Lugar de Trabajo:|Fecha de Defensa:|Jurados:|RESUMEN\b|ABSTRACT\b))/g,
      "\n"
    )
    .replace(/\n{3,}/g, "\n\n");

const joinWrappedLines = (value) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .reduce((acc, line) => {
      if (!line) {
        acc.push("");
        return acc;
      }

      const lastIndex = acc.length - 1;
      if (lastIndex >= 0 && acc[lastIndex] !== "") {
        acc[lastIndex] = `${acc[lastIndex]} ${line}`;
      } else {
        acc.push(line);
      }

      return acc;
    }, [])
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const getSingleLineField = (text, label) => {
  const pattern = new RegExp(`^${label}:\\s*(.+)$`, "im");
  return text.match(pattern)?.[1]?.trim() ?? "";
};

const getSingleLineFieldLoose = (text, label, stopLabels = []) => {
  const stopPattern = stopLabels.length
    ? `(?=\\s+(?:${stopLabels.join("|")}):|\\n|$)`
    : `(?=\\n|$)`;
  const pattern = new RegExp(`${label}:\\s*([\\s\\S]*?)${stopPattern}`, "i");
  return text.match(pattern)?.[1]?.replace(/\s+/g, " ").trim() ?? "";
};

const getFirstAvailableField = (text, label, stopLabels = []) =>
  getSingleLineField(text, label) ||
  getSingleLineFieldLoose(text, label, stopLabels);

const getMultilineField = (text, label, stopLabels = []) => {
  const stopPattern = stopLabels.length
    ? `(?=^(${stopLabels.join("|")}):|^RESUMEN$|^ABSTRACT$)`
    : `(?=^RESUMEN$|^ABSTRACT$)`;

  const pattern = new RegExp(
    `^${label}:\\s*([\\s\\S]*?)${stopPattern}`,
    "im"
  );

  const raw = text.match(pattern)?.[1] ?? "";
  return normalizeWhitespace(raw);
};

const getBlock = (text, startLabel, endLabel) => {
  if (endLabel === "$") {
    const pattern = new RegExp(`^${startLabel}\\s*$([\\s\\S]*)`, "im");
    return text.match(pattern)?.[1]?.trim() ?? "";
  }

  const pattern = new RegExp(
    `^${startLabel}\\s*$([\\s\\S]*?)(?=^${endLabel}\\s*$)`,
    "im"
  );

  return text.match(pattern)?.[1]?.trim() ?? "";
};

const inferTag = (degreeTitle) => {
  const normalized = degreeTitle.toLowerCase();

  if (normalized.includes("doctor")) {
    return "doctorado";
  }

  if (normalized.includes("maestr") || normalized.includes("magister")) {
    return "maestria";
  }

  return "";
};

const inferYearFromDefenseDate = (defenseDate) =>
  defenseDate.match(/\b(19|20)\d{2}\b/)?.[0] ?? "";

const monthMap = {
  enero: "01",
  febrero: "02",
  marzo: "03",
  abril: "04",
  mayo: "05",
  junio: "06",
  julio: "07",
  agosto: "08",
  septiembre: "09",
  setiembre: "09",
  octubre: "10",
  noviembre: "11",
  diciembre: "12",
};

const toIsoDefenseDate = (value) => {
  const normalized = compactBrokenWords(value.toLowerCase());
  const match = normalized.match(
    /\b(\d{1,2})\s+de\s+([a-záéíóú]+)\s+de\s+(\d{4})\b/
  );

  if (!match) {
    return "";
  }

  const [, day, rawMonth, year] = match;
  const month = monthMap[rawMonth];

  if (!month) {
    return "";
  }

  return `${year}-${month}-${day.padStart(2, "0")}`;
};

const parseJurors = (jurorsBlock) =>
  jurorsBlock
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 3);

const cleanAuthorName = (value) =>
  value
    .split(/(?=T[íi]tulo\b)/i)[0]
    .split(/(?=Tema:)/i)[0]
    .split(/(?=Director(?: de tesis)?:)/i)[0]
    .trim();

const extractPdfText = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
    disableWorker: true,
  }).promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const lineMap = new Map();

    content.items.forEach((item) => {
      if (!("str" in item)) {
        return;
      }

      const y = Math.round(item.transform[5]);
      const existing = lineMap.get(y) || [];

      existing.push({
        x: item.transform[4],
        text: item.str,
      });

      lineMap.set(y, existing);
    });

    const pageText = [...lineMap.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([, items]) =>
        items
          .sort((a, b) => a.x - b.x)
          .map((item) => item.text)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim()
      )
      .filter(Boolean)
      .join("\n");

    pages.push(compactBrokenWords(pageText));
  }

  return pages.join("\n");
};

const parseThesisPdfText = (rawText) => {
  const text = enforceFieldBoundaries(
    compactBrokenWords(removePageMarkers(normalizeWhitespace(rawText)))
  );

  const degreeTitle = getFirstAvailableField(text, "Título al que aspira", [
    "Tema",
    "Título",
    "Director de tesis",
    "Director",
    "Co-director",
    "Lugar de Trabajo",
  ]);
  const workplace = getMultilineField(text, "Lugar de Trabajo", [
    "Fecha de Defensa",
    "Jurados",
  ]);
  const jurors = parseJurors(getMultilineField(text, "Jurados", []));
  const summary = joinWrappedLines(getBlock(text, "RESUMEN", "ABSTRACT"));
  const abstract = joinWrappedLines(getBlock(text, "ABSTRACT", "$"));
  const defenseDate = getSingleLineField(text, "Fecha de Defensa");
  const isoDefenseDate = toIsoDefenseDate(defenseDate);

  return {
    ...EMPTY_THESIS_FORM,
    name: cleanAuthorName(
      getSingleLineField(text, "Tesista") ||
      getSingleLineFieldLoose(text, "Tesista", [
        "Título al que aspira",
        "Tema",
        "Título",
        "Director de tesis",
      ])
    ),
    title:
      getFirstAvailableField(text, "Tema", [
        "Director de tesis",
        "Co-director",
        "Lugar de Trabajo",
      ]) || getFirstAvailableField(text, "Título", [
        "Director de tesis",
        "Co-director",
        "Lugar de Trabajo",
      ]),
    degree_title: degreeTitle,
    director:
      getSingleLineField(text, "Director de tesis") ||
      getSingleLineField(text, "Director"),
    co_director:
      getSingleLineField(text, "Co-director") ||
      getSingleLineField(text, "Co-directora"),
    workplace,
    defense_date: isoDefenseDate,
    year: inferYearFromDefenseDate(defenseDate),
    tag: inferTag(degreeTitle),
    juror_1: jurors[0] || "",
    juror_2: jurors[1] || "",
    juror_3: jurors[2] || "",
    summary_es: compactBrokenWords(summary),
    abstract_en: compactBrokenWords(abstract),
  };
};

const importThesisFromPdf = async (file) => {
  const text = await extractPdfText(file);
  return parseThesisPdfText(text);
};

export { EMPTY_THESIS_FORM, importThesisFromPdf };
