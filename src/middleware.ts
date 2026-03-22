import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const res = NextResponse.next();
    const token = req.nextauth.token;

    // Synchronize the domain-wide 'token' cookie if NextAuth session exists
    // This handles both credentials and Google login perfectly
    if (token?.authToken && !req.cookies.has("token")) {
      res.cookies.set("token", token.authToken as string, {
        domain: process.env.NODE_ENV === "production" ? ".tasa.com.ng" : undefined,
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
  }
);

export const config = {
  matcher: [
    "/", // Running on root ensures the cookie is set after redirect from login
    "/dashboard/:path*",
    "/profile/:path*",
    "/api/protected/:path*",
  ],
};
