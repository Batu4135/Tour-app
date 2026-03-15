import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { readFile } from "node:fs/promises";
import path from "node:path";
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

  const logoBottomY = s(744);
  let logoDrawn = false;
  try {
    const logoPath = path.join(process.cwd(), "public", "brand", "nord-pack-logo.png");
    const logoBytes = await readFile(logoPath);
    const logoImage = await pdf.embedPng(logoBytes);
    const maxWidth = s(180);
    const maxHeight = s(58);
    const scale = Math.min(maxWidth / logoImage.width, maxHeight / logoImage.height);
    const logoWidth = logoImage.width * scale;
    const logoHeight = logoImage.height * scale;
    page.drawImage(logoImage, {
      x: (pageWidth - logoWidth) / 2,
      y: logoBottomY,
      width: logoWidth,
      height: logoHeight
    });
    logoDrawn = true;
  } catch {
    logoDrawn = false;
  }

  if (!logoDrawn) {
    const fallback = "Nord-Pack";
    const fallbackSize = s(18);
    const fallbackWidth = bold.widthOfTextAtSize(fallback, fallbackSize);
    page.drawText(fallback, {
      x: (pageWidth - fallbackWidth) / 2,
      y: s(764),
      size: fallbackSize,
      font: bold,
      color: accent
    });
  }

  page.drawText("Rechnungs-Vordruck", {
    x: (pageWidth - regular.widthOfTextAtSize("Rechnungs-Vordruck", s(9))) / 2,
    y: s(732),
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
    y: s(704),
    size: customerSize,
    font: bold,
    color: textColor
  });

  const headerY = s(666);
  page.drawLine({
    start: { x: left, y: s(686) },
    end: { x: right, y: s(686) },
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
    start: { x: left, y: s(654) },
    end: { x: right, y: s(654) },
    color: soft,
    thickness: s(1)
  });

  const rowStartY = s(630);
  const defaultRowHeight = s(32);
  const summaryGap = s(30);
  const minSummaryTop = s(150);
  const lineCount = Math.max(1, draft.lines.length);
  const availableRowHeight = Math.max(s(80), rowStartY - minSummaryTop - summaryGap);
  const rowHeight = Math.min(defaultRowHeight, availableRowHeight / lineCount);
  const rowDensity = rowHeight / defaultRowHeight;
  const rowFontSize = Math.max(s(3.5), Math.min(s(12) * rowDensity, rowHeight * 0.82));
  const qtyFontSize = Math.max(s(3), Math.min(s(10) * rowDensity, rowHeight * 0.72));
  const qtyBadgeHeight = Math.max(s(4.5), Math.min(s(16) * rowDensity, rowHeight * 1.05));
  const qtyBadgePaddingX = Math.max(s(4), s(12) * rowDensity);
  const rowDividerOffset = Math.min(rowHeight * 0.72, Math.max(s(1.6), s(9) * rowDensity));
  const nameMaxChars = rowDensity < 0.5 ? 18 : rowDensity < 0.7 ? 24 : 32;
  const subtotal = draft.lines.reduce((sum: number, line: any) => sum + line.quantity * line.unitPriceCents, 0);

  if (draft.lines.length === 0) {
    page.drawText("Keine Positionen", {
      x: productX,
      y: rowStartY - s(4),
      size: s(12),
      font: regular,
      color: muted
    });
  }

  draft.lines.forEach((line: any, index: number) => {
    const y = rowStartY - index * rowHeight;
    const lineTotal = line.quantity * line.unitPriceCents;
    const name = line.product.name.slice(0, nameMaxChars);
    const qtyText = String(line.quantity);

    const badgeWidth = Math.max(s(18), bold.widthOfTextAtSize(qtyText, qtyFontSize) + qtyBadgePaddingX);
    const badgeX = qtyCenter - badgeWidth / 2;
    page.drawRectangle({
      x: badgeX,
      y: y - s(2) * rowDensity,
      width: badgeWidth,
      height: qtyBadgeHeight,
      color: rgb(245 / 255, 249 / 255, 252 / 255),
      borderColor: soft,
      borderWidth: s(0.7)
    });
    const qtyWidth = bold.widthOfTextAtSize(qtyText, qtyFontSize);
    page.drawText(qtyText, {
      x: qtyCenter - qtyWidth / 2,
      y: y + s(0.5) * rowDensity,
      size: qtyFontSize,
      font: bold,
      color: accent
    });

    page.drawText(name, { x: productX, y, size: rowFontSize, font: regular, color: textColor });
    drawRightText({
      page,
      text: money(lineTotal),
      x: lineTotalRight,
      y,
      size: rowFontSize,
      font: bold,
      color: textColor
    });

    page.drawLine({
      start: { x: left, y: y - rowDividerOffset },
      end: { x: right, y: y - rowDividerOffset },
      color: soft,
      thickness: Math.max(s(0.45), s(0.8) * rowDensity)
    });
  });

  const vat = Math.round(subtotal * 0.19);
  const total = subtotal + vat;
  const usedRows = Math.max(1, draft.lines.length);
  const summaryTop = rowStartY - usedRows * rowHeight - summaryGap;
  const summaryScale = Math.max(0.7, Math.min(1, rowDensity + 0.12));
  const summaryLabelSize = s(10) * summaryScale;
  const summaryValueSize = s(12) * summaryScale;
  const summaryTotalSize = s(25) * summaryScale;

  page.drawText("Zwischensumme", { x: s(384), y: summaryTop, size: summaryLabelSize, font: regular, color: muted });
  drawRightText({
    page,
    text: money(subtotal),
    x: lineTotalRight,
    y: summaryTop,
    size: summaryValueSize,
    font: regular,
    color: textColor
  });
  page.drawText("MWSt 19%", { x: s(384), y: summaryTop - s(20) * summaryScale, size: summaryLabelSize, font: regular, color: muted });
  drawRightText({
    page,
    text: money(vat),
    x: lineTotalRight,
    y: summaryTop - s(20) * summaryScale,
    size: summaryValueSize,
    font: regular,
    color: textColor
  });

  const ruleY = summaryTop - s(28) * summaryScale;
  page.drawLine({
    start: { x: s(372), y: ruleY },
    end: { x: lineTotalRight, y: ruleY },
    thickness: s(2),
    color: accent
  });

  page.drawText("Gesamt", { x: s(384), y: summaryTop - s(50) * summaryScale, size: summaryLabelSize, font: regular, color: muted });
  drawRightText({
    page,
    text: money(total),
    x: lineTotalRight,
    y: summaryTop - s(56) * summaryScale,
    size: summaryTotalSize,
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
