import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { badRequest, unauthorized } from "@/lib/http";

export const runtime = "nodejs";

function parseWeekStart(raw: string | null): Date {
  if (!raw || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    throw new Error("Ungueltiger Wochenstart.");
  }
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

function dayKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function pickRouteLabel(values: Array<string | null | undefined>): string | null {
  const counts = new Map<string, number>();
  for (const value of values) {
    const cleaned = (value ?? "").trim();
    if (!cleaned) continue;
    counts.set(cleaned, (counts.get(cleaned) ?? 0) + 1);
  }
  if (counts.size === 0) return null;
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

export async function GET(request: Request) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const url = new URL(request.url);
  let weekStart: Date;
  try {
    weekStart = parseWeekStart(url.searchParams.get("start"));
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Ungueltiger Wochenstart.");
  }
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);

  const drafts = await prisma.draft.findMany({
    where: {
      date: { gte: weekStart, lt: weekEnd }
    },
    orderBy: [{ date: "asc" }, { id: "asc" }],
    include: {
      customer: { select: { name: true, routeDay: true } },
      lines: {
        orderBy: { id: "asc" },
        include: { product: { select: { name: true, sku: true, licenseFeeCents: true } } }
      }
    }
  });

  const byDay = new Map<string, any[]>();
  for (const draft of drafts) {
    const key = dayKey(draft.date);
    const list = byDay.get(key) ?? [];
    list.push(draft);
    byDay.set(key, list);
  }

  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595;
  const pageHeight = 842;
  const left = 42;
  const right = pageWidth - 42;

  let page = pdf.addPage([pageWidth, pageHeight]);
  let y = pageHeight - 52;

  const drawTop = () => {
    page.drawText("Wochenuebersicht Vordrucke", {
      x: left,
      y,
      size: 16,
      font: bold,
      color: rgb(0.2, 0.2, 0.2)
    });
    y -= 20;
    page.drawText(
      `${weekStart.toLocaleDateString("de-DE")} - ${new Date(weekEnd.getTime() - 86400000).toLocaleDateString("de-DE")}`,
      {
        x: left,
        y,
        size: 10,
        font: regular,
        color: rgb(0.4, 0.4, 0.4)
      }
    );
    y -= 20;
  };

  const ensure = (needed: number) => {
    if (y - needed >= 48) return;
    page = pdf.addPage([pageWidth, pageHeight]);
    y = pageHeight - 52;
    drawTop();
  };

  drawTop();

  for (const [key, dayDrafts] of byDay.entries()) {
    const routeLabel = pickRouteLabel(dayDrafts.map((d) => d.customer.routeDay));
    ensure(44);
    page.drawRectangle({
      x: left,
      y: y - 6,
      width: right - left,
      height: 24,
      color: rgb(0.95, 0.97, 1)
    });
    page.drawText(new Date(`${key}T12:00:00.000Z`).toLocaleDateString("de-DE"), {
      x: left + 8,
      y: y + 2,
      size: 11,
      font: bold,
      color: rgb(0.2, 0.2, 0.2)
    });
    if (routeLabel) {
      page.drawText(`Tour: ${routeLabel}`, {
        x: left + 120,
        y: y + 2,
        size: 10,
        font: regular,
        color: rgb(0.25, 0.25, 0.25)
      });
    }
    y -= 30;

    for (const draft of dayDrafts) {
      const subtotal = draft.lines.reduce((sum: number, line: any) => {
        const license = draft.includeLicenseFee ? line.product.licenseFeeCents ?? 0 : 0;
        return sum + line.quantity * (line.unitPriceCents + license);
      }, 0);
      const vat = Math.round(subtotal * 0.19);
      const total = subtotal + vat;

      const needed = 40 + draft.lines.length * (draft.includeLicenseFee ? 20 : 14);
      ensure(needed);

      page.drawText(`#${draft.id} ${draft.customer.name}`, {
        x: left + 8,
        y,
        size: 10,
        font: bold,
        color: rgb(0.18, 0.18, 0.18)
      });
      page.drawText(`${paymentLabel(draft.paymentMethod)} | Gesamt ${formatMoney(total)} EUR`, {
        x: right - 180,
        y,
        size: 9,
        font: regular,
        color: rgb(0.3, 0.3, 0.3)
      });
      y -= 14;

      for (const line of draft.lines) {
        ensure(draft.includeLicenseFee ? 20 : 14);
        const license = draft.includeLicenseFee ? line.product.licenseFeeCents ?? 0 : 0;
        const lineTotal = line.quantity * (line.unitPriceCents + license);
        const leftText = `${line.quantity}x ${line.product.sku} ${line.product.name}`.slice(0, 88);
        page.drawText(leftText, {
          x: left + 14,
          y,
          size: 8.8,
          font: regular,
          color: rgb(0.23, 0.23, 0.23)
        });
        page.drawText(`${formatMoney(lineTotal)} EUR`, {
          x: right - 96,
          y,
          size: 8.8,
          font: regular,
          color: rgb(0.23, 0.23, 0.23)
        });
        if (draft.includeLicenseFee && license > 0) {
          page.drawText(`Lizenz ${formatMoney(license)} / Stk | Netto ${formatMoney(license * line.quantity)} EUR`, {
            x: left + 20,
            y: y - 8,
            size: 7.7,
            font: regular,
            color: rgb(0.45, 0.45, 0.45)
          });
          y -= 18;
        } else {
          y -= 12;
        }
      }

      if (draft.note) {
        ensure(14);
        page.drawText(`Notiz: ${String(draft.note).slice(0, 90)}`, {
          x: left + 14,
          y,
          size: 8,
          font: regular,
          color: rgb(0.4, 0.4, 0.4)
        });
        y -= 12;
      }

      y -= 6;
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
