import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { badRequest, notFound, unauthorized } from "@/lib/http";
import { z } from "zod";
import { LicenseType, getLicenseDetails } from "@/lib/license";
import { getProductPopularityMap } from "@/lib/productPopularity";
import { rankProductsBySearch } from "@/lib/productSearch";
import { roundQuantity } from "@/lib/quantity";

export const runtime = "nodejs";

type RouteContext = {
  params: {
    id: string;
  };
};

type IncomingLine = {
  productId: number;
  quantity: number;
  unitPriceCents: number;
};

const updateDraftSchema = z.object({
  lines: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().min(0),
        unitPriceCents: z.number().int().min(0)
      })
    )
    .default([]),
  note: z.string().nullable().optional(),
  includeLicenseFee: z.boolean().optional(),
  discountCents: z.number().int().min(0).optional(),
  subtractVat: z.boolean().optional(),
  paymentMethod: z.enum(["CASH", "BANK", "DIRECT_DEBIT"]).optional()
});

export async function GET(_: Request, { params }: RouteContext) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const id = Number.parseInt(params.id, 10);
  if (!Number.isFinite(id)) return badRequest("Ungueltige Vordruck-ID.");

  const draft = await prisma.draft.findUnique({
    where: { id },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          customerPrice: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  licenseType: true,
                  licenseWeightGrams: true,
                  defaultPriceCents: true,
                  licenseFeeCents: true,
                  isActive: true
                }
              }
            }
          }
        }
      },
      lines: {
        include: {
          product: { select: { name: true, sku: true, licenseFeeCents: true, licenseType: true, licenseWeightGrams: true } }
        }
      }
    }
  });
  if (!draft) return notFound("Vordruck nicht gefunden.");
  const productLicenseFeeMap: Record<number, number> = {};
  const productLicenseTypeMap: Record<number, LicenseType> = {};
  const productLicenseWeightGramsMap: Record<number, number> = {};

  for (const line of draft.lines) {
    const details = getLicenseDetails(line.product ?? {});
    productLicenseFeeMap[line.productId] = details.unitFeeCents;
    productLicenseTypeMap[line.productId] = details.licenseType;
    productLicenseWeightGramsMap[line.productId] = details.licenseWeightGrams;
  }

  for (const price of draft.customer.customerPrice) {
    const details = getLicenseDetails(price.product ?? {});
    productLicenseFeeMap[price.productId] = details.unitFeeCents;
    productLicenseTypeMap[price.productId] = details.licenseType;
    productLicenseWeightGramsMap[price.productId] = details.licenseWeightGrams;
  }

  const rawSuggestedProducts = draft.customer.customerPrice
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

  return NextResponse.json({
    draft: {
      id: draft.id,
      customerId: draft.customer.id,
      customerName: draft.customer.name,
      date: draft.date.toISOString(),
      note: draft.note ?? null,
      includeLicenseFee: draft.includeLicenseFee ?? false,
      discountCents: draft.discountCents ?? 0,
      subtractVat: draft.subtractVat ?? false,
      paymentMethod: draft.paymentMethod,
      tourClosedAt: draft.tourClosedAt ? draft.tourClosedAt.toISOString() : null,
      updatedAt: draft.updatedAt.toISOString(),
      lines: draft.lines.map((line: any) => {
        const details = getLicenseDetails(line.product ?? {});
        return {
          id: line.id,
          productId: line.productId,
          productName: line.product.name,
          productSku: line.product.sku,
          quantity: line.quantity,
          unitPriceCents: line.unitPriceCents,
          licenseType: details.licenseType,
          licenseWeightGrams: details.licenseWeightGrams,
          licenseFeeCents: details.unitFeeCents
        };
      })
    },
    customerPriceMap: Object.fromEntries(
      draft.customer.customerPrice.map((price: any) => [price.productId, price.priceCents])
    ) as Record<number, number>,
    productLicenseFeeMap,
    productLicenseTypeMap,
    productLicenseWeightGramsMap,
    customerSuggestedProducts
  });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const id = Number.parseInt(params.id, 10);
  if (!Number.isFinite(id)) return badRequest("Ungueltige Vordruck-ID.");

  const parsed = updateDraftSchema.safeParse(await request.json());
  if (!parsed.success) return badRequest("Ungueltige Anfrage.");
  const body = parsed.data;
  const lines = body.lines as IncomingLine[];

  const sanitized = lines
    .map((line) => ({
      productId: Math.round(line.productId),
      quantity: roundQuantity(line.quantity),
      unitPriceCents: Math.round(line.unitPriceCents)
    }))
    .filter((line) => line.quantity > 0 && line.unitPriceCents >= 0);

  if (sanitized.some((line) => !Number.isFinite(line.productId) || line.productId <= 0)) {
    return badRequest("Mindestens eine Produkt-ID ist ungueltig.");
  }

  const existing = await prisma.draft.findUnique({
    where: { id },
    select: { id: true, includeLicenseFee: true, discountCents: true, subtractVat: true, paymentMethod: true }
  });
  if (!existing) return notFound("Vordruck nicht gefunden.");

  await prisma.$transaction(async (tx: any) => {
    await tx.draft.update({
      where: { id },
      data: {
        note: body.note?.trim() || null,
        includeLicenseFee: body.includeLicenseFee ?? existing.includeLicenseFee,
        discountCents: body.discountCents ?? existing.discountCents,
        subtractVat: body.subtractVat ?? existing.subtractVat,
        paymentMethod: body.paymentMethod ?? existing.paymentMethod
      }
    });
    await tx.invoiceRevision.create({
      data: {
        invoiceId: id,
        payloadJson: {
          lines: sanitized,
          note: body.note?.trim() || null,
          includeLicenseFee: body.includeLicenseFee ?? existing.includeLicenseFee,
          discountCents: body.discountCents ?? existing.discountCents,
          subtractVat: body.subtractVat ?? existing.subtractVat,
          paymentMethod: body.paymentMethod ?? existing.paymentMethod
        },
        createdBy: user.id
      }
    });
    await tx.draftLine.deleteMany({ where: { draftId: id } });
    if (sanitized.length > 0) {
      await tx.draftLine.createMany({
        data: sanitized.map((line) => ({ ...line, draftId: id }))
      });
    }
  });

  const draft = await prisma.draft.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, name: true } },
      lines: {
        include: {
          product: { select: { name: true, sku: true, licenseFeeCents: true, licenseType: true, licenseWeightGrams: true } }
        },
        orderBy: { id: "asc" }
      }
    }
  });
  if (!draft) return notFound("Vordruck nicht gefunden.");

  return NextResponse.json({
    draft: {
      id: draft.id,
      customerId: draft.customer.id,
      customerName: draft.customer.name,
      date: draft.date.toISOString(),
      note: draft.note ?? null,
      includeLicenseFee: draft.includeLicenseFee ?? false,
      discountCents: draft.discountCents ?? 0,
      subtractVat: draft.subtractVat ?? false,
      paymentMethod: draft.paymentMethod,
      tourClosedAt: draft.tourClosedAt ? draft.tourClosedAt.toISOString() : null,
      updatedAt: draft.updatedAt.toISOString(),
      lines: draft.lines.map((line: any) => {
        const details = getLicenseDetails(line.product ?? {});
        return {
          id: line.id,
          productId: line.productId,
          productName: line.product.name,
          productSku: line.product.sku,
          quantity: line.quantity,
          unitPriceCents: line.unitPriceCents,
          licenseType: details.licenseType,
          licenseWeightGrams: details.licenseWeightGrams,
          licenseFeeCents: details.unitFeeCents
        };
      })
    }
  });
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const id = Number.parseInt(params.id, 10);
  if (!Number.isFinite(id)) return badRequest("Ungueltige Vordruck-ID.");

  const existing = await prisma.draft.findUnique({
    where: { id },
    select: { id: true }
  });
  if (!existing) return notFound("Vordruck nicht gefunden.");

  await prisma.draft.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
