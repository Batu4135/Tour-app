import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { badRequest, unauthorized } from "@/lib/http";
import { z } from "zod";

export const runtime = "nodejs";

const createProductSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(1),
  defaultPriceCents: z.number().int().min(0).optional(),
  isActive: z.boolean().optional()
});

export async function GET(request: Request) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const includeInactive = url.searchParams.get("includeInactive") === "1";
  const limitParam = Number.parseInt(url.searchParams.get("limit") ?? "", 10);
  const take = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 500) : q ? 100 : 100;

  const products = await prisma.product.findMany({
    where: {
      ...(includeInactive ? {} : { isActive: true }),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { sku: { contains: q, mode: "insensitive" } }
            ]
          }
        : {})
    },
    orderBy: [{ name: "asc" }],
    take,
    select: {
      id: true,
      sku: true,
      name: true,
      defaultPriceCents: true,
      isActive: true
    }
  });

  return NextResponse.json({ products, total: products.length });
}

export async function POST(request: Request) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const parsed = createProductSchema.safeParse(await request.json());
  if (!parsed.success) return badRequest("Ungueltige Anfrage.");
  const name = parsed.data.name.trim();
  const sku = parsed.data.sku.trim();

  try {
    const product = await prisma.product.create({
      data: {
        name,
        sku,
        defaultPriceCents:
          typeof parsed.data.defaultPriceCents === "number" && parsed.data.defaultPriceCents >= 0
            ? Math.round(parsed.data.defaultPriceCents)
            : 0,
        isActive: parsed.data.isActive ?? true
      }
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return badRequest("SKU existiert bereits.");
  }
}
