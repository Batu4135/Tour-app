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

type WeekLine = {
  productName: string;
  productSku: string;
  quantity: number;
  lineTotalCents: number;
};

type WeekDraft = {
  id: number;
  customerName: string;
  customerRouteDay: string | null;
  date: string;
  paymentMethod: PaymentMethod;
  note: string | null;
  totalCents: number;
  tourClosedAt: string | null;
  lines: WeekLine[];
};

type WeekDay = {
  key: string;
  label: string;
  routeLabel: string | null;
  drafts: WeekDraft[];
  isClosed: boolean;
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

function mondayKey(base: Date, weekShift = 0): string {
  const d = new Date(base);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day + weekShift * 7);
  d.setHours(0, 0, 0, 0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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
  const [closingGroupKey, setClosingGroupKey] = useState<string | null>(null);
  const [tourError, setTourError] = useState("");
  const [tourSuccess, setTourSuccess] = useState("");

  const [weekStartKey, setWeekStartKey] = useState(() => mondayKey(new Date()));
  const [weekDays, setWeekDays] = useState<WeekDay[]>([]);
  const [weekLoading, setWeekLoading] = useState(false);
  const [weekError, setWeekError] = useState("");
  const [weekClosing, setWeekClosing] = useState(false);

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

  useEffect(() => {
    void loadWeekData();
  }, [weekStartKey]);

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

  const weekRangeLabel = useMemo(() => {
    const start = new Date(`${weekStartKey}T00:00:00.000Z`);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 6);
    return `${start.toLocaleDateString("de-DE")} - ${end.toLocaleDateString("de-DE")}`;
  }, [weekStartKey]);

  const weekIsClosed = useMemo(
    () => weekDays.length > 0 && weekDays.every((day) => day.drafts.length === 0 || day.isClosed),
    [weekDays]
  );

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

  async function loadWeekData() {
    setWeekLoading(true);
    setWeekError("");
    try {
      const response = await fetch(`/api/drafts/week?start=${encodeURIComponent(weekStartKey)}`);
      const data = (await response.json()) as { days?: WeekDay[]; error?: string };
      if (!response.ok) throw new Error(data.error ?? t("weekLoadError"));
      setWeekDays(data.days ?? []);
    } catch (weekLoadError) {
      setWeekError(weekLoadError instanceof Error ? weekLoadError.message : t("weekLoadError"));
      setWeekDays([]);
    } finally {
      setWeekLoading(false);
    }
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
    await Promise.all([loadRecentDrafts(), loadWeekData()]);
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
    await Promise.all([loadRecentDrafts(), loadWeekData()]);
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

  async function closeWeek() {
    const ids = weekDays
      .flatMap((day) => day.drafts)
      .filter((draft) => !draft.tourClosedAt)
      .map((draft) => draft.id);
    if (ids.length === 0) return;

    setWeekClosing(true);
    setWeekError("");
    try {
      await closeDraftIds(ids, t("weekClosed"));
    } catch (closeError) {
      setWeekError(closeError instanceof Error ? closeError.message : t("weekCloseError"));
    } finally {
      setWeekClosing(false);
    }
  }

  function shiftWeek(direction: -1 | 1) {
    const start = new Date(`${weekStartKey}T00:00:00.000Z`);
    start.setUTCDate(start.getUTCDate() + direction * 7);
    const next = `${start.getUTCFullYear()}-${String(start.getUTCMonth() + 1).padStart(2, "0")}-${String(start.getUTCDate()).padStart(2, "0")}`;
    setWeekStartKey(next);
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold">{t("weekTitle")}</p>
          <div className="flex items-center gap-2">
            <button type="button" className="secondary-btn !px-2 !py-1" onClick={() => shiftWeek(-1)}>
              {t("prevWeek")}
            </button>
            <button type="button" className="secondary-btn !px-2 !py-1" onClick={() => shiftWeek(1)}>
              {t("nextWeek")}
            </button>
          </div>
        </div>

        <p className="text-xs text-[#4A4A4A]/70">{weekRangeLabel}</p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-lg bg-[#2B8A3E] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
            onClick={() => void closeWeek()}
            disabled={weekClosing || weekIsClosed}
          >
            {weekClosing ? t("weekClosing") : weekIsClosed ? t("weekClosed") : t("weekClose")}
          </button>
          <a
            href={`/api/drafts/week-report?start=${encodeURIComponent(weekStartKey)}`}
            target="_blank"
            rel="noreferrer"
            className="secondary-btn !px-3 !py-1.5 text-xs"
          >
            {t("weeklyPrint")}
          </a>
        </div>

        {weekLoading ? <p className="text-sm text-[#4A4A4A]/65">{t("weekLoading")}</p> : null}
        {weekError ? <p className="text-sm text-[#8B2C2C]">{weekError}</p> : null}

        {!weekLoading && weekDays.length === 0 ? <p className="text-sm text-[#4A4A4A]/65">{t("weekEmpty")}</p> : null}

        <div className="space-y-3">
          {weekDays.map((day) => (
            <div key={day.key} className="rounded-xl border border-[#E5E5E5] bg-white p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold text-[#4A4A4A]/70">{day.label}</p>
                <div className="flex items-center gap-2">
                  {day.routeLabel ? <span className="text-xs text-[#2F7EA1]">{day.routeLabel}</span> : null}
                  {day.isClosed ? <span className="text-xs text-[#1E6F2D]">{t("tourClosedBadge")}</span> : null}
                </div>
              </div>

              <div className="mt-2 space-y-2">
                {day.drafts.map((draft) => (
                  <div key={`week-${day.key}-${draft.id}`} className="rounded-lg border border-[#E9E9E9] p-2">
                    <p className="text-sm font-semibold">{draft.customerName}</p>
                    <p className="text-xs text-[#4A4A4A]/65">
                      {paymentLabel(draft.paymentMethod, t)} | {centsToText(draft.totalCents)}
                    </p>
                    <div className="mt-1 space-y-1">
                      {draft.lines.map((line, index) => (
                        <p key={`line-${draft.id}-${index}`} className="text-[11px] text-[#4A4A4A]/75">
                          {line.quantity}x {line.productSku} {line.productName}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card space-y-3">
        <p className="text-sm font-semibold">{t("recent")}</p>

        {groupedDrafts.map((group) => (
          <div
            key={group.key}
            className={`rounded-xl border p-3 ${group.isClosed ? "border-[#B8E3C4] bg-[#ECFAF0]" : "border-[#E5E5E5] bg-white"}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[#4A4A4A]/70">
                  {group.label}
                  {group.routeLabel ? ` - ${group.routeLabel}` : ""}
                </p>
                {group.isClosed ? <p className="text-xs text-[#1E6F2D]">{t("tourClosedBadge")}</p> : null}
              </div>
              <div className="flex items-center gap-2">
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
                    <div className="flex flex-wrap items-center justify-between gap-2">
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
                      <a
                        href={`/api/drafts/day-report?ids=${encodeURIComponent(group.drafts.map((draft) => draft.id).join(","))}`}
                        target="_blank"
                        rel="noreferrer"
                        className="secondary-btn !px-3 !py-1.5 text-xs"
                      >
                        {t("dailyPdf")}
                      </a>
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
