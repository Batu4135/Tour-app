import { PDFDocument, PDFFont, StandardFonts, rgb } from "pdf-lib";
import { getLineLicenseTotals, summarizeLicenseByType } from "@/lib/license";
import { calculateDraftTotals } from "@/lib/draftTotals";

export type DraftVoucherFonts = {
  regular: PDFFont;
  bold: PDFFont;
};

type DrawDraftVoucherOptions = {
  headerTitle?: string;
  headerSubtitle?: string;
  headerTitleSize?: number;
  showSku?: boolean;
};

const A4_WIDTH = 595;
const A4_HEIGHT = 842;
export const A6_WIDTH = 298;
export const A6_HEIGHT = 420;
const SCALE_X = A6_WIDTH / A4_WIDTH;
const SCALE_Y = A6_HEIGHT / A4_HEIGHT;
const SCALE = Math.min(SCALE_X, SCALE_Y);

function s(value: number): number {
  return value * SCALE;
}

function money(cents: number): string {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(cents / 100);
}

function weightKg(grams: number): string {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  }).format(grams / 1000);
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
  font: PDFFont;
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

function paymentMethodText(value: string): string {
  if (value === "BANK") return "Bank";
  if (value === "DIRECT_DEBIT") return "Lastschrift";
  return "Bar";
}

export async function createDraftVoucherFonts(pdf: PDFDocument): Promise<DraftVoucherFonts> {
  return {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold)
  };
}

