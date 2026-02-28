"use client";

import { useTranslations } from "next-intl";

type SyncState = "ok" | "pending" | "error";

type SyncStatusProps = {
  state: SyncState;
  pendingCount: number;
  onSyncNow: () => void;
  disabled?: boolean;
};

export default function SyncStatus({ state, pendingCount, onSyncNow, disabled = false }: SyncStatusProps) {
  const t = useTranslations("syncStatus");
  const tone =
    state === "ok"
      ? "border-[#E5E5E5] bg-white text-[#4A4A4A]"
      : state === "pending"
        ? "border-[#2F7EA1]/30 bg-[#F8F9FA] text-[#4A4A4A]"
        : "border-[#4A4A4A]/30 bg-[#F8F9FA] text-[#4A4A4A]";

  const dot =
    state === "ok" ? "bg-green-500" : state === "pending" ? "bg-yellow-500" : "bg-red-500";

  const label =
    state === "ok"
      ? t("ok")
      : state === "pending"
        ? t("pending", { count: pendingCount })
        : t("error", { count: pendingCount });

  return (
    <div className={`card flex items-center justify-between gap-3 py-3 ${tone}`}>
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
        <p className="text-sm font-medium">{label}</p>
      </div>
      <button type="button" className="secondary-btn !px-3 !py-2 text-xs" onClick={onSyncNow} disabled={disabled}>
        {t("syncNow")}
      </button>
    </div>
  );
}
