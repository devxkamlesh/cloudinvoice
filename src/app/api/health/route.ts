import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Verify database connectivity — if this fails, the container is not healthy.
    await prisma.$queryRaw`SELECT 1`;

    // Opportunistic cleanup: purge expired verification tokens on every health
    // check (every 30s per docker-compose). This is cheaper than a separate cron
    // job and keeps the table small without any additional infrastructure.
    await prisma.verification.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      { status: "unhealthy", timestamp: new Date().toISOString() },
      { status: 503 }
    );
  }
}
