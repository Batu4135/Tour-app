import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { badRequest, unauthorized } from "@/lib/http";
import { z } from "zod";

type RouteContext = {
  params: {
    id: string;
  };
};

const createPriceSchema = z.object({
  productId: z.number().int().positive(),
  priceCents: z.number().int().min(0)
});

const updatePriceSchema = z.object({
  id: z.number().int().positive(),
  priceCents: z.number().int().min(0)
});

const deletePriceSchema = z.object({
  id: z.number().int().positive()
});

export async function POST(request: Request, { params }: RouteContext) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const customerId = Number.parseInt(params.id, 10);
  if (!Number.isFinite(customerId)) return badRequest("Ungueltige Kunden-ID.");

  const parsed = createPriceSchema.safeParse(await request.json());
  if (!parsed.success) return badRequest("Produkt oder Preis fehlt.");

  const price = await prisma.customerPrice.upsert({
    where: {
      customerId_productId: {
        customerId,
        productId: parsed.data.productId
      }
    },
    create: {
      customerId,
      productId: parsed.data.productId,
      priceCents: Math.round(parsed.data.priceCents)
    },
    update: {
      priceCents: Math.round(parsed.data.priceCents)
    }
  });

  return NextResponse.json({ price }, { status: 201 });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const customerId = Number.parseInt(params.id, 10);
  if (!Number.isFinite(customerId)) return badRequest("Ungueltige Kunden-ID.");

  const parsed = updatePriceSchema.safeParse(await request.json());
  if (!parsed.success) return badRequest("Preis-ID oder Wert fehlt.");

  const existing = await prisma.customerPrice.findFirst({
    where: { id: parsed.data.id, customerId },
    select: { id: true }
  });
  if (!existing) return badRequest("Preiszeile nicht gefunden.");

  const price = await prisma.customerPrice.update({
    where: { id: parsed.data.id },
    data: { priceCents: Math.round(parsed.data.priceCents) }
  });

  return NextResponse.json({ price });
}

export async function DELETE(request: Request, { params }: RouteContext) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const customerId = Number.parseInt(params.id, 10);
  if (!Number.isFinite(customerId)) return badRequest("Ungueltige Kunden-ID.");

  const parsed = deletePriceSchema.safeParse(await request.json());
  if (!parsed.success) return badRequest("Preis-ID fehlt.");

  const existing = await prisma.customerPrice.findFirst({
    where: { id: parsed.data.id, customerId },
    select: { id: true }
  });
  if (!existing) return badRequest("Preiszeile nicht gefunden.");

  await prisma.customerPrice.delete({ where: { id: parsed.data.id } });

  return NextResponse.json({ ok: true });
}
