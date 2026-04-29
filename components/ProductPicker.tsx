"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatCents, parseEuroToCents } from "@/lib/formatCents";
import { LicenseType, getLineLicenseTotals } from "@/lib/license";
import { rankProductsBySearch } from "@/lib/productSearch";
import {
  formatQuantity,
  isQuantityInputAllowed,
  multiplyCentsByQuantity,
  parseQuantityInput,
  roundQuantity
} from "@/lib/quantity";

export type ProductOption = {
  id: number;
  sku: string;
  name: string;
  defaultPriceCents: number | null;
  popularityCount?: number;
  licenseType?: LicenseType;
  licenseWeightGrams?: number;
  licenseFeeCents?: number;
};

export type SelectedProductItem = {
  productId: number;
  sku: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
  licenseType?: LicenseType;
  licenseWeightGrams?: number;
  licenseFeeCents?: number;
};

type ProductPickerProps = {
  selectedItems: SelectedProductItem[];
  onChange: (items: SelectedProductItem[]) => void;
  priceOverrides?: Record<number, number>;
  licenseFeeMap?: Record<number, number>;
  licenseTypeMap?: Record<number, LicenseType>;
  licenseWeightGramsMap?: Record<number, number>;
  includeLicenseFee?: boolean;
  suggestedProducts?: ProductOption[];
  searchMode?: "all" | "suggestedOnly";
  highlightedProductId?: number | null;
  getProductElementId?: (productId: number) => string;
};

