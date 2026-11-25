import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function handleUserTypeOnboarding(
  request: NextRequest,
  method: "POST" | "PUT",
) {
  const requestId = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  try {
    const session = await getServerSession(authOptions);
    const body = (await request.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;

    if (!body || typeof body.role !== "string") {
      return NextResponse.json(
        { success: false, error: "Role is required" },
        { status: 400 },
      );
    }

    const token =
      request.headers.get("authorization")?.replace("Bearer ", "") ||
      (session as any)?.authToken;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { success: false, error: "Backend API URL is not configured" },
        { status: 500 },
      );
    }

    const backendUrl = `${baseUrl}/api/auth/onboarding/user-type`;
    console.info(`[${requestId}] User-type onboarding proxying`, {
      backendUrl,
      method,
      role: body.role,
      hasToken: Boolean(token),
    });

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    let response = await fetch(backendUrl, {
      method,
      headers,
      body: JSON.stringify(body),
    });

    // If POST returns 405 Method Not Allowed, fallback to PUT
    if (response.status === 405 && method === "POST") {
      console.info(`[${requestId}] Retrying with PUT`);
      response = await fetch(backendUrl, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      });
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error(
        `[${requestId}] Onboarding backend error status ${response.status}:`,
        data,
      );
      return NextResponse.json(
        {
          success: false,
          error:
            data?.error ||
            data?.message ||
            "Failed to save onboarding user type",
          details: data,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data ?? { success: true }, {
      headers: { "x-request-id": requestId },
    });
  } catch (error) {
    console.error(`[${requestId}] User-type onboarding API error:`, error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  return handleUserTypeOnboarding(request, "POST");
}

export async function PUT(request: NextRequest) {
  return handleUserTypeOnboarding(request, "PUT");
}
