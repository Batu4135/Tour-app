export type SearchableProductLike = {
  name: string;
  sku: string;
  popularityCount?: number | null;
};

export function normalizeProductSearchValue(value: string): string {
  return value
    .toLocaleLowerCase("de-DE")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function compareProductsByPopularity<T extends SearchableProductLike>(
  left: T,
  right: T,
  locale = "de-DE"
): number {
  const popularityDelta = (right.popularityCount ?? 0) - (left.popularityCount ?? 0);
  if (popularityDelta !== 0) return popularityDelta;

  const nameDelta = left.name.localeCompare(right.name, locale);
  if (nameDelta !== 0) return nameDelta;

  return left.sku.localeCompare(right.sku, locale);
}

export function getProductSearchScore(product: SearchableProductLike, query: string): number | null {
  const normalizedQuery = normalizeProductSearchValue(query);
  if (!normalizedQuery) return 1000;

  const normalizedName = normalizeProductSearchValue(product.name);
  const normalizedSku = normalizeProductSearchValue(product.sku);

  if (normalizedName === normalizedQuery || normalizedSku === normalizedQuery) return 0;
  if (normalizedName.startsWith(normalizedQuery)) return 10;
  if (normalizedSku.startsWith(normalizedQuery)) return 16;

  const nameWords = normalizedName.split(/\s+/).filter(Boolean);
  const wordPrefixIndex = nameWords.findIndex((word) => word.startsWith(normalizedQuery));
  if (wordPrefixIndex >= 0) return 24 + wordPrefixIndex;

  const queryParts = normalizedQuery.split(/\s+/).filter(Boolean);
  if (queryParts.length > 1) {
    const allPartsMatch = queryParts.every((part) => normalizedName.includes(part) || normalizedSku.includes(part));
    if (allPartsMatch) {
      return (
        36 +
        queryParts.reduce((score, part) => {
          const nameIndex = normalizedName.indexOf(part);
          const skuIndex = normalizedSku.indexOf(part);
          const bestIndex = Math.min(nameIndex >= 0 ? nameIndex : 999, skuIndex >= 0 ? skuIndex : 999);
          return score + bestIndex;
        }, 0)
      );
    }
  }

  const nameIndex = normalizedName.indexOf(normalizedQuery);
  if (nameIndex >= 0) return 60 + nameIndex;

  const skuIndex = normalizedSku.indexOf(normalizedQuery);
  if (skuIndex >= 0) return 78 + skuIndex;

  return null;
}

export function rankProductsBySearch<T extends SearchableProductLike>(
  products: T[],
  query: string,
  locale = "de-DE"
): T[] {
  const normalizedQuery = normalizeProductSearchValue(query);

  if (!normalizedQuery) {
    return [...products].sort((left, right) => compareProductsByPopularity(left, right, locale));
  }

  return products
    .map((product) => ({
      product,
      score: getProductSearchScore(product, normalizedQuery)
    }))
    .filter((entry): entry is { product: T; score: number } => entry.score !== null)
    .sort(
      (left, right) =>
        left.score - right.score || compareProductsByPopularity(left.product, right.product, locale)
    )
    .map((entry) => entry.product);
}
