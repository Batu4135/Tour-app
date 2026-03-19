import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { badRequest, unauthorized } from "@/lib/http";

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

function formatMoney(cents: number): string {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(cents / 100);
}

function paymentLabel(value: string): string {
  if (value === "BANK") return "Bank";
  if (value === "DIRECT_DEBIT") return "Lastschrift";
  return "Bar";
}

function resolveRouteLabel(raw: string | null | undefined): string {
  const value = (raw ?? "").trim();
  return value || "Ohne Tour-Tag";
}

function calculateDraftTotalCents(draft: any): number {
  const subtotal = draft.lines.reduce((sum: number, line: any) => {
    const license = draft.includeLicenseFee ? line.product.licenseFeeCents ?? 0 : 0;
    return sum + line.quantity * (line.unitPriceCents + license);
  }, 0);
  const vat = Math.round(subtotal * 0.19);
  return subtotal + vat;
}

function estimateDraftHeight(draft: any): number {
  const lineHeight = draft.includeLicenseFee ? 20 : 13;
  const linesHeight = draft.lines.length > 0 ? draft.lines.length * lineHeight : 13;
  const noteHeight = draft.note ? 12 : 0;
  return 32 + linesHeight + noteHeight + 8;
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
        include: { product: { select: { name: true, sku: true, licenseFeeCents: true } } }
      }
    }
  });

  if (drafts.length === 0) return badRequest("Keine Vordrucke gefunden.");

  const byRoute = new Map<string, any[]>();
  for (const draft of drafts) {
    const key = resolveRouteLabel(draft.customer.routeDay);
    const list = byRoute.get(key) ?? [];
    list.push(draft);
    byRoute.set(key, list);
  }

  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595;
  const pageHeight = 842;
  const left = 42;
  const right = pageWidth - 42;

  const routeGroups = [...byRoute.entries()].sort((a, b) => a[0].localeCompare(b[0], "de-DE"));

  let page = pdf.addPage([pageWidth, pageHeight]);
  let y = pageHeight - 52;
  const drawTop = () => {
    page.drawText("Uebersicht Beendete Touren", {
      x: left,
      y,
      size: 16,
      font: bold,
      color: rgb(0.2, 0.2, 0.2)
    });
    y -= 20;
    const subtitle =
      ids.length > 0
        ? `${ids.length} Vordrucke ausgewaehlt`
        : `${weekStart.toLocaleDateString("de-DE")} - ${new Date(weekEnd.getTime() - 86400000).toLocaleDateString("de-DE")}`;
    page.drawText(subtitle, {
      x: left,
      y,
      size: 10,
      font: regular,
      color: rgb(0.4, 0.4, 0.4)
    });
    y -= 20;
  };

  const ensureSpace = (needed: number) => {
    if (y - needed >= 48) return;
    page = pdf.addPage([pageWidth, pageHeight]);
    y = pageHeight - 52;
    drawTop();
  };

  drawTop();

  for (const [routeLabel, routeDrafts] of routeGroups) {
    ensureSpace(36);
    page.drawRectangle({
      x: left,
      y: y - 8,
      width: right - left,
      height: 22,
      color: rgb(0.91, 0.96, 0.93)
    });
    page.drawText(routeLabel, {
      x: left + 8,
      y: y - 1,
      size: 12,
      font: bold,
      color: rgb(0.11, 0.39, 0.16)
    });
    y -= 30;

    for (const draft of routeDrafts) {
      const boxHeight = estimateDraftHeight(draft);
      ensureSpace(boxHeight + 8);

      page.drawRectangle({
        x: left + 2,
        y: y - boxHeight,
        width: right - left - 4,
        height: boxHeight,
        color: rgb(0.99, 0.99, 0.99),
        borderColor: rgb(0.9, 0.9, 0.9),
        borderWidth: 1
      });

      const total = calculateDraftTotalCents(draft);
      let lineY = y - 14;

      page.drawText(`${new Date(draft.date).toLocaleDateString("de-DE")} | #${draft.id} | ${draft.customer.name}`.slice(0, 86), {
        x: left + 10,
        y: lineY,
        size: 9.4,
        font: bold,
        color: rgb(0.16, 0.16, 0.16)
      });

      page.drawText(`${paymentLabel(draft.paymentMethod)} | Gesamt ${formatMoney(total)} EUR`, {
        x: right - 188,
        y: lineY,
        size: 8.4,
        font: regular,
        color: rgb(0.33, 0.33, 0.33)
      });

      lineY -= 12;
      if (draft.lines.length === 0) {
        page.drawText("Keine Positionen", {
          x: left + 12,
          y: lineY,
          size: 8.4,
          font: regular,
          color: rgb(0.45, 0.45, 0.45)
        });
        lineY -= 12;
      } else {
        for (const line of draft.lines) {
          const license = draft.includeLicenseFee ? line.product.licenseFeeCents ?? 0 : 0;
          const lineTotal = line.quantity * (line.unitPriceCents + license);
          page.drawText(`${line.quantity}x ${line.product.sku} ${line.product.name}`.slice(0, 84), {
            x: left + 12,
            y: lineY,
            size: 8.2,
            font: regular,
            color: rgb(0.24, 0.24, 0.24)
          });
          page.drawText(`${formatMoney(lineTotal)} EUR`, {
            x: right - 90,
            y: lineY,
            size: 8.2,
            font: regular,
            color: rgb(0.24, 0.24, 0.24)
          });
          if (draft.includeLicenseFee && license > 0) {
            page.drawText(`Lizenz ${formatMoney(license)} / Stk | Netto ${formatMoney(license * line.quantity)} EUR`, {
              x: left + 18,
              y: lineY - 8,
              size: 7.2,
              font: regular,
              color: rgb(0.45, 0.45, 0.45)
            });
            lineY -= 18;
          } else {
            lineY -= 11;
          }
        }
      }

      if (draft.note) {
        page.drawText(`Notiz: ${String(draft.note).slice(0, 92)}`, {
          x: left + 12,
          y: lineY,
          size: 7.6,
          font: regular,
          color: rgb(0.39, 0.39, 0.39)
        });
      }

      y -= boxHeight + 10;
    }
  }

  const bytes = await pdf.save();
  return new NextResponse(bytes as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=\"wochenuebersicht-vordrucke.pdf\"`
    }
  });
}
