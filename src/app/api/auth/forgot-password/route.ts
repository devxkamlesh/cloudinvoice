import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { sendPasswordResetEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({ prefix: "forgot-password", limit: 3, windowSeconds: 60 });

export async function POST(request: Request) {
  try {
    // Rate limit by IP
    const ip =
      request.headers.get("x-real-ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const { ok } = await limiter.check(ip);
    if (!ok) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Generate reset token
    const token = nanoid(32);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Store token
    await prisma.verification.create({
      data: {
        id: nanoid(),
        identifier: `password-reset:${email}`,
        value: token,
        expiresAt,
      },
    });

    // Send email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;
    
    await sendPasswordResetEmail({
      to: email,
      link: resetUrl,
      name: user.name,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
