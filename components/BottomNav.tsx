"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Settings, Users } from "lucide-react";
import { useTranslations } from "next-intl";

const items = [
  { href: "/customers", icon: Users, key: "customers" },
  { href: "/drafts", icon: FileText, key: "drafts" },
  { href: "/settings", icon: Settings, key: "settings" }
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  if (pathname === "/login") return null;

  return (
    <nav
      className="relative mx-auto w-full max-w-md rounded-t-2xl border-t border-[#E5E5E5] bg-white shadow-nav md:max-w-[920px]"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 10px)" }}
      aria-label="Bottom Navigation"
    >
      <ul className="grid h-[75px] grid-cols-3">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="touch-target flex h-full w-full flex-col items-center justify-center gap-1 transition-all"
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? "text-[#2F7EA1]" : "text-[#4A4A4A]/60"}
                />
                <span className={isActive ? "text-xs font-semibold text-[#2F7EA1]" : "text-xs text-[#4A4A4A]/60"}>
                  {t(item.key)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
