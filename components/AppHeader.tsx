"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppHeader() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <header className="mx-auto w-full max-w-md pt-3 md:max-w-[920px]">
      <div className="flex justify-center">
        <Link href="/drafts" className="inline-flex items-center justify-center" aria-label="Fatura">
          <Image
            src="/brand/nord-pack-logo.png"
            alt="Nord-Pack Logo"
            width={112}
            height={112}
            className="h-20 w-auto object-contain"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
