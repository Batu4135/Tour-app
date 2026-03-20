import fs from "fs/promises";
import path from "path";
import { prisma } from "../lib/prisma";
import { buildLicensePersistence } from "../lib/license";
import xlsx from "xlsx";

type HeaderIndexes = {
  name: number;
  sku: number;
  price: number;
};

type ParsedRow = {
  lineNumber: number;
  name: string;
  sku: string;
  defaultPriceCents: number;
};

type ParsedLicenseData = {
  licenseFeeCents: number;
  licenseType: "NONE" | "LP" | "LK" | "LA" | "LV";
  licenseWeightGrams: number;
};

type LicenseType = ParsedLicenseData["licenseType"];

type OfficialLicenseLookup = {
  bySku: Map<string, ParsedLicenseData>;
  allSku: Set<string>;
  sourcePath: string | null;
};

function normalizeSku(value: string): string {
  return value.trim();
}

function normalizeLicenseLookupSku(value: string): string {
  const compact = normalizeSku(value).toUpperCase().replace(/\s+/g, "");
  if (/^\d+$/.test(compact)) {
    return compact.replace(/^0+/, "") || "0";
  }
  return compact;
}

function getLicenseLookupKeys(rawSku: string): string[] {
  const normalized = normalizeLicenseLookupSku(rawSku);
  const keys = new Set<string>([normalized]);
  const normalizedWithoutLeadingZeros = normalized.replace(/^0+/, "") || "0";
  keys.add(normalizedWithoutLeadingZeros);

  const suffixLetters = normalized.match(/^(\d{4,})[A-Z]+$/);
  if (suffixLetters) {
    keys.add(suffixLetters[1]);
    keys.add(suffixLetters[1].replace(/^0+/, "") || "0");
  }

  const dashLetters = normalized.match(/^(\d{4,})-[A-Z]+$/);
  if (dashLetters) {
    keys.add(dashLetters[1]);
    keys.add(dashLetters[1].replace(/^0+/, "") || "0");
  }

  return [...keys];
}

function detectDelimiter(headerLine: string): string {
  const candidates = [",", ";", "\t"];
  let best = ",";
  let bestCount = 0;
  for (const delimiter of candidates) {
    const count = headerLine.split(delimiter).length;
    if (count > bestCount) {
      best = delimiter;
      bestCount = count;
    }
  }
  return best;
}

function parseCsvLine(line: string, delimiter: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s._\-\/\\:()]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/Ã¤/g, "ae")
    .replace(/Ã¶/g, "oe")
    .replace(/Ã¼/g, "ue")
    .replace(/ÃŸ/g, "ss");
}

function findHeaderIndexes(headers: string[]): HeaderIndexes {
  const normalized = headers.map(normalizeHeader);

  const nameIndex = normalized.findIndex((header) => header === "name" || header === "produktname");
  const skuIndex = normalized.findIndex(
    (header) => header === "artikelnummer" || header === "artikelnr" || header === "artnr" || header === "sku"
  );
  const priceIndex = normalized.findIndex(
    (header) => header === "preis" || header === "price" || header === "vkpreis" || header === "defaultpreis"
  );

  if (nameIndex < 0 || skuIndex < 0 || priceIndex < 0) {
    throw new Error(
      "CSV Header ungueltig. Erwartet Spalten: name, artikelnummer, preis (Reihenfolge egal)."
    );
  }

  return {
    name: nameIndex,
    sku: skuIndex,
    price: priceIndex
  };
}

function parsePriceToCents(raw: string): number | null {
  const cleaned = raw.replace(/\s/g, "").replace(/\u20AC/g, "").trim();
  if (!cleaned) return null;

  let normalized = cleaned.replace(/[^\d,.-]/g, "");
  if (!normalized) return null;

  if (normalized.includes(",") && normalized.includes(".")) {
    if (normalized.lastIndexOf(",") > normalized.lastIndexOf(".")) {
      normalized = normalized.replace(/\./g, "").replace(",", ".");
    } else {
      normalized = normalized.replace(/,/g, "");
    }
  } else if (normalized.includes(",")) {
    normalized = normalized.replace(",", ".");
  } else if ((normalized.match(/\./g) ?? []).length > 1) {
    const parts = normalized.split(".");
    const decimal = parts.pop() ?? "00";
    normalized = `${parts.join("")}.${decimal}`;
  }

  const amount = Number.parseFloat(normalized);
  if (!Number.isFinite(amount)) return null;
  return Math.round(amount * 100);
}

