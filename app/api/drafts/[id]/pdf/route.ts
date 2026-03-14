import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { badRequest, notFound, unauthorized } from "@/lib/http";

export const runtime = "nodejs";

type RouteContext = {
  params: {
    id: string;
  };
};

function money(cents: number): string {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(cents / 100);
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(value);
}

function drawRightText(params: {
  page: any;
  text: string;
  x: number;
  y: number;
  size: number;
  font: any;
  color: any;
}) {
  const width = params.font.widthOfTextAtSize(params.text, params.size);
  params.page.drawText(params.text, {
    x: params.x - width,
    y: params.y,
    size: params.size,
    font: params.font,
    color: params.color
  });
}

const A4_WIDTH = 595;
const A4_HEIGHT = 842;
const A6_WIDTH = 298;
const A6_HEIGHT = 420;
const SCALE_X = A6_WIDTH / A4_WIDTH;
const SCALE_Y = A6_HEIGHT / A4_HEIGHT;
const SCALE = Math.min(SCALE_X, SCALE_Y);

function s(value: number): number {
  return value * SCALE;
}

export async function GET(_: Request, { params }: RouteContext) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const id = Number.parseInt(params.id, 10);
  if (!Number.isFinite(id)) return badRequest("Ungueltige Vordruck-ID.");

  const draft = await prisma.draft.findUnique({
    where: { id },
    include: {
      customer: true,
      lines: {
        include: { product: true },
        orderBy: { id: "asc" }
      }
    }
  });
  if (!draft) return notFound("Vordruck nicht gefunden.");

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([A6_WIDTH, A6_HEIGHT]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = A6_WIDTH;
  const textColor = rgb(74 / 255, 74 / 255, 74 / 255);
  const accent = rgb(47 / 255, 126 / 255, 161 / 255);
  const soft = rgb(229 / 255, 229 / 255, 229 / 255);
  const muted = rgb(0.45, 0.45, 0.45);

  const left = s(56);
  const right = s(539);
  const qtyCenter = s(80);
  const productX = s(118);
  const lineTotalRight = s(528);

  page.drawRectangle({
    x: left,
    y: s(788),
    width: s(72),
    height: s(3),
    color: accent
  });
  page.drawText("nord-pack", {
    x: left,
    y: s(798),
    size: s(11),
    font: bold,
    color: accent
  });
  page.drawText("Rechnungs-Vordruck", {
    x: left,
    y: s(768),
    size: s(9),
    font: regular,
    color: muted
  });
  drawRightText({
    page,
    text: formatDate(draft.date),
    x: lineTotalRight,
    y: s(774),
    size: s(11),
    font: regular,
    color: textColor
  });

  const customerName = draft.customer.name.slice(0, 42);
  const customerSize = s(22);
  const customerWidth = bold.widthOfTextAtSize(customerName, customerSize);
  page.drawText(customerName, {
    x: (pageWidth - customerWidth) / 2,
    y: s(728),
    size: customerSize,
    font: bold,
    color: textColor
  });

  const headerY = s(688);
  page.drawLine({
    start: { x: left, y: s(708) },
    end: { x: right, y: s(708) },
    color: soft,
    thickness: s(1)
  });
  page.drawText("Menge", { x: s(62), y: headerY, size: s(9), font: bold, color: muted });
  page.drawText("Produkt", { x: productX, y: headerY, size: s(9), font: bold, color: muted });
  drawRightText({
    page,
    text: "Summe",
    x: lineTotalRight,
    y: headerY,
    size: s(9),
    font: bold,
    color: muted
  });
  page.drawLine({
    start: { x: left, y: s(676) },
    end: { x: right, y: s(676) },
    color: soft,
    thickness: s(1)
  });

  const rowStartY = s(652);
  const rowHeight = s(32);
  const maxVisibleLines = 14;
  const visibleLines = draft.lines.slice(0, maxVisibleLines);
  const subtotal = draft.lines.reduce((sum: number, line: any) => sum + line.quantity * line.unitPriceCents, 0);

  if (visibleLines.length === 0) {
    page.drawText("Keine Positionen", {
      x: productX,
      y: rowStartY - s(4),
      size: s(12),
      font: regular,
      color: muted
    });
  }

  visibleLines.forEach((line: any, index: number) => {
    const y = rowStartY - index * rowHeight;
    const lineTotal = line.quantity * line.unitPriceCents;
    const name = line.product.name.slice(0, 32);
    const qtyText = String(line.quantity);

    const badgeWidth = Math.max(s(24), bold.widthOfTextAtSize(qtyText, s(10)) + s(12));
    const badgeX = qtyCenter - badgeWidth / 2;
    page.drawRectangle({
      x: badgeX,
      y: y - s(3),
      width: badgeWidth,
      height: s(16),
      color: rgb(245 / 255, 249 / 255, 252 / 255),
      borderColor: soft,
      borderWidth: s(0.7)
    });
    const qtyWidth = bold.widthOfTextAtSize(qtyText, s(10));
    page.drawText(qtyText, {
      x: qtyCenter - qtyWidth / 2,
      y: y + s(1),
      size: s(10),
      font: bold,
      color: accent
    });

    page.drawText(name, { x: productX, y, size: s(12), font: regular, color: textColor });
    drawRightText({
      page,
      text: money(lineTotal),
      x: lineTotalRight,
      y,
      size: s(12),
      font: bold,
      color: textColor
    });

    page.drawLine({
      start: { x: left, y: y - s(9) },
      end: { x: right, y: y - s(9) },
      color: soft,
      thickness: s(0.8)
    });
  });

  if (draft.lines.length > maxVisibleLines) {
    page.drawText(`+${draft.lines.length - maxVisibleLines} weitere Positionen`, {
      x: productX,
      y: rowStartY - maxVisibleLines * rowHeight,
      size: s(10),
      font: regular,
      color: muted
    });
  }

  const vat = Math.round(subtotal * 0.19);
  const total = subtotal + vat;
  const usedRows = Math.max(1, Math.min(draft.lines.length, maxVisibleLines));
  const summaryTop = rowStartY - usedRows * rowHeight - s(30);

  page.drawText("Zwischensumme", { x: s(384), y: summaryTop, size: s(10), font: regular, color: muted });
  drawRightText({
    page,
    text: money(subtotal),
    x: lineTotalRight,
    y: summaryTop,
    size: s(12),
    font: regular,
    color: textColor
  });
  page.drawText("MWSt 19%", { x: s(384), y: summaryTop - s(20), size: s(10), font: regular, color: muted });
  drawRightText({
    page,
    text: money(vat),
    x: lineTotalRight,
    y: summaryTop - s(20),
    size: s(12),
    font: regular,
    color: textColor
  });

  const ruleY = summaryTop - s(28);
  page.drawLine({
    start: { x: s(372), y: ruleY },
    end: { x: lineTotalRight, y: ruleY },
    thickness: s(2),
    color: accent
  });

  page.drawText("Gesamt", { x: s(384), y: summaryTop - s(50), size: s(10), font: regular, color: muted });
  drawRightText({
    page,
    text: money(total),
    x: lineTotalRight,
    y: summaryTop - s(56),
    size: s(25),
    font: bold,
    color: textColor
  });

  page.drawText(`Nr. ${draft.id}`, {
    x: left,
    y: s(42),
    size: s(9),
    font: regular,
    color: muted
  });

  const bytes = await pdf.save();

  return new NextResponse(bytes as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="nord-pack-vordruck-${id}.pdf"`
    }
  });
}
