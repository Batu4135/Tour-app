"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, Minus, Plus, Printer } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DraftPdfPage() {
  const t = useTranslations("draftPdfViewer");
  const params = useParams<{ id: string }>();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const draftId = Number.parseInt(params.id, 10);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const pdfUrl = useMemo(
    () => (Number.isFinite(draftId) ? `/api/drafts/${draftId}/pdf?mode=print` : ""),
    [draftId]
  );
  const previewUrl = useMemo(
    () => (Number.isFinite(draftId) ? `/api/drafts/${draftId}/pdf?mode=preview#page=1&view=Fit` : ""),
    [draftId]
  );

  useEffect(() => {
    setIsLoaded(false);
  }, [previewUrl]);

  useEffect(() => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    const previousViewportContent = viewportMeta?.getAttribute("content") ?? null;

    if (viewportMeta) {
      viewportMeta.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no");
    }

    const preventGesture = (event: Event) => {
      event.preventDefault();
    };

    const preventCtrlWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    };

    document.addEventListener("gesturestart", preventGesture, { passive: false });
    document.addEventListener("gesturechange", preventGesture, { passive: false });
    document.addEventListener("gestureend", preventGesture, { passive: false });
    document.addEventListener("wheel", preventCtrlWheel, { passive: false });

    return () => {
      if (viewportMeta) {
        if (previousViewportContent) {
          viewportMeta.setAttribute("content", previousViewportContent);
        } else {
          viewportMeta.removeAttribute("content");
        }
      }

      document.removeEventListener("gesturestart", preventGesture);
      document.removeEventListener("gesturechange", preventGesture);
      document.removeEventListener("gestureend", preventGesture);
      document.removeEventListener("wheel", preventCtrlWheel);
    };
  }, []);

  function zoomOut() {
    setPreviewScale((prev) => Math.max(1, Math.round((prev - 0.2) * 100) / 100));
  }

  function zoomIn() {
    setPreviewScale((prev) => Math.min(2.4, Math.round((prev + 0.2) * 100) / 100));
  }

  function openPdfDirectly() {
    if (!pdfUrl) return;
    const popup = window.open(pdfUrl, "_blank", "noopener,noreferrer");
    if (!popup) {
      window.location.assign(pdfUrl);
    }
  }

  async function openPrintMenu() {
    if (!pdfUrl) return;
    setIsPrinting(true);

    try {
      const response = await fetch(pdfUrl, {
        cache: "no-store"
      });
      if (!response.ok) {
        throw new Error("PDF could not be loaded");
      }

      const pdfBlob = await response.blob();
      const pdfFile = new File([pdfBlob], `vordruck-${draftId}.pdf`, {
        type: "application/pdf"
      });

      if (
        typeof navigator !== "undefined" &&
        "share" in navigator &&
        "canShare" in navigator &&
        navigator.canShare({ files: [pdfFile] })
      ) {
        try {
          await navigator.share({
            files: [pdfFile],
            title: `Vordruck ${draftId}`
          });
        } catch {
          // iOS returns here when the share/print sheet is dismissed.
          // Do not open the full PDF as fallback in that case.
        }
        setIsPrinting(false);
        return;
      }
    } catch {
      // Fallback below.
    }

    openPdfDirectly();
    setIsPrinting(false);
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
    <section className="mx-auto w-full max-w-[1180px] space-y-4 pb-[180px]">
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
        <div className="mx-auto w-full max-w-none sm:max-w-[980px]">
          <div className="relative aspect-[210/297] w-full overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-[0_18px_45px_rgba(31,41,55,0.08)]">
            <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
              <button
                type="button"
                className="secondary-btn !w-auto !px-2.5 !py-2 text-sm disabled:opacity-50"
                onClick={zoomOut}
                disabled={previewScale <= 1}
                aria-label="Vorschau verkleinern"
                title="Vorschau verkleinern"
              >
                <Minus size={14} />
              </button>
              <button
                type="button"
                className="secondary-btn !w-auto !px-2.5 !py-2 text-sm disabled:opacity-50"
                onClick={zoomIn}
                disabled={previewScale >= 2.4}
                aria-label="Vorschau vergroessern"
                title="Vorschau vergroessern"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="absolute inset-0 overflow-auto overscroll-contain">
              <div
                className="origin-top-left"
                style={{
                  width: `${previewScale * 100}%`,
                  height: `${previewScale * 100}%`,
                  minWidth: "100%",
                  minHeight: "100%"
                }}
              >
                <iframe
                  ref={iframeRef}
                  title={t("frameTitle", { id: draftId })}
                  src={previewUrl}
                  className="h-full w-full bg-white"
                  onLoad={() => setIsLoaded(true)}
                />
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-[#4A4A4A]/65">{t("printHint")}</p>
      </div>
    </section>
  );
}
