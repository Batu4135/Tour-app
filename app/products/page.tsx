"use client";

import { FormEvent, InputHTMLAttributes, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Check, CheckCircle2, ChevronDown, Plus, Search, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatCents, parseEuroToCents } from "@/lib/formatCents";
import { LICENSE_TYPES, LicenseType } from "@/lib/license";

type Product = {
  id: number;
  sku: string;
  name: string;
  defaultPriceCents: number | null;
  licenseType: LicenseType;
  licenseWeightGrams: number;
  licenseFeeCents: number;
  isActive: boolean;
};

type EditableLicenseType = "" | Exclude<LicenseType, "NONE">;

type EditFields = {
  name: string;
  sku: string;
  defaultPrice: string;
  licenseType: EditableLicenseType;
  licenseWeightKg: string;
  isActive: boolean;
};

type FlashMessage = {
  type: "success" | "error";
  text: string;
};

function toPriceInput(value: number | null): string {
  if (value === null || !Number.isFinite(value) || value <= 0) return "";
  return (value / 100).toFixed(2).replace(".", ",");
}

function toWeightInput(grams: number): string {
  if (!Number.isFinite(grams) || grams <= 0) return "";
  const kg = grams / 1000;
  return kg.toFixed(3).replace(".", ",").replace(/0+$/, "").replace(/,$/, "");
}

function parseWeightInputToGrams(raw: string): number {
  const trimmed = raw.trim();
  if (!trimmed) return 0;
  const normalized = trimmed.replace(",", ".");
  const value = Number.parseFloat(normalized);
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.round(value * 1000);
}

function getLicenseRateCentsPerKg(type: EditableLicenseType): number {
  if (type === "LP") return 25;
  if (type === "LK" || type === "LA" || type === "LV") return 99;
  return 0;
}

function calculateLicenseFeeCents(type: EditableLicenseType, weightGrams: number): number {
  const rate = getLicenseRateCentsPerKg(type);
  if (rate <= 0 || weightGrams <= 0) return 0;
  return Math.round((weightGrams * rate) / 1000);
}

function toEditableLicenseType(type: LicenseType): EditableLicenseType {
  return type === "NONE" ? "" : type;
}

function toPersistedLicenseType(type: EditableLicenseType): LicenseType | undefined {
  return type || undefined;
}

function toEditFields(product: Product): EditFields {
  return {
    name: product.name,
    sku: product.sku,
    defaultPrice: toPriceInput(product.defaultPriceCents),
    licenseType: toEditableLicenseType(product.licenseType),
    licenseWeightKg: toWeightInput(product.licenseWeightGrams),
    isActive: product.isActive
  };
}

function getPersistedPriceCents(value: string): number | null {
  return value.trim().length > 0 ? parseEuroToCents(value) : null;
}

