import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ReactNode } from "react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "nord-pack Fahrer App",
  description: "Digitaler Rechnungs-Vordruck fuer nord-pack Fahrer",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icons/icon.svg"],
    apple: [{ url: "/icons/apple-touch-icon.svg", type: "image/svg+xml" }]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "nord-pack"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#F8F9FA"
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${manrope.className} bg-[#F8F9FA] text-[#4A4A4A]`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AppHeader />
          <main className="mx-auto min-h-screen w-full max-w-md px-4 pb-[110px] pt-3">{children}</main>
          <BottomNav />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
