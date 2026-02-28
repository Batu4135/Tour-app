import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, isValidPin, setSessionCookie, verifyPin } from "@/lib/auth";
import { badRequest } from "@/lib/http";
import { consumeRateLimit, getRequestIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const ip = getRequestIp(request);
    const rate = consumeRateLimit("auth-login", ip, {
      limit: 10,
      windowMs: 5 * 60 * 1000
    });

    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Zu viele Login-Versuche. Bitte spaeter erneut probieren." },
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

    const user = await prisma.user.findFirst({ orderBy: { id: "asc" } });

    if (!user) {
      return NextResponse.json(
        { error: "Kein Admin-User vorhanden. Bitte zuerst `npm run db:seed` ausfuehren." },
        { status: 503 }
      );
    }

    const valid = await verifyPin(pin, user.pinHash);
    if (!valid) return badRequest("PIN ist falsch.");

    const token = createSessionToken(user.id);
    setSessionCookie(token);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Login fehlgeschlagen." }, { status: 500 });
  }
}
