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

  const left = s(56);
  const right = s(539);
  const qtyCenter = s(80);
  const skuX = options?.showSku ? s(112) : s(118);
  const productX = options?.showSku ? s(168) : s(118);
  const lineTotalRight = s(528);
  const lines = Array.isArray(draft.lines) ? draft.lines : [];
  const rowStartY = s(660);
  const defaultRowHeight = s(32);
  const summaryGap = s(24);
  const minSummaryTop = s(158);
  const lineCount = Math.max(1, lines.length);
  const availableRowHeight = Math.max(s(80), rowStartY - minSummaryTop - summaryGap);
  const idealRowHeight = availableRowHeight / lineCount;
  const rowHeight = Math.max(s(21), Math.min(isPrintLayout ? s(68) : s(46), idealRowHeight));
  const rowDensity = rowHeight / defaultRowHeight;
  const layoutScale = isPrintLayout
    ? Math.max(0.88, Math.min(1.42, rowDensity + 0.18))
    : Math.max(0.84, Math.min(1.02, rowDensity + 0.02));

  const headerTitle = options?.headerTitle ?? "";
  const licenseModeText = draft.includeLicenseFee ? "Inkl. Lizenzierung" : "Ohne Lizenzierung";
  const headerSubtitle = options?.headerSubtitle ?? licenseModeText;
  const hasHeaderTitle = headerTitle.trim().length > 0;

  let headerTitleSize = Math.max(s(7.5), s(options?.headerTitleSize ?? 10) * layoutScale);
  while (regular.widthOfTextAtSize(headerTitle, headerTitleSize) > pageWidth - s(20) && headerTitleSize > s(7)) {
    headerTitleSize -= s(0.4);
  }
  const subtitleSize = Math.max(s(7), Math.min(isPrintLayout ? s(12.5) : s(10.5), s(8.4) * layoutScale));
  const customerSize = Math.max(s(16), Math.min(isPrintLayout ? s(30) : s(26), s(23.5) * layoutScale));
  const headerLabelSize = Math.max(s(8), Math.min(isPrintLayout ? s(11.5) : s(10.5), s(9.3) * layoutScale));
  const metaSize = Math.max(s(8.5), Math.min(isPrintLayout ? s(13.5) : s(12), s(10.8) * layoutScale));
  const metaSubSize = Math.max(s(7), Math.min(isPrintLayout ? s(10.8) : s(9.5), s(8.9) * layoutScale));
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

  page.drawText(headerSubtitle, {
    x: (pageWidth - regular.widthOfTextAtSize(headerSubtitle, subtitleSize)) / 2,
    y: subtitleY,
    size: subtitleSize,
    font: regular,
    color: muted
  });

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
  page.drawText("Menge", { x: s(62), y: headerY, size: headerLabelSize, font: bold, color: muted });
  if (options?.showSku) {
    page.drawText("Art.", { x: skuX, y: headerY, size: headerLabelSize, font: bold, color: muted });
  }
  page.drawText("Produkt", { x: productX, y: headerY, size: headerLabelSize, font: bold, color: muted });
  drawRightText({
    page,
    text: "Summe",
    x: lineTotalRight,
    y: headerY,
    size: headerLabelSize,
    font: bold,
    color: muted
  });
  page.drawLine({
    start: { x: left, y: s(664) },
    end: { x: right, y: s(664) },
    color: soft,
    thickness: s(1)
  });

  const rowFontSize = Math.max(s(6.5), Math.min(isPrintLayout ? s(16.5) : s(15), rowHeight * 0.52));
  const qtyFontSize = Math.max(s(5.5), Math.min(isPrintLayout ? s(11.5) : s(12.5), rowHeight * 0.34));
  const qtyBadgeHeight = Math.max(s(4.5), Math.min(isPrintLayout ? s(14.5) : s(16), rowHeight * 0.42));
  const qtyBadgePaddingX = Math.max(s(3.5), isPrintLayout ? s(6.5) : s(12) * rowDensity);
  const nameMaxCharsBase = rowDensity > 1.2 ? 42 : rowDensity > 0.9 ? 36 : rowDensity > 0.7 ? 30 : 24;
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
    const { details, lineFeeCents } = getLineLicenseTotals(line.quantity, line.product ?? {});
    const lineTotal = multiplyCentsByQuantity(line.quantity, line.unitPriceCents) + (draft.includeLicenseFee ? lineFeeCents : 0);
    const sku = String(line.product?.sku ?? "").trim();
    const productName = String(line.product?.name ?? "").trim();
    const name = productName.slice(0, nameMaxChars);
    const qtyText = formatQuantity(line.quantity);
    const rowTop = rowStartY - index * rowHeight;
    const rowBottom = rowTop - rowHeight;
    const rowCenterY = (rowTop + rowBottom) / 2;
    const hasLicenseDetails = draft.includeLicenseFee && details.hasLicense;
    const small = Math.max(s(5), rowFontSize * 0.62);
    const primaryY = hasLicenseDetails ? rowCenterY + small * 0.58 : rowCenterY - rowFontSize * 0.28;
    const secondaryY = rowCenterY - small * 0.95;

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
        size: Math.max(s(6.5), rowFontSize * 0.92),
        font: regular,
        color: textColor
      });
    }

    page.drawText(name, { x: productX, y: primaryY, size: rowFontSize, font: regular, color: textColor });
    if (hasLicenseDetails) {
      page.drawText(`${details.licenseType} ${weightKg(details.licenseWeightGrams)} kg - Lizenz ${money(details.unitFeeCents)} / Stk`, {
        x: productX,
        y: secondaryY,
        size: small,
        font: regular,
        color: muted
      });
    }

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

  const licenseSummary = draft.includeLicenseFee
    ? summarizeLicenseByType(lines as Array<{ quantity: number; product?: unknown }>, (line) => line.product ?? {})
    : [];
  const usedRows = Math.max(1, lines.length);
  const summaryTop = rowStartY - usedRows * rowHeight - summaryGap - noteBlockHeight;
  const summaryScale = isPrintLayout
    ? Math.max(0.9, Math.min(1.18, rowDensity + 0.12))
    : Math.max(0.86, Math.min(1.02, rowDensity + 0.04));
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

  let ruleY = summaryTop - s(10) * summaryScale;
  let totalLabelY = summaryTop - s(32) * summaryScale;
  let totalValueY = summaryTop - s(38) * summaryScale;

  if (draft.subtractVat) {
    ruleY = summaryTop;
    totalLabelY = summaryTop - s(22) * summaryScale;
    totalValueY = summaryTop - s(28) * summaryScale;
  } else {
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


