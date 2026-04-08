"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Banknote, CheckCircle2, ChevronDown, CreditCard, Landmark, Loader2, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import ProductPicker, { ProductOption, SelectedProductItem } from "@/components/ProductPicker";
import { formatCents } from "@/lib/formatCents";
import { LicenseType } from "@/lib/license";
import { calculateDraftTotals } from "@/lib/draftTotals";
import {
  DraftWritePayload,
  enqueueLatestPendingWrite,
  getPendingWriteCount,
  getPendingWrites,
  removePendingWrite,
  updatePendingWriteError
} from "@/lib/offlineQueue";

type DraftLine = {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  unitPriceCents: number;
  licenseType?: LicenseType;
  licenseWeightGrams?: number;
  licenseFeeCents?: number;
};

type DraftData = {
  id: number;
  customerId: number;
  customerName: string;
  date: string;
  note: string | null;
  includeLicenseFee?: boolean;
  discountCents?: number;
  subtractVat?: boolean;
  paymentMethod?: "CASH" | "BANK" | "DIRECT_DEBIT";
  tourClosedAt?: string | null;
  updatedAt?: string;
  lines: DraftLine[];
};

type InitResponse = {
  draft?: DraftData;
  customerPriceMap?: Record<number, number>;
  productLicenseFeeMap?: Record<number, number>;
  productLicenseTypeMap?: Record<number, LicenseType>;
  productLicenseWeightGramsMap?: Record<number, number>;
  customerSuggestedProducts?: ProductOption[];
  error?: string;
};

type DraftEditorProps = {
  draftId: number;
};

type PersistOptions = {
  force?: boolean;
  backgroundOnly?: boolean;
};