export function drawDraftVoucherPage(
  pdf: PDFDocument,
  fonts: DraftVoucherFonts,
  draft: any,
  options?: DrawDraftVoucherOptions
) {
  const { regular, bold } = fonts;
  const page = pdf.addPage([A6_WIDTH, A6_HEIGHT]);

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

  const headerTitle = options?.headerTitle ?? "Vordruck";
  const licenseModeText = draft.includeLicenseFee ? "Inkl. Lizenzierung" : "Ohne Lizenzierung";
  const headerSubtitle = options?.headerSubtitle ?? licenseModeText;

  let headerTitleSize = s(options?.headerTitleSize ?? 10);
  while (regular.widthOfTextAtSize(headerTitle, headerTitleSize) > pageWidth - s(20) && headerTitleSize > s(7)) {
    headerTitleSize -= s(0.4);
  }

  page.drawText(headerTitle, {
    x: (pageWidth - regular.widthOfTextAtSize(headerTitle, headerTitleSize)) / 2,
    y: s(752),
    size: headerTitleSize,
    font: regular,
    color: muted
  });

  page.drawText(headerSubtitle, {
    x: (pageWidth - regular.widthOfTextAtSize(headerSubtitle, s(8))) / 2,
    y: s(740),
    size: s(8),
    font: regular,
    color: muted
  });

  drawRightText({
    page,
    text: formatDate(new Date(draft.date)),
    x: lineTotalRight,
    y: s(772),
    size: s(11),
    font: regular,
    color: textColor
  });

  drawRightText({
    page,
    text: `Zahlart: ${paymentMethodText(draft.paymentMethod)}`,
    x: lineTotalRight,
    y: s(758),
    size: s(8.5),
    font: regular,
    color: muted
  });

  const customerName = String(draft.customer?.name ?? "").slice(0, 42);
  const customerSize = s(22);
  const customerWidth = bold.widthOfTextAtSize(customerName, customerSize);
  page.drawText(customerName, {
    x: (pageWidth - customerWidth) / 2,
    y: s(714),
    size: customerSize,
    font: bold,
    color: textColor
  });

  const headerY = s(676);
  page.drawLine({
    start: { x: left, y: s(696) },
    end: { x: right, y: s(696) },
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
    start: { x: left, y: s(664) },
    end: { x: right, y: s(664) },
    color: soft,
    thickness: s(1)
  });

  const rowStartY = s(640);
  const defaultRowHeight = s(32);
  const summaryGap = s(24);
  const minSummaryTop = s(158);
  const lines = Array.isArray(draft.lines) ? draft.lines : [];
  const lineCount = Math.max(1, lines.length);
  const availableRowHeight = Math.max(s(80), rowStartY - minSummaryTop - summaryGap);
  const idealRowHeight = availableRowHeight / lineCount;
  const rowHeight = Math.max(s(21), Math.min(s(46), idealRowHeight));
  const rowDensity = rowHeight / defaultRowHeight;
  const rowFontSize = Math.max(s(6), Math.min(s(12.5), rowHeight * 0.5));
  const qtyFontSize = Math.max(s(5), Math.min(s(10.5), rowHeight * 0.42));
  const qtyBadgeHeight = Math.max(s(4.5), Math.min(s(16) * rowDensity, rowHeight * 1.05));
  const qtyBadgePaddingX = Math.max(s(4), s(12) * rowDensity);
  const rowDividerOffset = Math.min(rowHeight * 0.72, Math.max(s(1.6), s(9) * rowDensity));
  const nameMaxChars = rowDensity > 1.2 ? 42 : rowDensity > 0.9 ? 36 : rowDensity > 0.7 ? 30 : 24;
  const noteRaw = (draft.note ?? "").trim();
  const noteLines =
    noteRaw.length > 0
      ? [noteRaw.slice(0, 66), noteRaw.length > 66 ? noteRaw.slice(66, 132) : ""].filter((value) => value.length > 0)
      : [];
  const noteBlockHeight = noteLines.length > 0 ? s(16 + noteLines.length * 8) : 0;

  const totals = calculateDraftTotals({
    lines,
    includeLicenseFee: draft.includeLicenseFee,
    discountCents: draft.discountCents,
    subtractVat: draft.subtractVat
  });

  if (lines.length === 0) {
    page.drawText("Keine Positionen", {
      x: productX,
      y: rowStartY - s(4),
      size: s(12),
      font: regular,
      color: muted
    });
  }

  lines.forEach((line: any, index: number) => {
    const y = rowStartY - index * rowHeight;
    const { details, lineFeeCents } = getLineLicenseTotals(line.quantity, line.product ?? {});
    const lineTotal = line.quantity * line.unitPriceCents + (draft.includeLicenseFee ? lineFeeCents : 0);
    const sku = String(line.product?.sku ?? "").trim();
    const productName = String(line.product?.name ?? "").trim();
    const labelRaw = options?.showSku && sku.length > 0 ? `${sku} ${productName}` : productName;
    const name = labelRaw.slice(0, nameMaxChars);
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
    if (draft.includeLicenseFee && details.hasLicense) {
      const small = Math.max(s(5), rowFontSize * 0.62);
      page.drawText(`${details.licenseType} ${weightKg(details.licenseWeightGrams)} kg - Lizenz ${money(details.unitFeeCents)} / Stk`, {
        x: productX,
        y: y - small * 1.2,
        size: small,
        font: regular,
        color: muted
      });
    }

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

  const licenseSummary = draft.includeLicenseFee
    ? summarizeLicenseByType(lines as Array<{ quantity: number; product?: unknown }>, (line) => line.product ?? {})
    : [];
  const usedRows = Math.max(1, lines.length);
  const summaryTop = rowStartY - usedRows * rowHeight - summaryGap - noteBlockHeight;
  const summaryScale = Math.max(0.85, Math.min(1.08, rowDensity + 0.08));
  const summaryLabelSize = s(10) * summaryScale;
  const summaryValueSize = s(12) * summaryScale;
  const summaryTotalSize = s(25) * summaryScale;

  if (noteLines.length > 0) {
    const noteLabelY = summaryTop + noteBlockHeight - s(9);
    page.drawText("Notiz:", {
      x: s(64),
      y: noteLabelY,
      size: s(8),
      font: bold,
      color: muted
    });
    noteLines.forEach((line, index) => {
      page.drawText(line, {
        x: s(104),
        y: noteLabelY - index * s(8.5),
        size: s(8),
        font: regular,
        color: textColor
      });
    });
  }

  if (licenseSummary.length > 0) {
    page.drawText("Lizenzen (Gewicht):", {
      x: s(64),
      y: summaryTop,
      size: s(8.2),
      font: bold,
      color: muted
    });

    licenseSummary.slice(0, 4).forEach((entry, index) => {
      page.drawText(`${entry.licenseType}: ${weightKg(entry.totalWeightGrams)} kg`, {
        x: s(64),
        y: summaryTop - s(10 + index * 8),
        size: s(7.8),
        font: regular,
        color: textColor
      });
    });
  }

  page.drawText("Zwischensumme", { x: s(384), y: summaryTop, size: summaryLabelSize, font: regular, color: muted });
  drawRightText({
    page,
    text: money(totals.subtotalCents),
    x: lineTotalRight,
    y: summaryTop,
    size: summaryValueSize,
    font: regular,
    color: textColor
  });

  let ruleY = summaryTop - s(10) * summaryScale;
  let totalLabelY = summaryTop - s(32) * summaryScale;
  let totalValueY = summaryTop - s(38) * summaryScale;

  if (!draft.subtractVat) {
    page.drawText("MWSt 19%", {
      x: s(384),
      y: summaryTop - s(20) * summaryScale,
      size: summaryLabelSize,
      font: regular,
      color: muted
    });
    drawRightText({
      page,
      text: money(totals.vatCents),
      x: lineTotalRight,
      y: summaryTop - s(20) * summaryScale,
      size: summaryValueSize,
      font: regular,
      color: textColor
    });
    ruleY = summaryTop - s(30) * summaryScale;
    totalLabelY = summaryTop - s(52) * summaryScale;
    totalValueY = summaryTop - s(58) * summaryScale;
  }

  page.drawLine({
    start: { x: s(372), y: ruleY },
    end: { x: lineTotalRight, y: ruleY },
    thickness: s(2),
    color: accent
  });

  page.drawText("Gesamt", { x: s(384), y: totalLabelY, size: summaryLabelSize, font: regular, color: muted });
  drawRightText({
    page,
    text: money(totals.invoiceTotalCents),
    x: lineTotalRight,
    y: totalValueY,
    size: summaryTotalSize,
    font: bold,
    color: textColor
  });
}


