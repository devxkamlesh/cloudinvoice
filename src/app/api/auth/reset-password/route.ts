import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Missing token or password" },
        { status: 400 }
      );
    }

    // Find verification token
    const verification = await prisma.verification.findFirst({
      where: {
        value: token,
        identifier: {
          startsWith: "password-reset:",
        },
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Extract email from token identifier format: "password-reset:email"
    const email = verification.identifier.split(":")[1];

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update or create account with new password
    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: "credential",
          providerAccountId: user.id,
        },
      },
      update: {
        password: hashedPassword,
      },
      create: {
        id: `${Date.now()}`,
        providerAccountId: user.id,
        provider: "credential",
        type: "credentials",
        userId: user.id,
        password: hashedPassword,
      },
    });

    // IMPORTANT: Delete used token to prevent reuse
    await prisma.verification.delete({
      where: { id: verification.id },
    });

    console.log(`Password reset successful for ${email}, token deleted`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
