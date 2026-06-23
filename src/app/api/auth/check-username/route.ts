import { type NextRequest, NextResponse } from "next/server";

type BackendResponse = {
  success?: boolean;
  error?: string;
  message?: string;
  data?: {
    exists: boolean;
    username: string;
  };
};

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.searchParams.get("username");

    console.log("[CHECK-USERNAME] Request received with username:", username);

    if (!username || typeof username !== "string") {
      console.log("[CHECK-USERNAME] Username parameter missing or invalid");
      return NextResponse.json(
        { success: false, error: "Username parameter is required" },
        { status: 400 },
      );
    }

    const trimmedUsername = username.trim().toLowerCase();

    if (!trimmedUsername.match(/^[a-zA-Z0-9_]+$/)) {
      console.log("[CHECK-USERNAME] Invalid username format:", trimmedUsername);
      return NextResponse.json(
        { success: false, error: "Invalid username format" },
        { status: 400 },
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      console.log("[CHECK-USERNAME] Backend API URL not configured");
      return NextResponse.json(
        { success: false, error: "Backend API URL is not configured" },
        { status: 500 },
      );
    }

    const backendUrl = `${baseUrl}/api/auth/check-username?username=${encodeURIComponent(trimmedUsername)}`;
    console.log("[CHECK-USERNAME] Calling backend API:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    console.log("[CHECK-USERNAME] Backend response status:", response.status);

    const data = (await response
      .json()
      .catch(() => null)) as BackendResponse | null;

    console.log("[CHECK-USERNAME] Backend response data:", data);

    if (!response.ok) {
      console.log(
        "[CHECK-USERNAME] Backend request failed with status:",
        response.status,
        "Error:",
        data?.error || data?.message,
      );
      return NextResponse.json(
        {
          success: false,
          error: data?.error || data?.message || "Failed to check username",
        },
        { status: response.status },
      );
    }

    const result = {
      success: true,
      data: {
        exists: data?.data?.exists ?? false,
        username: data?.data?.username ?? trimmedUsername,
      },
    };

    console.log("[CHECK-USERNAME] Success - Username exists:", result.data.exists);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[CHECK-USERNAME] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
