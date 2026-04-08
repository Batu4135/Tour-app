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
  const [pdfVersion, setPdfVersion] = useState<number>(() => Date.now());
  const [prepareError, setPrepareError] = useState("");
  const printStateKey = `nord-pack:print:${draftId}`;
  const pdfUrl = useMemo(() => {
    if (!Number.isFinite(draftId)) return "";
    return `/api/drafts/${draftId}/pdf?v=${pdfVersion}`;
  }, [draftId, pdfVersion]);

  useEffect(() => {
    setIsLoaded(false);
  }, [pdfUrl]);

  useEffect(() => {
    if (!Number.isFinite(draftId) || typeof window === "undefined") return;

    let isActive = true;

    const applyState = () => {
      const raw = window.sessionStorage.getItem(printStateKey);
      if (!raw) {
        setPrepareError("");
        return true;
      }

      try {
        const parsed = JSON.parse(raw) as { status?: string; updatedAt?: number; message?: string };
        if (parsed.status === "pending") {
          setPrepareError("");
          return false;
        }
        if (parsed.status === "error") {
          setPrepareError(parsed.message ?? t("preparingError"));
          window.sessionStorage.removeItem(printStateKey);
          return true;
        }

        setPrepareError("");
        setPdfVersion(parsed.updatedAt ?? Date.now());
        window.sessionStorage.removeItem(printStateKey);
        return true;
      } catch {
        setPrepareError("");
        window.sessionStorage.removeItem(printStateKey);
        return true;
      }
    };

    if (applyState()) return;

    const interval = window.setInterval(() => {
      if (!isActive) return;
      if (applyState()) {
        window.clearInterval(interval);
      }
    }, 120);

    const timeout = window.setTimeout(() => {
      if (!isActive) return;
      window.sessionStorage.removeItem(printStateKey);
      window.clearInterval(interval);
    }, 4000);

    return () => {
      isActive = false;
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [draftId, printStateKey, t]);

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
        {prepareError ? <p className="text-sm text-[#C62828]">{prepareError}</p> : null}
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
