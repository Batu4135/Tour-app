import fs from "fs/promises";
import path from "path";
import { prisma } from "../lib/prisma";
import { buildLicensePersistence } from "../lib/license";
import { attachImportedCustomerPrices } from "../lib/customerPriceDirectory";
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

type LicenseType = "NONE" | "LP" | "LK" | "LA" | "LV";

type ParsedLicenseData = {
  licenseFeeCents: number;
  licenseType: LicenseType;
  licenseWeightGrams: number;
};

type ProductSource =
  | {
      kind: "csv";
      path: string;
    }
  | {
      kind: "xlsx";
      path: string;
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
  const keys = new Set<string>([normalized, normalized.replace(/^0+/, "") || "0"]);

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

  const nameIndex = normalized.findIndex(
    (header) => header === "name" || header === "produktname" || header === "artikel"
  );
  const skuIndex = normalized.findIndex(
    (header) => header === "artikelnummer" || header === "artikelnr" || header === "artnr" || header === "sku"
  );
  const priceIndex = normalized.findIndex(
    (header) =>
      header === "preis" ||
      header === "price" ||
      header === "vkpreis" ||
      header === "defaultpreis" ||
      header === "netto"
  );

  if (nameIndex < 0 || skuIndex < 0 || priceIndex < 0) {
    throw new Error(
      "Produkt-Header ungueltig. Erwartet Spalten wie name/artikel, artikelnummer und preis/netto."
    );
  }

  return { name: nameIndex, sku: skuIndex, price: priceIndex };
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

function decodeCsv(buffer: Buffer): string {
  const utf8 = buffer.toString("utf8").replace(/^\uFEFF/, "");
  if (utf8.includes("\uFFFD")) {
    return buffer.toString("latin1").replace(/^\uFEFF/, "");
  }
  return utf8;
}

async function resolveProductSource(): Promise<ProductSource> {
  const candidates: ProductSource[] = [
    { kind: "xlsx", path: path.join(process.cwd(), "data", "Produktliste2026.xlsx") },
    { kind: "csv", path: path.join(process.cwd(), "data", "products.csv") },
    { kind: "csv", path: path.join(process.cwd(), "data", "produkte.csv") }
  ];

  for (const candidate of candidates) {
    try {
      await fs.access(candidate.path);
      return candidate;
    } catch {
      continue;
    }
  }

  throw new Error("Keine Produktquelle gefunden. Erwartet data/Produktliste2026.xlsx, data/products.csv oder data/produkte.csv.");
}

const DEFAULT_OFFICIAL_LICENSE_PATHS = [
  process.env.OFFICIAL_LICENSE_XLSX_PATH?.trim() || "",
  "c:\\Users\\batu4\\Downloads\\ARTIKELLISTE MIT LIZENSGEBÜHREN (1).xlsx",
  "c:\\Users\\batu4\\Downloads\\ARTIKELLISTE MIT LIZENSGEBÃœHREN (1).xlsx",
  path.join(process.cwd(), "data", "ARTIKELLISTE MIT LIZENSGEBÜHREN (1).xlsx"),
  path.join(process.cwd(), "data", "ARTIKELLISTE MIT LIZENSGEBÃœHREN (1).xlsx")
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
  return null;
}

function mapRateToLicenseType(rateCentsPerKg: number): LicenseType {
  if (rateCentsPerKg === 25) return "LP";
  if (rateCentsPerKg === 99) return "LK";
  return "NONE";
}

function normalizeOfficialTypeCell(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/Ä/g, "AE")
    .replace(/Ö/g, "OE")
    .replace(/Ü/g, "UE")
    .replace(/ß/g, "SS");
}

function mapOfficialLicenseTypeFromCell(value: string): LicenseType | null {
  const normalized = normalizeOfficialTypeCell(value);
  if (!normalized) return null;
  if (normalized === "LP" || normalized.includes("PAPIER")) return "LP";
  if (normalized === "LK" || normalized.includes("KUNSTSTOFF")) return "LK";
  if (normalized === "LA" || normalized.includes("ALU")) return "LA";
  if (normalized === "LV" || normalized.includes("VERBUND")) return "LV";
  if (normalized === "NONE" || normalized === "KEINE") return "NONE";
  return null;
}