function parseDecimal(raw: string): number | null {
  const cleaned = String(raw).replace(/\s/g, "").replace(/\u20AC/g, "").trim();
  if (!cleaned) return null;
  const normalized = cleaned.replace(",", ".");
  const value = Number.parseFloat(normalized);
  if (!Number.isFinite(value)) return null;
  return value;
}

function parseWeightKgToGrams(raw: string): number | null {
  const cleaned = raw.replace(/\s/g, "").trim();
  if (!cleaned) return null;
  const normalized = cleaned.replace(",", ".");
  const value = Number.parseFloat(normalized);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 1000);
}

function parseIntegerCents(raw: string): number | null {
  const cleaned = raw.replace(/[^\d\-]/g, "");
  if (!cleaned) return null;
  const parsed = Number.parseInt(cleaned, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
}

function decodeCsv(buffer: Buffer): string {
  const utf8 = buffer.toString("utf8").replace(/^\uFEFF/, "");
  if (utf8.includes("\uFFFD")) {
    return buffer.toString("latin1").replace(/^\uFEFF/, "");
  }
  return utf8;
}

async function resolveCsvPath(): Promise<string> {
  const preferred = path.join(process.cwd(), "data", "products.csv");
  try {
    await fs.access(preferred);
    return preferred;
  } catch {
    const fallback = path.join(process.cwd(), "data", "produkte.csv");
    await fs.access(fallback);
    return fallback;
  }
}

const DEFAULT_OFFICIAL_LICENSE_PATHS = [
  process.env.OFFICIAL_LICENSE_XLSX_PATH?.trim() || "",
  "c:\\Users\\batu4\\Downloads\\ARTIKELLISTE MIT LIZENSGEBÜHREN (1).xlsx",
  "c:\\Users\\batu4\\Downloads\\ARTIKELLISTE MIT LIZENSGEBÃœHREN (1).xlsx",
  path.join(process.cwd(), "data", "ARTIKELLISTE MIT LIZENSGEBÜHREN (1).xlsx"),
  path.join(process.cwd(), "data", "ARTIKELLISTE MIT LIZENSGEBÃœHREN (1).xlsx"),
  path.join(process.cwd(), "data", "license-fees.xlsx")
].filter((value) => value.length > 0);

async function resolveOfficialLicensePath(): Promise<string | null> {
  for (const filePath of DEFAULT_OFFICIAL_LICENSE_PATHS) {
    try {
      await fs.access(filePath);
      return filePath;
    } catch {
      continue;
    }
  }

  const searchDirs = [path.join(process.env.USERPROFILE ?? "", "Downloads"), path.join(process.cwd(), "data")].filter(
    (value) => value.length > 0
  );
  for (const dirPath of searchDirs) {
    try {
      const files = await fs.readdir(dirPath);
      const found = files.find((file) => /ARTIKELLISTE\s+MIT\s+LIZENSGEB.*\.xlsx$/i.test(file));
      if (found) {
        return path.join(dirPath, found);
      }
    } catch {
      continue;
    }
  }

  return null;
}

function mapRateToLicenseType(rateCentsPerKg: number): LicenseType {
  if (rateCentsPerKg === 25) return "LP";
  if (rateCentsPerKg === 99) return "LK";
  return "NONE";
}

function normalizeMaterialText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function mapMaterialToLicenseType(value: string): LicenseType | null {
  const normalized = normalizeMaterialText(value);
  if (!normalized) return null;

  if (/(^| )(papier|pappe|karton)( |$)/.test(normalized)) return "LP";
  if (/(^| )(alu|aluminium|aluschale|alufolie|aluminiumfolie)( |$)/.test(normalized)) return "LA";
  if (/(^| )(verbund|mehrschicht|composite)( |$)/.test(normalized)) return "LV";
  if (/(^| )(kunststoff|plastic|plastik|pet|rpet|cpet|pp|ps|eps|hdpe|ldpe)( |$)/.test(normalized)) return "LK";
  return null;
}

function mapOfficialLicenseType(rateCentsPerKg: number, articleName: string, materialHint: string): LicenseType {
  const rateType = mapRateToLicenseType(rateCentsPerKg);
  if (rateType !== "LK") return rateType;

  const materialType = mapMaterialToLicenseType(materialHint);
  if (materialType === "LA" || materialType === "LV" || materialType === "LK") return materialType;

  const articleType = mapMaterialToLicenseType(articleName);
  if (articleType === "LA" || articleType === "LV" || articleType === "LK") return articleType;

  // Bei 0,99 EUR/kg und ohne Materialhinweis standardmaessig Kunststoff.
  return "LK";
}

function loadLicenseFeesFromOfficialXlsx(filePath: string): OfficialLicenseLookup {
  const workbook = xlsx.readFile(filePath, { cellDates: false, raw: false });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: "" }) as Array<Array<string | number>>;
  if (rows.length === 0) {
    return { bySku: new Map(), allSku: new Set(), sourcePath: filePath };
  }

  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(rows.length, 30); i += 1) {
    const normalized = rows[i].map((cell) => normalizeHeader(String(cell ?? "")));
    if (normalized.some((value) => value === "artikelnr" || value === "artikelnummer")) {
      headerRowIndex = i;
      break;
    }
  }

  const header = rows[headerRowIndex].map((cell) => normalizeHeader(String(cell ?? "")));
  const articleNameIndex = header.findIndex((value) => value === "artikel" || value === "produkt" || value === "bezeichnung");
  const skuIndex = header.findIndex((value) => value === "artikelnr" || value === "artikelnummer" || value === "sku");
  const materialIndex = header.findIndex(
    (value) =>
      value === "material" ||
      value === "stoff" ||
      value === "werkstoff" ||
      value === "lizenztyp" ||
      value === "lizenzart" ||
      value === "verpackung"
  );
  const weightIndex = header.findIndex((value) => value === "gewicht" || value === "weight");
  const rateIndex = header.findIndex(
    (value) => value === "lizensgeb" || value === "lizenzgeb" || value === "lizenzgebuehr" || value === "licensefee"
  );

  if (skuIndex < 0 || weightIndex < 0 || rateIndex < 0) {
    throw new Error("Offizielle Lizenzdatei hat keine gueltigen Spalten (Artikel-Nr., Gewicht, Lizensgeb.).");
  }

  const map = new Map<string, ParsedLicenseData>();
  const allSku = new Set<string>();
  for (let i = headerRowIndex + 1; i < rows.length; i += 1) {
    const row = rows[i];
    const sku = normalizeSku(String(row[skuIndex] ?? ""));
    if (!sku) continue;
    const lookupSku = normalizeLicenseLookupSku(sku);
    allSku.add(lookupSku);

    const articleName = articleNameIndex >= 0 ? String(row[articleNameIndex] ?? "") : "";
    const materialHint = materialIndex >= 0 ? String(row[materialIndex] ?? "") : "";

    const weightKg = parseDecimal(String(row[weightIndex] ?? ""));
    const rateEuroPerKg = parseDecimal(String(row[rateIndex] ?? ""));
    if (weightKg === null || rateEuroPerKg === null || weightKg <= 0 || rateEuroPerKg <= 0) continue;

    const licenseWeightGrams = Math.round(weightKg * 1000);
    const rateCentsPerKg = Math.round(rateEuroPerKg * 100);
    const licenseType = mapOfficialLicenseType(rateCentsPerKg, articleName, materialHint);
    if (licenseType === "NONE") continue;

    const licenseFeeCents = Math.round((licenseWeightGrams * rateCentsPerKg) / 1000);
    const persisted = buildLicensePersistence({
      licenseType,
      licenseWeightGrams,
      licenseFeeCents
    });

    map.set(lookupSku, persisted);
  }

  return { bySku: map, allSku, sourcePath: filePath };
}