function priceText(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

export default function ProductPicker({
  selectedItems,
  onChange,
  priceOverrides = {},
  licenseFeeMap = {},
  licenseTypeMap = {},
  licenseWeightGramsMap = {},
  includeLicenseFee = false,
  suggestedProducts = [],
  searchMode = "all",
  highlightedProductId = null,
  getProductElementId
}: ProductPickerProps) {
  const t = useTranslations("productPicker");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [priceInputs, setPriceInputs] = useState<Record<number, string>>({});
  const [quantityInputs, setQuantityInputs] = useState<Record<number, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 180);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPriceInputs((prev) => {
      const next: Record<number, string> = {};
      for (const item of selectedItems) {
        next[item.productId] = prev[item.productId] ?? priceText(item.unitPriceCents);
      }
      return next;
    });
  }, [selectedItems]);

  useEffect(() => {
    setQuantityInputs((prev) => {
      const next: Record<number, string> = {};
      for (const item of selectedItems) {
        next[item.productId] = prev[item.productId] ?? formatQuantity(item.quantity);
      }
      return next;
    });
  }, [selectedItems]);

  useEffect(() => {
    const clean = debouncedQuery;
    if (!clean) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    if (searchMode === "suggestedOnly" && suggestedProducts.length > 0) {
      const localMatches = rankProductsBySearch(suggestedProducts, clean).slice(0, 30);
      if (localMatches.length > 0) {
        setSuggestions(localMatches);
        return;
      }
    }

    const controller = new AbortController();
    const run = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products?q=${encodeURIComponent(clean)}&includeInactive=1&limit=100`, {
          signal: controller.signal
        });
        const payload = (await response.json()) as { products?: ProductOption[] };
        if (response.ok) {
          setSuggestions(payload.products ?? []);
        }
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void run();
    return () => controller.abort();
  }, [debouncedQuery, searchMode, suggestedProducts]);

  const totalCents = useMemo(
    () =>
      selectedItems.reduce((sum, item) => {
        const { lineFeeCents } = getLineLicenseTotals(item.quantity, {
          licenseFeeCents: item.licenseFeeCents ?? licenseFeeMap[item.productId] ?? 0,
          licenseType: item.licenseType ?? licenseTypeMap[item.productId],
          licenseWeightGrams: item.licenseWeightGrams ?? licenseWeightGramsMap[item.productId]
        });
        return sum + multiplyCentsByQuantity(item.quantity, item.unitPriceCents) + (includeLicenseFee ? lineFeeCents : 0);
      }, 0),
    [includeLicenseFee, licenseFeeMap, licenseTypeMap, licenseWeightGramsMap, selectedItems]
  );

  function addProduct(product: ProductOption) {
    const existing = selectedItems.find((item) => item.productId === product.id);
    if (existing) {
      onChange(selectedItems);
    } else {
      const price = priceOverrides[product.id] ?? product.defaultPriceCents ?? 0;
      onChange([
        ...selectedItems,
        {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          quantity: 1,
          unitPriceCents: Math.max(0, price),
          licenseType: product.licenseType ?? licenseTypeMap[product.id],
          licenseWeightGrams: product.licenseWeightGrams ?? licenseWeightGramsMap[product.id],
          licenseFeeCents: product.licenseFeeCents ?? licenseFeeMap[product.id] ?? 0
        }
      ]);
    }
    setQuery("");
    setSuggestions([]);
  }

  function updateQuantity(productId: number, value: string) {
    if (!isQuantityInputAllowed(value)) return;
    setQuantityInputs((prev) => ({ ...prev, [productId]: value }));
    if (value.trim() === "") {
      return;
    }

    const normalized = value.trim().replace(/\s+/g, "").replace(",", ".");
    if (normalized.endsWith(".")) return;

    const parsed = parseQuantityInput(value);
    if (parsed === null) return;
    const quantity = Math.max(0, parsed);
    onChange(selectedItems.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
  }

  function normalizeQuantity(productId: number) {
    const raw = quantityInputs[productId] ?? "";
    const parsed = parseQuantityInput(raw);
    const current = selectedItems.find((item) => item.productId === productId);
    const fallbackQuantity = current ? roundQuantity(current.quantity) : 1;
    const quantity = parsed !== null && parsed > 0 ? parsed : fallbackQuantity;

    if (current && quantity !== current.quantity) {
      onChange(selectedItems.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
    }

    setQuantityInputs((prev) => ({ ...prev, [productId]: formatQuantity(quantity) }));
  }

  function updateUnitPrice(productId: number, cents: number) {
    onChange(
      selectedItems.map((item) => (item.productId === productId ? { ...item, unitPriceCents: Math.max(0, cents) } : item))
    );
  }

  function onPriceInputChange(productId: number, value: string) {
    setPriceInputs((prev) => ({ ...prev, [productId]: value }));
    if (value.trim() === "") return;
    updateUnitPrice(productId, parseEuroToCents(value));
  }

  function commitPrice(productId: number) {
    const raw = priceInputs[productId] ?? "";
    const cents = raw.trim() === "" ? 0 : parseEuroToCents(raw);
    updateUnitPrice(productId, cents);
    setPriceInputs((prev) => ({ ...prev, [productId]: priceText(cents) }));
  }

  function removeItem(productId: number) {
    onChange(selectedItems.filter((item) => item.productId !== productId));
  }

  return (
    <div className="space-y-3">
      <div className="card space-y-2">
        <label htmlFor="product-picker-search" className="text-sm font-semibold">
          {t("searchLabel")}
        </label>
        <div className="relative">
          <Search className="search-icon" size={16} />
          <input
            id="product-picker-search"
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
          />
        </div>

        {query.trim() ? (
          <div className="max-h-56 space-y-2 overflow-auto rounded-xl border border-[#E5E5E5] bg-white p-2">
            {loading ? <p className="px-2 py-1 text-xs text-[#4A4A4A]/60">{t("searching")}</p> : null}
            {!loading && suggestions.length === 0 ? (
              <p className="px-2 py-1 text-xs text-[#4A4A4A]/60">{t("noResults")}</p>
            ) : null}
            {suggestions.map((product) => (
              <button
                key={product.id}
                type="button"
                className="secondary-btn w-full !py-2 text-left"
                onClick={() => addProduct(product)}
              >
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-xs text-[#4A4A4A]/60">
                  {product.sku} {product.defaultPriceCents !== null ? `- ${formatCents(product.defaultPriceCents)}` : ""}
                </p>
              </button>
            ))}
          </div>
        ) : null}

        {!query.trim() && suggestedProducts.length > 0 ? (
          <div className="rounded-xl border border-[#E5E5E5] bg-white p-2">
            <p className="mb-1 text-xs text-[#4A4A4A]/60">{t("customerProducts")}</p>
            <div className="max-h-56 space-y-1 overflow-auto">
              {suggestedProducts.map((product) => (
                <button
                  key={`customer-suggestion-${product.id}`}
                  type="button"
                  className="secondary-btn w-full !py-2 text-left"
                  onClick={() => addProduct(product)}
                >
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-[#4A4A4A]/60">
                    {product.sku} {product.defaultPriceCents !== null ? `- ${formatCents(product.defaultPriceCents)}` : ""}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-2">
        {selectedItems.map((item) => {
          const { details, lineFeeCents } = getLineLicenseTotals(item.quantity, {
            licenseFeeCents: item.licenseFeeCents ?? licenseFeeMap[item.productId] ?? 0,
            licenseType: item.licenseType ?? licenseTypeMap[item.productId],
            licenseWeightGrams: item.licenseWeightGrams ?? licenseWeightGramsMap[item.productId]
          });
          const lineTotal = multiplyCentsByQuantity(item.quantity, item.unitPriceCents) + (includeLicenseFee ? lineFeeCents : 0);
          return (
            <div
              key={item.productId}
              id={getProductElementId?.(item.productId)}
              className={`card space-y-2 transition-all ${
                highlightedProductId === item.productId
                  ? "border-[#0A84FF] bg-[#DFF3FF] ring-2 ring-[#0A84FF]/18 shadow-[0_12px_28px_rgba(10,132,255,0.14)]"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-[#4A4A4A]/60">{item.sku}</p>
                </div>
                <button type="button" className="danger-btn !p-2" onClick={() => removeItem(item.productId)}>
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="grid grid-cols-[84px_1fr_auto] items-end gap-2">
                <div>
                  <label className="mb-1 block text-xs text-[#4A4A4A]/65">{t("quantity")}</label>
                  <input
                    className="input !px-3 !py-2"
                    type="text"
                    value={quantityInputs[item.productId] ?? formatQuantity(item.quantity)}
                    inputMode="decimal"
                    autoComplete="off"
                    onFocus={(event) => event.currentTarget.select()}
                    onChange={(event) => updateQuantity(item.productId, event.target.value)}
                    onBlur={() => normalizeQuantity(item.productId)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-[#4A4A4A]/65">{t("price")}</label>
                  <input
                    className="input !px-3 !py-2"
                    value={priceInputs[item.productId] ?? priceText(item.unitPriceCents)}
                    inputMode="decimal"
                    onFocus={(event) => event.currentTarget.select()}
                    onChange={(event) => onPriceInputChange(item.productId, event.target.value)}
                    onBlur={() => commitPrice(item.productId)}
                  />
                </div>
                <div className="pb-1 text-right">
                  <p className="text-xs text-[#4A4A4A]/65">{t("lineTotal")}</p>
                  <p className="text-sm font-semibold text-[#2F7EA1]">{formatCents(lineTotal)}</p>
                  {details.hasLicense && includeLicenseFee ? (
                    <div className="space-y-0.5 text-[11px] text-[#4A4A4A]/60">
                      <p>
                        {t("licenseIncluded", {
                          type: details.licenseType,
                          amount: formatCents(details.unitFeeCents)
                        })}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card flex items-center justify-between">
        <p className="text-sm text-[#4A4A4A]/70">{t("subtotal")}</p>
        <p className="text-lg font-semibold text-[#2F7EA1]">{formatCents(totalCents)}</p>
      </div>
    </div>
  );
}
