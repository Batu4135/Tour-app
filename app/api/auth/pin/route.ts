import { NextResponse } from "next/server";
import { hashPin, isValidPin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { badRequest, unauthorized } from "@/lib/http";
import { consumeRateLimit, getRequestIp } from "@/lib/rateLimit";

export async function PATCH(request: Request) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const ip = getRequestIp(request);
  const rate = consumeRateLimit("auth-pin", ip, {
    limit: 20,
    windowMs: 5 * 60 * 1000
  });

  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte spaeter erneut probieren." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rate.retryAfterMs / 1000))
        }
      }
    );
  }

  const body = (await request.json()) as { pin?: string };
  const pin = body.pin?.trim() ?? "";

  if (!isValidPin(pin)) {
    return badRequest("PIN muss mindestens 6 Ziffern haben.");
  }

  const pinHash = await hashPin(pin);
  await prisma.user.update({
    where: { id: user.id },
    data: { pinHash }
  });

  return NextResponse.json({ ok: true });
}
