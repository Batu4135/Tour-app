import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { badRequest, notFound, unauthorized } from "@/lib/http";

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
  const page = pdf.addPage([595, 842]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595;
  const textColor = rgb(74 / 255, 74 / 255, 74 / 255);
  const accent = rgb(47 / 255, 126 / 255, 161 / 255);
  const soft = rgb(229 / 255, 229 / 255, 229 / 255);
  const muted = rgb(0.45, 0.45, 0.45);

  const left = 56;
  const right = 539;
  const qtyCenter = 80;
  const productX = 118;
  const lineTotalRight = 528;

  page.drawRectangle({
    x: left,
    y: 788,
    width: 72,
    height: 3,
    color: accent
  });
  page.drawText("nord-pack", {
    x: left,
    y: 798,
    size: 11,
    font: bold,
    color: accent
  });
  page.drawText("Rechnungs-Vordruck", {
    x: left,
    y: 768,
    size: 9,
    font: regular,
    color: muted
  });
  drawRightText({
    page,
    text: formatDate(draft.date),
    x: lineTotalRight,
    y: 774,
    size: 11,
    font: regular,
    color: textColor
  });

  const customerName = draft.customer.name.slice(0, 42);
  const customerSize = 22;
  const customerWidth = bold.widthOfTextAtSize(customerName, customerSize);
  page.drawText(customerName, {
    x: (pageWidth - customerWidth) / 2,
    y: 728,
    size: customerSize,
    font: bold,
    color: textColor
  });

  const headerY = 688;
  page.drawLine({
    start: { x: left, y: 708 },
    end: { x: right, y: 708 },
    color: soft,
    thickness: 1
  });
  page.drawText("Menge", { x: 62, y: headerY, size: 9, font: bold, color: muted });
  page.drawText("Produkt", { x: productX, y: headerY, size: 9, font: bold, color: muted });
  drawRightText({
    page,
    text: "Summe",
    x: lineTotalRight,
    y: headerY,
    size: 9,
    font: bold,
    color: muted
  });
  page.drawLine({
    start: { x: left, y: 676 },
    end: { x: right, y: 676 },
    color: soft,
    thickness: 1
  });

  const rowStartY = 652;
  const rowHeight = 32;
  const maxVisibleLines = 14;
  const visibleLines = draft.lines.slice(0, maxVisibleLines);
  const subtotal = draft.lines.reduce((sum: number, line: any) => sum + line.quantity * line.unitPriceCents, 0);

  if (visibleLines.length === 0) {
    page.drawText("Keine Positionen", {
      x: productX,
      y: rowStartY - 4,
      size: 12,
      font: regular,
      color: muted
    });
  }

  visibleLines.forEach((line: any, index: number) => {
    const y = rowStartY - index * rowHeight;
    const lineTotal = line.quantity * line.unitPriceCents;
    const name = line.product.name.slice(0, 32);
    const qtyText = String(line.quantity);

    const badgeWidth = Math.max(24, bold.widthOfTextAtSize(qtyText, 10) + 12);
    const badgeX = qtyCenter - badgeWidth / 2;
    page.drawRectangle({
      x: badgeX,
      y: y - 3,
      width: badgeWidth,
      height: 16,
      color: rgb(245 / 255, 249 / 255, 252 / 255),
      borderColor: soft,
      borderWidth: 0.7
    });
    const qtyWidth = bold.widthOfTextAtSize(qtyText, 10);
    page.drawText(qtyText, {
      x: qtyCenter - qtyWidth / 2,
      y: y + 1,
      size: 10,
      font: bold,
      color: accent
    });

    page.drawText(name, { x: productX, y, size: 12, font: regular, color: textColor });
    drawRightText({
      page,
      text: money(lineTotal),
      x: lineTotalRight,
      y,
      size: 12,
      font: bold,
      color: textColor
    });

    page.drawLine({
      start: { x: left, y: y - 9 },
      end: { x: right, y: y - 9 },
      color: soft,
      thickness: 0.8
    });
  });

  if (draft.lines.length > maxVisibleLines) {
    page.drawText(`+${draft.lines.length - maxVisibleLines} weitere Positionen`, {
      x: productX,
      y: rowStartY - maxVisibleLines * rowHeight,
      size: 10,
      font: regular,
      color: muted
    });
  }

  const vat = Math.round(subtotal * 0.19);
  const total = subtotal + vat;
  const usedRows = Math.max(1, Math.min(draft.lines.length, maxVisibleLines));
  const summaryTop = rowStartY - usedRows * rowHeight - 30;

  page.drawText("Zwischensumme", { x: 384, y: summaryTop, size: 10, font: regular, color: muted });
  drawRightText({
    page,
    text: money(subtotal),
    x: lineTotalRight,
    y: summaryTop,
    size: 12,
    font: regular,
    color: textColor
  });
  page.drawText("MWSt 19%", { x: 384, y: summaryTop - 20, size: 10, font: regular, color: muted });
  drawRightText({
    page,
    text: money(vat),
    x: lineTotalRight,
    y: summaryTop - 20,
    size: 12,
    font: regular,
    color: textColor
  });

  const ruleY = summaryTop - 28;
  page.drawLine({
    start: { x: 372, y: ruleY },
    end: { x: lineTotalRight, y: ruleY },
    thickness: 2,
    color: accent
  });

  page.drawText("Gesamt", { x: 384, y: summaryTop - 50, size: 10, font: regular, color: muted });
  drawRightText({
    page,
    text: money(total),
    x: lineTotalRight,
    y: summaryTop - 56,
    size: 25,
    font: bold,
    color: textColor
  });

  page.drawText(`Nr. ${draft.id}`, {
    x: left,
    y: 42,
    size: 9,
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
