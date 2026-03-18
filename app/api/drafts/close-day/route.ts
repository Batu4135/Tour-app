import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { badRequest, unauthorized } from "@/lib/http";
import { z } from "zod";

export const runtime = "nodejs";

const closeDaySchema = z.object({
  draftIds: z.array(z.number().int().positive()).min(1)
});

export async function POST(request: Request) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const parsed = closeDaySchema.safeParse(await request.json());
  if (!parsed.success) return badRequest("Ungueltige Anfrage.");

  const ids = Array.from(new Set(parsed.data.draftIds));
  const now = new Date();

  const result = await prisma.draft.updateMany({
    where: {
      id: { in: ids },
      tourClosedAt: null
    },
    data: {
      tourClosedAt: now
    }
  });

  return NextResponse.json({
    ok: true,
    closedAt: now.toISOString(),
    updatedCount: result.count
  });
}
