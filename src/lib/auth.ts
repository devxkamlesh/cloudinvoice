import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    // One hour is long enough to find the email and short enough that a leaked link
    // in an inbox or proxy log stops being useful quickly.
    resetPasswordTokenExpiresIn: 60 * 60,
    // Better Auth builds the tokenised URL; we only choose where it lands.
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ to: user.email, link: url, name: user.name });
    }
  },
  session: { expiresIn: 60 * 60 * 24 * 14, updateAge: 60 * 60 * 24 },
  trustedOrigins: [
    process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    "https://cloudinvoice.co.in",
    "http://localhost:3000"
  ],
  // Allow decoded callback URLs
  advanced: {
    crossSubDomainCookies: {
      enabled: false
    }
  }
});
