import path from "path";
import xlsx from "xlsx";
import { prisma } from "../lib/prisma";
import {
  buildCustomerPriceDirectoryFingerprint,
  compactWhitespace,
  normalizeComparable,
  normalizeImportedCustomerName,
  normalizeImportedProductSku,
  parsePriceToCents
} from "../lib/customerPriceDirectory";

type HeaderIndexes = {
  customer: number;
  article: number;
  description: number;
  price: number;
};

type ParsedPriceRow = {
  routeDay: string | null;
  customerName: string;
  normalizedCustomerName: string;
  productSku: string;
  productLabel: string | null;
  priceCents: number;
  fingerprint: string;
};

function normalizeHeader(value: string): string {
  return compactWhitespace(value)
    .toLowerCase()
    .replace(/[\s._\-\/\\:()]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
}

function parseArgs() {
  const [, , inputArg] = process.argv;
  if (!inputArg) {
    throw new Error(
      "Bitte den Pfad zur Kundenpreisliste angeben, z.B. tsx scripts/import-customer-prices.ts data/Kundenpreisliste_export.xlsx"
    );
  }

  return path.isAbsolute(inputArg) ? inputArg : path.join(process.cwd(), inputArg);
}

function findHeaderIndexes(rows: string[][]): HeaderIndexes {
  for (let rowIndex = 0; rowIndex < Math.min(rows.length, 5); rowIndex += 1) {
    const normalized = rows[rowIndex].map((cell) => normalizeHeader(String(cell ?? "")));
    const customer = normalized.findIndex((value) => value === "kunden" || value === "kunde");
    const article = normalized.findIndex((value) => value === "artikel" || value === "artikelnr");
    const description = normalized.findIndex((value) => value === "beschreibung");
    const price = normalized.findIndex(
      (value) => value === "kundenprnetto" || value === "kundenpreisnetto" || value === "kundenpr."
    );

    if (customer >= 0 && article >= 0 && description >= 0 && price >= 0) {
      return { customer, article, description, price };
    }
  }

  throw new Error("Kundenpreisliste hat keine gueltigen Spalten fuer Kunden / Artikel / Beschreibung / Kundenpr. netto.");
}

async function main() {
  const inputPath = parseArgs();
  const workbook = xlsx.readFile(inputPath, { raw: false });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(firstSheet, {
    header: 1,
    raw: false,
    defval: ""
  }) as string[][];

  const indexes = findHeaderIndexes(rows);

  const directoryCustomers = await prisma.customerDirectoryEntry.findMany({
    select: { name: true, routeDay: true }
  });
  const routeDaysByCustomerName = new Map<string, Set<string>>();
  for (const customer of directoryCustomers) {
    const key = normalizeComparable(customer.name);
    if (!key) continue;
    if (!routeDaysByCustomerName.has(key)) routeDaysByCustomerName.set(key, new Set());
    routeDaysByCustomerName.get(key)?.add(customer.routeDay);
  }

  const parsedRows: ParsedPriceRow[] = [];
  let currentCustomerName = "";
  let currentRouteDay: string | null = null;

  for (let index = 1; index < rows.length; index += 1) {
    const row = rows[index];
    const customerCell = compactWhitespace(String(row[indexes.customer] ?? ""));
    const articleCell = compactWhitespace(String(row[indexes.article] ?? ""));
    const descriptionCell = compactWhitespace(String(row[indexes.description] ?? ""));
    const priceCell = compactWhitespace(String(row[indexes.price] ?? ""));

    if (customerCell && !articleCell) {
      currentCustomerName = normalizeImportedCustomerName(customerCell);
      const normalizedCustomerName = normalizeComparable(currentCustomerName);
      const matchedRouteDays = [...(routeDaysByCustomerName.get(normalizedCustomerName) ?? new Set())];
      currentRouteDay = matchedRouteDays.length === 1 ? matchedRouteDays[0] : null;
      continue;
    }

    if (!currentCustomerName || !articleCell || !priceCell) continue;

    const productSku = normalizeImportedProductSku(articleCell);
    const priceCents = parsePriceToCents(priceCell);
    if (!productSku || priceCents === null) continue;

    const normalizedCustomerName = normalizeComparable(currentCustomerName);
    parsedRows.push({
      routeDay: currentRouteDay,
      customerName: currentCustomerName,
      normalizedCustomerName,
      productSku,
      productLabel: descriptionCell || null,
      priceCents,
      fingerprint: buildCustomerPriceDirectoryFingerprint({
        routeDay: currentRouteDay,
        normalizedCustomerName,
        productSku
      })
    });
  }

  const dedupedRows = [...new Map(parsedRows.map((row) => [row.fingerprint, row])).values()];

  await prisma.customerPriceDirectoryEntry.deleteMany();

  const chunkSize = 500;
  for (let index = 0; index < dedupedRows.length; index += chunkSize) {
    const chunk = dedupedRows.slice(index, index + chunkSize);
    await prisma.customerPriceDirectoryEntry.createMany({ data: chunk });
  }

  const withUniqueRouteDay = dedupedRows.filter((row) => row.routeDay).length;
  const unresolvedRouteDay = dedupedRows.length - withUniqueRouteDay;

  console.log(
    JSON.stringify(
      {
        parsed: parsedRows.length,
        imported: dedupedRows.length,
        withUniqueRouteDay,
        unresolvedRouteDay
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error("[import:customer-prices] Fehler:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
