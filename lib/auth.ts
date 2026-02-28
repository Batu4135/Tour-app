import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { assertProductionSecrets } from "@/lib/securityEnv";

const SESSION_COOKIE_NAME = "np_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getSessionSecret(): string {
  assertProductionSecrets();
  const secret = process.env.SESSION_SECRET?.trim();
  if (secret) return secret;
  return "nord-pack-local-dev-secret-change-me";
}

export function isValidPin(pin: string): boolean {
  return /^\d{6,10}$/.test(pin);
}

export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, 12);
}

export async function verifyPin(pin: string, pinHash: string): Promise<boolean> {
  return bcrypt.compare(pin, pinHash);
}

export function createSessionToken(userId: number): string {
  const timestamp = Date.now();
  const payload = `${userId}.${timestamp}`;
  const signature = crypto.createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function verifySessionToken(token?: string | null): { valid: boolean; userId?: number } {
  if (!token) return { valid: false };
  const [userIdRaw, timestampRaw, signature] = token.split(".");
  if (!userIdRaw || !timestampRaw || !signature) return { valid: false };

  const payload = `${userIdRaw}.${timestampRaw}`;
  const expected = crypto.createHmac("sha256", getSessionSecret()).update(payload).digest("hex");

  if (expected !== signature) return { valid: false };

  const timestamp = Number.parseInt(timestampRaw, 10);
  if (!Number.isFinite(timestamp)) return { valid: false };

  if (Date.now() - timestamp > SESSION_MAX_AGE_SECONDS * 1000) {
    return { valid: false };
  }

  return { valid: true, userId: Number.parseInt(userIdRaw, 10) };
}

export function setSessionCookie(token: string): void {
  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS
  });
}

export function clearSessionCookie(): void {
  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export function getSessionFromCookies(): { valid: boolean; userId?: number } {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export const authConfig = {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS
};
