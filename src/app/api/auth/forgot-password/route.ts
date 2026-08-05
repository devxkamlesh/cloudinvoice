import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Store token in verification table
    await prisma.verification.create({
      data: {
        id: crypto.randomUUID(),
        identifier: `password-reset:${user.id}`,
        value: resetToken,
        expiresAt: resetTokenExpiry,
      },
    });

    // Send email with reset link
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    
    try {
      await sendPasswordResetEmail({
        to: email,
        link: resetUrl,
        name: user.name,
      });
      console.log(`Password reset email sent to: ${email}`);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      // Continue anyway to prevent email enumeration - user won't know if email failed
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
