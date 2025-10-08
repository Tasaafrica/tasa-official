import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const baseUrl = process.env.PRODUCTION_URL || "http://localhost:5000";

export async function POST(
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

    // Check if user is uploading to their own profile
    if (session.user.id !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    console.log(`Uploading image for user ID: ${userId}`, {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    // Create new FormData for backend
    const backendFormData = new FormData();
    backendFormData.append("file", file);

    const response = await fetch(
      `${baseUrl}/api/user/${userId}/image?t=${Date.now()}`,
      {
        method: "POST",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        body: backendFormData,
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
            errorData.error || errorData.message || "Failed to upload image",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Image uploaded successfully:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in POST /api/user/[userId]/image:", error);
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

    // Check if user is deleting their own image
    if (session.user.id !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    console.log(`Deleting image for user ID: ${userId}`);

    const response = await fetch(
      `${baseUrl}/api/user/${userId}/image?t=${Date.now()}`,
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
            errorData.error || errorData.message || "Failed to delete image",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Image deleted successfully:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in DELETE /api/user/[userId]/image:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    // Check if user is accessing their own image
    if (session.user.id !== userId) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    console.log(`Getting image info for user ID: ${userId}`);

    const response = await fetch(
      `${baseUrl}/api/user/${userId}/image?t=${Date.now()}`,
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
            errorData.error || errorData.message || "Failed to get image info",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Image info retrieved:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in GET /api/user/[userId]/image:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
