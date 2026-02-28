"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";

type ToastTone = "success" | "error" | "info";

type ToastProps = {
  message: string;
  tone?: ToastTone;
  visible: boolean;
};

export default function Toast({ message, tone = "info", visible }: ToastProps) {
  if (!visible) return null;

  const toneClasses =
    tone === "success"
      ? "border-green-200 bg-green-50 text-green-800"
      : tone === "error"
        ? "border-red-200 bg-red-50 text-red-800"
        : "border-[#2F7EA1]/30 bg-[#F8F9FA] text-[#2F7EA1]";

  return (
    <div className={`rounded-xl border px-3 py-2 text-sm shadow-sm ${toneClasses}`} role="status" aria-live="polite">
      <div className="flex items-center gap-2">
        {tone === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
        <span>{message}</span>
      </div>
    </div>
  );
}
