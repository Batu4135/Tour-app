import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { badRequest, unauthorized } from "@/lib/http";
import { attachImportedCustomerPrices } from "@/lib/customerPriceDirectory";
import { z } from "zod";

export const runtime = "nodejs";

const createCustomerSchema = z.object({
  name: z.string().min(2),
  address: z.string().optional(),
  phone: z.string().optional(),
  routeDay: z.string().trim().min(1),
  copiedPrices: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        priceCents: z.number().int().min(0)
      })
    )
    .optional()
});

function normalizeText(value?: string | null) {
  return (value ?? "")
    .trim()
    .toLocaleLowerCase("tr-TR")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function normalizePhone(value?: string | null) {
  return (value ?? "").replace(/\D+/g, "");
}

function isDuplicateCustomer(
  existing: { name: string; routeDay: string | null; address: string | null; phone: string | null },
  incoming: { name: string; routeDay: string; address?: string; phone?: string }
) {
  const existingRouteDay = normalizeText(existing.routeDay);
  const incomingRouteDay = normalizeText(incoming.routeDay);
  if (!existingRouteDay || existingRouteDay !== incomingRouteDay) return false;

  const existingName = normalizeText(existing.name);
  const incomingName = normalizeText(incoming.name);
  if (!existingName || existingName !== incomingName) return false;

  const existingPhone = normalizePhone(existing.phone);
  const incomingPhone = normalizePhone(incoming.phone);
  if (existingPhone && incomingPhone && existingPhone === incomingPhone) return true;

  const existingAddress = normalizeText(existing.address);
  const incomingAddress = normalizeText(incoming.address);
  if (existingAddress && incomingAddress && existingAddress === incomingAddress) return true;

  return !incomingPhone && !incomingAddress;
}

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
    orderBy: { createdAt: "desc" },
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
  const routeDay = parsed.data.routeDay.trim();
  const address = parsed.data.address?.trim() || null;
  const phone = parsed.data.phone?.trim() || null;
  const copiedPrices = parsed.data.copiedPrices ?? [];

  const potentialDuplicates = await prisma.customer.findMany({
    where: {
      routeDay: {
        equals: routeDay,
        mode: "insensitive"
      },
      name: {
        equals: name,
        mode: "insensitive"
      }
    },
    select: {
      id: true,
      name: true,
      routeDay: true,
      address: true,
      phone: true
    }
  });

  const duplicateCustomer = potentialDuplicates.find((customer) =>
    isDuplicateCustomer(customer, {
      name,
      routeDay,
      address: address ?? undefined,
      phone: phone ?? undefined
    })
  );

  if (duplicateCustomer) {
    return badRequest("Dieser Kunde ist bereits gespeichert.");
  }

  const result = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.create({
      data: {
        name,
        address,
        phone,
        routeDay
      }
    });

    const importedPrices = await attachImportedCustomerPrices(tx as any, {
      id: customer.id,
      name: customer.name,
      routeDay: customer.routeDay
    });

    for (const copiedPrice of copiedPrices) {
      await tx.customerPrice.upsert({
        where: {
          customerId_productId: {
            customerId: customer.id,
            productId: copiedPrice.productId
          }
        },
        create: {
          customerId: customer.id,
          productId: copiedPrice.productId,
          priceCents: Math.round(copiedPrice.priceCents)
        },
        update: {
          priceCents: Math.round(copiedPrice.priceCents)
        }
      });
    }

    return { customer, importedPrices, copiedPricesCount: copiedPrices.length };
  });

  return NextResponse.json(result, { status: 201 });
}
