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

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(value);
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
  const productRows = draft.lines.length > 0 ? draft.lines.length : 1;
  const licenseRows = draft.includeLicenseFee
    ? draft.lines.filter((line: any) => (line.product?.licenseFeeCents ?? 0) > 0).length
    : 0;
  const noteRows = draft.note ? 1 : 0;
  return 56 + productRows * 14 + licenseRows * 9 + noteRows * 11;
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
        include: { product: { select: { name: true, sku: true, licenseFeeCents: true } } }
      }
    }
  });

  if (drafts.length === 0) return badRequest("Keine Vordrucke gefunden.");

  const draftDates = drafts.map((draft) => new Date(draft.date));
  const rangeFrom = ids.length > 0 ? minDate(draftDates) : weekStart;
  const rangeTo = ids.length > 0 ? maxDate(draftDates) : new Date(weekEnd.getTime() - 86400000);

  const byRoute = new Map<string, any[]>();
  for (const draft of drafts) {
    const key = resolveRouteLabel(draft.customer.routeDay);
    const list = byRoute.get(key) ?? [];
    list.push(draft);
    byRoute.set(key, list);
  }

  const routeGroups = [...byRoute.entries()].sort((a, b) => a[0].localeCompare(b[0], "de-DE"));

  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595;
  const pageHeight = 842;
  const left = 42;
  const right = pageWidth - 42;
  const qtyX = left + 12;
  const productX = left + 58;
  const totalRight = right - 14;

  let page: any;
  let y = 0;

  const drawRightText = (text: string, x: number, drawY: number, size: number, font: any, color: any) => {
    const width = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: x - width, y: drawY, size, font, color });
  };

  const startRoutePage = (routeLabel: string, continuation: boolean) => {
    page = pdf.addPage([pageWidth, pageHeight]);
    y = pageHeight - 52;

    const title = `Übersicht vom ${formatDate(rangeFrom)} bis ${formatDate(rangeTo)}`;
    page.drawText(title, {
      x: left,
      y,
      size: 15,
      font: bold,
      color: rgb(0.17, 0.17, 0.17)
    });
    y -= 18;

    page.drawText(`${drafts.length} Vordrucke ausgewählt`, {
      x: left,
      y,
      size: 10,
      font: regular,
      color: rgb(0.4, 0.4, 0.4)
    });
    y -= 18;

    page.drawRectangle({
      x: left,
      y: y - 8,
      width: right - left,
      height: 22,
      color: rgb(0.91, 0.96, 0.93)
    });
    page.drawText(continuation ? `${routeLabel} (Fortsetzung)` : routeLabel, {
      x: left + 8,
      y: y - 1,
      size: 12,
      font: bold,
      color: rgb(0.11, 0.39, 0.16)
    });

    y -= 30;
  };

  for (const [routeLabel, routeDrafts] of routeGroups) {
    startRoutePage(routeLabel, false);

    for (const draft of routeDrafts) {
      const boxHeight = estimateDraftHeight(draft);
      if (y - boxHeight < 44) {
        startRoutePage(routeLabel, true);
      }

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

      page.drawText(`${formatDate(new Date(draft.date))} | ${draft.customer.name}`.slice(0, 90), {
        x: left + 10,
        y: lineY,
        size: 9.6,
        font: bold,
        color: rgb(0.16, 0.16, 0.16)
      });
      drawRightText(`${paymentLabel(draft.paymentMethod)} | Gesamt ${formatMoney(total)} EUR`, right - 10, lineY, 8.6, regular, rgb(0.34, 0.34, 0.34));

      lineY -= 13;
      page.drawText("Menge", { x: qtyX, y: lineY, size: 8, font: bold, color: rgb(0.45, 0.45, 0.45) });
      page.drawText("Produkt", { x: productX, y: lineY, size: 8, font: bold, color: rgb(0.45, 0.45, 0.45) });
      drawRightText("Summe", totalRight, lineY, 8, bold, rgb(0.45, 0.45, 0.45));

      lineY -= 10;
      if (draft.lines.length === 0) {
        page.drawText("Keine Positionen", {
          x: productX,
          y: lineY,
          size: 8.5,
          font: regular,
          color: rgb(0.45, 0.45, 0.45)
        });
        lineY -= 12;
      } else {
        for (const line of draft.lines) {
          const license = draft.includeLicenseFee ? line.product.licenseFeeCents ?? 0 : 0;
          const lineTotal = line.quantity * (line.unitPriceCents + license);

          page.drawText(`${line.quantity}x`, {
            x: qtyX,
            y: lineY,
            size: 8.6,
            font: bold,
            color: rgb(0.2, 0.2, 0.2)
          });

          const sku = String(line.product.sku ?? "").trim();
          const productText = `${sku ? `${sku} ` : ""}${line.product.name}`.slice(0, 74);
          page.drawText(productText, {
            x: productX,
            y: lineY,
            size: 8.6,
            font: regular,
            color: rgb(0.2, 0.2, 0.2)
          });

          drawRightText(`${formatMoney(lineTotal)} EUR`, totalRight, lineY, 8.6, regular, rgb(0.2, 0.2, 0.2));

          if (draft.includeLicenseFee && license > 0) {
            page.drawText(`Lizenz ${formatMoney(license)} / Stk | Netto ${formatMoney(license * line.quantity)} EUR`, {
              x: productX,
              y: lineY - 8,
              size: 7.2,
              font: regular,
              color: rgb(0.45, 0.45, 0.45)
            });
            lineY -= 17;
          } else {
            lineY -= 12;
          }
        }
      }

      if (draft.note) {
        page.drawText(`Notiz: ${String(draft.note).slice(0, 92)}`, {
          x: productX,
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
      "Content-Disposition": `inline; filename="wochenuebersicht-vordrucke.pdf"`
    }
  });
}