function CompactPrefixField({
  prefix,
  value,
  onChange,
  inputMode,
  className = ""
}: {
  prefix: string;
  value: string;
  onChange: (value: string) => void;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  className?: string;
}) {
  return (
    <div className={`flex min-h-[52px] items-center gap-3 rounded-xl border border-[#E5E5E5] bg-white px-3 ${className}`}>
      <span className="shrink-0 text-xs font-semibold text-[#4A4A4A]/60">{prefix}</span>
      <input
        className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[#4A4A4A] outline-none placeholder:text-[#4A4A4A]/50"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder=""
        inputMode={inputMode}
      />
    </div>
  );
}

function CompactSuffixField({
  suffix,
  value,
  onChange,
  inputMode,
  readOnly = false,
  disabled = false,
  className = "",
  suffixClassName = ""
}: {
  suffix: string;
  value: string;
  onChange?: (value: string) => void;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  suffixClassName?: string;
}) {
  return (
    <div
      className={`flex min-h-[52px] items-center gap-3 rounded-xl border border-[#E5E5E5] bg-white px-3 ${
        disabled ? "opacity-60" : ""
      } ${className}`}
    >
      <input
        className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[#4A4A4A] outline-none placeholder:text-[#4A4A4A]/50"
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        placeholder=""
        inputMode={inputMode}
        readOnly={readOnly}
        disabled={disabled}
      />
      <span className={`shrink-0 text-xs font-semibold text-[#4A4A4A]/60 ${suffixClassName}`}>{suffix}</span>
    </div>
  );
}

function hasProductChanges(product: Product, edit: EditFields): boolean {
  return (
    product.name !== edit.name.trim() ||
    product.sku !== edit.sku.trim() ||
    (product.defaultPriceCents ?? null) !== getPersistedPriceCents(edit.defaultPrice) ||
    product.licenseType !== (toPersistedLicenseType(edit.licenseType) ?? "NONE") ||
    product.licenseWeightGrams !== parseWeightInputToGrams(edit.licenseWeightKg) ||
    product.isActive !== edit.isActive
  );
}

export default function ProductsPage() {
  const t = useTranslations("productsPage");
  const productCardRefs = useRef<Record<number, HTMLElement | null>>({});
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
  const [savedProductId, setSavedProductId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [openProductId, setOpenProductId] = useState<number | null>(null);
  const [createForm, setCreateForm] = useState({
    name: "",
    sku: "",
    defaultPrice: "",
    licenseType: "" as EditableLicenseType,
    licenseWeightKg: ""
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

    setOpenProductId((prev) => (prev !== null && products.some((product) => product.id === prev) ? prev : null));
  }, [products]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (openProductId === null || savingId === openProductId || deletingId === openProductId) {
        return;
      }

      const openProduct = products.find((product) => product.id === openProductId);
      if (!openProduct) return;

      const card = productCardRefs.current[openProductId];
      const target = event.target as Node | null;
      if (card && target && card.contains(target)) {
        return;
      }

      resetProductEdit(openProduct);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [deletingId, openProductId, products, savingId]);

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

  function resetProductEdit(product: Product) {
    setSavedProductId((prev) => (prev === product.id ? null : prev));
    setEdits((prev) => {
      const current = prev[product.id] ?? toEditFields(product);
      if (!hasProductChanges(product, current)) {
        return prev;
      }

      return {
        ...prev,
        [product.id]: toEditFields(product)
      };
    });
  }

  function toggleProduct(product: Product) {
    setOpenProductId((prev) => {
      if (prev === product.id) {
        resetProductEdit(product);
        return null;
      }

      if (prev !== null) {
        const previousProduct = products.find((entry) => entry.id === prev);
        if (previousProduct) {
          resetProductEdit(previousProduct);
        }
      }

      return product.id;
    });
  }

  function setEditField(productId: number, field: keyof EditFields, value: string | boolean) {
    setSavedProductId((prev) => (prev === productId ? null : prev));
    setEdits((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value
      }
    }));
  }

  function setProductLicenseType(product: Product, nextType: EditableLicenseType) {
    setSavedProductId((prev) => (prev === product.id ? null : prev));
    setEdits((prev) => ({
      ...prev,
      [product.id]: {
        ...(prev[product.id] ?? toEditFields(product)),
        licenseType: nextType,
        licenseWeightKg: nextType ? (prev[product.id]?.licenseWeightKg ?? toEditFields(product).licenseWeightKg) : ""
      }
    }));
  }

  function blurActiveField() {
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
  }

  function scrollProductIntoView(productId: number) {
    window.setTimeout(() => {
      productCardRefs.current[productId]?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 180);
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
          licenseType: toPersistedLicenseType(createForm.licenseType),
          licenseWeightGrams: parseWeightInputToGrams(createForm.licenseWeightKg),
          isActive: true
        })
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? t("saveError"));

      setCreateForm({ name: "", sku: "", defaultPrice: "", licenseType: "", licenseWeightKg: "" });
      setCreateOpen(false);
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

    blurActiveField();
    setSavingId(productId);
    setSavedProductId(null);
    setError("");
    setFlash(null);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: edit.name.trim(),
          sku: edit.sku.trim(),
          defaultPriceCents: getPersistedPriceCents(edit.defaultPrice),
          licenseType: toPersistedLicenseType(edit.licenseType),
          licenseWeightGrams: parseWeightInputToGrams(edit.licenseWeightKg),
          isActive: edit.isActive
        })
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? t("saveError"));

      setSavedProductId(productId);
      setFlash({ type: "success", text: t("updateSuccess") });
      await loadProducts();
      scrollProductIntoView(productId);
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

  const createWeightGrams = parseWeightInputToGrams(createForm.licenseWeightKg);
  const createCalculatedFeeCents = calculateLicenseFeeCents(createForm.licenseType, createWeightGrams);
  const createHasLicense = Boolean(createForm.licenseType);

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-sm text-[#4A4A4A]/70">{t("subtitle")}</p>
      </header>

      <div className="card space-y-3">
        <button
          type="button"
          className="flex w-full items-center justify-between text-left"
          onClick={() => setCreateOpen((prev) => !prev)}
        >
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Plus size={16} />
            {t("createTitle")}
          </p>
          <ChevronDown size={18} className={`transition-transform ${createOpen ? "rotate-180" : ""}`} />
        </button>
        {createOpen ? (
          <form className="space-y-2" onSubmit={onCreate}>
            <input
              className="input"
              placeholder={t("createName")}
              value={createForm.name}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
            />

            <div className="grid grid-cols-2 gap-1">
              <CompactPrefixField
                prefix={t("fieldSkuShort")}
                value={createForm.sku}
                onChange={(value) => setCreateForm((prev) => ({ ...prev, sku: value }))}
              />
              <CompactSuffixField
                suffix={t("fieldPriceShort")}
                value={createForm.defaultPrice}
                onChange={(value) => setCreateForm((prev) => ({ ...prev, defaultPrice: value }))}
                inputMode="decimal"
              />
            </div>

            <p className="px-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#8A6A1E]">
              {t("licenseSectionTitle")}
            </p>
            <div className="rounded-2xl border border-[#E7D2A2] bg-[#FFF7E8] p-2">
              <div className="grid grid-cols-3 gap-1">
                <select
                  className="input !border-[#E1C989] !bg-[#FFFDF7] !px-3"
                  value={createForm.licenseType}
                  onChange={(event) =>
                    setCreateForm((prev) => {
                      const nextType = event.target.value as EditableLicenseType;
                      return {
                        ...prev,
                        licenseType: nextType,
                        licenseWeightKg: nextType ? prev.licenseWeightKg : ""
                      };
                    })
                  }
                >
                  <option value="">-</option>
                  {LICENSE_TYPES.filter((licenseType) => licenseType !== "NONE").map((licenseType) => (
                    <option key={licenseType} value={licenseType}>
                      {licenseType}
                    </option>
                  ))}
                </select>
                <CompactSuffixField
                  suffix={t("fieldWeightShort")}
                  value={createHasLicense ? createForm.licenseWeightKg : ""}
                  onChange={(value) => setCreateForm((prev) => ({ ...prev, licenseWeightKg: value }))}
                  inputMode="decimal"
                  disabled={!createHasLicense}
                  className="!border-[#E1C989] !bg-[#FFFDF7]"
                  suffixClassName="text-[#8A6A1E]"
                />
                <CompactSuffixField
                  suffix={t("fieldPriceShort")}
                  value={createHasLicense ? toPriceInput(createCalculatedFeeCents) : ""}
                  readOnly
                  disabled={!createHasLicense}
                  className="!border-[#E1C989] !bg-[#FFFDF7]"
                  suffixClassName="text-[#8A6A1E]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="primary-btn w-full"
              disabled={creating || !createForm.name.trim() || !createForm.sku.trim()}
            >
              {creating ? t("creating") : t("createAction")}
            </button>
          </form>
        ) : (
          <p className="text-xs text-[#4A4A4A]/65">{t("createHint")}</p>
        )}
      </div>

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
                    {product.sku} {product.defaultPriceCents !== null ? `- ${formatCents(product.defaultPriceCents)}` : "-"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {flash ? (
        <div
          className={`flex items-center gap-2 rounded-2xl border px-3 py-3 text-sm font-semibold ${
            flash.type === "success"
              ? "border-[#B7E4C0] bg-[#F1FBF3] text-[#246B35]"
              : "border-[#F1B7B7] bg-[#FFF4F4] text-[#A33A3A]"
          }`}
        >
          {flash.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{flash.text}</span>
        </div>
      ) : null}
      {loading ? <p className="text-sm text-[#4A4A4A]/65">{t("loading")}</p> : null}
      {error ? <p className="text-sm text-[#4A4A4A]">{error}</p> : null}

      <div className="space-y-2">
        {products.map((product) => {
          const edit = edits[product.id] ?? toEditFields(product);
          const isOpen = openProductId === product.id;
          const isSaving = savingId === product.id;
          const isDeleting = deletingId === product.id;
          const isDirty = hasProductChanges(product, edit);
          const showSavedHint = savedProductId === product.id && !isDirty && !isSaving;
          const hasLicenseType = Boolean(edit.licenseType);
          const editWeightGrams = parseWeightInputToGrams(edit.licenseWeightKg);
          const editCalculatedFeeCents = calculateLicenseFeeCents(edit.licenseType, editWeightGrams);

          return (
            <article
              key={product.id}
              className="card space-y-2 py-3"
              ref={(node) => {
                productCardRefs.current[product.id] = node;
              }}
            >
              <button
                type="button"
                className="flex w-full items-start justify-between gap-3 text-left"
                onClick={() => toggleProduct(product)}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{edit.name || product.name}</p>
                  <p className="truncate text-xs text-[#4A4A4A]/60">{edit.sku || product.sku}</p>
                </div>
                <div className="flex items-center gap-2">
                  {showSavedHint ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E9F8EC] px-2.5 py-1 text-xs font-semibold text-[#246B35]">
                      <CheckCircle2 size={14} />
                      {t("savedHint")}
                    </span>
                  ) : null}
                  <ChevronDown size={18} className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>
              </button>

              {isOpen ? (
                <div className="space-y-2">
                  <input
                    className="input"
                    value={edit.name}
                    onChange={(event) => setEditField(product.id, "name", event.target.value)}
                    placeholder={t("createName")}
                  />

                  <div className="grid grid-cols-2 gap-1">
                    <CompactPrefixField
                      prefix={t("fieldSkuShort")}
                      value={edit.sku}
                      onChange={(value) => setEditField(product.id, "sku", value)}
                    />

                    <CompactSuffixField
                      suffix={t("fieldPriceShort")}
                      value={edit.defaultPrice}
                      onChange={(value) => setEditField(product.id, "defaultPrice", value)}
                      inputMode="decimal"
                    />
                  </div>

                  <p className="px-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#8A6A1E]">
                    {t("licenseSectionTitle")}
                  </p>
                  <div className="rounded-2xl border border-[#E7D2A2] bg-[#FFF7E8] p-2">
                    <div className="grid grid-cols-3 gap-1">
                      <select
                        className="input !border-[#E1C989] !bg-[#FFFDF7] !px-3"
                        value={edit.licenseType}
                        onChange={(event) => setProductLicenseType(product, event.target.value as EditableLicenseType)}
                      >
                        <option value="">-</option>
                        {LICENSE_TYPES.filter((licenseType) => licenseType !== "NONE").map((licenseType) => (
                          <option key={licenseType} value={licenseType}>
                            {licenseType}
                          </option>
                        ))}
                      </select>
                      <CompactSuffixField
                        suffix={t("fieldWeightShort")}
                        value={hasLicenseType ? edit.licenseWeightKg : ""}
                        onChange={(value) => setEditField(product.id, "licenseWeightKg", value)}
                        inputMode="decimal"
                        disabled={!hasLicenseType}
                        className="!border-[#E1C989] !bg-[#FFFDF7]"
                        suffixClassName="text-[#8A6A1E]"
                      />

                      <CompactSuffixField
                        suffix={t("fieldPriceShort")}
                        value={hasLicenseType ? toPriceInput(editCalculatedFeeCents) : ""}
                        readOnly
                        disabled={!hasLicenseType}
                        className="!border-[#E1C989] !bg-[#FFFDF7]"
                        suffixClassName="text-[#8A6A1E]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <label className="inline-flex items-center gap-2 text-sm text-[#4A4A4A]/80">
                      <input
                        type="checkbox"
                        checked={edit.isActive}
                        onChange={(event) => setEditField(product.id, "isActive", event.target.checked)}
                      />
                      {t("active")}
                    </label>

                    <div className="flex items-center gap-2">
                      {isDirty || isSaving ? (
                        <button
                          type="button"
                          className="primary-btn !w-auto !px-3 !py-2"
                          onClick={() => void onSave(product.id)}
                          disabled={isSaving || isDeleting}
                        >
                          <span className="flex items-center gap-1">
                            <Check size={14} />
                            {isSaving ? t("saving") : t("saveAction")}
                          </span>
                        </button>
                      ) : null}

                      <button
                        type="button"
                        className="danger-btn !w-auto !px-3 !py-2 disabled:opacity-50"
                        onClick={() => void onDelete(product.id)}
                        disabled={isSaving || isDeleting}
                        aria-label={isDeleting ? t("deleting") : t("deleteAction")}
                      >
                        <span className="flex items-center gap-1">
                          <Trash2 size={14} />
                          {isDeleting ? t("deleting") : t("deleteAction")}
                        </span>
                      </button>
                    </div>
                  </div>
                  {showSavedHint ? (
                    <div className="rounded-2xl border border-[#B7E4C0] bg-[#F1FBF3] px-3 py-3 text-sm font-semibold text-[#246B35]">
                      <span className="inline-flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        {t("updateSuccess")}
                      </span>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
        {!loading && products.length === 0 ? <p className="text-sm text-[#4A4A4A]/65">{t("empty")}</p> : null}
      </div>
    </section>
  );
}
