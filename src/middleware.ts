import { NextResponse, type NextRequest } from "next/server";

/**
 * Paths that require an authenticated session. This is a safety net: if a
 * developer forgets `getAuthenticatedUser()` in a new page, the middleware
 * still redirects unauthenticated visitors. The page-level guards remain the
 * source of truth for suspension, roles, and org membership.
 */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/invoices",
  "/clients",
  "/settings",
  "/analytics",
  "/onboarding",
  "/admin",
];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY");

  // Route-level auth guard: redirect to sign-in if no session cookie is present.
  // NextAuth v5 stores the session in a cookie named `authjs.session-token`
  // (or `__Secure-authjs.session-token` when behind HTTPS).
  if (isProtected(request.nextUrl.pathname)) {
    const hasSession =
      request.cookies.has("authjs.session-token") ||
      request.cookies.has("__Secure-authjs.session-token");

    if (!hasSession) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