async function loadLicenseFeesBySku(): Promise<OfficialLicenseLookup> {
  const officialPath = await resolveOfficialLicensePath();
  if (officialPath) {
    return loadLicenseFeesFromOfficialXlsx(officialPath);
  }

  const licensePath = path.join(process.cwd(), "data", "license-fees.csv");
  try {
    const raw = await fs.readFile(licensePath);
    const content = decodeCsv(raw);
    const lines = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    if (lines.length < 2) return { bySku: new Map(), allSku: new Set(), sourcePath: licensePath };

    const delimiter = detectDelimiter(content.split(/\r?\n/)[0] ?? lines[0]);
    const header = parseCsvLine(lines[0], delimiter).map(normalizeHeader);
    const skuIndex = header.findIndex((cell) => cell === "sku" || cell === "artikelnummer");
    const feeIndex = header.findIndex((cell) => cell === "licensefeecents" || cell === "lizenzgebuehrcents");
    const typeIndex = header.findIndex((cell) => cell === "licensetype" || cell === "lizenztyp" || cell === "lizenzart");
    const weightKgIndex = header.findIndex(
      (cell) => cell === "licenseweightkg" || cell === "lizenzgewichtkg" || cell === "weightkg"
    );
    const weightGramsIndex = header.findIndex(
      (cell) => cell === "licenseweightgrams" || cell === "lizenzgewichtgrams" || cell === "weightgrams"
    );

    if (skuIndex < 0) return { bySku: new Map(), allSku: new Set(), sourcePath: null };

    const map = new Map<string, ParsedLicenseData>();
    const allSku = new Set<string>();
    for (let i = 1; i < lines.length; i += 1) {
      const cells = parseCsvLine(lines[i], delimiter);
      const sku = normalizeSku(cells[skuIndex] ?? "");
      if (!sku) continue;
      const lookupSku = normalizeLicenseLookupSku(sku);
      allSku.add(lookupSku);

      const type = typeIndex >= 0 ? (cells[typeIndex] ?? "").trim() : "";
      const weightGramsFromKg = weightKgIndex >= 0 ? parseWeightKgToGrams(cells[weightKgIndex] ?? "") : null;
      const weightGramsDirect = weightGramsIndex >= 0 ? parseIntegerCents(cells[weightGramsIndex] ?? "") : null;
      const parsedFeeCents = feeIndex >= 0 ? parseIntegerCents(cells[feeIndex] ?? "") : null;

      const persisted = buildLicensePersistence({
        licenseType: type || undefined,
        licenseWeightGrams: weightGramsDirect ?? weightGramsFromKg ?? undefined,
        licenseFeeCents: parsedFeeCents ?? undefined
      });

      if (persisted.licenseType !== "NONE" && persisted.licenseFeeCents > 0) {
        map.set(lookupSku, persisted);
      }
    }
    return { bySku: map, allSku, sourcePath: licensePath };
  } catch {
    return { bySku: new Map(), allSku: new Set(), sourcePath: null };
  }
}

