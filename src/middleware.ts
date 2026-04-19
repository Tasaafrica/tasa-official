import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

function getCookieDomain(req: any): string | undefined {
  if (process.env.NODE_ENV === "production") {
    return ".tasa.com.ng";
  }

  // Development: get allowed domains from environment variable
  const allowedDomains = process.env.AUTH_COOKIE_DOMAINS?.split(",") || [];
  const hostHeader = req.headers.get("host");

  // Check if current host is in allowed domains
  if (hostHeader && allowedDomains.includes(hostHeader)) {
    return undefined; // Let browser handle it for same-origin
  }

  return undefined;
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    const res = NextResponse.next();

    // Synchronize the domain-wide '_secure_tasaxx' cookie if NextAuth session exists
    // This handles both credentials and Google login perfectly
    if (token?.authToken && !req.cookies.has("_secure_tasaxx")) {
      res.cookies.set("_secure_tasaxx", token.authToken as string, {
        domain: getCookieDomain(req),
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none", // As requested for cross-domain fetch
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return res;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public access to auth routes
        if (req.nextUrl.pathname.startsWith("/auth/")) return true;

        // Requirement for protected routes
        const isProtectedRoute =
          req.nextUrl.pathname.startsWith("/dashboard") ||
          req.nextUrl.pathname.startsWith("/profile");

        if (isProtectedRoute) return !!token;

        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    "/", // Running on root ensures the cookie is set after redirect from login
  ],
};
