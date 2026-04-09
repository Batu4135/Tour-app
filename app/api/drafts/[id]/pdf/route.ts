import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { badRequest, notFound, unauthorized } from "@/lib/http";
import { createDraftVoucherFonts, drawDraftVoucherPage } from "@/lib/pdf/draftVoucher";

export const runtime = "nodejs";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: RouteContext) {
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
  const fonts = await createDraftVoucherFonts(pdf);
  const url = new URL(request.url);
  const pageSize = url.searchParams.get("mode") === "print" ? "A4" : "A6";
  drawDraftVoucherPage(pdf, fonts, draft, { showSku: true, pageSize });
  const bytes = await pdf.save();

  return new NextResponse(bytes as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="vordruck-${id}.pdf"`
    }
  });
}
