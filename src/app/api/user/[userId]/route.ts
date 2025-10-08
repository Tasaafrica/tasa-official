import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const baseUrl = process.env.PRODUCTION_URL || "http://localhost:5000";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId } = await params;

    // Check if user is accessing their own profile
    if (session.user.id !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    console.log(`Fetching user profile for ID: ${userId}`);

    const response = await fetch(
      `${baseUrl}/api/user/${userId}?t=${Date.now()}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );

    console.log(`Backend response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Backend error:", errorData);
      return NextResponse.json(
        {
          success: false,
          error:
            errorData.error ||
            errorData.message ||
            "Failed to fetch user profile",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("User profile data received:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET /api/user/[userId]:", error);
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

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId } = await params;

    // Check if user is updating their own profile
    if (session.user.id !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log(`Updating user profile for ID: ${userId}`, body);

    const response = await fetch(
      `${baseUrl}/api/user/${userId}?t=${Date.now()}`,
      {
        method: "PUT",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        body: JSON.stringify(body),
      }
    );

    console.log(`Backend response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Backend error:", errorData);
      return NextResponse.json(
        {
          success: false,
          error:
            errorData.error ||
            errorData.message ||
            "Failed to update user profile",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("User profile updated:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in PUT /api/user/[userId]:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { userId } = await params;

    // Check if user is deleting their own profile
    if (session.user.id !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    console.log(`Deleting user profile for ID: ${userId}`);

    const response = await fetch(
      `${baseUrl}/api/user/${userId}?t=${Date.now()}`,
      {
        method: "DELETE",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );

    console.log(`Backend response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Backend error:", errorData);
      return NextResponse.json(
        {
          success: false,
          error:
            errorData.error ||
            errorData.message ||
            "Failed to delete user profile",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("User profile deleted:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in DELETE /api/user/[userId]:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
