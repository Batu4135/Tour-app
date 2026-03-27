"use client";

import { FormEvent, KeyboardEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
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
  const [routeCatalog, setRouteCatalog] = useState<string[]>([]);
  const [directorySuggestions, setDirectorySuggestions] = useState<CustomerDirectorySuggestion[]>([]);
  const [directoryLoading, setDirectoryLoading] = useState(false);
  const [directorySelectionLocked, setDirectorySelectionLocked] = useState(false);
  const [nameFieldFocused, setNameFieldFocused] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeFieldFocused, setRouteFieldFocused] = useState(false);
  const selectingDirectorySuggestionRef = useRef(false);
  const routeInputRef = useRef<HTMLInputElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);

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
  const routeSuggestions = useMemo(() => {
    const typed = form.routeDay.trim().toLocaleLowerCase("tr-TR");
    if (!typed) return [];
    return routeCatalog
      .filter((entry) => entry.toLocaleLowerCase("tr-TR").startsWith(typed))
      .sort((a, b) => a.localeCompare(b, "tr-TR"))
      .slice(0, 6);
  }, [form.routeDay, routeCatalog]);
  const inlineRouteSuggestion = useMemo(() => {
    const typed = form.routeDay;
    if (!typed.trim()) return "";
    const normalizedTyped = typed.toLocaleLowerCase("tr-TR");
    const bestMatch = routeSuggestions.find((entry) => entry.toLocaleLowerCase("tr-TR").startsWith(normalizedTyped));
    if (!bestMatch) return "";
    if (bestMatch.toLocaleLowerCase("tr-TR") === normalizedTyped) return "";
    return bestMatch.slice(typed.length);
  }, [form.routeDay, routeSuggestions]);
  const topRouteSuggestion = useMemo(() => {
    const bestMatch = routeSuggestions[0] ?? "";
    if (!bestMatch) return "";
    if (bestMatch.toLocaleLowerCase("tr-TR") === form.routeDay.trim().toLocaleLowerCase("tr-TR")) return "";
    return bestMatch;
  }, [form.routeDay, routeSuggestions]);
  const hasUniqueRouteSuggestion = useMemo(() => {
    const typed = form.routeDay.trim().toLocaleLowerCase("tr-TR");
    if (!typed) return false;
    const matches = routeSuggestions.filter((entry) => entry.toLocaleLowerCase("tr-TR").startsWith(typed));
    return matches.length === 1;
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
      setRouteCatalog([]);
      return;
    }

    const controller = new AbortController();
    const run = async () => {
      setRouteLoading(true);
      try {
        const response = await fetch(`/api/customer-directory?mode=routes`, {
          signal: controller.signal
        });
        const payload = (await response.json()) as { routeDays?: string[] };
        if (!response.ok) throw new Error(t("loadError"));
        setRouteCatalog(payload.routeDays ?? []);
      } catch (suggestionError) {
        if ((suggestionError as Error).name !== "AbortError") {
          setRouteCatalog([]);
        }
      } finally {
        setRouteLoading(false);
      }
    };

    void run();

    return () => {
      controller.abort();
    };
  }, [createOpen, t]);

  useEffect(() => {
    if (!createOpen) {
      setDirectorySuggestions([]);
      setDirectorySelectionLocked(false);
      setNameFieldFocused(false);
      return;
    }

    const routeDay = form.routeDay.trim();
    const nameQuery = form.name.trim();
    if (!routeDay || nameQuery.length < 1 || directorySelectionLocked || !nameFieldFocused) {
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
  }, [createOpen, directorySelectionLocked, form.name, form.routeDay, nameFieldFocused, t]);

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
      setDirectorySelectionLocked(false);
      setNameFieldFocused(false);
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
    setDirectorySelectionLocked(true);
    setNameFieldFocused(false);
    setDirectorySuggestions([]);
  }

  function onDirectorySuggestionPointerDown(
    event: PointerEvent<HTMLButtonElement>,
    suggestion: CustomerDirectorySuggestion
  ) {
    event.preventDefault();
    selectingDirectorySuggestionRef.current = true;
    applyDirectorySuggestion(suggestion);
  }

  function applyRouteSuggestion() {
    if (!topRouteSuggestion) return;
    setForm((prev) => ({ ...prev, routeDay: topRouteSuggestion }));
  }

  function onRouteDayKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Tab" || event.key === "ArrowRight") {
      if (!topRouteSuggestion) return;
      event.preventDefault();
      applyRouteSuggestion();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (topRouteSuggestion) {
        applyRouteSuggestion();
      }
      nameInputRef.current?.focus();
    }
  }

  function onNameKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addressInputRef.current?.focus();
  }

  function onAddressKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    phoneInputRef.current?.focus();
  }

  function onPhoneKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    phoneInputRef.current?.blur();
  }

  function onRouteDayBlur() {
    setRouteFieldFocused(false);
    if (!hasUniqueRouteSuggestion || !topRouteSuggestion) return;
    setForm((prev) => {
      if (prev.routeDay.trim().toLocaleLowerCase("tr-TR") === topRouteSuggestion.toLocaleLowerCase("tr-TR")) {
        return prev;
      }
      return {
        ...prev,
        routeDay: topRouteSuggestion
      };
    });
  }

  function onNameFieldBlur() {
    if (selectingDirectorySuggestionRef.current) {
      selectingDirectorySuggestionRef.current = false;
      return;
    }
    setNameFieldFocused(false);
  }

  function onNameFieldFocus() {
    if (directorySelectionLocked) {
      setForm((prev) => ({
        ...prev,
        name: "",
        address: "",
        phone: ""
      }));
      setDirectorySelectionLocked(false);
      setDirectorySuggestions([]);
    }
    setNameFieldFocused(true);
  }

  const showInlineRouteSuggestion = routeFieldFocused && Boolean(inlineRouteSuggestion);

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
            <div className="relative">
              {showInlineRouteSuggestion ? (
                <div className="pointer-events-none absolute inset-0 z-[2] flex items-center overflow-hidden rounded-xl px-4 py-3">
                  <span className="invisible whitespace-pre text-[#4A4A4A]">{form.routeDay}</span>
                  <span className="truncate whitespace-nowrap font-medium text-[#0A84FF]">{inlineRouteSuggestion}</span>
                </div>
              ) : null}
              <input
                ref={routeInputRef}
                className="input relative z-[1] bg-white text-[#4A4A4A]"
                placeholder={t("routeDayPlaceholder")}
                inputMode="search"
                enterKeyHint="next"
                value={form.routeDay}
                onChange={(event) => {
                  setDirectorySelectionLocked(false);
                  setForm((prev) => ({ ...prev, routeDay: event.target.value }));
                }}
                onKeyDown={onRouteDayKeyDown}
                onFocus={() => setRouteFieldFocused(true)}
                onBlur={onRouteDayBlur}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                required
              />
            </div>
            {routeFieldFocused && form.routeDay.trim().length >= 1 && routeLoading && routeSuggestions.length === 0 ? (
              <p className="px-1 text-xs text-[#4A4A4A]/55">{t("loading")}</p>
            ) : null}
            <input
              ref={nameInputRef}
              className="input"
              placeholder={t("name")}
              enterKeyHint="next"
              value={form.name}
              onChange={(event) => {
                setDirectorySelectionLocked(false);
                setForm((prev) => ({ ...prev, name: event.target.value }));
              }}
              onKeyDown={onNameKeyDown}
              onFocus={onNameFieldFocus}
              onBlur={onNameFieldBlur}
            />
            {nameFieldFocused && form.routeDay.trim() && form.name.trim().length >= 2 && !directorySelectionLocked ? (
              <div className="space-y-1">
                {directoryLoading ? <p className="px-1 text-xs text-[#4A4A4A]/60">{t("loading")}</p> : null}
                {!directoryLoading && directorySuggestions.length > 0 ? (
                  <div className="space-y-2 rounded-xl border border-[#E5E5E5] bg-white p-2">
                    {directorySuggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        className="w-full rounded-xl border border-[#E5E5E5] bg-[#FCFCFC] px-3 py-2 text-left transition-colors active:bg-[#F4F7F8]"
                        onPointerDown={(event) => onDirectorySuggestionPointerDown(event, suggestion)}
                        onClick={() => applyDirectorySuggestion(suggestion)}
                      >
                        <p className="text-sm font-semibold text-[#4A4A4A]">{suggestion.name}</p>
                        {suggestion.phone ? <p className="text-xs text-[#4A4A4A]/70">{suggestion.phone}</p> : null}
                        {suggestion.address ? <p className="text-xs text-[#4A4A4A]/70">{suggestion.address}</p> : null}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
            <input
              ref={addressInputRef}
              className="input"
              placeholder={t("address")}
              enterKeyHint="next"
              value={form.address}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              onKeyDown={onAddressKeyDown}
            />
            <input
              ref={phoneInputRef}
              className="input"
              placeholder={t("phone")}
              enterKeyHint="done"
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              onKeyDown={onPhoneKeyDown}
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
