import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { email } = await request.json();
    const userEmail = email || session.user.email;

    console.log("Sending magic link for email:", userEmail);

    // Call your backend API to send magic link
    const baseUrl = process.env.PRODUCTION_URL || "http://localhost:5000";
    const response = await fetch(
      `${baseUrl}/api/email-verification/send-magic-link`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ email: userEmail }),
      }
    );

    console.log("Backend magic link response status:", response.status);
    const data = await response.json();
    console.log("Backend magic link response data:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || "Failed to send magic link",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Send magic link API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