function loadLicenseFeesFromOfficialXlsx(filePath: string): Map<string, ParsedLicenseData> {
  const workbook = xlsx.readFile(filePath, { cellDates: false, raw: false });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: "" }) as Array<Array<string | number>>;
  if (rows.length === 0) return new Map();

  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(rows.length, 30); i += 1) {
    const normalized = rows[i].map((cell) => normalizeHeader(String(cell ?? "")));
    if (normalized.some((value) => value === "artikelnr" || value === "artikelnummer")) {
      headerRowIndex = i;
      break;
    }
  }

  const header = rows[headerRowIndex].map((cell) => normalizeHeader(String(cell ?? "")));
  const skuIndex = header.findIndex((value) => value === "artikelnr" || value === "artikelnummer" || value === "sku");
  const weightIndex = header.findIndex((value) => value === "gewicht" || value === "weight");
  const rateIndex = header.findIndex(
    (value) => value === "lizensgeb" || value === "lizenzgeb" || value === "lizenzgebuehr" || value === "licensefee"
  );
  const licenseTypeIndex = header.findIndex(
    (value) =>
      value === "lizenztyp" ||
      value === "lizenzart" ||
      value === "lizenstyp" ||
      value === "material" ||
      value === "stoff"
  );

  if (skuIndex < 0 || weightIndex < 0 || rateIndex < 0) {
    throw new Error("Offizielle Lizenzdatei hat keine gueltigen Spalten (Artikel-Nr., Gewicht, Lizensgeb.).");
  }

  const map = new Map<string, ParsedLicenseData>();
  for (let i = headerRowIndex + 1; i < rows.length; i += 1) {
    const row = rows[i];
    const sku = normalizeSku(String(row[skuIndex] ?? ""));
    if (!sku) continue;

    const weightKg = parseDecimal(String(row[weightIndex] ?? ""));
    const rateEuroPerKg = parseDecimal(String(row[rateIndex] ?? ""));
    if (weightKg === null || rateEuroPerKg === null || weightKg <= 0 || rateEuroPerKg <= 0) continue;

    const licenseWeightGrams = Math.round(weightKg * 1000);
    const rateCentsPerKg = Math.round(rateEuroPerKg * 100);
    const explicitType =
      licenseTypeIndex >= 0 ? mapOfficialLicenseTypeFromCell(String(row[licenseTypeIndex] ?? "")) : null;
    const rateType = mapRateToLicenseType(rateCentsPerKg);

    // Strikt datenbasiert: nur offizieller Typ oder eindeutig ueber 0.25 EUR/kg => LP.
    const licenseType: LicenseType = explicitType ?? (rateType === "LP" ? "LP" : "NONE");
    if (licenseType === "NONE") continue;

    const licenseFeeCents = Math.round((licenseWeightGrams * rateCentsPerKg) / 1000);
    const persisted = buildLicensePersistence({
      licenseType,
      licenseWeightGrams,
      licenseFeeCents
    });
    map.set(normalizeLicenseLookupSku(sku), persisted);
  }

  return map;
}

async function loadLicenseFeesBySku(): Promise<Map<string, ParsedLicenseData>> {
  const officialPath = await resolveOfficialLicensePath();
  if (!officialPath) {
    throw new Error(
      "Offizielle Lizenz-Excel wurde nicht gefunden. Bitte OFFICIAL_LICENSE_XLSX_PATH setzen oder Datei in data/ ablegen."
    );
  }
  return loadLicenseFeesFromOfficialXlsx(officialPath);
}

function resolveLicenseForSku(sku: string, map: Map<string, ParsedLicenseData>): ParsedLicenseData {
  for (const key of getLicenseLookupKeys(sku)) {
    const found = map.get(key);
    if (found) return found;
  }
  return buildLicensePersistence({ licenseFeeCents: 0, licenseType: "NONE", licenseWeightGrams: 0 });
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

    validRows.push({ lineNumber, name, sku, defaultPriceCents: priceCents });
  }

  return { validRows, invalidRows };
}

