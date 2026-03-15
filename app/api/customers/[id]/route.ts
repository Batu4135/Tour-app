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

const updateCustomerSchema = z.object({
  name: z.string().min(2),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  routeDay: z.string().trim().min(1)
});

export async function GET(_: Request, { params }: RouteContext) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const id = Number.parseInt(params.id, 10);
  if (!Number.isFinite(id)) return badRequest("Ungueltige ID.");

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      customerPrice: {
        include: { product: { select: { name: true } } },
        orderBy: { productId: "asc" }
      }
    }
  });

  if (!customer) return notFound("Kunde wurde nicht gefunden.");

  const products = await prisma.product.findMany({
    select: { id: true, name: true, sku: true },
    orderBy: { name: "asc" }
  });

  return NextResponse.json({
    customer: {
      id: customer.id,
      name: customer.name,
      address: customer.address,
      phone: customer.phone,
      routeDay: customer.routeDay,
      products,
      prices: customer.customerPrice.map((price: any) => ({
        id: price.id,
        productId: price.productId,
        productName: price.product.name,
        priceCents: price.priceCents
      }))
    }
  });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const id = Number.parseInt(params.id, 10);
  if (!Number.isFinite(id)) return badRequest("Ungueltige ID.");

  const parsed = updateCustomerSchema.safeParse(await request.json());
  if (!parsed.success) return badRequest("Ungueltige Anfrage.");
  const name = parsed.data.name.trim();

  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name,
        address: parsed.data.address?.trim() || null,
        phone: parsed.data.phone?.trim() || null,
        routeDay: parsed.data.routeDay.trim()
      }
    });

    return NextResponse.json({ customer });
  } catch {
    return notFound("Kunde wurde nicht gefunden.");
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const id = Number.parseInt(params.id, 10);
  if (!Number.isFinite(id)) return badRequest("Ungueltige ID.");

  try {
    await prisma.customer.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return notFound("Kunde wurde nicht gefunden.");
  }
}
