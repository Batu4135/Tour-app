"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LoginForm() {
  const t = useTranslations("login");
  const router = useRouter();

  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? t("invalidPin"));
      }
      router.replace("/drafts");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t("genericError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <div>
        <label htmlFor="pin" className="mb-2 block text-sm font-medium">
          {t("pinLabel")}
        </label>
        <input
          id="pin"
          type="password"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d*"
          maxLength={10}
          className="input text-center text-2xl tracking-[0.35em]"
          placeholder="******"
          value={pin}
          onChange={(event) => setPin(event.target.value.replace(/[^\d]/g, ""))}
        />
      </div>

      {error ? <p className="text-sm text-[#4A4A4A]">{error}</p> : null}

      <button type="submit" className="primary-btn w-full" disabled={loading}>
        {loading ? t("loading") : t("submit")}
      </button>
      <p className="text-center text-xs text-[#4A4A4A]/65">{t("hint")}</p>
    </form>
  );
}