function parseXlsxRows(filePath: string): {
  validRows: ParsedRow[];
  invalidRows: Array<{ lineNumber: number; reason: string; raw: string }>;
} {
  const workbook = xlsx.readFile(filePath, { cellDates: false, raw: false });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: "" }) as Array<Array<string | number>>;

  if (rows.length < 2) {
    throw new Error("Excel ist leer oder enthaelt keine Datenzeilen.");
  }

  const headers = rows[0].map((cell) => String(cell ?? ""));
  const indexes = findHeaderIndexes(headers);
  const validRows: ParsedRow[] = [];
  const invalidRows: Array<{ lineNumber: number; reason: string; raw: string }> = [];

  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    const lineNumber = i + 1;
    const name = String(row[indexes.name] ?? "").trim();
    const sku = String(row[indexes.sku] ?? "").trim();
    const priceRaw = String(row[indexes.price] ?? "").trim();
    const priceCents = parsePriceToCents(priceRaw);

    if (!name) {
      invalidRows.push({ lineNumber, reason: "name fehlt", raw: JSON.stringify(row) });
      continue;
    }
    if (!sku) {
      invalidRows.push({ lineNumber, reason: "artikelnummer fehlt", raw: JSON.stringify(row) });
      continue;
    }
    if (priceCents === null) {
      invalidRows.push({ lineNumber, reason: "preis ist ungueltig", raw: JSON.stringify(row) });
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

async function main() {
  const source = await resolveProductSource();
  let validRows: ParsedRow[] = [];
  let invalidRows: Array<{ lineNumber: number; reason: string; raw: string }> = [];

  if (source.kind === "xlsx") {
    ({ validRows, invalidRows } = parseXlsxRows(source.path));
  } else {
    const buffer = await fs.readFile(source.path);
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
    ({ validRows, invalidRows } = parseRows(lines, delimiter, indexes));
  }

  if (validRows.length === 0) {
    throw new Error("Keine gueltigen Produktzeilen zum Import gefunden.");
  }

  const lastBySku = new Map<string, ParsedRow>();
  for (const row of validRows) {
    lastBySku.set(row.sku, row);
  }
  const uniqueRows = [...lastBySku.values()];
  const licenseFeesBySku = await loadLicenseFeesBySku();

  const customers = await prisma.customer.findMany({
    select: {
      id: true,
      name: true,
      routeDay: true
    },
    orderBy: { id: "asc" }
  });

  await prisma.$transaction(async (tx: any) => {
    await tx.draftLine.deleteMany();
    await tx.customerPrice.deleteMany();
    await tx.productAlias.deleteMany();
    await tx.product.deleteMany();

    if (uniqueRows.length === 0) return;

    const chunkSize = 250;
    for (let index = 0; index < uniqueRows.length; index += chunkSize) {
      const chunk = uniqueRows.slice(index, index + chunkSize);
      await tx.product.createMany({
        data: chunk.map((row) => {
          const normalizedSku = normalizeSku(row.sku);
          const license = resolveLicenseForSku(normalizedSku, licenseFeesBySku);
          return {
            name: row.name,
            sku: normalizedSku,
            defaultPriceCents: row.defaultPriceCents,
            licenseFeeCents: license.licenseFeeCents,
            licenseType: license.licenseType,
            licenseWeightGrams: license.licenseWeightGrams,
            isActive: true
          };
        })
      });
    }
  });

  let restoredCustomerPrices = 0;
  let customersWithPrices = 0;
  for (const customer of customers) {
    const result = await attachImportedCustomerPrices(prisma as any, customer);
    restoredCustomerPrices += result.attachedRows;
    if (result.attachedRows > 0) {
      customersWithPrices += 1;
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

  console.log(
    `[import:products] Import abgeschlossen. quelle=${source.kind}:${path.basename(source.path)}, importiert=${uniqueRows.length}, ersetzt=ja, kundenpreise_wiederhergestellt=${restoredCustomerPrices}, kunden_mit_preisen=${customersWithPrices}, fehlerhaft=${invalidRows.length}`
  );
}

main()
  .catch((error) => {
    console.error("[import:products] Fehler:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
