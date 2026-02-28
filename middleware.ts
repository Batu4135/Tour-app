import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "np_session";
const PUBLIC_PATHS = ["/login"];
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30;

function isMissing(value: string | undefined): boolean {
  return !value || value.trim().length === 0;
}

function isDevAuthBypassEnabled(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.DISABLE_AUTH === "true";
}

function assertProductionSecrets(): void {
  if (process.env.NODE_ENV !== "production") return;

  const missing: string[] = [];
  if (isMissing(process.env.SESSION_SECRET)) missing.push("SESSION_SECRET");
  if (isMissing(process.env.NEXTAUTH_SECRET)) missing.push("NEXTAUTH_SECRET");

  if (missing.length > 0) {
    throw new Error(`Fehlende Pflicht-Umgebungsvariablen in Production: ${missing.join(", ")}`);
  }
}

function getSessionSecret(): string {
  assertProductionSecrets();
  return process.env.SESSION_SECRET ?? "nord-pack-local-dev-secret-change-me";
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyToken(token: string): Promise<boolean> {
  const [userIdRaw, timestampRaw, signature] = token.split(".");
  if (!userIdRaw || !timestampRaw || !signature) return false;

  const timestamp = Number.parseInt(timestampRaw, 10);
  if (!Number.isFinite(timestamp)) return false;
  if (Date.now() - timestamp > SESSION_MAX_AGE_MS) return false;

  const payload = `${userIdRaw}.${timestampRaw}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const expectedBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const expected = toHex(expectedBuffer);

  return expected === signature;
}

export async function middleware(request: NextRequest) {
  const authDisabled = isDevAuthBypassEnabled();
  if (authDisabled) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token || !(await verifyToken(token))) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"]
};
