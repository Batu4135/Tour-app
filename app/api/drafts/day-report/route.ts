import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { badRequest, unauthorized } from "@/lib/http";

export const runtime = "nodejs";

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

export async function GET(request: Request) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const url = new URL(request.url);
  const idsParam = (url.searchParams.get("ids") ?? "").trim();
  if (!idsParam) return badRequest("Keine Vordruck-IDs uebergeben.");

  const ids = Array.from(
    new Set(
      idsParam
        .split(",")
        .map((value) => Number.parseInt(value.trim(), 10))
        .filter((value) => Number.isFinite(value) && value > 0)
    )
  );
  if (ids.length === 0) return badRequest("Ungueltige Vordruck-IDs.");

  const drafts = await prisma.draft.findMany({
    where: { id: { in: ids } },
    include: {
      customer: { select: { name: true } },
      lines: {
        include: {
          product: { select: { name: true, licenseFeeCents: true } }
        },
        orderBy: { id: "asc" }
      }
    },
    orderBy: { id: "asc" }
  });

  if (drafts.length === 0) return badRequest("Keine Vordrucke gefunden.");

  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595;
  const pageHeight = 842;
  const left = 48;
  const right = pageWidth - 48;

  let page = pdf.addPage([pageWidth, pageHeight]);
  let y = pageHeight - 56;

  const drawHeader = () => {
    page.drawText("Tagesuebersicht Vordrucke", {
      x: left,
      y,
      size: 17,
      font: bold,
      color: rgb(0.2, 0.2, 0.2)
    });
    y -= 24;
    page.drawText(`Erstellt: ${new Date().toLocaleString("de-DE")}`, {
      x: left,
      y,
      size: 10,
      font: regular,
      color: rgb(0.4, 0.4, 0.4)
    });
    y -= 22;
  };

  const ensureSpace = (needed: number) => {
    if (y - needed >= 56) return;
    page = pdf.addPage([pageWidth, pageHeight]);
    y = pageHeight - 56;
    drawHeader();
  };

  drawHeader();

  for (const draft of drafts) {
    const subtotal = draft.lines.reduce((sum, line) => {
      const licenseFee = draft.includeLicenseFee ? line.product.licenseFeeCents ?? 0 : 0;
      return sum + line.quantity * (line.unitPriceCents + licenseFee);
    }, 0);
    const vat = Math.round(subtotal * 0.19);
    const total = subtotal + vat;

    const estimatedHeight = 96 + draft.lines.length * (draft.includeLicenseFee ? 22 : 16);
    ensureSpace(estimatedHeight);

    page.drawRectangle({
      x: left,
      y: y - 8,
      width: right - left,
      height: 30,
      color: rgb(0.96, 0.97, 0.99)
    });
    page.drawText(`#${draft.id}  ${draft.customer.name}`, {
      x: left + 10,
      y: y + 3,
      size: 12,
      font: bold,
      color: rgb(0.2, 0.2, 0.2)
    });
    page.drawText(`${new Date(draft.date).toLocaleDateString("de-DE")}  |  ${paymentLabel(draft.paymentMethod)}`, {
      x: left + 10,
      y: y - 12,
      size: 9,
      font: regular,
      color: rgb(0.35, 0.35, 0.35)
    });
    page.drawText(`Gesamt ${formatMoney(total)} EUR`, {
      x: right - 140,
      y: y - 4,
      size: 10,
      font: bold,
      color: rgb(0.2, 0.2, 0.2)
    });
    y -= 44;

    if (draft.lines.length === 0) {
      page.drawText("Keine Positionen", {
        x: left + 10,
        y,
        size: 9,
        font: regular,
        color: rgb(0.45, 0.45, 0.45)
      });
      y -= 18;
    } else {
      for (const line of draft.lines) {
        ensureSpace(draft.includeLicenseFee ? 24 : 18);
        const lineLicenseFee = draft.includeLicenseFee ? line.product.licenseFeeCents ?? 0 : 0;
        const lineTotal = line.quantity * (line.unitPriceCents + lineLicenseFee);
        const lineText = `${line.quantity} x ${line.product.name}`;
        const clipped = lineText.length > 72 ? `${lineText.slice(0, 69)}...` : lineText;
        page.drawText(clipped, {
          x: left + 10,
          y,
          size: 9,
          font: regular,
          color: rgb(0.22, 0.22, 0.22)
        });
        page.drawText(`${formatMoney(lineTotal)} EUR`, {
          x: right - 120,
          y,
          size: 9,
          font: regular,
          color: rgb(0.22, 0.22, 0.22)
        });

        if (draft.includeLicenseFee && lineLicenseFee > 0) {
          page.drawText(`Lizenz ${formatMoney(lineLicenseFee)} / Stk | Netto ${formatMoney(lineLicenseFee * line.quantity)} EUR`, {
            x: left + 18,
            y: y - 10,
            size: 8,
            font: regular,
            color: rgb(0.45, 0.45, 0.45)
          });
          y -= 22;
        } else {
          y -= 16;
        }
      }
    }

    y -= 10;
  }

  const bytes = await pdf.save();
  return new NextResponse(bytes as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=\"tour-uebersicht.pdf\"`
    }
  });
}
