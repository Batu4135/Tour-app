"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Copy, Search, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { centsToEuro, euroToCents } from "@/lib/money";
import Toast from "@/components/Toast";
import { rankProductsBySearch } from "@/lib/productSearch";
import { saveCustomerPriceClipboard } from "@/lib/customerPriceClipboard";

type Product = {
  id: number;
  name: string;
  sku: string;
  popularityCount?: number;
};

type CustomerPrice = {
  id: number;
  productId: number;
  productName: string;
  priceCents: number;
};

type CustomerDetail = {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  routeDay: string | null;
  prices: CustomerPrice[];
  products: Product[];
};

export default function CustomerDetailPage() {
  const t = useTranslations("customerDetail");
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const customerId = Number.parseInt(params.id, 10);

  const [data, setData] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [productQuery, setProductQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductSearchFocused, setIsProductSearchFocused] = useState(false);
  const [priceInput, setPriceInput] = useState("");
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" | "info" } | null>(null);
  const productSearchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    void loadDetail();
  }, [customerId]);

  const availableProducts = useMemo(() => {
    if (!data) return [];
    const used = new Set(data.prices.map((price) => price.productId));
    return data.products.filter((product) => !used.has(product.id));
  }, [data]);

  const productSuggestions = useMemo(() => {
    if (availableProducts.length === 0) return [];
    if (!productQuery.trim()) return [];

    return rankProductsBySearch(availableProducts, productQuery).slice(0, 12);
  }, [availableProducts, productQuery]);

  const showSuggestions = isProductSearchFocused && productQuery.trim().length >= 1;

  useEffect(() => {
    if (searchParams.get("created") !== "1") return;
    setToast({ message: t("createdSuccess"), tone: "success" });
    router.replace(`/customers/${customerId}`);
  }, [customerId, router, searchParams, t]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!selectedProduct) return;
    const stillAvailable = availableProducts.some((product) => product.id === selectedProduct.id);
    if (!stillAvailable) {
      setSelectedProduct(null);
      setProductQuery("");
    }
  }, [availableProducts, selectedProduct]);

  async function loadDetail() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/customers/${customerId}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? t("loadError"));
      setData(payload.customer as CustomerDetail);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t("loadError"));
    } finally {
      setLoading(false);
    }
  }

  async function onSaveCustomer(event: FormEvent) {
    event.preventDefault();
    if (!data) return;
    if (!data.routeDay?.trim()) {
      setError(t("routeDayRequired"));
      return;
    }
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          address: data.address,
          phone: data.phone,
          routeDay: data.routeDay.trim()
        })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? t("saveError"));
      await loadDetail();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : t("saveError"));
    } finally {
      setSaving(false);
    }
  }

  async function onDeleteCustomer() {
    if (!confirm(t("confirmDelete"))) return;
    const response = await fetch(`/api/customers/${customerId}`, { method: "DELETE" });
    if (response.ok) {
      router.push("/customers");
      router.refresh();
    }
  }

  async function onAddPrice(event: FormEvent) {
    event.preventDefault();
    if (!selectedProduct || !priceInput) return;
    setError("");
    const cents = euroToCents(priceInput);
    const response = await fetch(`/api/customers/${customerId}/prices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: selectedProduct.id,
        priceCents: cents
      })
    });
    const payload = (await response.json()) as { ok?: boolean; error?: string };
    if (response.ok && payload.ok) {
      setSelectedProduct(null);
      setProductQuery("");
      setIsProductSearchFocused(false);
      setPriceInput("");
      setToast({ message: t("productAddedSuccess"), tone: "success" });
      await loadDetail();
      requestAnimationFrame(() => productSearchRef.current?.focus());
    } else {
      setToast({ message: payload.error ?? t("saveError"), tone: "error" });
    }
  }

  function onSelectProduct(product: Product) {
    setSelectedProduct(product);
    setProductQuery(product.name);
    setIsProductSearchFocused(false);
  }

  async function onUpdatePrice(priceId: number, newPriceCents: number) {
    await fetch(`/api/customers/${customerId}/prices`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: priceId, priceCents: newPriceCents })
    });
    await loadDetail();
  }

  async function onDeletePrice(priceId: number) {
    await fetch(`/api/customers/${customerId}/prices`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: priceId })
    });
    await loadDetail();
  }

  async function onCopyPrices() {
    if (!data || data.prices.length === 0) return;

    await saveCustomerPriceClipboard({
      type: "customer-price-clipboard",
      sourceCustomerId: data.id,
      sourceCustomerName: data.name,
      copiedAt: new Date().toISOString(),
      items: data.prices.map((price) => ({
        productId: price.productId,
        productName: price.productName,
        priceCents: price.priceCents
      }))
    });

    setToast({
      message: t("pricesCopied", { count: data.prices.length, customer: data.name }),
      tone: "success"
    });
  }

  if (loading) return <p className="text-sm text-[#4A4A4A]/70">{t("loading")}</p>;
  if (!data) return <p className="text-sm text-[#4A4A4A]/70">{error || t("empty")}</p>;

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{data.name}</h1>
        <p className="text-sm text-[#4A4A4A]/70">{t("subtitle")}</p>
      </header>

      <Toast visible={Boolean(toast)} message={toast?.message ?? ""} tone={toast?.tone ?? "info"} />

      <form className="card space-y-3" onSubmit={onSaveCustomer}>
        <input
          className="input"
          value={data.name}
          onChange={(event) => setData((prev) => (prev ? { ...prev, name: event.target.value } : prev))}
          placeholder={t("name")}
        />
        <input
          className="input"
          value={data.address ?? ""}
          onChange={(event) => setData((prev) => (prev ? { ...prev, address: event.target.value } : prev))}
          placeholder={t("address")}
        />
        <input
          className="input"
          value={data.phone ?? ""}
          onChange={(event) => setData((prev) => (prev ? { ...prev, phone: event.target.value } : prev))}
          placeholder={t("phone")}
        />
        <input
          className="input"
          value={data.routeDay ?? ""}
          onChange={(event) => setData((prev) => (prev ? { ...prev, routeDay: event.target.value } : prev))}
          placeholder={t("routeDay")}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <button className="primary-btn" type="submit" disabled={saving || !data.routeDay?.trim()}>
            {saving ? t("saving") : t("save")}
          </button>
          <button className="danger-btn flex items-center justify-center gap-2" type="button" onClick={onDeleteCustomer}>
            <Trash2 size={16} />
            {t("deleteCustomer")}
          </button>
        </div>
      </form>

      <div className="card space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">{t("pricesTitle")}</h2>
          <button
            type="button"
            className="secondary-btn !w-auto !px-3 !py-2 text-sm"
            onClick={onCopyPrices}
            disabled={data.prices.length === 0}
          >
            <span className="flex items-center gap-2">
              <Copy size={14} />
              {t("copyPrices")}
            </span>
          </button>
        </div>
        <form className="grid grid-cols-1 gap-2" onSubmit={onAddPrice}>
          <div className="relative">
            <Search className="search-icon" size={16} />
            <input
              id="customer-product-search"
              ref={productSearchRef}
              className="search-input"
              type="search"
              value={productQuery}
              onFocus={() => setIsProductSearchFocused(true)}
              onBlur={() => {
                setTimeout(() => setIsProductSearchFocused(false), 120);
              }}
              onChange={(event) => {
                setProductQuery(event.target.value);
                setSelectedProduct(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !selectedProduct && productSuggestions.length > 0) {
                  event.preventDefault();
                  onSelectProduct(productSuggestions[0]);
                }
              }}
              placeholder={t("productSearchPlaceholder")}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              inputMode="search"
              enterKeyHint="search"
            />
          </div>
          {showSuggestions ? (
            <div className="max-h-56 space-y-2 overflow-auto rounded-xl border border-[#E5E5E5] bg-white p-2">
              {productSuggestions.length === 0 ? (
                <p className="px-2 py-2 text-xs text-[#4A4A4A]/60">{t("productSearchNoResults")}</p>
              ) : (
                productSuggestions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    className="secondary-btn w-full !py-2 text-left"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => onSelectProduct(product)}
                  >
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-[#4A4A4A]/60">{product.sku}</p>
                  </button>
                ))
              )}
            </div>
          ) : null}
          {selectedProduct ? (
            <p className="text-xs text-[#4A4A4A]/65">
              {t("productSelected")}: {selectedProduct.name} ({selectedProduct.sku})
            </p>
          ) : (
            <p className="text-xs text-[#4A4A4A]/65">{t("productSelect")}</p>
          )}
          <input
            className="input"
            value={priceInput}
            onChange={(event) => setPriceInput(event.target.value)}
            placeholder={t("priceInput")}
          />
          <button className="primary-btn" type="submit">
            {t("addPrice")}
          </button>
        </form>

        <div className="space-y-2">
          {data.prices.map((price) => (
            <PriceRow
              key={price.id}
              price={price}
              onDelete={onDeletePrice}
              onSave={onUpdatePrice}
              saveLabel={t("save")}
            />
          ))}
          {data.prices.length === 0 ? <p className="text-sm text-[#4A4A4A]/65">{t("noPrices")}</p> : null}
        </div>
      </div>

      {error ? <p className="text-sm text-[#4A4A4A]">{error}</p> : null}
    </section>
  );
}

function PriceRow({
  price,
  onDelete,
  onSave,
  saveLabel
}: {
  price: CustomerPrice;
  onDelete: (id: number) => Promise<void>;
  onSave: (id: number, newPriceCents: number) => Promise<void>;
  saveLabel: string;
}) {
  const [value, setValue] = useState((price.priceCents / 100).toFixed(2).replace(".", ","));

  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-3">
      <p className="text-sm font-medium">{price.productName}</p>
      <p className="mt-1 text-xs text-[#4A4A4A]/60">{centsToEuro(price.priceCents)}</p>
      <div className="mt-2 grid grid-cols-[1fr_auto_auto] gap-2">
        <input className="input" value={value} onChange={(event) => setValue(event.target.value)} />
        <button type="button" className="secondary-btn px-3 py-2 text-sm" onClick={() => onSave(price.id, euroToCents(value))}>
          {saveLabel}
        </button>
        <button type="button" className="danger-btn px-3 py-2" onClick={() => onDelete(price.id)}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
