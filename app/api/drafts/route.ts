import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { badRequest, notFound, unauthorized } from "@/lib/http";
import { z } from "zod";

export const runtime = "nodejs";

const createDraftSchema = z.object({
  customerId: z.number().int().positive()
});

export async function GET() {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const drafts = await prisma.draft.findMany({
    take: 120,
    orderBy: { date: "desc" },
    include: {
      customer: { select: { name: true } },
      lines: { select: { quantity: true, unitPriceCents: true, product: { select: { licenseFeeCents: true } } } }
    }
  });

  return NextResponse.json({
    drafts: drafts.map((draft: any) => ({
      id: draft.id,
      customerId: draft.customerId,
      customerName: draft.customer.name,
      date: draft.date.toISOString(),
      note: draft.note ?? null,
      includeLicenseFee: draft.includeLicenseFee ?? false,
      paymentMethod: draft.paymentMethod,
      tourClosedAt: draft.tourClosedAt ? draft.tourClosedAt.toISOString() : null,
      updatedAt: draft.updatedAt.toISOString(),
      totalCents: draft.lines.reduce(
        (sum: number, line: any) =>
          sum +
          line.quantity * (line.unitPriceCents + (draft.includeLicenseFee ? (line.product?.licenseFeeCents ?? 0) : 0)),
        0
      )
    }))
  });
}

export async function POST(request: Request) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const parsed = createDraftSchema.safeParse(await request.json());
  if (!parsed.success) return badRequest("Ungueltige Anfrage.");

  const result = await prisma.$transaction(async (tx: any) => {
    const customer = await tx.customer.findUnique({
      where: { id: parsed.data.customerId },
      include: {
        customerPrice: {
          include: {
            product: {
              select: { id: true, name: true, sku: true, defaultPriceCents: true, licenseFeeCents: true, isActive: true }
            }
          },
          orderBy: { productId: "asc" }
        }
      }
    });

    if (!customer) return null;

    const draft = await tx.draft.create({
      data: {
        customerId: customer.id,
        paymentMethod: "CASH"
      }
    });

    return { customer, draft };
  });

  if (!result) return notFound("Kunde wurde nicht gefunden.");
  const { customer, draft } = result;

  const customerSuggestedProducts = customer.customerPrice
    .filter((price: any) => price.product?.isActive)
    .map((price: any) => ({
      id: price.product.id,
      sku: price.product.sku,
      name: price.product.name,
      defaultPriceCents: price.product.defaultPriceCents,
      licenseFeeCents: price.product.licenseFeeCents ?? 0
    }))
    .sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, "de-DE"));

  const customerPriceMap = Object.fromEntries(
    customer.customerPrice.map((price: any) => [price.productId, price.priceCents])
  ) as Record<number, number>;

  return NextResponse.json({
    draft: {
      id: draft.id,
      customerId: draft.customerId,
      customerName: customer.name,
      date: draft.date.toISOString(),
      note: draft.note ?? null,
      includeLicenseFee: draft.includeLicenseFee ?? false,
      paymentMethod: draft.paymentMethod,
      tourClosedAt: draft.tourClosedAt ? draft.tourClosedAt.toISOString() : null,
      updatedAt: draft.updatedAt.toISOString(),
      lines: []
    },
    customerPriceMap,
    productLicenseFeeMap: Object.fromEntries(
      customer.customerPrice.map((price: any) => [price.productId, price.product?.licenseFeeCents ?? 0])
    ) as Record<number, number>,
    customerSuggestedProducts
  });
}
