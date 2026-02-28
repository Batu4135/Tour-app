"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, FileDown, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import ProductPicker, { ProductOption, SelectedProductItem } from "@/components/ProductPicker";
import { formatCents } from "@/lib/formatCents";
import SyncStatus from "@/components/SyncStatus";
import {
  DraftWritePayload,
  enqueuePendingWrite,
  getPendingWriteCount,
  removePendingWrite,
  syncPendingWrites,
  updatePendingWriteError
} from "@/lib/offlineQueue";

type DraftLine = {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  unitPriceCents: number;
};

type DraftData = {
  id: number;
  customerId: number;
  customerName: string;
  date: string;
  lines: DraftLine[];
};

type InitResponse = {
  draft: DraftData;
  customerPriceMap: Record<number, number>;
  customerSuggestedProducts: ProductOption[];
  error?: string;
};

export default function NewDraftPage() {
  const t = useTranslations("draftEditor");
  const searchParams = useSearchParams();
  const router = useRouter();
  const customerId = Number.parseInt(searchParams.get("customerId") ?? "", 10);
  const draftId = Number.parseInt(searchParams.get("draftId") ?? "", 10);

  const [draft, setDraft] = useState<DraftData | null>(null);
  const [customerPriceMap, setCustomerPriceMap] = useState<Record<number, number>>({});
  const [customerSuggestedProducts, setCustomerSuggestedProducts] = useState<ProductOption[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [syncState, setSyncState] = useState<"ok" | "pending" | "error">("ok");
  const [pendingCount, setPendingCount] = useState(0);
  const [syncingNow, setSyncingNow] = useState(false);
  const [error, setError] = useState("");
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  const totalCents = useMemo(
    () => (draft ? draft.lines.reduce((sum, line) => sum + line.quantity * line.unitPriceCents, 0) : 0),
    [draft]
  );

  useEffect(() => {
    if (Number.isFinite(draftId)) {
      void loadExistingDraft(draftId);
      return;
    }
    if (Number.isFinite(customerId)) {
      void initializeDraft(customerId);
    }
  }, [customerId, draftId]);

  const sendDraftPatch = useCallback(
    async (targetDraftId: number, writePayload: DraftWritePayload): Promise<DraftData> => {
      const response = await fetch(`/api/drafts/${targetDraftId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(writePayload)
      });
      const responsePayload = (await response.json()) as { draft?: DraftData; error?: string };
      if (!response.ok || !responsePayload.draft) throw new Error(responsePayload.error ?? t("saveError"));
      return responsePayload.draft;
    },
    [t]
  );

  const refreshPendingState = useCallback(async () => {
    const count = await getPendingWriteCount().catch(() => 0);
    setPendingCount(count);
    if (count === 0) {
      setSyncState("ok");
    }
  }, []);

  const syncNow = useCallback(async () => {
    setSyncingNow(true);
    try {
      const result = await syncPendingWrites(async (entry) => {
        const updated = await sendDraftPatch(entry.draftId, entry.payload);
        if (draft && updated.id === draft.id) {
          setDraft(updated);
          setStatus("saved");
        }
      });
      setPendingCount(result.pending);
      setSyncState(result.failed > 0 ? "error" : result.pending > 0 ? "pending" : "ok");
    } catch {
      setSyncState("error");
    } finally {
      setSyncingNow(false);
    }
  }, [draft, sendDraftPatch]);

  const persistDraft = useCallback(async () => {
    if (!draft) return;
    setStatus("saving");
    const payload: DraftWritePayload = {
      lines: draft.lines.map((line) => ({
        productId: line.productId,
        quantity: line.quantity,
        unitPriceCents: line.unitPriceCents
      }))
    };

    let pendingId: string | null = null;
    try {
      pendingId = await enqueuePendingWrite(draft.id, payload);
      const count = await getPendingWriteCount();
      setPendingCount(count);
      setSyncState("pending");
    } catch {
      // Wenn IndexedDB nicht verfuegbar ist, speichern wir direkt weiter.
    }

    try {
      const updated = await sendDraftPatch(draft.id, payload);
      setDraft(updated);
      setStatus("saved");
      if (pendingId) {
        await removePendingWrite(pendingId);
      }
      await refreshPendingState();
    } catch (persistError) {
      setStatus("error");
      setSyncState("error");
      setError(persistError instanceof Error ? persistError.message : t("saveError"));
      if (pendingId) {
        await updatePendingWriteError(
          pendingId,
          persistError instanceof Error ? persistError.message : t("saveError")
        ).catch(() => undefined);
      }
      const count = await getPendingWriteCount().catch(() => 0);
      setPendingCount(count);
    }
  }, [draft, refreshPendingState, sendDraftPatch, t]);

  useEffect(() => {
    if (!draft) return;
    if (status !== "idle") return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void persistDraft(), 700);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [draft?.lines, persistDraft, status]);

  useEffect(() => {
    void refreshPendingState();
    const onOnline = () => void syncNow();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [refreshPendingState, syncNow]);

  async function initializeDraft(id: number) {
    setError("");
    try {
      const response = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: id })
      });
      const payload = (await response.json()) as InitResponse;
      if (!response.ok) throw new Error(payload.error ?? t("initError"));
      setDraft(payload.draft);
      setCustomerPriceMap(payload.customerPriceMap ?? {});
      setCustomerSuggestedProducts(payload.customerSuggestedProducts ?? []);
      setStatus("saved");
    } catch (initError) {
      setError(initError instanceof Error ? initError.message : t("initError"));
    }
  }

  async function loadExistingDraft(id: number) {
    setError("");
    try {
      const response = await fetch(`/api/drafts/${id}`);
      const payload = (await response.json()) as InitResponse;
      if (!response.ok) throw new Error(payload.error ?? t("initError"));
      setDraft(payload.draft);
      setCustomerPriceMap(payload.customerPriceMap ?? {});
      setCustomerSuggestedProducts(payload.customerSuggestedProducts ?? []);
      setStatus("saved");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t("initError"));
    }
  }

  function onItemsChange(items: SelectedProductItem[]) {
    setDraft((prev) => {
      if (!prev) return prev;
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
            unitPriceCents: item.unitPriceCents
          };
        })
      };
    });
    setStatus("idle");
  }

  async function onDownloadPdf() {
    if (!draft) return;
    const response = await fetch(`/api/drafts/${draft.id}/pdf`);
    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `nord-pack-vordruck-${draft.id}.pdf`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (!Number.isFinite(customerId) && !Number.isFinite(draftId)) {
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

  const selectedItems: SelectedProductItem[] = draft.lines.map((line) => ({
    productId: line.productId,
    sku: line.productSku ?? "",
    name: line.productName,
    quantity: line.quantity,
    unitPriceCents: line.unitPriceCents
  }));

  return (
    <section className="space-y-4 pb-[140px]">
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
                ? t("saveError")
                : t("autoSave")}
        </div>
      </header>

      <SyncStatus state={syncState} pendingCount={pendingCount} onSyncNow={() => void syncNow()} disabled={syncingNow} />

      <ProductPicker
        selectedItems={selectedItems}
        onChange={onItemsChange}
        priceOverrides={customerPriceMap}
        suggestedProducts={customerSuggestedProducts}
        searchMode={customerSuggestedProducts.length > 0 ? "suggestedOnly" : "all"}
      />

      {error ? <p className="text-sm">{error}</p> : null}

      <div
        className="fixed bottom-[75px] left-0 right-0 z-30 mx-auto flex w-full max-w-md items-center justify-between gap-2 rounded-t-2xl bg-[#2F7EA1] px-4 py-3 text-white shadow-lg"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
      >
        <div>
          <p className="text-xs text-white/80">{t("total")}</p>
          <p className="text-xl font-bold">{formatCents(totalCents)}</p>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-sm"
            onClick={() => void persistDraft()}
          >
            <span className="flex items-center gap-1">
              <Save size={14} />
              {t("save")}
            </span>
          </button>
          <button className="rounded-xl border border-white/30 bg-white/10 px-3 py-2 text-sm" onClick={onDownloadPdf}>
            <span className="flex items-center gap-1">
              <FileDown size={14} />
              PDF
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
