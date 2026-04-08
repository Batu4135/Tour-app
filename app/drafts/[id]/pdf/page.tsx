"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, Printer } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DraftPdfPage() {
  const t = useTranslations("draftPdfViewer");
  const params = useParams<{ id: string }>();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const draftId = Number.parseInt(params.id, 10);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const pdfUrl = useMemo(
    () => (Number.isFinite(draftId) ? `/api/drafts/${draftId}/pdf` : ""),
    [draftId]
  );

  useEffect(() => {
    setIsLoaded(false);
  }, [pdfUrl]);

  function openPdfDirectly() {
    if (!pdfUrl) return;
    const popup = window.open(pdfUrl, "_blank", "noopener,noreferrer");
    if (!popup) {
      window.location.assign(pdfUrl);
    }
  }

  function openPrintMenu() {
    if (!pdfUrl) return;
    setIsPrinting(true);

    try {
      const popup = window.open(pdfUrl, "_blank");
      if (popup) {
        window.setTimeout(() => {
          try {
            popup.focus();
            popup.print();
          } catch {
            // Fallback below.
          } finally {
            setIsPrinting(false);
          }
        }, 700);
        return;
      }
    } catch {
      // Fallback below.
    }

    try {
      const frameWindow = iframeRef.current?.contentWindow;
      if (frameWindow) {
        frameWindow.focus();
        frameWindow.print();
        window.setTimeout(() => setIsPrinting(false), 600);
        return;
      }
    } catch {
      // Fallback below.
    }

    openPdfDirectly();
    window.setTimeout(() => setIsPrinting(false), 600);
  }

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
    <section className="space-y-4 pb-[180px]">
      <div className="card flex items-center justify-between gap-3">
        <Link
          href={`/drafts/${draftId}`}
          className="secondary-btn inline-flex items-center gap-2 !py-2 text-sm"
        >
          <ArrowLeft size={16} />
          {t("backToDraft")}
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            className="primary-btn inline-flex items-center gap-2 !py-2 text-sm disabled:opacity-70"
            onClick={openPrintMenu}
            disabled={isPrinting}
          >
            {isPrinting ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
            {isPrinting ? t("openingPrint") : t("printNow")}
          </button>
        </div>
      </div>

      <div className="card space-y-3">
        {!isLoaded ? <p className="text-sm text-[#4A4A4A]/65">{t("loadingPdf")}</p> : null}
        <iframe
          ref={iframeRef}
          title={t("frameTitle", { id: draftId })}
          src={pdfUrl}
          className="h-[72vh] w-full rounded-xl border border-[#E5E5E5] bg-white"
          onLoad={() => setIsLoaded(true)}
        />
        <p className="text-xs text-[#4A4A4A]/65">{t("printHint")}</p>
      </div>
    </section>
  );
}
