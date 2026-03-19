import fs from "fs/promises";
import path from "path";
import { prisma } from "../lib/prisma";

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

function normalizeSku(value: string): string {
  return value.trim();
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
    .replace(/ß/g, "ss");
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

async function loadLicenseFeesBySku(): Promise<Map<string, number>> {
  const licensePath = path.join(process.cwd(), "data", "license-fees.csv");
  try {
    const raw = await fs.readFile(licensePath, "utf8");
    const lines = raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    if (lines.length < 2) return new Map();

    const header = lines[0].split(",").map((cell) => cell.trim().toLowerCase());
    const skuIndex = header.findIndex((cell) => cell === "sku");
    const feeIndex = header.findIndex((cell) => cell === "licensefeecents");
    if (skuIndex < 0 || feeIndex < 0) return new Map();

    const map = new Map<string, number>();
    for (let i = 1; i < lines.length; i += 1) {
      const cells = lines[i].split(",").map((cell) => cell.trim());
      const sku = normalizeSku(cells[skuIndex] ?? "");
      const fee = Number.parseInt(cells[feeIndex] ?? "", 10);
      if (!sku || !Number.isFinite(fee) || fee < 0) continue;
      map.set(sku, fee);
    }
    return map;
  } catch {
    return new Map();
  }
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
  const licenseFeesBySku = await loadLicenseFeesBySku();

  const existing = await prisma.product.findMany({
    where: { sku: { in: uniqueRows.map((row) => normalizeSku(row.sku)) } },
    select: { sku: true }
  });
  const existingSet = new Set(existing.map((item) => item.sku));

  let created = 0;
  let updated = 0;

  for (const row of uniqueRows) {
    const normalizedSku = normalizeSku(row.sku);
    const existed = existingSet.has(normalizedSku);
    await prisma.product.upsert({
      where: { sku: normalizedSku },
      create: {
        name: row.name,
        sku: normalizedSku,
        defaultPriceCents: row.defaultPriceCents,
        licenseFeeCents: licenseFeesBySku.get(normalizedSku) ?? 0,
        isActive: true
      },
      update: {
        name: row.name,
        defaultPriceCents: row.defaultPriceCents,
        licenseFeeCents: licenseFeesBySku.get(normalizedSku) ?? 0,
        isActive: true
      }
    });

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

  console.log(
    `[import:products] Import abgeschlossen. importiert=${uniqueRows.length}, neu=${created}, aktualisiert=${updated}, fehlerhaft=${invalidRows.length}`
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
