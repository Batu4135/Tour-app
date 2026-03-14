"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Search, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

type Customer = {
  id: number;
  name: string;
  address: string | null;
};

type Draft = {
  id: number;
  customerId: number;
  customerName: string;
  date: string;
  totalCents: number;
};

function centsToText(cents: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
  }).format(cents / 100);
}

export default function DraftsPage() {
  const t = useTranslations("drafts");
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [recentDrafts, setRecentDrafts] = useState<Draft[]>([]);
  const [debounced, setDebounced] = useState("");
  const [error, setError] = useState("");

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
  const groupedDrafts = useMemo(() => {
    const groups = new Map<string, Draft[]>();
    for (const draft of recentDrafts) {
      const date = new Date(draft.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`;
      const list = groups.get(key) ?? [];
      list.push(draft);
      groups.set(key, list);
    }
    return Array.from(groups.entries()).map(([key, drafts]) => ({
      key,
      label: new Date(`${key}T12:00:00.000Z`).toLocaleDateString("de-DE"),
      drafts
    }));
  }, [recentDrafts]);

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
        {groupedDrafts.map((group) => (
          <div key={group.key} className="space-y-2">
            <p className="text-xs font-semibold text-[#4A4A4A]/70">{group.label}</p>
            {group.drafts.map((draft) => (
              <div key={draft.id} className="rounded-xl border border-[#E5E5E5] bg-white px-3 py-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{draft.customerName}</p>
                    <p className="text-xs text-[#4A4A4A]/65">{centsToText(draft.totalCents)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/drafts/${draft.id}`}
                      className="secondary-btn !p-2"
                      aria-label={t("editAria")}
                    >
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
        ))}
        {recentDrafts.length === 0 ? <p className="text-sm text-[#4A4A4A]/60">{t("noDrafts")}</p> : null}
        {error ? <p className="text-sm text-[#4A4A4A]">{error}</p> : null}
      </div>
    </section>
  );
}
