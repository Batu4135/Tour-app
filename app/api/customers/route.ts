import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { badRequest, unauthorized } from "@/lib/http";
import { z } from "zod";

export const runtime = "nodejs";

const createCustomerSchema = z.object({
  name: z.string().min(2),
  address: z.string().optional(),
  phone: z.string().optional(),
  routeDay: z.string().optional()
});

export async function GET(request: Request) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";

  const customers = await prisma.customer.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { address: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { routeDay: { contains: q, mode: "insensitive" } }
          ]
        }
      : undefined,
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
      routeDay: true
    }
  });

  return NextResponse.json({ customers });
}

export async function POST(request: Request) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const parsed = createCustomerSchema.safeParse(await request.json());
  if (!parsed.success) return badRequest("Ungueltige Anfrage.");
  const name = parsed.data.name.trim();

  const customer = await prisma.customer.create({
    data: {
      name,
      address: parsed.data.address?.trim() || null,
      phone: parsed.data.phone?.trim() || null,
      routeDay: parsed.data.routeDay?.trim() || null
    }
  });

  return NextResponse.json({ customer }, { status: 201 });
}
