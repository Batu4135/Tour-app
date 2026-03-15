"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function AppHeader() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  if (pathname === "/login") return null;

  return (
    <header className="mx-auto w-full max-w-md px-4 pt-3">
      <Link
        href="/drafts"
        className="flex items-center gap-3 rounded-2xl border border-[#E5E5E5] bg-white/95 px-3 py-2 shadow-sm backdrop-blur"
      >
        <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-[#E5E5E5] bg-white">
          <Image src="/brand/nord-pack-logo.png" alt="Nord-Pack Logo" fill sizes="40px" className="object-contain p-1" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#2F7EA1]">Nord-Pack</p>
          <p className="truncate text-xs text-[#4A4A4A]/70">{t("drafts")}</p>
        </div>
      </Link>
    </header>
  );
}
