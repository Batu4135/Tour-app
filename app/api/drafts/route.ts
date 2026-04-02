import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { badRequest, notFound, unauthorized } from "@/lib/http";
import { z } from "zod";
import { LicenseType, getLicenseDetails } from "@/lib/license";
import { getProductPopularityMap } from "@/lib/productPopularity";
import { rankProductsBySearch } from "@/lib/productSearch";
import { calculateDraftTotals } from "@/lib/draftTotals";

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
      customer: { select: { name: true, routeDay: true } },
      lines: {
        select: {
          quantity: true,
          unitPriceCents: true,
          product: { select: { licenseFeeCents: true, licenseType: true, licenseWeightGrams: true } }
        }
      }
    }
  });

  return NextResponse.json({
    drafts: drafts.map((draft: any) => ({
      id: draft.id,
      customerId: draft.customerId,
      customerName: draft.customer.name,
      customerRouteDay: draft.customer.routeDay ?? null,
      date: draft.date.toISOString(),
      note: draft.note ?? null,
      includeLicenseFee: draft.includeLicenseFee ?? false,
      discountCents: draft.discountCents ?? 0,
      subtractVat: draft.subtractVat ?? false,
      paymentMethod: draft.paymentMethod,
      tourClosedAt: draft.tourClosedAt ? draft.tourClosedAt.toISOString() : null,
      updatedAt: draft.updatedAt.toISOString(),
      totalCents: calculateDraftTotals({
        lines: draft.lines,
        includeLicenseFee: draft.includeLicenseFee,
        discountCents: draft.discountCents,
        subtractVat: draft.subtractVat
      }).invoiceTotalCents
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
              select: {
                id: true,
                name: true,
                sku: true,
                defaultPriceCents: true,
                licenseFeeCents: true,
                licenseType: true,
                licenseWeightGrams: true,
                isActive: true
              }
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
        paymentMethod: "CASH",
        discountCents: 0,
        subtractVat: false
      }
    });

    return { customer, draft };
  });

  if (!result) return notFound("Kunde wurde nicht gefunden.");
  const { customer, draft } = result;

  const rawSuggestedProducts = customer.customerPrice
    .filter((price: any) => price.product?.isActive)
    .map((price: any) => {
      const details = getLicenseDetails(price.product ?? {});
      return {
        id: price.product.id,
        sku: price.product.sku,
        name: price.product.name,
        defaultPriceCents: price.product.defaultPriceCents,
        licenseType: details.licenseType,
        licenseWeightGrams: details.licenseWeightGrams,
        licenseFeeCents: details.unitFeeCents
      };
    });
  const popularityMap = await getProductPopularityMap(prisma as any, rawSuggestedProducts);
  const customerSuggestedProducts = rankProductsBySearch(
    rawSuggestedProducts.map((product: (typeof rawSuggestedProducts)[number]) => ({
      ...product,
      popularityCount: popularityMap[product.id] ?? 0
    })),
    ""
  );

  const customerPriceMap = Object.fromEntries(
    customer.customerPrice.map((price: any) => [price.productId, price.priceCents])
  ) as Record<number, number>;

  const productLicenseTypeMap = Object.fromEntries(
    customer.customerPrice.map((price: any) => {
      const details = getLicenseDetails(price.product ?? {});
      return [price.productId, details.licenseType];
    })
  ) as Record<number, LicenseType>;
  const productLicenseWeightGramsMap = Object.fromEntries(
    customer.customerPrice.map((price: any) => {
      const details = getLicenseDetails(price.product ?? {});
      return [price.productId, details.licenseWeightGrams];
    })
  ) as Record<number, number>;

  return NextResponse.json({
    draft: {
      id: draft.id,
      customerId: draft.customerId,
      customerName: customer.name,
      date: draft.date.toISOString(),
      note: draft.note ?? null,
      includeLicenseFee: draft.includeLicenseFee ?? false,
      discountCents: draft.discountCents ?? 0,
      subtractVat: draft.subtractVat ?? false,
      paymentMethod: draft.paymentMethod,
      tourClosedAt: draft.tourClosedAt ? draft.tourClosedAt.toISOString() : null,
      updatedAt: draft.updatedAt.toISOString(),
      lines: []
    },
    customerPriceMap,
    productLicenseFeeMap: Object.fromEntries(
      customer.customerPrice.map((price: any) => [price.productId, getLicenseDetails(price.product ?? {}).unitFeeCents])
    ) as Record<number, number>,
    productLicenseTypeMap,
    productLicenseWeightGramsMap,
    customerSuggestedProducts
  });
}
