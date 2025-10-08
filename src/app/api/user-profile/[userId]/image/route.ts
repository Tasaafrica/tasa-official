import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
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

    // Verify the user is uploading to their own profile or is admin
    if (session.user.id !== userId && session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized to upload to this profile" },
        { status: 403 }
      );
    }

    console.log("Uploading profile image for user:", userId);

    // Get the form data from the request
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        { success: false, error: "No image provided" },
        { status: 400 }
      );
    }

    // Validate image type and size
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid image type. Only JPG and PNG are allowed",
        },
        { status: 400 }
      );
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (image.size > maxSize) {
      return NextResponse.json(
        { success: false, error: "Image size too large. Maximum 2MB allowed" },
        { status: 400 }
      );
    }

    // Call your backend API to upload the image
    const baseUrl = process.env.PRODUCTION_URL || "http://localhost:5000";
    const backendFormData = new FormData();
    backendFormData.append("image", image);

    const response = await fetch(
      `${baseUrl}/api/user-profile/${userId}/image`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: backendFormData,
      }
    );

    console.log("Backend upload image response:", response.status);
    const data = await response.json();
    console.log("Backend upload image data:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || "Failed to upload profile image",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Upload profile image API error:", error);
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
    const { userId } = await params;

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Verify the user is deleting their own profile image or is admin
    if (session.user.id !== userId && session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized to delete this profile image" },
        { status: 403 }
      );
    }

    console.log("Deleting profile image for user:", userId);

    // Call your backend API to delete the image
    const baseUrl = process.env.PRODUCTION_URL || "http://localhost:5000";
    const response = await fetch(
      `${baseUrl}/api/user-profile/${userId}/image`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    console.log("Backend delete image response:", response.status);
    const data = await response.json();
    console.log("Backend delete image data:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || "Failed to delete profile image",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Delete profile image API error:", error);
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
    const { userId } = await params;

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Verify the user is accessing their own profile image or is admin
    if (session.user.id !== userId && session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized to access this profile image" },
        { status: 403 }
      );
    }

    console.log("Getting profile image info for user:", userId);

    // Call your backend API to get image info
    const baseUrl = process.env.PRODUCTION_URL || "http://localhost:5000";
    const response = await fetch(
      `${baseUrl}/api/user-profile/${userId}/image`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    console.log("Backend get image info response:", response.status);
    const data = await response.json();
    console.log("Backend get image info data:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error:
            data.error || data.message || "Failed to get profile image info",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get profile image info API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
