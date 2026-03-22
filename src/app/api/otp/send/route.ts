import { type NextRequest, NextResponse } from "next/server";

type BackendResponse = {
  success?: boolean;
  error?: string;
  message?: string;
};

export async function POST(request: NextRequest) {
  const requestId = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
  try {
    const body = (await request.json().catch(() => null)) as {
      email?: string;
    } | null;

    const email = body?.email?.trim();
    console.info(`[${requestId}] OTP send request`, {
      emailProvided: Boolean(email),
      hasBody: Boolean(body),
    });
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
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

    const backendUrl = `${baseUrl}/api/otp/send`;
    console.info(`[${requestId}] OTP send proxying`, { backendUrl });
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = (await response
      .json()
      .catch(() => null)) as BackendResponse | null;
    console.info(`[${requestId}] OTP send response`, {
      backendStatus: response.status,
      backendOk: response.ok,
      successFlag: data?.success,
      hasError: Boolean(data?.error || data?.message),
    });

    if (response.ok && data?.success === false) {
      return NextResponse.json(
        {
          success: false,
          error: data?.error || data?.message || "Failed to send OTP",
        },
        { status: 400 },
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data?.error || data?.message || "Failed to send OTP",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data ?? { success: true }, {
      headers: { "x-request-id": requestId },
    });
  } catch (error) {
    console.error(`[${requestId}] OTP send API error:`, error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
