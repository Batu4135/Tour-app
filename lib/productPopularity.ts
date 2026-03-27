import { extractComparableProductSku } from "@/lib/customerPriceDirectory";

type ProductLike = {
  id: number;
  sku: string;
};

type ProductAliasLike = {
  alias: string;
  productId: number;
};

type ProductPopularityClient = {
  customerPriceDirectoryEntry: {
    groupBy: (args: Record<string, unknown>) => Promise<Array<{ productSku: string; _count: { _all: number } }>>;
  };
  productAlias: {
    findMany: (args: Record<string, unknown>) => Promise<ProductAliasLike[]>;
  };
};

export async function getProductPopularityMap(
  client: ProductPopularityClient,
  products: ProductLike[]
): Promise<Record<number, number>> {
  if (products.length === 0) return {};

  const productIds = [...new Set(products.map((product) => product.id))];
  const aliases = await client.productAlias.findMany({
    where: { productId: { in: productIds } },
    select: { alias: true, productId: true }
  });

  const skuKeysByProductId = new Map<number, Set<string>>();
  for (const product of products) {
    const key = extractComparableProductSku(product.sku);
    if (!key) continue;
    if (!skuKeysByProductId.has(product.id)) skuKeysByProductId.set(product.id, new Set());
    skuKeysByProductId.get(product.id)?.add(key);
  }

  for (const alias of aliases) {
    const key = extractComparableProductSku(alias.alias);
    if (!key) continue;
    if (!skuKeysByProductId.has(alias.productId)) skuKeysByProductId.set(alias.productId, new Set());
    skuKeysByProductId.get(alias.productId)?.add(key);
  }

  const allKeys = [...new Set([...skuKeysByProductId.values()].flatMap((keys) => [...keys]))];
  if (allKeys.length === 0) return {};

  const grouped = await client.customerPriceDirectoryEntry.groupBy({
    by: ["productSku"],
    where: {
      productSku: {
        in: allKeys
      }
    },
    _count: {
      _all: true
    }
  });

  const countBySku = new Map<string, number>();
  for (const row of grouped) {
    countBySku.set(extractComparableProductSku(row.productSku), row._count._all);
  }

  const popularityByProductId: Record<number, number> = {};
  for (const product of products) {
    const keys = [...(skuKeysByProductId.get(product.id) ?? new Set())];
    popularityByProductId[product.id] = keys.reduce((best, key) => Math.max(best, countBySku.get(key) ?? 0), 0);
  }

  return popularityByProductId;
}
