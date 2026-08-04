import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return {
    rules: [{
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard", "/invoices", "/clients", "/analytics", "/settings", "/onboarding",
        "/sign-in", "/forgot-password", "/reset-password",
        // Private surfaces. /admin is additionally gated server-side and returns 404
        // to non-admins, so this is defence in depth rather than the control.
        "/admin", "/suspended", "/pay/"
      ]
    }],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
