import { NextResponse } from "next/server";

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function unauthorized(message = "Nicht autorisiert") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function notFound(message = "Nicht gefunden") {
  return NextResponse.json({ error: message }, { status: 404 });
}
