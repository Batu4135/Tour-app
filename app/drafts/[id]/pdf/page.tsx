"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import PdfViewerFrame from "@/components/PdfViewerFrame";

type DraftMeta = {
  customerName: string;
  date: string;
};

type DraftResponse = {
  draft?: DraftMeta;
  error?: string;
};

export default function DraftPdfViewerPage() {
  const t = useTranslations("draftPdfViewer");
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const draftId = Number.parseInt(params.id, 10);
  const [meta, setMeta] = useState<DraftMeta | null>(null);

  useEffect(() => {
    if (!Number.isFinite(draftId)) return;
    const controller = new AbortController();

    const run = async () => {
      try {
        const response = await fetch(`/api/drafts/${draftId}`, {
          signal: controller.signal
        });
        const payload = (await response.json()) as DraftResponse;
        if (response.ok && payload.draft) {
          setMeta(payload.draft);
        }
      } catch {
        // Meta ist optional; Viewer funktioniert auch ohne.
      }
    };

    void run();
    return () => controller.abort();
  }, [draftId]);

  if (!Number.isFinite(draftId)) {
    return (
      <section className="space-y-4">
        <p className="card text-sm">{t("invalidDraft")}</p>
        <Link href="/drafts" className="primary-btn block w-full text-center">
          {t("backToDrafts")}
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4 pb-[120px]">
      <header className="card space-y-2">
        <button type="button" className="secondary-btn inline-flex items-center gap-2 !py-2 text-sm" onClick={() => router.push(`/drafts/${draftId}`)}>
          <ArrowLeft size={16} />
          {t("backToDraft")}
        </button>
        <h1 className="text-lg font-semibold">{t("title")}</h1>
        {meta ? (
          <p className="text-sm text-[#4A4A4A]/70">
            {meta.customerName} - {new Date(meta.date).toLocaleDateString("de-DE")}
          </p>
        ) : null}
      </header>

      <PdfViewerFrame draftId={draftId} />
    </section>
  );
}
