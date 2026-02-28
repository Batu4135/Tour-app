"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatCents } from "@/lib/formatCents";

type Product = {
  id: number;
  sku: string;
  name: string;
  defaultPriceCents: number | null;
  isActive: boolean;
};

export default function ProductsPage() {
  const t = useTranslations("productsPage");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 180);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    void loadProducts();
  }, [debounced]);

  const suggestions = useMemo(() => products.slice(0, 8), [products]);

  async function loadProducts() {
    setLoading(true);
    setError("");
    try {
      const params = debounced ? `q=${encodeURIComponent(debounced)}` : "limit=200";
      const response = await fetch(`/api/products?${params}`);
      const payload = (await response.json()) as { products?: Product[]; error?: string };
      if (!response.ok) throw new Error(payload.error ?? t("loadError"));
      setProducts(payload.products ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t("loadError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-sm text-[#4A4A4A]/70">{t("subtitle")}</p>
      </header>

      <div className="card space-y-2">
        <label htmlFor="product-query" className="text-sm font-semibold">
          {t("searchLabel")}
        </label>
        <div className="relative">
          <Search className="search-icon" size={16} />
          <input
            id="product-query"
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
          />
        </div>
        {query.trim() ? (
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-2">
            <p className="mb-1 text-xs text-[#4A4A4A]/60">{t("suggestions")}</p>
            {suggestions.length === 0 && !loading ? (
              <p className="px-1 py-1 text-xs text-[#4A4A4A]/60">{t("noResults")}</p>
            ) : null}
            <div className="space-y-1">
              {suggestions.map((product) => (
                <button
                  key={`suggestion-${product.id}`}
                  className="secondary-btn w-full !py-2 text-left"
                  onClick={() => setQuery(product.sku)}
                >
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-[#4A4A4A]/60">{product.sku}</p>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {loading ? <p className="text-sm text-[#4A4A4A]/65">{t("loading")}</p> : null}
      {error ? <p className="text-sm text-[#4A4A4A]">{error}</p> : null}

      <div className="space-y-2">
        {products.map((product) => (
          <article key={product.id} className="card py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{product.name}</p>
                <p className="text-xs text-[#4A4A4A]/60">{product.sku}</p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-[#2F7EA1]">
                {product.defaultPriceCents !== null ? formatCents(product.defaultPriceCents) : "-"}
              </p>
            </div>
          </article>
        ))}
        {!loading && products.length === 0 ? <p className="text-sm text-[#4A4A4A]/65">{t("empty")}</p> : null}
      </div>
    </section>
  );
}
