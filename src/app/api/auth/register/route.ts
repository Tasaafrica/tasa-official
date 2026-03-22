import { type NextRequest, NextResponse } from "next/server";

type BackendResponse = {
  success?: boolean;
  error?: string;
  message?: string;
  data?: unknown;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password =
      typeof body?.password === "string" ? body.password.trim() : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { success: false, error: "Backend API URL is not configured" },
        { status: 500 },
      );
    }

    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = (await response
      .json()
      .catch(() => null)) as BackendResponse | null;

    if (response.ok && data?.success === false) {
      return NextResponse.json(
        {
          success: false,
          error: data?.error || data?.message || "Registration failed",
        },
        { status: 400 },
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data?.error || data?.message || "Registration failed",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data ?? { success: true });
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
