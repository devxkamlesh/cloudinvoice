import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({ prefix: "signup", limit: 5, windowSeconds: 60 });

export async function POST(request: Request) {
  try {
    // Rate limit by IP (Cloudflare → nginx forwards the real IP in X-Real-IP)
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
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Generic error to prevent email enumeration — an attacker cannot tell
      // whether the email is taken or the request simply failed.
      return NextResponse.json(
        { error: "Unable to create account. Please try again or use a different email." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = nanoid();
    const user = await prisma.user.create({
      data: {
        id: userId,
        email,
        name,
        emailVerified: null,
      },
    });

    // Create account with password
    await prisma.account.create({
      data: {
        id: nanoid(),
        providerAccountId: userId,
        provider: "credential",
        type: "credentials",
        userId: user.id,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
