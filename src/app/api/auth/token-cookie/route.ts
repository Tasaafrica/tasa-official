import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ success: false, error: "Token is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    
    // Set a specialized authToken cookie that is HttpOnly, Secure, and shared across subdomains
    cookieStore.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      domain: ".tasa.com.ng",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days matching session length
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Token cookie API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// Add a DELETE method for logout
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set("authToken", "", {
    domain: ".tasa.com.ng",
    path: "/",
    maxAge: 0,
  });
  return NextResponse.json({ success: true });
}
