import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { unauthorized } from "@/lib/http";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const url = new URL(request.url);
  const mode = url.searchParams.get("mode")?.trim() ?? "customers";
  const q = url.searchParams.get("q")?.trim() ?? "";
  const routeDay = url.searchParams.get("routeDay")?.trim() ?? "";

  if (mode === "routes") {
    const routes = await prisma.customerDirectoryEntry.findMany({
      where: q
        ? {
            routeDay: {
              contains: q,
              mode: "insensitive"
            }
          }
        : undefined,
      distinct: ["routeDay"],
      orderBy: { routeDay: "asc" },
      select: { routeDay: true },
      take: 12
    });

    return NextResponse.json({
      routeDays: routes.map((entry) => entry.routeDay).filter(Boolean)
    });
  }

  if (!routeDay) {
    return NextResponse.json({ customers: [] });
  }

  const customers = await prisma.customerDirectoryEntry.findMany({
    where: {
      routeDay: {
        equals: routeDay,
        mode: "insensitive"
      },
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { address: { contains: q, mode: "insensitive" } },
              { phone: { contains: q, mode: "insensitive" } }
            ]
          }
        : {})
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
      routeDay: true
    },
    take: 8
  });

  return NextResponse.json({ customers });
}
