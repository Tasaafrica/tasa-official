import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.authToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { userId } = await params;

    // Verify ownership
    if (session.user.id !== userId && session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    if (!baseUrl) {
      return NextResponse.json(
        { success: false, error: "Missing NEXT_PUBLIC_API_URL" },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    // Support both 'image' and 'file' keys just in case
    const file = (formData.get("image") || formData.get("file")) as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 },
      );
    }

    // Create backend FormData
    const backendFormData = new FormData();
    // Most backends expect 'image' for profile pictures
    backendFormData.append("file", file);
    // Adding userId to form data as some APIs require it in the body even if it's in the URL
    backendFormData.append("userId", userId);

    const response = await fetch(
      `${baseUrl}/api/users/${userId}/image?userId=${userId}&t=${Date.now()}`,
      {
        method: "POST",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${session.authToken}`,
        },
        body: backendFormData,
      },
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Backend image upload error:", data);
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || "Failed to upload image to backend",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in POST /api/users/[userId]/image:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.authToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { userId } = await params;

    if (!baseUrl) {
      return NextResponse.json(
        { success: false, error: "Missing NEXT_PUBLIC_API_URL" },
        { status: 500 },
      );
    }

    const response = await fetch(
      `${baseUrl}/api/users/${userId}/image?userId=${userId}&t=${Date.now()}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${session.authToken}`,
          "Cache-Control": "no-cache",
        },
      },
    );

    // If it's an image response, we might need to handle it differently, 
    // but usually these endpoints return image metadata or a redirect
    const contentType = response.headers.get("content-type");
    
    if (contentType?.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      // If it returns the actual image binary
      const blob = await response.blob();
      return new NextResponse(blob, {
        headers: {
          "Content-Type": contentType || "image/jpeg",
          "Cache-Control": "no-cache",
        },
      });
    }
  } catch (error) {
    console.error("Error in GET /api/users/[userId]/image:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
