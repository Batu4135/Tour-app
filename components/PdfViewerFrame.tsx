"use client";

import { useMemo, useState } from "react";

type PdfViewerFrameProps = {
  draftId: number;
};

export default function PdfViewerFrame({ draftId }: PdfViewerFrameProps) {
  const [loaded, setLoaded] = useState(false);
  const pdfUrl = useMemo(() => `/api/drafts/${draftId}/pdf`, [draftId]);

  function openPdfInNewTab() {
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="card space-y-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" className="secondary-btn !py-2 text-sm" onClick={openPdfInNewTab}>
          PDF in neuem Tab
        </button>
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="secondary-btn !py-2 text-sm">
          PDF herunterladen
        </a>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E5E5E5] bg-white">
        <iframe
          title={`PDF Vordruck ${draftId}`}
          src={pdfUrl}
          className="h-[65vh] w-full"
          onLoad={() => setLoaded(true)}
        />
      </div>

      {!loaded ? (
        <p className="text-xs text-[#4A4A4A]/65">
          Wenn die Vorschau nicht erscheint, nutze bitte &quot;PDF in neuem Tab&quot;.
        </p>
      ) : null}
    </div>
  );
}
