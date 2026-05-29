import { type NextRequest, NextResponse } from "next/server";

type BackendResponse = {
  success?: boolean;
  error?: string;
  message?: string;
  data?: {
    exists: boolean;
    email: string;
  };
};

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    console.log("[CHECK-EMAIL] Request received with email:", email);

    if (!email || typeof email !== "string") {
      console.log("[CHECK-EMAIL] Email parameter missing or invalid");
      return NextResponse.json(
        { success: false, error: "Email parameter is required" },
        { status: 400 },
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      console.log("[CHECK-EMAIL] Invalid email format:", trimmedEmail);
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 },
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      console.log("[CHECK-EMAIL] Backend API URL not configured");
      return NextResponse.json(
        { success: false, error: "Backend API URL is not configured" },
        { status: 500 },
      );
    }

    const backendUrl = `${baseUrl}/api/auth/check-email?email=${encodeURIComponent(trimmedEmail)}`;
    console.log("[CHECK-EMAIL] Calling backend API:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    console.log("[CHECK-EMAIL] Backend response status:", response.status);

    const data = (await response
      .json()
      .catch(() => null)) as BackendResponse | null;

    console.log("[CHECK-EMAIL] Backend response data:", data);

    if (!response.ok) {
      console.log(
        "[CHECK-EMAIL] Backend request failed with status:",
        response.status,
        "Error:",
        data?.error || data?.message,
      );
      return NextResponse.json(
        {
          success: false,
          error: data?.error || data?.message || "Failed to check email",
        },
        { status: response.status },
      );
    }

    const result = {
      success: true,
      data: {
        exists: data?.data?.exists ?? false,
        email: data?.data?.email ?? trimmedEmail,
      },
    };

    console.log("[CHECK-EMAIL] Success - Email exists:", result.data.exists);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[CHECK-EMAIL] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
