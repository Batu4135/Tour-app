"use client";

import { useEffect, useMemo, useState } from "react";
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
  date: string;
  totalCents: number;
  paymentMethod: PaymentMethod;
  tourClosedAt: string | null;
};

type DraftGroup = {
  key: string;
  label: string;
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

export default function DraftsPage() {
  const t = useTranslations("drafts");
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [recentDrafts, setRecentDrafts] = useState<Draft[]>([]);
  const [debounced, setDebounced] = useState("");
  const [error, setError] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [showTodayReview, setShowTodayReview] = useState(false);
  const [closingTour, setClosingTour] = useState(false);
  const [tourError, setTourError] = useState("");
  const [tourSuccess, setTourSuccess] = useState("");

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

  const todayGroup = useMemo(() => groupedDrafts.find((group) => group.isToday) ?? null, [groupedDrafts]);

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

  async function closeTodayTour() {
    if (!todayGroup || todayGroup.drafts.length === 0 || todayGroup.isClosed) return;

    setClosingTour(true);
    setTourError("");
    setTourSuccess("");
    try {
      const response = await fetch("/api/drafts/close-day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftIds: todayGroup.drafts.map((draft) => draft.id)
        })
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? t("tourCloseError"));
      }
      setTourSuccess(t("tourClosed"));
      setOpenGroups((previous) => ({ ...previous, [todayGroup.key]: false }));
      await loadRecentDrafts();
    } catch (closeError) {
      setTourError(closeError instanceof Error ? closeError.message : t("tourCloseError"));
    } finally {
      setClosingTour(false);
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

        {todayGroup ? (
          <div className="rounded-xl border border-[#DDE6EF] bg-[#F8FBFF] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold">{t("todayActionsTitle")}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="secondary-btn !px-3 !py-1.5 text-xs"
                  onClick={() => setShowTodayReview((prev) => !prev)}
                >
                  {showTodayReview ? t("hideOverview") : t("showOverview")}
                </button>
                <button
                  type="button"
                  className="primary-btn !w-auto !px-3 !py-1.5 text-xs"
                  disabled={closingTour || todayGroup.isClosed}
                  onClick={() => void closeTodayTour()}
                >
                  {todayGroup.isClosed ? t("tourClosed") : closingTour ? t("tourClosing") : t("tourClose")}
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs text-[#4A4A4A]/70">
              {t("cashTotal")}: {centsToText(todayGroup.cashTotalCents)} • {t("bankCount")}: {todayGroup.bankCount} •{" "}
              {t("debitCount")}: {todayGroup.debitCount}
            </p>
            {tourSuccess ? <p className="mt-2 text-xs text-[#1E6F2D]">{tourSuccess}</p> : null}
            {tourError ? <p className="mt-2 text-xs text-[#8B2C2C]">{tourError}</p> : null}

            {showTodayReview ? (
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {todayGroup.drafts.map((draft) => (
                  <div key={draft.id} className="rounded-xl border border-[#DDE6EF] bg-white p-3">
                    <p className="text-sm font-semibold">{draft.customerName}</p>
                    <p className="text-xs text-[#4A4A4A]/65">{centsToText(draft.totalCents)}</p>
                    <p className="mt-1 text-xs text-[#4A4A4A]/65">{paymentLabel(draft.paymentMethod, t)}</p>
                    <Link href={`/drafts/${draft.id}`} className="mt-2 inline-block text-xs text-[#2F7EA1]">
                      {t("openDraft")}
                    </Link>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {groupedDrafts.map((group) => (
          <div
            key={group.key}
            className={`rounded-xl border p-3 ${group.isClosed ? "border-[#B8E3C4] bg-[#ECFAF0]" : "border-[#E5E5E5] bg-white"}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[#4A4A4A]/70">{group.label}</p>
                {group.isClosed ? <p className="text-xs text-[#1E6F2D]">{t("tourClosedBadge")}</p> : null}
              </div>
              <button
                type="button"
                className="secondary-btn !px-2 !py-1"
                onClick={() => toggleGroup(group.key)}
                aria-label={openGroups[group.key] ? t("collapseGroup") : t("expandGroup")}
              >
                {openGroups[group.key] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {openGroups[group.key] ? (
              <div className="mt-3 space-y-2">
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
        {error ? <p className="text-sm text-[#4A4A4A]">{error}</p> : null}
      </div>
    </section>
  );
}
