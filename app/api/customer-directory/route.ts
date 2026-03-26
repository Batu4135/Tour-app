import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { unauthorized } from "@/lib/http";

export const runtime = "nodejs";

function compactWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeSearch(value: string): string {
  return compactWhitespace(value).toLocaleLowerCase("tr-TR");
}

function normalizeComparable(value: string): string {
  return normalizeSearch(value).replace(/[^a-z0-9\u00c0-\u024f]+/g, "");
}

function normalizeAddress(name: string, address: string | null): string | null {
  const compactAddress = compactWhitespace(address ?? "");
  if (!compactAddress) return null;

  const compactName = compactWhitespace(name);
  if (!compactName) return compactAddress;

  const nameTokens = compactName.split(/\s+/).map((token) => normalizeComparable(token)).filter(Boolean);
  if (nameTokens.length === 0) return compactAddress;

  let addressTokens = compactAddress.split(/\s+/);
  let changed = false;

  while (addressTokens.length >= nameTokens.length) {
    const candidate = addressTokens
      .slice(0, nameTokens.length)
      .map((token) => normalizeComparable(token))
      .filter(Boolean);
    if (candidate.length !== nameTokens.length) break;
    if (!candidate.every((token, index) => token === nameTokens[index])) break;
    addressTokens = addressTokens.slice(nameTokens.length);
    changed = true;
  }

  const stripped = compactWhitespace(addressTokens.join(" "));
  if (changed && stripped) return stripped;
  return compactAddress;
}

function rankMatch(haystack: string, query: string): number {
  const normalizedHaystack = normalizeSearch(haystack);
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedHaystack || !normalizedQuery) return Number.MAX_SAFE_INTEGER;
  if (normalizedHaystack === normalizedQuery) return 0;
  if (normalizedHaystack.startsWith(normalizedQuery)) return 1;
  if (normalizedHaystack.split(/\s+/).some((part) => part.startsWith(normalizedQuery))) return 2;
  if (normalizedHaystack.includes(normalizedQuery)) return 3;
  return Number.MAX_SAFE_INTEGER;
}

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
      take: 20
    });

    const rankedRoutes = (q
      ? routes
          .map((entry) => ({ routeDay: entry.routeDay, score: rankMatch(entry.routeDay, q) }))
          .filter((entry) => Number.isFinite(entry.score))
          .sort((a, b) => a.score - b.score || a.routeDay.localeCompare(b.routeDay, "tr-TR"))
          .slice(0, 6)
          .map((entry) => entry.routeDay)
      : routes.map((entry) => entry.routeDay).filter(Boolean));

    return NextResponse.json({
      routeDays: rankedRoutes
    });
  }

  if (!routeDay || q.trim().length < 2) {
    return NextResponse.json({ customers: [] });
  }

  const rawCustomers = await prisma.customerDirectoryEntry.findMany({
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
    take: 40
  });

  const customers = rawCustomers
    .map((customer) => {
      const scores = [customer.name, customer.address ?? "", customer.phone ?? ""]
        .map((value) => rankMatch(value, q))
        .filter((value) => Number.isFinite(value));
      return {
        ...customer,
        address: normalizeAddress(customer.name, customer.address),
        score: scores.length > 0 ? Math.min(...scores) : Number.MAX_SAFE_INTEGER
      };
    })
    .filter((customer) => Number.isFinite(customer.score))
    .sort((a, b) => a.score - b.score || a.name.localeCompare(b.name, "tr-TR"))
    .slice(0, 5)
    .map(({ score: _score, ...customer }) => customer);

  return NextResponse.json({ customers });
}
