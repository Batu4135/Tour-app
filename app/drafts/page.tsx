"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Pencil, Search, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

type Customer = {
  id: number;
  name: string;
  address: string | null;
};

type PaymentMethod = "CASH" | "BANK" | "DIRECT_DEBIT";

type Draft = {
  id: number;
  customerId: number;
  customerName: string;
  customerRouteDay: string | null;
  date: string;
  totalCents: number;
  paymentMethod: PaymentMethod;
  tourClosedAt: string | null;
};

type DraftGroup = {
  key: string;
  label: string;
  routeLabel: string | null;
  drafts: Draft[];
  isToday: boolean;
  isClosed: boolean;
  cashTotalCents: number;
  bankCount: number;
  debitCount: number;
};

function centsToText(cents: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
  }).format(cents / 100);
}

function dayKey(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function paymentLabel(method: PaymentMethod, t: (key: string) => string): string {
  if (method === "BANK") return t("paymentBank");
  if (method === "DIRECT_DEBIT") return t("paymentDebit");
  return t("paymentCash");
}

function pickRouteLabel(values: Array<string | null | undefined>): string | null {
  const counts = new Map<string, number>();
  for (const value of values) {
    const cleaned = (value ?? "").trim();
    if (!cleaned) continue;
    counts.set(cleaned, (counts.get(cleaned) ?? 0) + 1);
  }
  if (counts.size === 0) return null;
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

export default function DraftsPage() {
  const t = useTranslations("drafts");
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [recentDrafts, setRecentDrafts] = useState<Draft[]>([]);
  const [debounced, setDebounced] = useState("");
  const [error, setError] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [showOverviewByGroup, setShowOverviewByGroup] = useState<Record<string, boolean>>({});
  const [selectedClosedGroups, setSelectedClosedGroups] = useState<Record<string, boolean>>({});
  const [selectionMode, setSelectionMode] = useState(false);
  const [closingGroupKey, setClosingGroupKey] = useState<string | null>(null);
  const [deletingGroupKey, setDeletingGroupKey] = useState<string | null>(null);
  const [tourError, setTourError] = useState("");
  const [tourSuccess, setTourSuccess] = useState("");
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 260);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    void loadCustomers();
  }, [debounced]);

  useEffect(() => {
    void loadRecentDrafts();
  }, []);

  const selectedResults = useMemo(() => customers.slice(0, 10), [customers]);
  const todayKey = useMemo(() => dayKey(new Date()), []);

  const groupedDrafts = useMemo<DraftGroup[]>(() => {
    const groups = new Map<string, Draft[]>();
    for (const draft of recentDrafts) {
      const key = dayKey(draft.date);
      const list = groups.get(key) ?? [];
      list.push(draft);
      groups.set(key, list);
    }

    return Array.from(groups.entries()).map(([key, drafts]) => {
      const isClosed = drafts.length > 0 && drafts.every((draft) => Boolean(draft.tourClosedAt));
      return {
        key,
        label: new Date(`${key}T12:00:00.000Z`).toLocaleDateString("de-DE"),
        routeLabel: pickRouteLabel(drafts.map((draft) => draft.customerRouteDay)),
        drafts,
        isToday: key === todayKey,
        isClosed,
        cashTotalCents: drafts
          .filter((draft) => draft.paymentMethod === "CASH")
          .reduce((sum, draft) => sum + draft.totalCents, 0),
        bankCount: drafts.filter((draft) => draft.paymentMethod === "BANK").length,
        debitCount: drafts.filter((draft) => draft.paymentMethod === "DIRECT_DEBIT").length
      };
    });
  }, [recentDrafts, todayKey]);

  useEffect(() => {
    setOpenGroups((previous) => {
      const next: Record<string, boolean> = {};
      for (const group of groupedDrafts) {
        next[group.key] = previous[group.key] ?? !group.isClosed;
      }
      return next;
    });
  }, [groupedDrafts]);

  useEffect(() => {
    setSelectedClosedGroups((previous) => {
      const next: Record<string, boolean> = {};
      for (const group of groupedDrafts) {
        if (!group.isClosed) continue;
        if (previous[group.key]) next[group.key] = true;
      }
      return next;
    });
  }, [groupedDrafts]);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    };
  }, []);

  const closedGroups = useMemo(() => groupedDrafts.filter((group) => group.isClosed), [groupedDrafts]);
  const selectedClosedGroupCount = useMemo(
    () => closedGroups.filter((group) => selectedClosedGroups[group.key]).length,
    [closedGroups, selectedClosedGroups]
  );
  const selectedClosedDraftIds = useMemo(
    () =>
      closedGroups
        .filter((group) => selectedClosedGroups[group.key])
        .flatMap((group) => group.drafts.map((draft) => draft.id)),
    [closedGroups, selectedClosedGroups]
  );
  const selectedClosedReportHref = useMemo(() => {
    if (selectedClosedDraftIds.length === 0) return "";
    const uniqueIds = Array.from(new Set(selectedClosedDraftIds));
    return `/api/drafts/week-report?ids=${encodeURIComponent(uniqueIds.join(","))}`;
  }, [selectedClosedDraftIds]);

  async function loadCustomers() {
    const response = await fetch(`/api/customers?q=${encodeURIComponent(debounced)}`);
    const data = await response.json();
    if (response.ok) setCustomers(data.customers as Customer[]);
  }

  async function loadRecentDrafts() {
    const response = await fetch("/api/drafts");
    const data = await response.json();
    if (response.ok) setRecentDrafts(data.drafts as Draft[]);
  }

  async function deleteDraft(id: number) {
    if (!confirm(t("confirmDelete"))) return;
    setError("");
    const response = await fetch(`/api/drafts/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };
      setError(payload.error ?? t("deleteError"));
      return;
    }
    await loadRecentDrafts();
  }

  function toggleGroup(key: string) {
    setOpenGroups((previous) => ({ ...previous, [key]: !previous[key] }));
  }

  async function closeDraftIds(ids: number[], successMessage: string) {
    if (ids.length === 0) return;
    setTourError("");
    setTourSuccess("");

    const response = await fetch("/api/drafts/close-day", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ draftIds: ids })
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      throw new Error(payload.error ?? t("tourCloseError"));
    }

    setTourSuccess(successMessage);
    await loadRecentDrafts();
  }

  async function closeTour(group: DraftGroup) {
    if (!group.isToday || group.drafts.length === 0 || group.isClosed) return;

    setClosingGroupKey(group.key);
    try {
      await closeDraftIds(
        group.drafts.map((draft) => draft.id),
        t("tourClosed")
      );
      setOpenGroups((previous) => ({ ...previous, [group.key]: false }));
      setShowOverviewByGroup((previous) => ({ ...previous, [group.key]: false }));
    } catch (closeError) {
      setTourError(closeError instanceof Error ? closeError.message : t("tourCloseError"));
    } finally {
      setClosingGroupKey(null);
    }
  }

  function clearLongPressTimer() {
    if (!longPressTimerRef.current) return;
    clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  }

  function startLongPressSelection(group: DraftGroup) {
    if (!group.isClosed || selectionMode) return;
    clearLongPressTimer();
    longPressTimerRef.current = setTimeout(() => {
      setSelectionMode(true);
      setSelectedClosedGroups((previous) => ({ ...previous, [group.key]: true }));
      longPressTimerRef.current = null;
    }, 420);
  }

  function stopLongPressSelection() {
    clearLongPressTimer();
  }

  function toggleClosedTourSelection(groupKey: string) {
    setSelectedClosedGroups((previous) => ({
      ...previous,
      [groupKey]: !previous[groupKey]
    }));
  }

  function stopSelectionMode() {
    setSelectionMode(false);
    setSelectedClosedGroups({});
  }

  async function deleteClosedTour(group: DraftGroup) {
    if (!group.isClosed || group.drafts.length === 0 || deletingGroupKey) return;
    if (!confirm(t("confirmDeleteClosedTour", { date: group.label }))) return;

    setDeletingGroupKey(group.key);
    setTourError("");
    setTourSuccess("");
    try {
      for (const draft of group.drafts) {
        const response = await fetch(`/api/drafts/${draft.id}`, { method: "DELETE" });
        if (!response.ok) {
          const payload = (await response.json().catch(() => ({}))) as { error?: string };
          throw new Error(payload.error ?? t("deleteClosedTourError"));
        }
      }
      await loadRecentDrafts();
      setTourSuccess(t("deleteClosedTourSuccess"));
      setSelectedClosedGroups((previous) => {
        const next = { ...previous };
        delete next[group.key];
        return next;
      });
    } catch (deleteError) {
      setTourError(deleteError instanceof Error ? deleteError.message : t("deleteClosedTourError"));
    } finally {
      setDeletingGroupKey(null);
    }
  }

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-sm text-[#4A4A4A]/70">{t("subtitle")}</p>
      </header>

      <div className="card space-y-3">
        <p className="text-sm font-semibold">{t("newDraft")}</p>
        <div className="relative">
          <Search className="search-icon" size={16} />
          <input
            className="search-input"
            placeholder={t("customerSearch")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          {selectedResults.map((customer) => (
            <Link
              key={customer.id}
              href={`/drafts/new?customerId=${customer.id}`}
              className="secondary-btn flex w-full items-center justify-between text-left"
            >
              <span className="truncate text-sm font-medium">{customer.name}</span>
              <span className="ml-3 truncate text-xs text-[#4A4A4A]/60">{customer.address ?? ""}</span>
            </Link>
          ))}
          {selectedResults.length === 0 ? <p className="text-sm text-[#4A4A4A]/60">{t("noCustomers")}</p> : null}
        </div>
      </div>

      <div className="card space-y-3">
        <p className="text-sm font-semibold">{t("recent")}</p>
        {selectionMode ? (
          <div className="rounded-xl border border-[#DDE6EF] bg-white p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#4A4A4A]/70">
                {t("selectedToursCount", { count: selectedClosedGroupCount })}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={selectedClosedReportHref || "#"}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => {
                    if (!selectedClosedReportHref) event.preventDefault();
                  }}
                  className={`secondary-btn !px-3 !py-1.5 text-xs ${selectedClosedReportHref ? "" : "pointer-events-none opacity-50"}`}
                  aria-disabled={!selectedClosedReportHref}
                >
                  {t("weeklySelectedPdf")}
                </a>
                <button type="button" className="secondary-btn !px-3 !py-1.5 text-xs" onClick={stopSelectionMode}>
                  {t("cancelSelection")}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {groupedDrafts.map((group) => (
          <div
            key={group.key}
            className={`rounded-xl border p-3 ${group.isClosed ? "border-[#B8E3C4] bg-[#ECFAF0]" : "border-[#E5E5E5] bg-white"}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div
                className="flex items-center gap-2"
                onTouchStart={() => startLongPressSelection(group)}
                onTouchEnd={stopLongPressSelection}
                onTouchCancel={stopLongPressSelection}
                onMouseDown={() => startLongPressSelection(group)}
                onMouseUp={stopLongPressSelection}
                onMouseLeave={stopLongPressSelection}
                onContextMenu={(event) => {
                  if (group.isClosed) event.preventDefault();
                }}
                onClick={() => {
                  if (selectionMode && group.isClosed) {
                    toggleClosedTourSelection(group.key);
                  }
                }}
              >
                {selectionMode && group.isClosed ? (
                  <input
                    type="checkbox"
                    checked={Boolean(selectedClosedGroups[group.key])}
                    onChange={() => toggleClosedTourSelection(group.key)}
                    className="h-4 w-4 accent-[#2F7EA1]"
                    aria-label={t("selectClosedTours")}
                    onClick={(event) => event.stopPropagation()}
                  />
                ) : null}
                <div>
                  <p className="text-xs font-semibold text-[#4A4A4A]/70">
                    {group.label}
                    {group.routeLabel ? ` - ${group.routeLabel}` : ""}
                  </p>
                  {group.isClosed ? <p className="text-xs text-[#1E6F2D]">{t("tourClosedBadge")}</p> : null}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {group.isClosed ? (
                  <button
                    type="button"
                    className="secondary-btn !px-2 !py-1 text-xs text-[#8B2C2C]"
                    onClick={() => void deleteClosedTour(group)}
                    disabled={deletingGroupKey === group.key}
                  >
                    {deletingGroupKey === group.key ? t("deletingClosedTour") : t("deleteClosedTour")}
                  </button>
                ) : null}
                {group.isToday && !group.isClosed ? (
                  <button
                    type="button"
                    className="rounded-lg bg-[#2B8A3E] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                    disabled={closingGroupKey === group.key || group.drafts.length === 0}
                    onClick={() => void closeTour(group)}
                  >
                    {closingGroupKey === group.key ? t("tourClosing") : t("tourClose")}
                  </button>
                ) : null}
                <button
                  type="button"
                  className="secondary-btn !px-2 !py-1"
                  onClick={() => toggleGroup(group.key)}
                  aria-label={openGroups[group.key] ? t("collapseGroup") : t("expandGroup")}
                >
                  {openGroups[group.key] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            </div>

            {openGroups[group.key] ? (
              <div className="mt-3 space-y-2">
                {group.isClosed ? (
                  <div className="rounded-xl border border-[#DDE6EF] bg-white p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="secondary-btn !px-3 !py-1.5 text-xs"
                        onClick={() =>
                          setShowOverviewByGroup((previous) => ({
                            ...previous,
                            [group.key]: !previous[group.key]
                          }))
                        }
                      >
                        {showOverviewByGroup[group.key] ? t("hideOverview") : t("showOverview")}
                      </button>
                    </div>

                    {showOverviewByGroup[group.key] ? (
                      <p className="mt-2 text-xs text-[#4A4A4A]/70">
                        {t("cashTotal")}: {centsToText(group.cashTotalCents)} | {t("bankCount")}: {group.bankCount} |{" "}
                        {t("debitCount")}: {group.debitCount}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {group.drafts.map((draft) => (
                  <div key={draft.id} className="rounded-xl border border-[#E5E5E5] bg-white px-3 py-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{draft.customerName}</p>
                        <p className="text-xs text-[#4A4A4A]/65">{centsToText(draft.totalCents)}</p>
                        <p className="text-[11px] text-[#4A4A4A]/55">{paymentLabel(draft.paymentMethod, t)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/drafts/${draft.id}`} className="secondary-btn !p-2" aria-label={t("editAria")}>
                          <Pencil size={14} />
                        </Link>
                        <button
                          type="button"
                          className="secondary-btn !p-2"
                          onClick={() => void deleteDraft(draft.id)}
                          aria-label={t("deleteAria")}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}

        {recentDrafts.length === 0 ? <p className="text-sm text-[#4A4A4A]/60">{t("noDrafts")}</p> : null}
        {tourSuccess ? <p className="text-sm text-[#1E6F2D]">{tourSuccess}</p> : null}
        {tourError ? <p className="text-sm text-[#8B2C2C]">{tourError}</p> : null}
        {error ? <p className="text-sm text-[#4A4A4A]">{error}</p> : null}
      </div>
    </section>
  );
}
