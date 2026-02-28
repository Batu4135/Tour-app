import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "np_session";
const PUBLIC_PATHS = ["/login"];
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30;

function isDevAuthBypassEnabled(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.DISABLE_AUTH === "true";
}

function getSessionSecret(): string | null {
  const secret = process.env.SESSION_SECRET?.trim();
  return secret && secret.length > 0 ? secret : null;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    const [userIdRaw, timestampRaw, signature] = token.split(".");
    if (!userIdRaw || !timestampRaw || !signature) return false;

    const timestamp = Number.parseInt(timestampRaw, 10);
    if (!Number.isFinite(timestamp)) return false;
    if (Date.now() - timestamp > SESSION_MAX_AGE_MS) return false;

    const secret = getSessionSecret();
    if (!secret) return false;

    const payload = `${userIdRaw}.${timestampRaw}`;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const expectedBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
    const expected = toHex(expectedBuffer);

    return expected === signature;
  } catch {
    return false;
  }
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
