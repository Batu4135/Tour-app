"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Languages, LogOut, Package, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");

  async function setLocale(nextLocale: "de" | "tr") {
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: nextLocale })
    });
    router.refresh();
  }

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  async function onPinSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/auth/pin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin })
    });
    const data = await response.json();
    if (response.ok) {
      setPin("");
      setMessage(t("pinSaved"));
      return;
    }
    setMessage(data.error ?? t("pinError"));
  }

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-sm text-[#4A4A4A]/70">{t("subtitle")}</p>
      </header>

      <div className="card space-y-3">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Languages size={16} />
          {t("language")}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            className={locale === "de" ? "primary-btn" : "secondary-btn"}
            type="button"
            onClick={() => setLocale("de")}
          >
            Deutsch
          </button>
          <button
            className={locale === "tr" ? "primary-btn" : "secondary-btn"}
            type="button"
            onClick={() => setLocale("tr")}
          >
            Türkçe
          </button>
        </div>
      </div>

      <form className="card space-y-3" onSubmit={onPinSubmit}>
        <p className="flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck size={16} />
          {t("pinTitle")}
        </p>
        <input
          className="input"
          placeholder={t("pinPlaceholder")}
          value={pin}
          onChange={(event) => setPin(event.target.value.replace(/[^\d]/g, ""))}
          maxLength={10}
          inputMode="numeric"
        />
        <button className="primary-btn w-full" type="submit">
          {t("savePin")}
        </button>
      </form>

      <div className="card space-y-3">
        <Link href="/products" className="secondary-btn flex items-center justify-center gap-2">
          <Package size={16} />
          {t("products")}
        </Link>
        <button className="secondary-btn flex w-full items-center justify-center gap-2" type="button" onClick={onLogout}>
          <LogOut size={16} />
          {t("logout")}
        </button>
      </div>

      {message ? <p className="text-sm text-[#4A4A4A]">{message}</p> : null}
    </section>
  );
}
