import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Call the external backend API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || "Authentication failed",
        },
        { status: response.status }
      );
    }

    // Prepare the response
    const nextResponse = NextResponse.json(data);
    
    // Extract the token from the backend response
    const token = data.data?.token || data.token;
    
    if (token) {
      // Set the token cookie exactly as requested:
      // domain=.tasa.com.ng, path=/, HttpOnly, Secure, SameSite=none
      nextResponse.cookies.set("token", token, {
        domain: process.env.NODE_ENV === "production" ? ".tasa.com.ng" : undefined,
        path: "/",
        httpOnly: true,
        secure: true, // Required for SameSite: "none"
        sameSite: "none",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
