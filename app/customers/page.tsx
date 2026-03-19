"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ChevronDown, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import CustomerCard from "@/components/CustomerCard";

type Customer = {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  routeDay: string | null;
};

type NewCustomerForm = {
  name: string;
  address: string;
  phone: string;
  routeDay: string;
};

const emptyForm: NewCustomerForm = {
  name: "",
  address: "",
  phone: "",
  routeDay: ""
};

export default function CustomersPage() {
  const t = useTranslations("customers");
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<NewCustomerForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [selectedRouteDay, setSelectedRouteDay] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 260);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    void loadCustomers();
  }, [debouncedQuery]);

  const canSubmit = useMemo(
    () => form.name.trim().length > 1 && form.routeDay.trim().length > 0,
    [form.name, form.routeDay]
  );
  const routeOptions = useMemo(() => {
    const entries = new Map<string, string>();
    for (const customer of customers) {
      const routeDay = customer.routeDay?.trim();
      if (!routeDay) continue;
      const key = routeDay.toLocaleLowerCase("tr-TR");
      if (!entries.has(key)) entries.set(key, routeDay);
    }
    return Array.from(entries.values()).sort((a, b) => a.localeCompare(b, "tr-TR"));
  }, [customers]);
  const filteredCustomers = useMemo(() => {
    if (selectedRouteDay === "all") return customers;
    return customers.filter((customer) => (customer.routeDay?.trim() ?? "") === selectedRouteDay);
  }, [customers, selectedRouteDay]);

  useEffect(() => {
    if (selectedRouteDay === "all") return;
    if (!routeOptions.includes(selectedRouteDay)) {
      setSelectedRouteDay("all");
    }
  }, [routeOptions, selectedRouteDay]);

  async function loadCustomers() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/customers?q=${encodeURIComponent(debouncedQuery)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? t("loadError"));
      setCustomers(data.customers as Customer[]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t("loadError"));
    } finally {
      setLoading(false);
    }
  }

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = (await response.json()) as { customer?: { id: number }; error?: string };
      if (!response.ok) throw new Error(data.error ?? t("createError"));
      if (!data.customer?.id) throw new Error(t("createError"));
      setForm(emptyForm);
      setCreateOpen(false);
      router.push(`/customers/${data.customer.id}?created=1`);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : t("createError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-[#4A4A4A]">{t("title")}</h1>
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
            {t("newCustomer")}
          </p>
          <ChevronDown size={18} className={`transition-transform ${createOpen ? "rotate-180" : ""}`} />
        </button>
        {createOpen ? (
          <form className="space-y-3" onSubmit={onCreate}>
            <input
              className="input"
              placeholder={t("name")}
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
            <input
              className="input"
              placeholder={t("address")}
              value={form.address}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
            />
            <input
              className="input"
              placeholder={t("phone")}
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            />
            <input
              className="input"
              placeholder={t("routeDay")}
              value={form.routeDay}
              onChange={(event) => setForm((prev) => ({ ...prev, routeDay: event.target.value }))}
              required
            />
            <button type="submit" className="primary-btn w-full" disabled={!canSubmit || saving}>
              {saving ? t("saving") : t("save")}
            </button>
          </form>
        ) : (
          <p className="text-xs text-[#4A4A4A]/65">{t("newCustomerHint")}</p>
        )}
      </div>

      <div className="card space-y-3">
        <div className="relative">
          <Search className="search-icon" size={16} />
          <input
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
          />
        </div>
        {query ? (
          <div className="rounded-xl border border-[#E5E5E5] bg-[#F8F9FA] px-3 py-2 text-xs text-[#4A4A4A]/70">
            {t("autocompleteHint")}
          </div>
        ) : null}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#4A4A4A]/70">{t("routeFilterTitle")}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={selectedRouteDay === "all" ? "primary-btn !w-auto !px-3 !py-2" : "secondary-btn !w-auto !px-3 !py-2"}
              onClick={() => setSelectedRouteDay("all")}
            >
              {t("allRoutes")}
            </button>
            {routeOptions.map((routeDay) => (
              <button
                key={routeDay}
                type="button"
                className={
                  selectedRouteDay === routeDay
                    ? "primary-btn !w-auto !px-3 !py-2"
                    : "secondary-btn !w-auto !px-3 !py-2"
                }
                onClick={() => setSelectedRouteDay(routeDay)}
              >
                {routeDay}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error ? <p className="text-sm text-[#4A4A4A]">{error}</p> : null}

      <div className="space-y-3 pb-2">
        {loading ? <p className="text-sm text-[#4A4A4A]/65">{t("loading")}</p> : null}
        {!loading && filteredCustomers.length === 0 ? <p className="text-sm text-[#4A4A4A]/65">{t("empty")}</p> : null}
        {filteredCustomers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </div>
    </section>
  );
}
