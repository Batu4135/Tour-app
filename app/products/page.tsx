"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Check, Plus, Search, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatCents, parseEuroToCents } from "@/lib/formatCents";

type Product = {
  id: number;
  sku: string;
  name: string;
  defaultPriceCents: number | null;
  isActive: boolean;
};

type EditFields = {
  name: string;
  sku: string;
  defaultPrice: string;
  isActive: boolean;
};

type FlashMessage = {
  type: "success" | "error";
  text: string;
};

function toPriceInput(value: number | null): string {
  if (value === null) return "";
  return (value / 100).toFixed(2).replace(".", ",");
}

function toEditFields(product: Product): EditFields {
  return {
    name: product.name,
    sku: product.sku,
    defaultPrice: toPriceInput(product.defaultPriceCents),
    isActive: product.isActive
  };
}

export default function ProductsPage() {
  const t = useTranslations("productsPage");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [edits, setEdits] = useState<Record<number, EditFields>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState<FlashMessage | null>(null);
  const [creating, setCreating] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [createForm, setCreateForm] = useState({
    name: "",
    sku: "",
    defaultPrice: ""
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 180);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    void loadProducts();
  }, [debounced]);

  useEffect(() => {
    setEdits((prev) => {
      const next: Record<number, EditFields> = {};
      const validIds = new Set(products.map((product) => product.id));
      for (const product of products) {
        next[product.id] = prev[product.id] ?? toEditFields(product);
      }
      for (const [idText, edit] of Object.entries(prev)) {
        const id = Number.parseInt(idText, 10);
        if (validIds.has(id)) {
          next[id] = next[id] ?? edit;
        }
      }
      return next;
    });
  }, [products]);

  const suggestions = useMemo(() => products.slice(0, 8), [products]);

  async function loadProducts() {
    setLoading(true);
    setError("");
    try {
      const params = debounced ? `q=${encodeURIComponent(debounced)}&includeInactive=1` : "limit=300&includeInactive=1";
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

  function setEditField(productId: number, field: keyof EditFields, value: string | boolean) {
    setEdits((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }));
  }

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    if (!createForm.name.trim() || !createForm.sku.trim()) return;
    setCreating(true);
    setError("");
    setFlash(null);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createForm.name.trim(),
          sku: createForm.sku.trim(),
          defaultPriceCents:
            createForm.defaultPrice.trim().length > 0 ? parseEuroToCents(createForm.defaultPrice) : undefined,
          isActive: true
        })
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? t("saveError"));

      setCreateForm({ name: "", sku: "", defaultPrice: "" });
      setFlash({ type: "success", text: t("createSuccess") });
      await loadProducts();
    } catch (createError) {
      const message = createError instanceof Error ? createError.message : t("saveError");
      setError(message);
      setFlash({ type: "error", text: message });
    } finally {
      setCreating(false);
    }
  }

  async function onSave(productId: number) {
    const edit = edits[productId];
    if (!edit) return;
    if (!edit.name.trim() || !edit.sku.trim()) {
      setFlash({ type: "error", text: t("requiredFields") });
      return;
    }

    setSavingId(productId);
    setError("");
    setFlash(null);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: edit.name.trim(),
          sku: edit.sku.trim(),
          defaultPriceCents: edit.defaultPrice.trim().length > 0 ? parseEuroToCents(edit.defaultPrice) : null,
          isActive: edit.isActive
        })
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? t("saveError"));

      setFlash({ type: "success", text: t("updateSuccess") });
      await loadProducts();
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : t("saveError");
      setError(message);
      setFlash({ type: "error", text: message });
    } finally {
      setSavingId(null);
    }
  }

  async function onDelete(productId: number) {
    if (!window.confirm(t("confirmDelete"))) return;
    setDeletingId(productId);
    setError("");
    setFlash(null);
    try {
      const response = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? t("saveError"));

      setFlash({ type: "success", text: t("deleteSuccess") });
      await loadProducts();
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : t("saveError");
      setError(message);
      setFlash({ type: "error", text: message });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-sm text-[#4A4A4A]/70">{t("subtitle")}</p>
      </header>

      <form className="card space-y-3" onSubmit={onCreate}>
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Plus size={16} />
          {t("createTitle")}
        </p>
        <input
          className="input"
          placeholder={t("createName")}
          value={createForm.name}
          onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
        />
        <input
          className="input"
          placeholder={t("createSku")}
          value={createForm.sku}
          onChange={(event) => setCreateForm((prev) => ({ ...prev, sku: event.target.value }))}
        />
        <input
          className="input"
          placeholder={t("createPrice")}
          value={createForm.defaultPrice}
          onChange={(event) => setCreateForm((prev) => ({ ...prev, defaultPrice: event.target.value }))}
          inputMode="decimal"
        />
        <button
          type="submit"
          className="primary-btn w-full"
          disabled={creating || !createForm.name.trim() || !createForm.sku.trim()}
        >
          {creating ? t("creating") : t("createAction")}
        </button>
      </form>

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
                  type="button"
                  className="secondary-btn w-full !py-2 text-left"
                  onClick={() => setQuery(product.sku)}
                >
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-[#4A4A4A]/60">
                    {product.sku}{" "}
                    {product.defaultPriceCents !== null ? `- ${formatCents(product.defaultPriceCents)}` : "-"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {flash ? (
        <p className={`text-sm ${flash.type === "success" ? "text-[#2B8A3E]" : "text-[#A33A3A]"}`}>{flash.text}</p>
      ) : null}
      {loading ? <p className="text-sm text-[#4A4A4A]/65">{t("loading")}</p> : null}
      {error ? <p className="text-sm text-[#4A4A4A]">{error}</p> : null}

      <div className="space-y-2">
        {products.map((product) => {
          const edit = edits[product.id] ?? toEditFields(product);
          const isSaving = savingId === product.id;
          const isDeleting = deletingId === product.id;
          return (
            <article key={product.id} className="card space-y-2 py-3">
              <div className="grid grid-cols-1 gap-2">
                <input
                  className="input !py-2"
                  value={edit.name}
                  onChange={(event) => setEditField(product.id, "name", event.target.value)}
                  placeholder={t("createName")}
                />
                <input
                  className="input !py-2"
                  value={edit.sku}
                  onChange={(event) => setEditField(product.id, "sku", event.target.value)}
                  placeholder={t("createSku")}
                />
                <input
                  className="input !py-2"
                  value={edit.defaultPrice}
                  onChange={(event) => setEditField(product.id, "defaultPrice", event.target.value)}
                  placeholder={t("createPrice")}
                  inputMode="decimal"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-[#4A4A4A]/80">
                <input
                  type="checkbox"
                  checked={edit.isActive}
                  onChange={(event) => setEditField(product.id, "isActive", event.target.checked)}
                />
                {t("active")}
              </label>

              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-[#4A4A4A]/65">
                  {edit.defaultPrice.trim() ? formatCents(parseEuroToCents(edit.defaultPrice)) : "-"}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="secondary-btn !px-3 !py-2"
                    onClick={() => void onSave(product.id)}
                    disabled={isSaving || isDeleting}
                  >
                    <span className="flex items-center gap-1">
                      <Check size={14} />
                      {isSaving ? t("saving") : t("saveAction")}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="secondary-btn !px-3 !py-2"
                    onClick={() => void onDelete(product.id)}
                    disabled={isSaving || isDeleting}
                  >
                    <span className="flex items-center gap-1">
                      <Trash2 size={14} />
                      {isDeleting ? t("deleting") : t("deleteAction")}
                    </span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
        {!loading && products.length === 0 ? <p className="text-sm text-[#4A4A4A]/65">{t("empty")}</p> : null}
      </div>
    </section>
  );
}
