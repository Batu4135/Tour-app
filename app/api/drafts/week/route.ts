import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { badRequest, unauthorized } from "@/lib/http";

export const runtime = "nodejs";

function parseWeekStart(raw: string | null): Date {
  if (!raw) {
    const now = new Date();
    const day = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() - day);
    return monday;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    throw new Error("Ungueltiger Wochenstart.");
  }
  const start = new Date(`${raw}T00:00:00.000Z`);
  if (!Number.isFinite(start.getTime())) throw new Error("Ungueltiger Wochenstart.");
  return start;
}

function dayKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function pickRouteLabel(values: Array<string | null | undefined>): string | null {
  const counts = new Map<string, number>();
  for (const value of values) {
    const cleaned = (value ?? "").trim();
    if (!cleaned) continue;
    counts.set(cleaned, (counts.get(cleaned) ?? 0) + 1);
  }
  if (counts.size === 0) return null;
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

export async function GET(request: Request) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const url = new URL(request.url);
  let weekStart: Date;
  try {
    weekStart = parseWeekStart(url.searchParams.get("start"));
  } catch (error) {
    return badRequest(error instanceof Error ? error.message : "Ungueltiger Wochenstart.");
  }

  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);

  const drafts = await prisma.draft.findMany({
    where: {
      date: {
        gte: weekStart,
        lt: weekEnd
      }
    },
    orderBy: [{ date: "asc" }, { id: "asc" }],
    include: {
      customer: { select: { name: true, routeDay: true } },
      lines: {
        orderBy: { id: "asc" },
        include: {
          product: { select: { name: true, sku: true, licenseFeeCents: true } }
        }
      }
    }
  });

  const groups = new Map<string, any[]>();
  for (const draft of drafts) {
    const key = dayKey(draft.date);
    const list = groups.get(key) ?? [];
    const totalCents = draft.lines.reduce((sum, line) => {
      const license = draft.includeLicenseFee ? line.product.licenseFeeCents ?? 0 : 0;
      return sum + line.quantity * (line.unitPriceCents + license);
    }, 0);
    list.push({
      id: draft.id,
      customerName: draft.customer.name,
      customerRouteDay: draft.customer.routeDay ?? null,
      date: draft.date.toISOString(),
      paymentMethod: draft.paymentMethod,
      includeLicenseFee: draft.includeLicenseFee,
      note: draft.note ?? null,
      totalCents,
      tourClosedAt: draft.tourClosedAt ? draft.tourClosedAt.toISOString() : null,
      lines: draft.lines.map((line) => {
        const license = draft.includeLicenseFee ? line.product.licenseFeeCents ?? 0 : 0;
        return {
          productName: line.product.name,
          productSku: line.product.sku,
          quantity: line.quantity,
          unitPriceCents: line.unitPriceCents,
          licenseFeeCents: license,
          lineTotalCents: line.quantity * (line.unitPriceCents + license)
        };
      })
    });
    groups.set(key, list);
  }

  const days = [...groups.entries()].map(([key, dayDrafts]) => ({
    key,
    label: new Date(`${key}T12:00:00.000Z`).toLocaleDateString("de-DE"),
    routeLabel: pickRouteLabel(dayDrafts.map((draft) => draft.customerRouteDay)),
    drafts: dayDrafts,
    isClosed: dayDrafts.length > 0 && dayDrafts.every((draft) => Boolean(draft.tourClosedAt))
  }));

  return NextResponse.json({
    weekStart: weekStart.toISOString(),
    weekEnd: weekEnd.toISOString(),
    days
  });
}
