import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log("Login API request:", { email, password: "[REDACTED]" });

    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Call your backend API for authentication
    const baseUrl = process.env.PRODUCTION_URL || "http://localhost:5000";
    console.log("Calling backend login API:", `${baseUrl}/api/auth/login`);

    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("Backend login response status:", response.status);
    const data = await response.json();
    console.log("Backend login response data:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || "Authentication failed",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
