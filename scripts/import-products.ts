import fs from "fs/promises";
import path from "path";
import { prisma } from "../lib/prisma";
import {
  LICENSE_RATE_CENTS_PER_KG,
  computeLicenseFeeCents,
  normalizeLicenseMaterial,
  type LicenseMaterialCode
} from "../lib/license";

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

type LicenseEntry = {
  feeCents: number;
  licenseMaterial: LicenseMaterialCode | null;
  licenseWeightGrams: number;
};

function normalizeSku(value: string): string {
  return value.trim();
}

function canonicalSkuForLookup(value: string): string {
  return normalizeSku(value).replace(/\s+/g, "").toUpperCase();
}

function skuLookupCandidates(value: string): string[] {
  const canonical = canonicalSkuForLookup(value);
  if (!canonical) return [];

  const candidates = new Set<string>([canonical]);
  const baseNumericMatch = canonical.match(/^(\d+)[A-Z]+$/);
  if (baseNumericMatch?.[1]) {
    candidates.add(baseNumericMatch[1]);
  }

  return [...candidates];
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

function parseWeightKgToGrams(raw: string): number | null {
  const cleaned = raw.replace(/\s/g, "").replace(",", ".").replace(/[^\d.-]/g, "").trim();
  if (!cleaned) return null;
  const value = Number.parseFloat(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.max(0, Math.round(value * 1000));
}

function inferLicenseMaterialFromName(name: string): LicenseMaterialCode {
  const normalized = name.toLowerCase();
  if (/(alu|aluminium)/i.test(normalized)) return "LA";
  if (/(verbund|composite|tetra)/i.test(normalized)) return "LV";
  if (/(papier|papp|karton|serviett|beutel|box)/i.test(normalized)) return "LP";
  return "LK";
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

async function loadLicenseFeesBySku(): Promise<Map<string, LicenseEntry>> {
  const licensePath = path.join(process.cwd(), "data", "license-fees.csv");
  try {
    const raw = await fs.readFile(licensePath, "utf8");
    const lines = raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    if (lines.length < 2) return new Map();

    const delimiter = detectDelimiter(lines[0]);
    const header = parseCsvLine(lines[0], delimiter).map(normalizeHeader);

    const skuIndex = header.findIndex((cell) => cell === "sku" || cell === "artikelnummer" || cell === "artikelnr");
    const feeIndex = header.findIndex((cell) => cell === "licensefeecents" || cell === "lizenzgebuehrcent");
    const materialIndex = header.findIndex(
      (cell) => cell === "licensematerial" || cell === "lizenztyp" || cell === "licensetype"
    );
    const weightKgIndex = header.findIndex(
      (cell) => cell === "licenseweightkg" || cell === "gewichtkg" || cell === "weightkg"
    );

    if (skuIndex < 0) return new Map();

    const map = new Map<string, LicenseEntry>();
    for (let i = 1; i < lines.length; i += 1) {
      const cells = parseCsvLine(lines[i], delimiter);
      const sku = normalizeSku(cells[skuIndex] ?? "");
      if (!sku) continue;

      const material = normalizeLicenseMaterial(materialIndex >= 0 ? cells[materialIndex] : undefined);
      const weightGramsRaw = weightKgIndex >= 0 ? parseWeightKgToGrams(cells[weightKgIndex] ?? "") : null;
      const feeRaw = feeIndex >= 0 ? Number.parseInt((cells[feeIndex] ?? "").trim(), 10) : NaN;

      const licenseWeightGrams = weightGramsRaw !== null ? Math.max(0, Math.round(weightGramsRaw)) : 0;
      const feeFromColumn = Number.isFinite(feeRaw) && feeRaw >= 0 ? Math.round(feeRaw) : null;
      const feeFromMaterial = material && licenseWeightGrams > 0 ? computeLicenseFeeCents(material, licenseWeightGrams) : 0;
      const feeCents = feeFromColumn ?? feeFromMaterial;

      map.set(canonicalSkuForLookup(sku), {
        feeCents: Math.max(0, feeCents),
        licenseMaterial: material,
        licenseWeightGrams
      });
    }
    return map;
  } catch {
    return new Map();
  }
}

function resolveLicenseEntry(
  map: Map<string, LicenseEntry>,
  sku: string
): { entry: LicenseEntry; source: "exact" | "base" } | null {
  const candidates = skuLookupCandidates(sku);
  if (candidates.length === 0) return null;

  const direct = candidates[0];
  if (direct && map.has(direct)) {
    return { entry: map.get(direct)!, source: "exact" };
  }

  for (let i = 1; i < candidates.length; i += 1) {
    const candidate = candidates[i];
    if (!candidate || !map.has(candidate)) continue;
    return { entry: map.get(candidate)!, source: "base" };
  }

  return null;
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
  let matchedExact = 0;
  let matchedBase = 0;

  for (const row of uniqueRows) {
    const normalizedSku = normalizeSku(row.sku);
    const existed = existingSet.has(normalizedSku);
    const resolved = resolveLicenseEntry(licenseFeesBySku, normalizedSku);

    if (resolved?.source === "exact") matchedExact += 1;
    if (resolved?.source === "base") matchedBase += 1;

    const baseEntry = resolved?.entry ?? {
      feeCents: 0,
      licenseMaterial: null,
      licenseWeightGrams: 0
    };
    const inferredMaterial =
      baseEntry.feeCents > 0 ? baseEntry.licenseMaterial ?? inferLicenseMaterialFromName(row.name) : null;
    const derivedWeightGrams =
      inferredMaterial && baseEntry.feeCents > 0 && baseEntry.licenseWeightGrams <= 0
        ? Math.round((baseEntry.feeCents / LICENSE_RATE_CENTS_PER_KG[inferredMaterial]) * 1000)
        : baseEntry.licenseWeightGrams;
    const licenseWeightGrams = Math.max(0, derivedWeightGrams);
    const licenseFeeCents =
      inferredMaterial && licenseWeightGrams > 0
        ? computeLicenseFeeCents(inferredMaterial, licenseWeightGrams)
        : Math.max(0, baseEntry.feeCents);

    await prisma.product.upsert({
      where: { sku: normalizedSku },
      create: {
        name: row.name,
        sku: normalizedSku,
        defaultPriceCents: row.defaultPriceCents,
        licenseFeeCents,
        licenseMaterial: inferredMaterial,
        licenseWeightGrams,
        isActive: true
      },
      update: {
        name: row.name,
        defaultPriceCents: row.defaultPriceCents,
        licenseFeeCents,
        licenseMaterial: inferredMaterial,
        licenseWeightGrams,
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
  console.log(`[import:products] Lizenz-Matching: direkt=${matchedExact}, basisSKU=${matchedBase}`);
}

main()
  .catch((error) => {
    console.error("[import:products] Fehler:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
