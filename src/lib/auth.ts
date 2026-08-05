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
  // Remove trustedOrigins - this might be causing the validation to reject encoded URLs
  advanced: {
    crossSubDomainCookies: {
      enabled: false
    },
    // Disable strict callback URL validation
    useSecureCookies: process.env.NODE_ENV === "production"
  }
});