function resolveLicenseForSku(
  sku: string,
  map: Map<string, ParsedLicenseData>
): { matchedKey: string | null; license: ParsedLicenseData } {
  for (const key of getLicenseLookupKeys(sku)) {
    const found = map.get(key);
    if (found) {
      return { matchedKey: key, license: found };
    }
  }

  return {
    matchedKey: null,
    license: buildLicensePersistence({ licenseFeeCents: 0, licenseType: "NONE", licenseWeightGrams: 0 })
  };
}

function hasOfficialSkuReference(sku: string, skuSet: Set<string>): boolean {
  return getLicenseLookupKeys(sku).some((key) => skuSet.has(key));
}

function parseRows(lines: string[], delimiter: string, indexes: HeaderIndexes): {
  validRows: ParsedRow[];
  invalidRows: Array<{ lineNumber: number; reason: string; raw: string }>;
} {
  const validRows: ParsedRow[] = [];
  const invalidRows: Array<{ lineNumber: number; reason: string; raw: string }> = [];

  for (let i = 1; i < lines.length; i += 1) {
    const raw = lines[i];
    const lineNumber = i + 1;
    const cells = parseCsvLine(raw, delimiter);

    const name = (cells[indexes.name] ?? "").trim();
    const sku = (cells[indexes.sku] ?? "").trim();
    const priceRaw = (cells[indexes.price] ?? "").trim();
    const priceCents = parsePriceToCents(priceRaw);

    if (!name) {
      invalidRows.push({ lineNumber, reason: "name fehlt", raw });
      continue;
    }
    if (!sku) {
      invalidRows.push({ lineNumber, reason: "artikelnummer fehlt", raw });
      continue;
    }
    if (priceCents === null) {
      invalidRows.push({ lineNumber, reason: "preis ist ungueltig", raw });
      continue;
    }

    validRows.push({
      lineNumber,
      name,
      sku,
      defaultPriceCents: priceCents
    });
  }

  return { validRows, invalidRows };
}

function csvEscape(value: string): string {
  const normalized = value.replace(/\r?\n/g, " ").trim();
  if (normalized.includes('"')) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  if (normalized.includes(",") || normalized.includes(";")) {
    return `"${normalized}"`;
  }
  return normalized;
}

async function writeCsvReport(filePath: string, header: string[], rows: string[][]): Promise<void> {
  const lines = [header.join(","), ...rows.map((row) => row.map(csvEscape).join(","))];
  await fs.writeFile(filePath, `${lines.join("\n")}\n`, "utf8");
}

