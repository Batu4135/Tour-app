export type ImportedCustomerPriceLike = {
  routeDay: string | null;
  productSku: string;
  priceCents: number;
};

type TxClient = {
  customerPriceDirectoryEntry: {
    findMany: (args: Record<string, unknown>) => Promise<Array<ImportedCustomerPriceLike>>;
  };
  product: {
    findMany: (args: Record<string, unknown>) => Promise<Array<{ id: number; sku: string }>>;
  };
  productAlias: {
    findMany: (args: Record<string, unknown>) => Promise<Array<{ alias: string; productId: number }>>;
  };
  customerPrice: {
    upsert: (args: Record<string, unknown>) => Promise<unknown>;
  };
};

export function compactWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function normalizeComparable(value: string): string {
  return compactWhitespace(value)
    .toLocaleLowerCase("tr-TR")
    .replace(/[^a-z0-9\u00c0-\u024f]+/g, "");
}

export function normalizeImportedCustomerName(raw: string): string {
  const text = compactWhitespace(raw);
  if (!text) return "";

  const parts = text.split(/Â·|·/).map((part) => compactWhitespace(part));
  if (parts.length >= 2 && parts[1]) {
    return parts.slice(1).join(" - ");
  }

  const withoutNumericPrefix = text.replace(/^\d{2,6}\s*(?:-|–|—|:)?\s+/, "").trim();
  return withoutNumericPrefix || text;
}

export function normalizeImportedProductSku(raw: string): string {
  const text = compactWhitespace(raw);
  if (!text) return "";

  const parts = text.split(/Â·|·/).map((part) => compactWhitespace(part));
  return extractComparableProductSku(parts[0] || text);
}

export function extractComparableProductSku(raw: string): string {
  const text = compactWhitespace(raw);
  if (!text) return "";

  const firstSegment = text.split(/Â·|·/).map((part) => compactWhitespace(part))[0] || text;
  const compact = compactWhitespace(firstSegment).toUpperCase().replace(/\s+/g, "");
  const leadingDigits = compact.match(/^(\d{1,8})/);
  if (leadingDigits) {
    return leadingDigits[1].replace(/^0+/, "") || "0";
  }
  return compact;
}

export function parsePriceToCents(raw: string): number | null {
  const cleaned = compactWhitespace(raw).replace(/\u20ac/gi, "");
  if (!cleaned) return null;

  const normalized = cleaned.replace(/[^\d,.-]/g, "");
  if (!normalized) return null;

  const commaCount = (normalized.match(/,/g) ?? []).length;
  const dotCount = (normalized.match(/\./g) ?? []).length;

  let decimal = normalized;
  if (commaCount > 0 && dotCount > 0) {
    decimal = normalized.replace(/\./g, "").replace(",", ".");
  } else if (commaCount > 0) {
    decimal = normalized.replace(",", ".");
  }

  const value = Number.parseFloat(decimal);
  if (!Number.isFinite(value)) return null;

  return Math.round(value * 100);
}

export function buildCustomerPriceDirectoryFingerprint(input: {
  routeDay: string | null;
  normalizedCustomerName: string;
  productSku: string;
}): string {
  return [
    normalizeComparable(input.routeDay ?? ""),
    input.normalizedCustomerName,
    normalizeComparable(input.productSku)
  ].join("|");
}

function normalizeRouteDay(value: string | null | undefined): string {
  return compactWhitespace(value ?? "").toLocaleLowerCase("tr-TR");
}

export function selectImportedCustomerPriceRows<T extends ImportedCustomerPriceLike>(
  rows: T[],
  routeDay: string | null | undefined
): T[] {
  if (rows.length === 0) return [];

  const normalizedRouteDay = normalizeRouteDay(routeDay);
  const exactRouteRows = normalizedRouteDay
    ? rows.filter((row) => normalizeRouteDay(row.routeDay) === normalizedRouteDay)
    : [];
  if (exactRouteRows.length > 0) return exactRouteRows;

  const rowsWithoutRoute = rows.filter((row) => !compactWhitespace(row.routeDay ?? ""));
  if (rowsWithoutRoute.length === rows.length) return rowsWithoutRoute;

  const uniqueRoutes = new Set(rows.map((row) => normalizeRouteDay(row.routeDay)).filter(Boolean));
  if (uniqueRoutes.size === 1) return rows;

  return [];
}

export async function attachImportedCustomerPrices(
  tx: TxClient,
  customer: { id: number; name: string; routeDay: string | null }
) {
  const normalizedCustomerName = normalizeComparable(customer.name);
  if (!normalizedCustomerName) {
    return { matchedRows: 0, attachedRows: 0, missingProductSkus: [] as string[] };
  }

  const importedRows = await tx.customerPriceDirectoryEntry.findMany({
    where: {
      normalizedCustomerName
    },
    select: {
      routeDay: true,
      productSku: true,
      priceCents: true
    },
    orderBy: {
      productSku: "asc"
    }
  });

  const selectedRows = selectImportedCustomerPriceRows(importedRows, customer.routeDay);
  if (selectedRows.length === 0) {
    return { matchedRows: importedRows.length, attachedRows: 0, missingProductSkus: [] as string[] };
  }

  const uniqueSkus = [...new Set(selectedRows.map((row) => row.productSku).filter(Boolean))];
  const [products, aliases] = await Promise.all([
    tx.product.findMany({
      select: { id: true, sku: true }
    }),
    tx.productAlias.findMany({
      select: { alias: true, productId: true }
    })
  ]);

  const productIdsBySku = new Map<string, number[]>();
  for (const product of products) {
    const key = extractComparableProductSku(product.sku);
    if (!key) continue;
    const list = productIdsBySku.get(key) ?? [];
    list.push(product.id);
    productIdsBySku.set(key, list);
  }
  for (const alias of aliases) {
    const key = extractComparableProductSku(alias.alias);
    if (!key) continue;
    const list = productIdsBySku.get(key) ?? [];
    if (!list.includes(alias.productId)) list.push(alias.productId);
    productIdsBySku.set(key, list);
  }

  let attachedRows = 0;
  const missingProductSkus: string[] = [];

  for (const row of selectedRows) {
    const productIds = productIdsBySku.get(extractComparableProductSku(row.productSku)) ?? [];
    if (productIds.length === 0) {
      missingProductSkus.push(row.productSku);
      continue;
    }

    for (const productId of productIds) {
      await tx.customerPrice.upsert({
        where: {
          customerId_productId: {
            customerId: customer.id,
            productId
          }
        },
        create: {
          customerId: customer.id,
          productId,
          priceCents: row.priceCents
        },
        update: {
          priceCents: row.priceCents
        }
      });
      attachedRows += 1;
    }
  }

  return {
    matchedRows: selectedRows.length,
    attachedRows,
    missingProductSkus: [...new Set(missingProductSkus)]
  };
}
