import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// Simple password hashing using Node's built-in crypto
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Find valid verification token
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
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Extract user ID from identifier
    const userId = verification.identifier.replace("password-reset:", "");

    // Hash new password
    const hashedPassword = hashPassword(password);

    // Update user password
    await prisma.account.updateMany({
      where: {
        userId,
        providerId: "credential",
      },
      data: {
        password: hashedPassword,
      },
    });

    // Delete used verification token
    await prisma.verification.delete({
      where: {
        id: verification.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