async function main() {
  const csvPath = await resolveCsvPath();
  const buffer = await fs.readFile(csvPath);
  const content = decodeCsv(buffer);
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    throw new Error("CSV ist leer oder enthaelt keine Datenzeilen.");
  }

  const delimiter = detectDelimiter(lines[0]);
  const headers = parseCsvLine(lines[0], delimiter);
  const indexes = findHeaderIndexes(headers);
  const { validRows, invalidRows } = parseRows(lines, delimiter, indexes);

  if (validRows.length === 0) {
    throw new Error("Keine gueltigen CSV-Zeilen zum Import gefunden.");
  }

  const lastBySku = new Map<string, ParsedRow>();
  for (const row of validRows) {
    lastBySku.set(row.sku, row);
  }
  const uniqueRows = [...lastBySku.values()];
  const licenseLookup = await loadLicenseFeesBySku();
  const licenseFeesBySku = licenseLookup.bySku;

  const existing = await prisma.product.findMany({
    where: { sku: { in: uniqueRows.map((row) => normalizeSku(row.sku)) } },
    select: { sku: true }
  });
  const existingSet = new Set(existing.map((item) => item.sku));

  let created = 0;
  let updated = 0;
  const licensedRows: string[][] = [];
  const missingLicenseRows: string[][] = [];

  for (const row of uniqueRows) {
    const normalizedSku = normalizeSku(row.sku);
    const existed = existingSet.has(normalizedSku);
    const licenseMatch = resolveLicenseForSku(normalizedSku, licenseFeesBySku);
    const license = licenseMatch.license;

    await prisma.product.upsert({
      where: { sku: normalizedSku },
      create: {
        name: row.name,
        sku: normalizedSku,
        defaultPriceCents: row.defaultPriceCents,
        licenseFeeCents: license.licenseFeeCents,
        licenseType: license.licenseType,
        licenseWeightGrams: license.licenseWeightGrams,
        isActive: true
      },
      update: {
        name: row.name,
        defaultPriceCents: row.defaultPriceCents,
        licenseFeeCents: license.licenseFeeCents,
        licenseType: license.licenseType,
        licenseWeightGrams: license.licenseWeightGrams,
        isActive: true
      }
    });

    if (license.licenseType !== "NONE" && license.licenseFeeCents > 0) {
      licensedRows.push([
        normalizedSku,
        row.name,
        license.licenseType,
        (license.licenseWeightGrams / 1000).toFixed(3),
        (license.licenseFeeCents / 100).toFixed(2),
        licenseMatch.matchedKey ?? ""
      ]);
    } else {
      const hasOfficialSku = hasOfficialSkuReference(normalizedSku, licenseLookup.allSku);
      missingLicenseRows.push([
        normalizedSku,
        row.name,
        hasOfficialSku ? "kein_lizenzwert_in_excel" : "nicht_in_excel"
      ]);
    }

    if (existed) {
      updated += 1;
    } else {
      created += 1;
    }
  }

  if (invalidRows.length > 0) {
    console.warn(`[import:products] ${invalidRows.length} fehlerhafte Zeilen wurden uebersprungen:`);
    for (const row of invalidRows.slice(0, 50)) {
      console.warn(`  Zeile ${row.lineNumber}: ${row.reason} -> ${row.raw}`);
    }
    if (invalidRows.length > 50) {
      console.warn(`  ... weitere ${invalidRows.length - 50} Zeilen ausgelassen`);
    }
  }

  licensedRows.sort((a, b) => a[0].localeCompare(b[0], "de-DE"));
  missingLicenseRows.sort((a, b) => a[0].localeCompare(b[0], "de-DE"));

  const licensedReportPath = path.join(process.cwd(), "data", "licensed-products-from-excel.csv");
  const missingReportPath = path.join(process.cwd(), "data", "missing-license-fee-products.csv");
  await writeCsvReport(
    licensedReportPath,
    ["sku", "name", "licenseType", "licenseWeightKg", "licenseFeeEuro", "matchedOfficialSkuKey"],
    licensedRows
  );
  await writeCsvReport(missingReportPath, ["sku", "name", "reason"], missingLicenseRows);

  console.log(
    `[import:products] Import abgeschlossen. importiert=${uniqueRows.length}, neu=${created}, aktualisiert=${updated}, fehlerhaft=${invalidRows.length}`
  );
  console.log(
    `[import:products] Lizenzquelle=${licenseLookup.sourcePath ?? "keine offizielle Datei gefunden"}, mitLizenz=${licensedRows.length}, ohneLizenz=${missingLicenseRows.length}`
  );
  console.log(`[import:products] Report mit Lizenz: ${licensedReportPath}`);
  console.log(`[import:products] Report ohne Lizenz: ${missingReportPath}`);
}

main()
  .catch((error) => {
    console.error("[import:products] Fehler:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

