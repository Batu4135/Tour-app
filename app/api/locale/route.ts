import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAuth } from "@/lib/requireAuth";
import { unauthorized } from "@/lib/http";

export async function POST(request: Request) {
  const user = await requireAuth();
  if (!user) return unauthorized();

  const body = (await request.json()) as { locale?: string };
  const locale = body.locale === "tr" ? "tr" : "de";

  cookies().set({
    name: "locale",
    value: locale,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365
  });

  return NextResponse.json({ ok: true, locale });
}
