import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { badRequest, notFound, unauthorized } from "@/lib/http";
import { z } from "zod";

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
        quantity: z.number().int().min(0),
        unitPriceCents: z.number().int().min(0)
      })
    )
    .default([]),
  note: z.string().nullable().optional(),
  includeLicenseFee: z.boolean().optional(),
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
                  defaultPriceCents: true,
                  licenseFeeCents: true,
                  licenseMaterial: true,
                  licenseWeightGrams: true,
                  isActive: true
                }
              }
            }
          }
        }
      },
      lines: {
        include: {
          product: {
            select: { name: true, sku: true, licenseFeeCents: true, licenseMaterial: true, licenseWeightGrams: true }
          }
        }
      }
    }
  });
  if (!draft) return notFound("Vordruck nicht gefunden.");
  const productLicenseFeeMap = Object.fromEntries(
    draft.lines.map((line: any) => [line.productId, line.product?.licenseFeeCents ?? 0])
  ) as Record<number, number>;
  const productLicenseMaterialMap = Object.fromEntries(
    draft.lines.map((line: any) => [line.productId, line.product?.licenseMaterial ?? null])
  ) as Record<number, "LP" | "LK" | "LA" | "LV" | null>;
  const productLicenseWeightMap = Object.fromEntries(
    draft.lines.map((line: any) => [line.productId, line.product?.licenseWeightGrams ?? 0])
  ) as Record<number, number>;
  for (const price of draft.customer.customerPrice) {
    productLicenseFeeMap[price.productId] = price.product?.licenseFeeCents ?? 0;
    productLicenseMaterialMap[price.productId] = price.product?.licenseMaterial ?? null;
    productLicenseWeightMap[price.productId] = price.product?.licenseWeightGrams ?? 0;
  }

  return NextResponse.json({
    draft: {
      id: draft.id,
      customerId: draft.customer.id,
      customerName: draft.customer.name,
      date: draft.date.toISOString(),
      note: draft.note ?? null,
      includeLicenseFee: draft.includeLicenseFee ?? false,
      paymentMethod: draft.paymentMethod,
      tourClosedAt: draft.tourClosedAt ? draft.tourClosedAt.toISOString() : null,
      updatedAt: draft.updatedAt.toISOString(),
      lines: draft.lines.map((line: any) => ({
        id: line.id,
        productId: line.productId,
        productName: line.product.name,
        productSku: line.product.sku,
        quantity: line.quantity,
        unitPriceCents: line.unitPriceCents
      }))
    },
    customerPriceMap: Object.fromEntries(
      draft.customer.customerPrice.map((price: any) => [price.productId, price.priceCents])
    ) as Record<number, number>,
    productLicenseFeeMap,
    productLicenseMaterialMap,
    productLicenseWeightMap,
    customerSuggestedProducts: draft.customer.customerPrice
      .filter((price: any) => price.product?.isActive)
      .map((price: any) => ({
        id: price.product.id,
        sku: price.product.sku,
        name: price.product.name,
        defaultPriceCents: price.product.defaultPriceCents,
        licenseFeeCents: price.product.licenseFeeCents ?? 0,
        licenseMaterial: price.product.licenseMaterial ?? null,
        licenseWeightGrams: price.product.licenseWeightGrams ?? 0
      }))
      .sort((a: any, b: any) => a.name.localeCompare(b.name, "de-DE"))
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
    .filter((line) => line.quantity > 0 && line.unitPriceCents >= 0)
    .map((line) => ({
      productId: Math.round(line.productId),
      quantity: Math.round(line.quantity),
      unitPriceCents: Math.round(line.unitPriceCents)
    }));

  if (sanitized.some((line) => !Number.isFinite(line.productId) || line.productId <= 0)) {
    return badRequest("Mindestens eine Produkt-ID ist ungueltig.");
  }

  const existing = await prisma.draft.findUnique({
    where: { id },
    select: { id: true, includeLicenseFee: true, paymentMethod: true }
  });
  if (!existing) return notFound("Vordruck nicht gefunden.");

  await prisma.$transaction(async (tx: any) => {
    await tx.draft.update({
      where: { id },
      data: {
        note: body.note?.trim() || null,
        includeLicenseFee: body.includeLicenseFee ?? existing.includeLicenseFee,
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
      lines: { include: { product: { select: { name: true, sku: true } } }, orderBy: { id: "asc" } }
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
      paymentMethod: draft.paymentMethod,
      tourClosedAt: draft.tourClosedAt ? draft.tourClosedAt.toISOString() : null,
      updatedAt: draft.updatedAt.toISOString(),
      lines: draft.lines.map((line: any) => ({
        id: line.id,
        productId: line.productId,
        productName: line.product.name,
        productSku: line.product.sku,
        quantity: line.quantity,
        unitPriceCents: line.unitPriceCents
      }))
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
