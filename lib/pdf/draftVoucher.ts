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
  paperMode?: "preview" | "print";
};

const A4_WIDTH = 595;
const A4_HEIGHT = 842;
const A6_WIDTH = 298;
const A6_HEIGHT = 420;

function s(value: number, scale: number): number {
  return value * scale;
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
  const paperMode = options?.paperMode ?? "preview";
  const pageWidth = paperMode === "print" ? A4_WIDTH : A6_WIDTH;
  const pageHeight = paperMode === "print" ? A4_HEIGHT : A6_HEIGHT;
  const scale = paperMode === "print" ? 1 : Math.min(A6_WIDTH / A4_WIDTH, A6_HEIGHT / A4_HEIGHT);
  const page = pdf.addPage([pageWidth, pageHeight]);

  const textColor = rgb(74 / 255, 74 / 255, 74 / 255);
  const accent = rgb(47 / 255, 126 / 255, 161 / 255);
  const soft = rgb(229 / 255, 229 / 255, 229 / 255);
  const muted = rgb(0.45, 0.45, 0.45);

  const left = s(56, scale);
  const right = s(539, scale);
  const qtyCenter = s(80, scale);
  const productX = s(118, scale);
  const lineTotalRight = s(528, scale);

  const headerTitle = (options?.headerTitle ?? "").trim();
  const headerSubtitle = (options?.headerSubtitle ?? "").trim();
  const hasHeader = headerTitle.length > 0 || headerSubtitle.length > 0;

  let headerTitleSize = s(options?.headerTitleSize ?? 10, scale);
  if (headerTitle.length > 0) {
    while (regular.widthOfTextAtSize(headerTitle, headerTitleSize) > pageWidth - s(20, scale) && headerTitleSize > s(7, scale)) {
      headerTitleSize -= s(0.4, scale);
    }

    page.drawText(headerTitle, {
      x: (pageWidth - regular.widthOfTextAtSize(headerTitle, headerTitleSize)) / 2,
      y: s(752, scale),
      size: headerTitleSize,
      font: regular,
      color: muted
    });
  }

  if (headerSubtitle.length > 0) {
    page.drawText(headerSubtitle, {
      x: (pageWidth - regular.widthOfTextAtSize(headerSubtitle, s(8, scale))) / 2,
      y: s(740, scale),
      size: s(8, scale),
      font: regular,
      color: muted
    });
  }

  drawRightText({
    page,
    text: formatDate(new Date(draft.date)),
    x: lineTotalRight,
    y: s(hasHeader ? 772 : 792, scale),
    size: s(11, scale),
    font: regular,
    color: textColor
  });

  drawRightText({
    page,
    text: `Zahlart: ${paymentMethodText(draft.paymentMethod)}`,
    x: lineTotalRight,
    y: s(hasHeader ? 758 : 778, scale),
    size: s(8.5, scale),
    font: regular,
    color: muted
  });

  const customerName = String(draft.customer?.name ?? "").slice(0, 42);
  const customerSize = s(22, scale);
  const customerWidth = bold.widthOfTextAtSize(customerName, customerSize);
  page.drawText(customerName, {
    x: (pageWidth - customerWidth) / 2,
    y: s(hasHeader ? 714 : 742, scale),
    size: customerSize,
    font: bold,
    color: textColor
  });

  const headerY = s(hasHeader ? 676 : 704, scale);
  page.drawLine({
    start: { x: left, y: s(hasHeader ? 696 : 724, scale) },
    end: { x: right, y: s(hasHeader ? 696 : 724, scale) },
    color: soft,
    thickness: s(1, scale)
  });
  page.drawText("Menge", { x: s(62, scale), y: headerY, size: s(9, scale), font: bold, color: muted });
  page.drawText("Produkt", { x: productX, y: headerY, size: s(9, scale), font: bold, color: muted });
  drawRightText({
    page,
    text: "Summe",
    x: lineTotalRight,
    y: headerY,
    size: s(9, scale),
    font: bold,
    color: muted
  });
  page.drawLine({
    start: { x: left, y: s(hasHeader ? 664 : 692, scale) },
    end: { x: right, y: s(hasHeader ? 664 : 692, scale) },
    color: soft,
    thickness: s(1, scale)
  });

  const rowStartY = s(hasHeader ? 640 : 668, scale);
  const defaultRowHeight = s(32, scale);
  const summaryGap = s(24, scale);
  const minSummaryTop = s(158, scale);
  const lines = Array.isArray(draft.lines) ? draft.lines : [];
  const lineCount = Math.max(1, lines.length);
  const availableRowHeight = Math.max(s(80, scale), rowStartY - minSummaryTop - summaryGap);
  const idealRowHeight = availableRowHeight / lineCount;
  const rowHeight = Math.max(s(21, scale), Math.min(s(46, scale), idealRowHeight));
  const rowDensity = rowHeight / defaultRowHeight;
  const rowFontSize = Math.max(s(6, scale), Math.min(s(12.5, scale), rowHeight * 0.5));
  const qtyFontSize = Math.max(s(5, scale), Math.min(s(10.5, scale), rowHeight * 0.42));
  const qtyBadgeHeight = Math.max(s(4.5, scale), Math.min(s(16, scale) * rowDensity, rowHeight * 1.05));
  const qtyBadgePaddingX = Math.max(s(4, scale), s(12, scale) * rowDensity);
  const rowDividerOffset = Math.min(rowHeight * 0.72, Math.max(s(1.6, scale), s(9, scale) * rowDensity));
  const nameMaxChars = rowDensity > 1.2 ? 42 : rowDensity > 0.9 ? 36 : rowDensity > 0.7 ? 30 : 24;
  const noteRaw = (draft.note ?? "").trim();
  const noteLines =
    noteRaw.length > 0
      ? [noteRaw.slice(0, 66), noteRaw.length > 66 ? noteRaw.slice(66, 132) : ""].filter((value) => value.length > 0)
      : [];
  const noteBlockHeight = noteLines.length > 0 ? s(16 + noteLines.length * 8, scale) : 0;

  const totals = calculateDraftTotals({
    lines,
    includeLicenseFee: draft.includeLicenseFee,
    discountCents: draft.discountCents,
    subtractVat: draft.subtractVat
  });

  if (lines.length === 0) {
    page.drawText("Keine Positionen", {
      x: productX,
      y: rowStartY - s(4, scale),
      size: s(12, scale),
      font: regular,
      color: muted
    });
  }

  lines.forEach((line: any, index: number) => {
    const y = rowStartY - index * rowHeight;
    const { details, lineFeeCents } = getLineLicenseTotals(line.quantity, line.product ?? {});
    const lineTotal = multiplyCentsByQuantity(line.quantity, line.unitPriceCents) + (draft.includeLicenseFee ? lineFeeCents : 0);
    const sku = String(line.product?.sku ?? "").trim();
    const productName = String(line.product?.name ?? "").trim();
    const labelRaw = options?.showSku && sku.length > 0 ? `${sku} ${productName}` : productName;
    const name = labelRaw.slice(0, nameMaxChars);
    const qtyText = formatQuantity(line.quantity);

    const badgeWidth = Math.max(s(18, scale), bold.widthOfTextAtSize(qtyText, qtyFontSize) + qtyBadgePaddingX);
    const badgeX = qtyCenter - badgeWidth / 2;
    page.drawRectangle({
      x: badgeX,
      y: y - s(2, scale) * rowDensity,
      width: badgeWidth,
      height: qtyBadgeHeight,
      color: rgb(245 / 255, 249 / 255, 252 / 255),
      borderColor: soft,
      borderWidth: s(0.7, scale)
    });

    const qtyWidth = bold.widthOfTextAtSize(qtyText, qtyFontSize);
    page.drawText(qtyText, {
      x: qtyCenter - qtyWidth / 2,
      y: y + s(0.5, scale) * rowDensity,
      size: qtyFontSize,
      font: bold,
      color: accent
    });

    page.drawText(name, { x: productX, y, size: rowFontSize, font: regular, color: textColor });
    if (draft.includeLicenseFee && details.hasLicense) {
      const small = Math.max(s(5, scale), rowFontSize * 0.62);
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
      thickness: Math.max(s(0.45, scale), s(0.8, scale) * rowDensity)
    });
  });

  const licenseSummary = draft.includeLicenseFee
    ? summarizeLicenseByType(lines as Array<{ quantity: number; product?: unknown }>, (line) => line.product ?? {})
    : [];
  const usedRows = Math.max(1, lines.length);
  const summaryTop = rowStartY - usedRows * rowHeight - summaryGap - noteBlockHeight;
  const summaryScale = Math.max(0.85, Math.min(1.08, rowDensity + 0.08));
  const summaryLabelSize = s(10, scale) * summaryScale;
  const summaryValueSize = s(12, scale) * summaryScale;
  const summaryTotalSize = s(25, scale) * summaryScale;

  if (noteLines.length > 0) {
    const noteLabelY = summaryTop + noteBlockHeight - s(9, scale);
    page.drawText("Notiz:", {
      x: s(64, scale),
      y: noteLabelY,
      size: s(8, scale),
      font: bold,
      color: muted
    });
    noteLines.forEach((line, index) => {
      page.drawText(line, {
        x: s(104, scale),
        y: noteLabelY - index * s(8.5, scale),
        size: s(8, scale),
        font: regular,
        color: textColor
      });
    });
  }

  if (licenseSummary.length > 0) {
    page.drawText("Lizenzen (Gewicht):", {
      x: s(64, scale),
      y: summaryTop,
      size: s(8.2, scale),
      font: bold,
      color: muted
    });

    licenseSummary.slice(0, 4).forEach((entry, index) => {
      page.drawText(`${entry.licenseType}: ${weightKg(entry.totalWeightGrams)} kg`, {
        x: s(64, scale),
        y: summaryTop - s(10 + index * 8, scale),
        size: s(7.8, scale),
        font: regular,
        color: textColor
      });
    });
  }

  let ruleY = summaryTop - s(10, scale) * summaryScale;
  let totalLabelY = summaryTop - s(32, scale) * summaryScale;
  let totalValueY = summaryTop - s(38, scale) * summaryScale;

  if (draft.subtractVat) {
    ruleY = summaryTop;
    totalLabelY = summaryTop - s(22, scale) * summaryScale;
    totalValueY = summaryTop - s(28, scale) * summaryScale;
  } else {
    page.drawText("Zwischensumme", { x: s(384, scale), y: summaryTop, size: summaryLabelSize, font: regular, color: muted });
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
      x: s(384, scale),
      y: summaryTop - s(20, scale) * summaryScale,
      size: summaryLabelSize,
      font: regular,
      color: muted
    });
    drawRightText({
      page,
      text: money(totals.vatCents),
      x: lineTotalRight,
      y: summaryTop - s(20, scale) * summaryScale,
      size: summaryValueSize,
      font: regular,
      color: textColor
    });
    ruleY = summaryTop - s(30, scale) * summaryScale;
    totalLabelY = summaryTop - s(52, scale) * summaryScale;
    totalValueY = summaryTop - s(58, scale) * summaryScale;
  }

  page.drawLine({
    start: { x: s(372, scale), y: ruleY },
    end: { x: lineTotalRight, y: ruleY },
    thickness: s(2, scale),
    color: accent
  });

  page.drawText("Gesamt", { x: s(384, scale), y: totalLabelY, size: summaryLabelSize, font: regular, color: muted });
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