function isOnline(): boolean {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeDraftData(value: DraftData): DraftData {
  return {
    ...value,
    includeLicenseFee: Boolean(value.includeLicenseFee),
    discountCents: 0,
    subtractVat: Boolean(value.subtractVat),
    paymentMethod: value.paymentMethod ?? "CASH"
  };
}

export default function DraftEditor({ draftId }: DraftEditorProps) {
  const t = useTranslations("draftEditor");
  const router = useRouter();
  const [draft, setDraft] = useState<DraftData | null>(null);
  const [customerPriceMap, setCustomerPriceMap] = useState<Record<number, number>>({});
  const [productLicenseFeeMap, setProductLicenseFeeMap] = useState<Record<number, number>>({});
  const [productLicenseTypeMap, setProductLicenseTypeMap] = useState<Record<number, LicenseType>>({});
  const [productLicenseWeightGramsMap, setProductLicenseWeightGramsMap] = useState<Record<number, number>>({});
  const [customerSuggestedProducts, setCustomerSuggestedProducts] = useState<ProductOption[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [syncState, setSyncState] = useState<"ok" | "pending" | "error">("ok");
  const [isPrinting, setIsPrinting] = useState(false);
  const [error, setError] = useState("");
  const [isOffline, setIsOffline] = useState(false);
  const [dirty, setDirty] = useState(false);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const saveSeqRef = useRef(0);
  const localVersionRef = useRef(0);
  const snapshotKey = `nord-pack:draft:${draftId}`;
  const paymentSectionRef = useRef<HTMLDivElement | null>(null);
  const licenseSectionRef = useRef<HTMLDivElement | null>(null);
  const [activeWalkthroughTarget, setActiveWalkthroughTarget] = useState<string | null>(null);

  const totals = useMemo(() => {
    if (!draft) {
      return calculateDraftTotals({ lines: [] });
    }

    return calculateDraftTotals({
      lines: draft.lines.map((line) => ({
        quantity: line.quantity,
        unitPriceCents: line.unitPriceCents,
        product: {
          licenseFeeCents: line.licenseFeeCents ?? productLicenseFeeMap[line.productId] ?? 0,
          licenseType: line.licenseType ?? productLicenseTypeMap[line.productId],
          licenseWeightGrams: line.licenseWeightGrams ?? productLicenseWeightGramsMap[line.productId]
        }
      })),
      includeLicenseFee: draft.includeLicenseFee,
      subtractVat: draft.subtractVat
    });
  }, [draft, productLicenseFeeMap, productLicenseTypeMap, productLicenseWeightGramsMap]);
  const selectedItems: SelectedProductItem[] = useMemo(
    () =>
      draft?.lines.map((line) => ({
        productId: line.productId,
        sku: line.productSku ?? "",
        name: line.productName,
        quantity: line.quantity,
        unitPriceCents: line.unitPriceCents,
        licenseType: line.licenseType ?? productLicenseTypeMap[line.productId],
        licenseWeightGrams: line.licenseWeightGrams ?? productLicenseWeightGramsMap[line.productId] ?? 0,
        licenseFeeCents: line.licenseFeeCents ?? productLicenseFeeMap[line.productId] ?? 0
      })) ?? [],
    [draft, productLicenseFeeMap, productLicenseTypeMap, productLicenseWeightGramsMap]
  );
  const navigationTargets = useMemo(
    () => [...selectedItems.map((item) => `product:${item.productId}`), "payment", "license"],
    [selectedItems]
  );
  const highlightedProductId =
    activeWalkthroughTarget?.startsWith("product:") === true
      ? Number.parseInt(activeWalkthroughTarget.split(":")[1] ?? "", 10)
      : null;

  const writeSnapshot = useCallback(
    (value: DraftData | null) => {
      if (typeof window === "undefined") return;
      if (!value) {
        window.localStorage.removeItem(snapshotKey);
        return;
      }
      window.localStorage.setItem(
        snapshotKey,
        JSON.stringify({
          draft: value,
          savedAt: Date.now()
        })
      );
    },
    [snapshotKey]
  );

  const loadSnapshot = useCallback((): DraftData | null => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(snapshotKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { draft?: DraftData };
      if (!parsed.draft) return null;
      return normalizeDraftData(parsed.draft);
    } catch {
      return null;
    }
  }, [snapshotKey]);

  const sendDraftPatch = useCallback(
    async (targetDraftId: number, writePayload: DraftWritePayload, signal?: AbortSignal): Promise<DraftData> => {
      const response = await fetch(`/api/drafts/${targetDraftId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(writePayload),
        signal
      });
      const responsePayload = (await response.json()) as InitResponse;
      if (!response.ok || !responsePayload.draft) throw new Error(responsePayload.error ?? t("saveError"));
      return responsePayload.draft;
    },
    [t]
  );

  const refreshPendingState = useCallback(async () => {
    const count = await getPendingWriteCount().catch(() => 0);
    if (count === 0) {
      setSyncState("ok");
    } else if (syncState !== "error") {
      setSyncState("pending");
    }
  }, [syncState]);

  const hydrateDraft = useCallback(async () => {
    setError("");
    const snapshot = loadSnapshot();
    const pendingWrites = await getPendingWrites().catch(() => []);
    const hasPendingForDraft = pendingWrites.some((entry) => entry.draftId === draftId);
    const usedSnapshot = Boolean(snapshot && hasPendingForDraft);

    if (usedSnapshot && snapshot) {
      setDraft(snapshot);
      setStatus("saved");
      setSyncState("pending");
    }

    try {
      const response = await fetch(`/api/drafts/${draftId}`);
      const payload = (await response.json()) as InitResponse;
      if (!response.ok || !payload.draft) throw new Error(payload.error ?? t("initError"));

      setCustomerPriceMap(payload.customerPriceMap ?? {});
      setProductLicenseFeeMap(payload.productLicenseFeeMap ?? {});
      setProductLicenseTypeMap(payload.productLicenseTypeMap ?? {});
      setProductLicenseWeightGramsMap(payload.productLicenseWeightGramsMap ?? {});
      setCustomerSuggestedProducts(payload.customerSuggestedProducts ?? []);

      if (!snapshot || !hasPendingForDraft) {
        const normalizedDraft = normalizeDraftData(payload.draft);
        setDraft(normalizedDraft);
        writeSnapshot(normalizedDraft);
        setStatus("saved");
      }
    } catch (loadError) {
      if (!snapshot) {
        setError(loadError instanceof Error ? loadError.message : t("initError"));
      } else if (!usedSnapshot) {
        setDraft(snapshot);
        setStatus("saved");
        writeSnapshot(snapshot);
        setSyncState("pending");
      } else {
        setSyncState("pending");
      }
    }
  }, [draftId, loadSnapshot, t, writeSnapshot]);

  const flushOfflineQueue = useCallback(
    async (options?: { onlyDraftId?: number; retries?: number }): Promise<boolean> => {
      const retries = options?.retries ?? 2;
      const onlyDraftId = options?.onlyDraftId;

      for (let attempt = 0; attempt <= retries; attempt += 1) {
        const entries = await getPendingWrites().catch(() => []);
        const targets =
          typeof onlyDraftId === "number" ? entries.filter((entry) => entry.draftId === onlyDraftId) : entries;

        if (targets.length === 0) {
          await refreshPendingState();
          return true;
        }

        let failed = false;
        for (const entry of targets) {
          try {
            const updated = await sendDraftPatch(entry.draftId, entry.payload);
            if (entry.draftId === draftId) {
              const normalizedDraft = normalizeDraftData(updated);
              setDraft(normalizedDraft);
              writeSnapshot(normalizedDraft);
            }
            await removePendingWrite(entry.id);
          } catch (syncError) {
            failed = true;
            await updatePendingWriteError(
              entry.id,
              syncError instanceof Error ? syncError.message : "Sync fehlgeschlagen"
            ).catch(() => undefined);
            break;
          }
        }

        await refreshPendingState();
        if (!failed) {
          continue;
        }

        if (attempt < retries) {
          await wait(300 * (attempt + 1));
        }
      }

      setSyncState("error");
      return false;
    },
    [draftId, refreshPendingState, sendDraftPatch, writeSnapshot]
  );

  const syncNow = useCallback(async () => {
    try {
      const ok = await flushOfflineQueue({ retries: 2 });
      const count = await getPendingWriteCount().catch(() => 0);
      setSyncState(ok ? (count > 0 ? "pending" : "ok") : "error");
    } catch {
      setSyncState("error");
    }
  }, [flushOfflineQueue]);

  const persistDraft = useCallback(
    async (options?: PersistOptions): Promise<boolean> => {
      if (!draft) return false;

      const normalizedNote = draft.note?.trim();
      const payload: DraftWritePayload = {
        lines: draft.lines.map((line) => ({
          productId: line.productId,
          quantity: line.quantity,
          unitPriceCents: line.unitPriceCents
        })),
        includeLicenseFee: Boolean(draft.includeLicenseFee),
        discountCents: 0,
        subtractVat: Boolean(draft.subtractVat),
        paymentMethod: draft.paymentMethod ?? "CASH",
        note: normalizedNote ? normalizedNote : undefined
      };

      writeSnapshot(draft);
      setStatus("saving");
      setError("");

      if (!dirty && !options?.force) {
        setStatus("saved");
        return true;
      }

      let pendingId: string | null = null;
      try {
        pendingId = await enqueueLatestPendingWrite(draft.id, payload);
        setSyncState("pending");
      } catch {
        // IndexedDB kann auf iOS in Private Mode blockiert sein.
      }

      if (options?.backgroundOnly) {
        setStatus("idle");
        return false;
      }

      if (!isOnline()) {
        setIsOffline(true);
        setStatus("error");
        setSyncState("pending");
        setError(t("offlinePending"));
        return false;
      }

      const saveSeq = ++saveSeqRef.current;
      const localVersionAtStart = localVersionRef.current;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const updated = await sendDraftPatch(draft.id, payload, controller.signal);
        if (saveSeq !== saveSeqRef.current) return true;
        const normalizedDraft = normalizeDraftData(updated);

        if (localVersionAtStart === localVersionRef.current) {
          setDraft(normalizedDraft);
          writeSnapshot(normalizedDraft);
          setStatus("saved");
          setDirty(false);
          setIsOffline(false);
        } else {
          setStatus("idle");
          setDirty(true);
        }

        if (pendingId) {
          await removePendingWrite(pendingId);
        }
        await refreshPendingState();
        return true;
      } catch (persistError) {
        if (controller.signal.aborted) return false;

        setStatus("error");
        setSyncState("error");
        setError(persistError instanceof Error ? persistError.message : t("saveError"));
        if (pendingId) {
          await updatePendingWriteError(
            pendingId,
            persistError instanceof Error ? persistError.message : t("saveError")
          ).catch(() => undefined);
        }
        return false;
      }
    },
    [draft, dirty, refreshPendingState, sendDraftPatch, t, writeSnapshot]
  );

  const forceSave = useCallback(async (): Promise<boolean> => {
    if (!draft) return false;
    if (!isOnline()) {
      setIsOffline(true);
      setStatus("error");
      setSyncState("pending");
      setError(t("offlinePending"));
      return false;
    }

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const saved = await persistDraft({ force: true });
      if (!saved) {
        if (attempt < 2) {
          await wait(250 * (attempt + 1));
          continue;
        }
        return false;
      }

      const flushed = await flushOfflineQueue({ onlyDraftId: draft.id, retries: 2 });
      if (flushed) {
        const count = await getPendingWriteCount().catch(() => 0);
        setStatus("saved");
        setSyncState(count > 0 ? "pending" : "ok");
        return true;
      }

      if (attempt < 2) {
        await wait(300 * (attempt + 1));
      }
    }

    setStatus("error");
    setSyncState("error");
    setError(t("saveError"));
    return false;
  }, [draft, flushOfflineQueue, persistDraft, t]);

  useEffect(() => {
    setIsOffline(!isOnline());
    void hydrateDraft();
    void refreshPendingState();
  }, [hydrateDraft, refreshPendingState]);

  useEffect(() => {
    if (!draft || !dirty) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void persistDraft(), 650);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [dirty, draft, persistDraft]);

  useEffect(() => {
    const onOnline = () => {
      setIsOffline(false);
      void syncNow();
    };
    const onOffline = () => {
      setIsOffline(true);
      setSyncState("pending");
    };
    const onPageHide = () => {
      if (dirty) {
        void persistDraft({ backgroundOnly: true });
      }
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden" && dirty) {
        void persistDraft({ backgroundOnly: true });
      }
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        void hydrateDraft();
        if (isOnline()) void syncNow();
      }
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [dirty, hydrateDraft, persistDraft, syncNow]);

  function updateDraft(mutator: (current: DraftData) => DraftData) {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = mutator(prev);
      writeSnapshot(next);
      return next;
    });
    localVersionRef.current += 1;
    setDirty(true);
    setStatus("idle");
  }

  function onItemsChange(items: SelectedProductItem[]) {
    setProductLicenseFeeMap((prev) => {
      const next = { ...prev };
      for (const item of items) {
        if (typeof item.licenseFeeCents === "number" && Number.isFinite(item.licenseFeeCents)) {
          next[item.productId] = Math.max(0, Math.round(item.licenseFeeCents));
        }
      }
      return next;
    });
    setProductLicenseTypeMap((prev) => {
      const next = { ...prev };
      for (const item of items) {
        if (item.licenseType) {
          next[item.productId] = item.licenseType;
        }
      }
      return next;
    });
    setProductLicenseWeightGramsMap((prev) => {
      const next = { ...prev };
      for (const item of items) {
        if (typeof item.licenseWeightGrams === "number" && Number.isFinite(item.licenseWeightGrams)) {
          next[item.productId] = Math.max(0, Math.round(item.licenseWeightGrams));
        }
      }
      return next;
    });

    updateDraft((prev) => {
      const existingByProductId = new Map(prev.lines.map((line) => [line.productId, line]));
      return {
        ...prev,
        lines: items.map((item) => {
          const existing = existingByProductId.get(item.productId);
          return {
            id: existing?.id ?? -Date.now() - item.productId,
            productId: item.productId,
            productName: item.name,
            productSku: item.sku,
            quantity: item.quantity,
            unitPriceCents: item.unitPriceCents,
            licenseType: item.licenseType,
            licenseWeightGrams: item.licenseWeightGrams,
            licenseFeeCents: item.licenseFeeCents
          };
        })
      };
    });
  }

  function onNoteChange(value: string) {
    updateDraft((prev) => ({ ...prev, note: value }));
  }

  function onIncludeLicenseFeeChange(next: boolean) {
    updateDraft((prev) => ({ ...prev, includeLicenseFee: next }));
  }

  function onSubtractVatChange(next: boolean) {
    updateDraft((prev) => ({ ...prev, discountCents: 0, subtractVat: next }));
  }

  function onPaymentMethodChange(next: "CASH" | "BANK" | "DIRECT_DEBIT") {
    updateDraft((prev) => ({ ...prev, paymentMethod: next }));
  }

  function getProductElementId(productId: number) {
    return `draft-product-item-${productId}`;
  }

  async function onPrintPdf() {
    if (!draft) return;
    if (isPrinting) return;
    setIsPrinting(true);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    const saved = await forceSave();
    if (!saved) {
      setError(t("saveError"));
      setIsPrinting(false);
      return;
    }
    router.push(`/drafts/${draft.id}/pdf`);
    setTimeout(() => setIsPrinting(false), 400);
  }

  useEffect(() => {
    if (!activeWalkthroughTarget) return;
    if (navigationTargets.includes(activeWalkthroughTarget)) return;
    setActiveWalkthroughTarget(navigationTargets[0] ?? null);
  }, [activeWalkthroughTarget, navigationTargets]);

  if (!Number.isFinite(draftId)) {
    return (
      <section className="space-y-4">
        <p className="card text-sm">{t("missingCustomer")}</p>
        <button className="primary-btn w-full" onClick={() => router.push("/drafts")}>
          {t("backToDrafts")}
        </button>
      </section>
    );
  }

  if (!draft) return <p className="text-sm text-[#4A4A4A]/70">{t("loading")}</p>;

  function scrollToWalkthroughTarget(target: string) {
    setActiveWalkthroughTarget(target);
    window.requestAnimationFrame(() => {
      if (target.startsWith("product:")) {
        const productId = Number.parseInt(target.split(":")[1] ?? "", 10);
        const element = document.getElementById(getProductElementId(productId));
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      if (target === "payment") {
        paymentSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      if (target === "license") {
        licenseSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  function onAdvanceWalkthrough() {
    if (navigationTargets.length === 0) return;
    const currentIndex = activeWalkthroughTarget ? navigationTargets.indexOf(activeWalkthroughTarget) : -1;
    const nextIndex =
      currentIndex >= 0 && currentIndex < navigationTargets.length - 1 ? currentIndex + 1 : 0;
    scrollToWalkthroughTarget(navigationTargets[nextIndex]);
  }

  return (
    <section className="space-y-4 pb-[180px]">
      <header className="card">
        <p className="text-sm text-[#4A4A4A]/70">{t("customer")}</p>
        <h1 className="text-xl font-bold">{draft.customerName}</h1>
        <p className="mt-1 text-sm text-[#4A4A4A]/70">{new Date(draft.date).toLocaleDateString("de-DE")}</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-[#4A4A4A]/70">
          <CheckCircle2 size={14} />
          {status === "saving"
            ? t("saving")
            : status === "saved"
              ? t("saved")
              : status === "error"
                ? isOffline
                  ? t("offlinePending")
                  : t("saveError")
                : t("autoSave")}
        </div>
      </header>

      <ProductPicker
        selectedItems={selectedItems}
        onChange={onItemsChange}
        priceOverrides={customerPriceMap}
        licenseFeeMap={productLicenseFeeMap}
        licenseTypeMap={productLicenseTypeMap}
        licenseWeightGramsMap={productLicenseWeightGramsMap}
        includeLicenseFee={Boolean(draft.includeLicenseFee)}
        suggestedProducts={customerSuggestedProducts}
        searchMode="all"
        highlightedProductId={Number.isFinite(highlightedProductId ?? NaN) ? highlightedProductId : null}
        getProductElementId={getProductElementId}
      />

      <div
        ref={paymentSectionRef}
        className={`card space-y-2 transition-all ${
          activeWalkthroughTarget === "payment"
            ? "border-[#0A84FF] bg-[#DFF3FF] ring-2 ring-[#0A84FF]/18 shadow-[0_12px_28px_rgba(10,132,255,0.14)]"
            : ""
        }`}
      >
        <p className="text-sm font-semibold">{t("paymentTitle")}</p>
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex items-center gap-2 rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm">
            <input
              type="radio"
              name="payment-method"
              checked={(draft.paymentMethod ?? "CASH") === "CASH"}
              onChange={() => onPaymentMethodChange("CASH")}
            />
            <Banknote size={14} />
            <span>{t("paymentCash")}</span>
          </label>
          <label className="inline-flex items-center gap-2 rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm">
            <input
              type="radio"
              name="payment-method"
              checked={(draft.paymentMethod ?? "CASH") === "BANK"}
              onChange={() => onPaymentMethodChange("BANK")}
            />
            <Landmark size={14} />
            <span>{t("paymentBank")}</span>
          </label>
          <label className="inline-flex items-center gap-2 rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm">
            <input
              type="radio"
              name="payment-method"
              checked={(draft.paymentMethod ?? "CASH") === "DIRECT_DEBIT"}
              onChange={() => onPaymentMethodChange("DIRECT_DEBIT")}
            />
            <CreditCard size={14} />
            <span>{t("paymentDebit")}</span>
          </label>
        </div>
      </div>

      <div
        ref={licenseSectionRef}
        className={`card space-y-2 transition-all ${
          activeWalkthroughTarget === "license"
            ? "border-[#0A84FF] bg-[#DFF3FF] ring-2 ring-[#0A84FF]/18 shadow-[0_12px_28px_rgba(10,132,255,0.14)]"
            : ""
        }`}
      >
        <p className="text-sm font-semibold">{t("licenseTitle")}</p>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="license-fee-mode"
            checked={Boolean(draft.includeLicenseFee)}
            onChange={() => onIncludeLicenseFeeChange(true)}
          />
          <span>{t("withLicense", { licenseTotal: formatCents(totals.licenseTotalCents) })}</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="license-fee-mode"
            checked={!draft.includeLicenseFee}
            onChange={() => onIncludeLicenseFeeChange(false)}
          />
          <span>{t("withoutLicense")}</span>
        </label>
      </div>

      <div className="card">
        <label
          className="flex items-center gap-3"
          aria-label={t("subtractVatTitle")}
          title={t("subtractVatTitle")}
        >
          <input
            type="checkbox"
            className="sr-only"
            checked={Boolean(draft.subtractVat)}
            onChange={(event) => onSubtractVatChange(event.target.checked)}
          />
          <span
            className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
              draft.subtractVat ? "border-[#2F7EA1] bg-[#2F7EA1]" : "border-[#BFC8CE] bg-white"
            }`}
            aria-hidden="true"
          >
            {draft.subtractVat ? <CheckCircle2 size={10} className="text-white" /> : null}
          </span>
          <Image src="/icons/no-mwst.png" alt={t("subtractVatTitle")} width={44} height={44} className="h-11 w-11" />
          {draft.subtractVat ? (
            <span className="rounded-full bg-[#E8F4F8] px-2.5 py-1 text-[11px] font-medium text-[#2F7EA1]">
              {t("subtractVatActiveHint")}
            </span>
          ) : null}
        </label>
      </div>

      <div className="card space-y-2">
        <label htmlFor="draft-note" className="text-sm font-semibold">
          {t("noteLabel")}
        </label>
        <textarea
          id="draft-note"
          className="input min-h-[96px] resize-y"
          placeholder={t("notePlaceholder")}
          value={draft.note ?? ""}
          onChange={(event) => onNoteChange(event.target.value)}
        />
      </div>

      {error ? <p className="text-sm">{error}</p> : null}

      <div
        className="fixed bottom-[75px] left-0 right-0 z-30 mx-auto flex w-full max-w-md items-center justify-between gap-2 rounded-t-2xl bg-[#2F7EA1] px-4 py-3 text-white shadow-lg"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)"
        }}
      >
        <div>
          <p className="text-xs text-white/80">{t("total")}</p>
          <p className="text-xl font-bold">{formatCents(totals.subtotalCents)}</p>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-white"
            onClick={onAdvanceWalkthrough}
            aria-label={t("walkthroughNext")}
            title={t("walkthroughNext")}
          >
            <ChevronDown size={18} />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-sm disabled:opacity-70"
            onClick={onPrintPdf}
            disabled={isPrinting}
          >
            <span className="flex items-center gap-1">
              {isPrinting ? <Loader2 size={14} className="animate-spin" /> : <Printer size={14} />}
              {isPrinting ? t("printing") : t("printAction")}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
