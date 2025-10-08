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

    // Verify the user is accessing their own profile or is admin
    if (session.user.id !== userId && session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized to access this profile" },
        { status: 403 }
      );
    }

    console.log("Fetching user profile for user:", userId);

    // Call your backend API to get user profile
    const baseUrl = process.env.PRODUCTION_URL || "http://localhost:5000";
    const response = await fetch(`${baseUrl}/api/user-profile/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    console.log("Backend profile response:", response.status);
    const data = await response.json();
    console.log("Backend profile data:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || "Failed to fetch user profile",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get user profile API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    // Verify the user is updating their own profile or is admin
    if (session.user.id !== userId && session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized to update this profile" },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log("Updating user profile for user:", userId, "with data:", body);

    // Call your backend API to update user profile
    const baseUrl = process.env.PRODUCTION_URL || "http://localhost:5000";
    const response = await fetch(`${baseUrl}/api/user-profile/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    console.log("Backend update profile response:", response.status);
    const data = await response.json();
    console.log("Backend update profile data:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || "Failed to update user profile",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Update user profile API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
