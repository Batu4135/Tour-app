"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

type CreateDraftResponse = {
  draft?: {
    id: number;
  };
  error?: string;
};

export default function NewDraftPage() {
  const t = useTranslations("draftEditor");
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = Number.parseInt(searchParams.get("customerId") ?? "", 10);
  const [error, setError] = useState("");
  const startedRef = useRef(false);

  useEffect(() => {
    if (!Number.isFinite(customerId) || startedRef.current) return;
    startedRef.current = true;

    const controller = new AbortController();

    const run = async () => {
      try {
        const response = await fetch("/api/drafts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId }),
          signal: controller.signal
        });
        const payload = (await response.json()) as CreateDraftResponse;
        if (!response.ok || !payload.draft?.id) {
          throw new Error(payload.error ?? t("initError"));
        }
        router.replace(`/drafts/${payload.draft.id}`);
      } catch (createError) {
        if (!controller.signal.aborted) {
          setError(createError instanceof Error ? createError.message : t("initError"));
        }
      }
    };

    void run();
    return () => controller.abort();
  }, [customerId, router, t]);

  if (!Number.isFinite(customerId)) {
    return (
      <section className="space-y-4">
        <p className="card text-sm">{t("missingCustomer")}</p>
        <button className="primary-btn w-full" onClick={() => router.push("/drafts")}>
          {t("backToDrafts")}
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <p className="card text-sm text-[#4A4A4A]/70">{t("loading")}</p>
      {error ? <p className="text-sm">{error}</p> : null}
    </section>
  );
}
