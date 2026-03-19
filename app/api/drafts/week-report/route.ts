import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { badRequest, unauthorized } from "@/lib/http";
import { createDraftVoucherFonts, drawDraftVoucherPage } from "@/lib/pdf/draftVoucher";

export const runtime = "nodejs";

function parseIds(raw: string | null): number[] {
  if (!raw) return [];
  return Array.from(
    new Set(
      raw
        .split(",")
        .map((value) => Number.parseInt(value.trim(), 10))
        .filter((value) => Number.isFinite(value) && value > 0)
    )
  );
}

function parseWeekStart(raw: string | null): Date {
  if (!raw) {
    const now = new Date();
    const day = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - day);
    return monday;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) throw new Error("Ungueltiger Wochenstart.");
  const start = new Date(`${raw}T00:00:00.000Z`);
  if (!Number.isFinite(start.getTime())) throw new Error("Ungueltiger Wochenstart.");
  return start;
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(value);
}

function resolveRouteLabel(raw: string | null | undefined): string {
  const value = (raw ?? "").trim();
  return value || "Ohne Tour-Tag";
}

function minDate(dates: Date[]): Date {
  return dates.reduce((min, value) => (value.getTime() < min.getTime() ? value : min), dates[0]);
}

function maxDate(dates: Date[]): Date {
  return dates.reduce((max, value) => (value.getTime() > max.getTime() ? value : max), dates[0]);
}

export async function GET(request: Request) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const url = new URL(request.url);
  const ids = parseIds(url.searchParams.get("ids"));

  let weekStart: Date;
  try {
    weekStart = parseWeekStart(url.searchParams.get("start"));
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Ungueltiger Wochenstart.");
  }

  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);

  const drafts = await prisma.draft.findMany({
    where: ids.length > 0 ? { id: { in: ids } } : { date: { gte: weekStart, lt: weekEnd } },
    orderBy: [{ date: "asc" }, { id: "asc" }],
    include: {
      customer: { select: { name: true, routeDay: true } },
      lines: {
        orderBy: { id: "asc" },
        include: {
          product: { select: { name: true, sku: true, licenseFeeCents: true, licenseType: true, licenseWeightGrams: true } }
        }
      }
    }
  });

  if (drafts.length === 0) return badRequest("Keine Vordrucke gefunden.");

  const draftDates = drafts.map((draft) => new Date(draft.date));
  const rangeFrom = ids.length > 0 ? minDate(draftDates) : weekStart;
  const rangeTo = ids.length > 0 ? maxDate(draftDates) : new Date(weekEnd.getTime() - 86400000);
  const rangeSubtitle = `vom ${formatDate(rangeFrom)} bis ${formatDate(rangeTo)}`;

  const sorted = [...drafts].sort((a, b) => {
    const routeA = resolveRouteLabel(a.customer.routeDay);
    const routeB = resolveRouteLabel(b.customer.routeDay);
    const routeCmp = routeA.localeCompare(routeB, "de-DE");
    if (routeCmp !== 0) return routeCmp;
    const dateCmp = a.date.getTime() - b.date.getTime();
    if (dateCmp !== 0) return dateCmp;
    return a.id - b.id;
  });

  const pdf = await PDFDocument.create();
  const fonts = await createDraftVoucherFonts(pdf);

  for (const draft of sorted) {
    const routeLabel = resolveRouteLabel(draft.customer.routeDay);
    drawDraftVoucherPage(pdf, fonts, draft, {
      headerTitle: routeLabel,
      headerSubtitle: rangeSubtitle,
      headerTitleSize: 14,
      showSku: true
    });
  }

  const bytes = await pdf.save();
  return new NextResponse(bytes as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="wochenuebersicht-vordrucke.pdf"`
    }
  });
}
