import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { userId } = await params;

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Verify the user is checking their own status or is admin
    if (session.user.id !== userId && session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized to check this user's status" },
        { status: 403 }
      );
    }

    console.log("Checking email verification status for user:", userId);

    // Call your backend API to check verification status
    const baseUrl = process.env.PRODUCTION_URL || "http://localhost:5000";
    const response = await fetch(
      `${baseUrl}/api/auth/verify-status/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    console.log("Backend verification status response:", response.status);
    const data = await response.json();
    console.log("Backend verification status data:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error:
            data.error || data.message || "Failed to check verification status",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Check verification status API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
