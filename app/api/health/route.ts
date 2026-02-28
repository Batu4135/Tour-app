import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      {
        ok: true,
        status: "healthy",
        db: "up",
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        status: "unhealthy",
        db: "down",
        error: error instanceof Error ? error.message : "unknown",
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}
