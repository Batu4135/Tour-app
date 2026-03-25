import path from "path";
import xlsx from "xlsx";
import { prisma } from "../lib/prisma";

type CustomerImportRow = {
  name: string;
  address: string | null;
  phone: string | null;
  routeDay: string;
};

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[.\-_/\\:()]/g, "");
}

function compactWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function parseArgs() {
  const [, , inputArg, routeDayArg] = process.argv;
  if (!inputArg) {
    throw new Error("Bitte den Pfad zur Kunden-Excel angeben, z.B. tsx scripts/import-customers.ts data/Kunden_Bremen_export.xlsx Bremen");
  }

  const inputPath = path.isAbsolute(inputArg) ? inputArg : path.join(process.cwd(), inputArg);
  const inferredRouteDay = path
    .basename(inputPath)
    .replace(/^Kunden_/i, "")
    .replace(/_export\.xlsx$/i, "")
    .replace(/\.xlsx$/i, "")
    .replace(/[_-]+/g, " ")
    .trim();

  const routeDay = compactWhitespace(routeDayArg?.trim() || inferredRouteDay);
  if (!routeDay) {
    throw new Error("Bitte einen Rota günü / routeDay angeben.");
  }

  return { inputPath, routeDay };
}

function findHeaderIndexes(rows: string[][]) {
  for (let rowIndex = 0; rowIndex < Math.min(rows.length, 10); rowIndex += 1) {
    const normalized = rows[rowIndex].map((cell) => normalizeHeader(String(cell ?? "")));
    const nameIndex = normalized.findIndex((value) => value === "kunde" || value === "name");
    const phoneIndex = normalized.findIndex((value) => value === "telefon" || value === "phone");
    const addressIndex = normalized.findIndex((value) => value === "rechnungan" || value === "adresse" || value === "address");
    if (nameIndex >= 0 && addressIndex >= 0) {
      return {
        rowIndex,
        nameIndex,
        phoneIndex,
        addressIndex
      };
    }
  }

  throw new Error("Kunden-Excel hat keine gueltigen Spalten fuer Kunde / Telefon / Rechnung an.");
}

function extractCustomerName(raw: string): string {
  const text = compactWhitespace(raw);
  if (!text) return "";

  const parts = text.split("·").map((part) => compactWhitespace(part));
  if (parts.length >= 2 && parts[1]) {
    return parts.slice(1).join(" - ");
  }

  return text;
}

function normalizePhone(raw: string): string | null {
  const value = compactWhitespace(raw);
  return value || null;
}

function normalizeAddress(raw: string): string | null {
  const value = compactWhitespace(raw);
  return value || null;
}

function buildKey(row: CustomerImportRow): string {
  return [
    row.routeDay.trim().toLocaleLowerCase("tr-TR"),
    row.name.trim().toLocaleLowerCase("tr-TR"),
    row.address?.trim().toLocaleLowerCase("tr-TR") ?? "",
    row.phone?.trim().toLocaleLowerCase("tr-TR") ?? ""
  ].join("|");
}

async function main() {
  const { inputPath, routeDay } = parseArgs();
  const workbook = xlsx.readFile(inputPath, { raw: false });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(firstSheet, {
    header: 1,
    raw: false,
    defval: ""
  }) as string[][];

  const { rowIndex, nameIndex, phoneIndex, addressIndex } = findHeaderIndexes(rows);
  const parsedRows: CustomerImportRow[] = [];

  for (let index = rowIndex + 1; index < rows.length; index += 1) {
    const row = rows[index];
    const name = extractCustomerName(String(row[nameIndex] ?? ""));
    const address = normalizeAddress(String(row[addressIndex] ?? ""));
    const phone = phoneIndex >= 0 ? normalizePhone(String(row[phoneIndex] ?? "")) : null;

    if (!name && !address && !phone) continue;
    if (!name) continue;

    parsedRows.push({
      name,
      address,
      phone,
      routeDay
    });
  }

  const dedupedByKey = new Map<string, CustomerImportRow>();
  for (const row of parsedRows) {
    dedupedByKey.set(buildKey(row), row);
  }
  const dedupedRows = [...dedupedByKey.values()];

  const existing = await prisma.customer.findMany({
    select: {
      name: true,
      address: true,
      phone: true,
      routeDay: true
    }
  });
  const existingKeys = new Set(
    existing.map((row) =>
      buildKey({
        name: row.name,
        address: row.address,
        phone: row.phone,
        routeDay: row.routeDay ?? ""
      })
    )
  );

  const toCreate = dedupedRows.filter((row) => !existingKeys.has(buildKey(row)));
  const chunkSize = 200;
  for (let index = 0; index < toCreate.length; index += chunkSize) {
    const chunk = toCreate.slice(index, index + chunkSize);
    await prisma.customer.createMany({
      data: chunk
    });
  }

  console.log(
    JSON.stringify(
      {
        routeDay,
        parsed: parsedRows.length,
        uniqueInFile: dedupedRows.length,
        created: toCreate.length,
        skippedExisting: dedupedRows.length - toCreate.length
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error("[import:customers] Fehler:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
