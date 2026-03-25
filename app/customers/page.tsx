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

type CustomerDirectorySuggestion = {
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
  const [routeSuggestions, setRouteSuggestions] = useState<string[]>([]);
  const [directorySuggestions, setDirectorySuggestions] = useState<CustomerDirectorySuggestion[]>([]);
  const [routeLoading, setRouteLoading] = useState(false);
  const [directoryLoading, setDirectoryLoading] = useState(false);

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
  const suggestedRouteDays = useMemo(() => {
    const suggestions = [...routeSuggestions];
    const currentRouteDay = form.routeDay.trim();
    if (currentRouteDay && !suggestions.some((entry) => entry.toLocaleLowerCase("tr-TR") === currentRouteDay.toLocaleLowerCase("tr-TR"))) {
      suggestions.unshift(currentRouteDay);
    }
    return suggestions;
  }, [form.routeDay, routeSuggestions]);
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

  useEffect(() => {
    if (!createOpen) {
      setRouteSuggestions([]);
      return;
    }

    const routeQuery = form.routeDay.trim();
    if (!routeQuery) {
      setRouteSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setRouteLoading(true);
      try {
        const response = await fetch(`/api/customer-directory?mode=routes&q=${encodeURIComponent(routeQuery)}`, {
          signal: controller.signal
        });
        const payload = (await response.json()) as { routeDays?: string[] };
        if (!response.ok) throw new Error(t("loadError"));
        setRouteSuggestions(payload.routeDays ?? []);
      } catch (routeError) {
        if ((routeError as Error).name !== "AbortError") {
          setRouteSuggestions([]);
        }
      } finally {
        setRouteLoading(false);
      }
    }, 180);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [createOpen, form.routeDay, t]);

  useEffect(() => {
    if (!createOpen) {
      setDirectorySuggestions([]);
      return;
    }

    const routeDay = form.routeDay.trim();
    const nameQuery = form.name.trim();
    if (!routeDay || nameQuery.length < 1) {
      setDirectorySuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setDirectoryLoading(true);
      try {
        const response = await fetch(
          `/api/customer-directory?routeDay=${encodeURIComponent(routeDay)}&q=${encodeURIComponent(nameQuery)}`,
          { signal: controller.signal }
        );
        const payload = (await response.json()) as { customers?: CustomerDirectorySuggestion[] };
        if (!response.ok) throw new Error(t("loadError"));
        setDirectorySuggestions(payload.customers ?? []);
      } catch (suggestionError) {
        if ((suggestionError as Error).name !== "AbortError") {
          setDirectorySuggestions([]);
        }
      } finally {
        setDirectoryLoading(false);
      }
    }, 180);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [createOpen, form.name, form.routeDay, t]);

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

  function applyDirectorySuggestion(suggestion: CustomerDirectorySuggestion) {
    setForm((prev) => ({
      ...prev,
      routeDay: suggestion.routeDay ?? prev.routeDay,
      name: suggestion.name,
      address: suggestion.address ?? "",
      phone: suggestion.phone ?? ""
    }));
    setDirectorySuggestions([]);
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
              placeholder={t("routeDayPlaceholder")}
              value={form.routeDay}
              onChange={(event) => setForm((prev) => ({ ...prev, routeDay: event.target.value }))}
              list="customer-route-day-options"
              autoFocus
              autoComplete="off"
              required
            />
            <datalist id="customer-route-day-options">
              {suggestedRouteDays.map((routeDay) => (
                <option key={routeDay} value={routeDay} />
              ))}
            </datalist>
            {routeOptions.length > 0 ? (
              <p className="rounded-xl border border-[#E5E5E5] bg-[#F8F9FA] px-3 py-2 text-xs text-[#4A4A4A]/70">
                {t("routeDayHint")}
              </p>
            ) : null}
            {form.routeDay.trim() ? (
              <div className="space-y-2 rounded-xl border border-[#E5E5E5] bg-[#F8F9FA] px-3 py-2">
                <p className="text-xs font-semibold text-[#4A4A4A]/70">{t("routeSuggestionsTitle")}</p>
                {routeLoading ? <p className="text-xs text-[#4A4A4A]/60">{t("loading")}</p> : null}
                {!routeLoading && suggestedRouteDays.length === 0 ? (
                  <p className="text-xs text-[#4A4A4A]/60">{t("noRouteSuggestions")}</p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {suggestedRouteDays.map((routeDay) => (
                    <button
                      key={routeDay}
                      type="button"
                      className="secondary-btn !w-auto !px-3 !py-2 text-sm"
                      onClick={() => setForm((prev) => ({ ...prev, routeDay }))}
                    >
                      {routeDay}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <input
              className="input"
              placeholder={t("name")}
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
            {form.routeDay.trim() && form.name.trim() ? (
              <div className="space-y-2 rounded-xl border border-[#E5E5E5] bg-[#F8F9FA] px-3 py-2">
                <p className="text-xs font-semibold text-[#4A4A4A]/70">{t("customerSuggestionsTitle")}</p>
                {directoryLoading ? <p className="text-xs text-[#4A4A4A]/60">{t("loading")}</p> : null}
                {!directoryLoading && directorySuggestions.length === 0 ? (
                  <p className="text-xs text-[#4A4A4A]/60">{t("noCustomerSuggestions")}</p>
                ) : null}
                <div className="space-y-2">
                  {directorySuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      className="secondary-btn w-full !py-2 text-left"
                      onClick={() => applyDirectorySuggestion(suggestion)}
                    >
                      <p className="text-sm font-semibold">{suggestion.name}</p>
                      {suggestion.phone ? <p className="text-xs text-[#4A4A4A]/70">{suggestion.phone}</p> : null}
                      {suggestion.address ? <p className="text-xs text-[#4A4A4A]/70">{suggestion.address}</p> : null}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
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
