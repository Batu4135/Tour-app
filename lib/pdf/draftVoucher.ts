import { PDFDocument, PDFFont, StandardFonts, rgb } from "pdf-lib";
import { getLineLicenseTotals, summarizeLicenseByType } from "@/lib/license";
import { calculateDraftTotals } from "@/lib/draftTotals";
import { formatQuantity, multiplyCentsByQuantity } from "@/lib/quantity";

export type DraftVoucherFonts = {
  regular: PDFFont;
  bold: PDFFont;
};

type DrawDraftVoucherOptions = {
  headerTitle?: string;
  headerSubtitle?: string;
  headerTitleSize?: number;
  showSku?: boolean;
  pageSize?: "A6" | "A4";
  layoutVariant?: "preview" | "print";
};

const A4_WIDTH = 595;
const A4_HEIGHT = 842;
export const A6_WIDTH = 298;
export const A6_HEIGHT = 420;
const SCALE_X = A6_WIDTH / A4_WIDTH;
const SCALE_Y = A6_HEIGHT / A4_HEIGHT;
const A6_SCALE = Math.min(SCALE_X, SCALE_Y);

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

function licenseLabel(type: string): string {
  if (type === "LA") return "1 Lizenz Alu";
  if (type === "LK") return "1 Lizenz Kunststoff";
  if (type === "LV") return "1 Lizenz Verbund";
  if (type === "LP") return "1 Lizenz Papier";
  return "1 Lizenz";
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
  const pageSize = options?.pageSize ?? "A6";
  const layoutVariant = options?.layoutVariant ?? (pageSize === "A4" ? "print" : "preview");
  const scale = pageSize === "A4" ? 1 : A6_SCALE;
  const isPrintLayout = layoutVariant === "print";
  const pageWidth = pageSize === "A4" ? A4_WIDTH : A6_WIDTH;
  const pageHeight = pageSize === "A4" ? A4_HEIGHT : A6_HEIGHT;
  const s = (value: number) => value * scale;
  const page = pdf.addPage([pageWidth, pageHeight]);

  const textColor = rgb(74 / 255, 74 / 255, 74 / 255);
  const accent = rgb(47 / 255, 126 / 255, 161 / 255);
  const soft = rgb(229 / 255, 229 / 255, 229 / 255);
  const muted = rgb(0.45, 0.45, 0.45);

  const left = s(isPrintLayout ? 30 : 56);
  const right = s(isPrintLayout ? 565 : 539);
  const qtyCenter = s(isPrintLayout ? 50 : 80);
  const skuX = options?.showSku ? s(isPrintLayout ? 86 : 112) : s(isPrintLayout ? 100 : 118);
  const productX = options?.showSku ? s(isPrintLayout ? 140 : 168) : s(isPrintLayout ? 108 : 118);
  const lineTotalRight = s(isPrintLayout ? 552 : 528);
  const lines = Array.isArray(draft.lines) ? draft.lines : [];
  const licenseSummary = draft.includeLicenseFee
    ? summarizeLicenseByType(lines as Array<{ quantity: number; product?: unknown }>, (line) => line.product ?? {})
    : [];
  const displayRows = [
    ...lines.map((line: any) => ({ type: "product" as const, line })),
    ...licenseSummary.map((entry, index) => ({ type: "license" as const, entry, index }))
  ];
  const defaultRowHeight = s(32);
  const summaryGap = s(24);
  const headerTitle = options?.headerTitle ?? "";
  const headerSubtitle = options?.headerSubtitle ?? "";
  const hasHeaderTitle = headerTitle.trim().length > 0;
  const hasSubtitle = headerSubtitle.trim().length > 0;
  const headerTopY = hasSubtitle ? s(696) : s(710);
  const headerLabelY = headerTopY - s(20);
  const headerBottomY = headerTopY - s(32);
  const customerY = hasSubtitle ? s(714) : s(730);
  const rowStartY = headerBottomY - s(6);
  const minSummaryTop = isPrintLayout ? s(182) : s(158);
  const lineCount = Math.max(1, displayRows.length);
  const availableRowHeight = Math.max(s(80), rowStartY - minSummaryTop - summaryGap);
  const idealRowHeight = availableRowHeight / lineCount;
  const rowHeight = Math.max(s(21), Math.min(isPrintLayout ? s(74) : s(46), idealRowHeight));
  const rowDensity = rowHeight / defaultRowHeight;
  const layoutScale = isPrintLayout
    ? Math.max(0.94, Math.min(1.56, rowDensity + 0.28))
    : Math.max(0.84, Math.min(1.04, rowDensity + 0.04));

  let headerTitleSize = Math.max(s(7.5), s(options?.headerTitleSize ?? 10) * layoutScale);
  while (regular.widthOfTextAtSize(headerTitle, headerTitleSize) > pageWidth - s(20) && headerTitleSize > s(7)) {
    headerTitleSize -= s(0.4);
  }
  const subtitleSize = Math.max(s(7), Math.min(isPrintLayout ? s(12.2) : s(10.5), s(8.5) * layoutScale));
  const customerSize = Math.max(s(16), Math.min(isPrintLayout ? s(35) : s(26), s(26.5) * layoutScale));
  const headerLabelSize = Math.max(s(8), Math.min(isPrintLayout ? s(13.2) : s(10.5), s(10.3) * layoutScale));
  const metaSize = Math.max(s(8.5), Math.min(isPrintLayout ? s(17) : s(12), s(12.8) * layoutScale));
  const metaSubSize = Math.max(s(7), Math.min(isPrintLayout ? s(14) : s(9.5), s(10.8) * layoutScale));
  const titleY = hasHeaderTitle ? s(752) : s(0);
  const subtitleY = hasHeaderTitle ? s(740) : s(752);

  if (hasHeaderTitle) {
    page.drawText(headerTitle, {
      x: (pageWidth - regular.widthOfTextAtSize(headerTitle, headerTitleSize)) / 2,
      y: titleY,
      size: headerTitleSize,
      font: regular,
      color: muted
    });
  }

  if (hasSubtitle) {
    page.drawText(headerSubtitle, {
      x: (pageWidth - regular.widthOfTextAtSize(headerSubtitle, subtitleSize)) / 2,
      y: subtitleY,
      size: subtitleSize,
      font: regular,
      color: muted
    });
  }

  drawRightText({
    page,
    text: formatDate(new Date(draft.date)),
    x: lineTotalRight,
    y: s(772),
    size: metaSize,
    font: regular,
    color: textColor
  });

  drawRightText({
    page,
    text: `Zahlart: ${paymentMethodText(draft.paymentMethod)}`,
    x: lineTotalRight,
    y: s(758),
    size: metaSubSize,
    font: regular,
    color: muted
  });

  const customerName = String(draft.customer?.name ?? "").slice(0, 42);
  const customerWidth = bold.widthOfTextAtSize(customerName, customerSize);
  page.drawText(customerName, {
    x: (pageWidth - customerWidth) / 2,
    y: customerY,
    size: customerSize,
    font: bold,
    color: textColor
  });

  page.drawLine({
    start: { x: left, y: headerTopY },
    end: { x: right, y: headerTopY },
    color: soft,
    thickness: s(1)
  });
  page.drawText("Menge", { x: s(isPrintLayout ? 34 : 62), y: headerLabelY, size: headerLabelSize, font: bold, color: muted });
  if (options?.showSku) {
    page.drawText("Art.", { x: skuX, y: headerLabelY, size: headerLabelSize, font: bold, color: muted });
  }
  page.drawText("Produkt", { x: productX, y: headerLabelY, size: headerLabelSize, font: bold, color: muted });
  drawRightText({
    page,
    text: "Summe",
    x: lineTotalRight,
    y: headerLabelY,
    size: headerLabelSize,
    font: bold,
    color: muted
  });
  page.drawLine({
    start: { x: left, y: headerBottomY },
    end: { x: right, y: headerBottomY },
    color: soft,
    thickness: s(1)
  });

  const rowFontSize = Math.max(s(6.5), Math.min(isPrintLayout ? s(19.5) : s(15), rowHeight * 0.6));
  const skuFontSize = Math.max(s(6.4), rowFontSize * 0.9);
  const qtyFontSize = Math.max(s(5.5), Math.min(isPrintLayout ? s(10.5) : s(12.5), rowHeight * 0.28));
  const qtyBadgeHeight = Math.max(s(4.5), Math.min(isPrintLayout ? s(12.5) : s(16), rowHeight * 0.32));
  const qtyBadgePaddingX = Math.max(s(3.2), isPrintLayout ? s(5.4) : s(12) * rowDensity);
  const nameMaxCharsBase = rowDensity > 1.2 ? 48 : rowDensity > 0.9 ? 40 : rowDensity > 0.7 ? 32 : 24;
  const nameMaxChars = options?.showSku ? Math.max(16, nameMaxCharsBase - 10) : nameMaxCharsBase;
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

  if (displayRows.length === 0) {
    page.drawText("Keine Positionen", {
      x: productX,
      y: rowStartY - s(4),
      size: s(12),
      font: regular,
      color: muted
    });
  }

  displayRows.forEach((row, index) => {
    const rowTop = rowStartY - index * rowHeight;
    const rowBottom = rowTop - rowHeight;
    const rowCenterY = (rowTop + rowBottom) / 2;
    const primaryY = rowCenterY - rowFontSize * 0.3;
    const qtyText = row.type === "product" ? formatQuantity(row.line.quantity) : "1";
    const sku = row.type === "product" ? String(row.line.product?.sku ?? "").trim() : "Liz.";
    const name =
      row.type === "product"
        ? String(row.line.product?.name ?? "").trim().slice(0, nameMaxChars)
        : `${licenseLabel(row.entry.licenseType)} ${weightKg(row.entry.totalWeightGrams)} kg`;
    const lineTotal =
      row.type === "product"
        ? multiplyCentsByQuantity(row.line.quantity, row.line.unitPriceCents)
        : row.entry.totalFeeCents;

    const badgeWidth = Math.max(s(18), bold.widthOfTextAtSize(qtyText, qtyFontSize) + qtyBadgePaddingX);
    const badgeX = qtyCenter - badgeWidth / 2;
    const badgeY = rowCenterY - qtyBadgeHeight / 2;
    page.drawRectangle({
      x: badgeX,
      y: badgeY,
      width: badgeWidth,
      height: qtyBadgeHeight,
      color: rgb(249 / 255, 252 / 255, 254 / 255),
      borderColor: soft,
      borderWidth: s(0.45)
    });

    const qtyWidth = bold.widthOfTextAtSize(qtyText, qtyFontSize);
    page.drawText(qtyText, {
      x: qtyCenter - qtyWidth / 2,
      y: rowCenterY - qtyFontSize * 0.36,
      size: qtyFontSize,
      font: bold,
      color: accent
    });

    if (options?.showSku) {
      page.drawText(sku.slice(0, 9), {
        x: skuX,
        y: primaryY,
        size: skuFontSize,
        font: regular,
        color: textColor
      });
    }

    page.drawText(name, { x: productX, y: primaryY, size: rowFontSize, font: regular, color: textColor });

    drawRightText({
      page,
      text: money(lineTotal),
      x: lineTotalRight,
      y: primaryY,
      size: rowFontSize,
      font: bold,
      color: textColor
    });

    page.drawLine({
      start: { x: left, y: rowBottom },
      end: { x: right, y: rowBottom },
      color: soft,
      thickness: Math.max(s(0.45), s(0.7))
    });
  });

  const usedRows = Math.max(1, displayRows.length);
  const summaryTop = rowStartY - usedRows * rowHeight - summaryGap - noteBlockHeight;
  const summaryScale = isPrintLayout
    ? Math.max(0.96, Math.min(1.3, rowDensity + 0.18))
    : Math.max(0.86, Math.min(1.02, rowDensity + 0.04));
  const summaryLabelSize = s(isPrintLayout ? 11 : 10) * summaryScale;
  const summaryValueSize = s(isPrintLayout ? 13 : 12) * summaryScale;
  const summaryTotalSize = s(isPrintLayout ? 25 : 25) * summaryScale;

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

  const summaryRows: Array<{ label: string; value: number }> = [];
  if (!draft.subtractVat) {
    summaryRows.push({ label: "Zwischensumme", value: totals.subtotalCents });
    summaryRows.push({ label: "MWSt 19%", value: totals.vatCents });
  }

  const summaryRowGap = s(isPrintLayout ? 20 : 20) * summaryScale;
  const summaryRightX = s(isPrintLayout ? 332 : 370);
  summaryRows.forEach((row, index) => {
    const rowY = summaryTop - index * summaryRowGap;
    page.drawText(row.label, { x: summaryRightX, y: rowY, size: summaryLabelSize, font: regular, color: muted });
    drawRightText({
      page,
      text: money(row.value),
      x: lineTotalRight,
      y: rowY,
      size: summaryValueSize,
      font: regular,
      color: textColor
    });
  });

  const lastSummaryRowY = summaryTop - Math.max(0, summaryRows.length - 1) * summaryRowGap;
  const ruleY = lastSummaryRowY - s(12) * summaryScale;
  const totalLabelY = ruleY - s(22) * summaryScale;
  const totalValueY = ruleY - s(28) * summaryScale;

  page.drawLine({
    start: { x: s(isPrintLayout ? 338 : 372), y: ruleY },
    end: { x: lineTotalRight, y: ruleY },
    thickness: s(2),
    color: accent
  });

  page.drawText("Gesamt", { x: s(isPrintLayout ? 348 : 384), y: totalLabelY, size: summaryLabelSize, font: regular, color: muted });
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


