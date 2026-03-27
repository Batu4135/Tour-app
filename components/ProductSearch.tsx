"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { rankProductsBySearch } from "@/lib/productSearch";

type Product = {
  id: number;
  name: string;
  sku: string;
  unit?: string | null;
  defaultPriceCents?: number | null;
  popularityCount?: number | null;
};

type ProductSearchProps = {
  products: Product[];
  onSelect: (product: Product) => void;
  placeholder: string;
  emptyLabel?: string;
};

export default function ProductSearch({ products, onSelect, placeholder, emptyLabel = "Keine Treffer" }: ProductSearchProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Product[]>(rankProductsBySearch(products, "").slice(0, 8));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults(rankProductsBySearch(products, "").slice(0, 8));
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const fallback = rankProductsBySearch(products, debouncedQuery).slice(0, 20);

    const run = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products?q=${encodeURIComponent(debouncedQuery)}`, {
          signal: controller.signal
        });
        const payload = (await response.json()) as { products?: Product[] };
        if (!response.ok) {
          setResults(fallback);
          return;
        }
        setResults(payload.products ?? []);
      } catch {
        if (!controller.signal.aborted) {
          setResults(fallback);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void run();
    return () => controller.abort();
  }, [debouncedQuery, products]);

  const filtered = useMemo(() => results, [results]);

  return (
    <div className="card space-y-3">
      <label className="sr-only" htmlFor="product-search">
        Produktsuche
      </label>
      <div className="relative">
        <Search className="search-icon" size={16} />
        <input
          id="product-search"
          className="search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
        />
      </div>
      <div className="max-h-52 space-y-2 overflow-auto pr-1">
        {loading ? <p className="py-1 text-center text-xs text-[#4A4A4A]/60">Suche...</p> : null}
        {filtered.map((product) => (
          <button
            key={product.id}
            type="button"
            className="secondary-btn w-full text-left"
            onClick={() => onSelect(product)}
          >
            <p className="text-sm font-medium">{product.name}</p>
            <p className="text-xs text-[#4A4A4A]/65">
              {[product.sku, product.unit].filter(Boolean).join(" - ") || " "}
            </p>
          </button>
        ))}
        {!loading && filtered.length === 0 ? (
          <p className="py-2 text-center text-sm text-[#4A4A4A]/60">{emptyLabel}</p>
        ) : null}
      </div>
    </div>
  );
}
