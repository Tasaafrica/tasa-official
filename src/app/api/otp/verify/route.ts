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
      otp?: string;
      code?: string;
    } | null;

    const email = body?.email?.trim();
    const otp = body?.otp?.trim();
    const code = body?.code?.trim();
    const otpToken = code || otp;
    console.info(`[${requestId}] OTP verify request`, {
      emailProvided: Boolean(email),
      otpProvided: Boolean(otp),
      codeProvided: Boolean(code),
      hasBody: Boolean(body),
    });

    if (!email || !otpToken) {
      return NextResponse.json(
        { success: false, error: "Email and code are required" },
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

    const backendUrl = `${baseUrl}/api/otp/verify`;
    console.info(`[${requestId}] OTP verify proxying`, { backendUrl });
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: otpToken }),
    });

    const data = (await response
      .json()
      .catch(() => null)) as BackendResponse | null;
    console.info(`[${requestId}] OTP verify response`, {
      backendStatus: response.status,
      backendOk: response.ok,
      successFlag: data?.success,
      hasError: Boolean(data?.error || data?.message),
    });

    if (response.ok && data?.success === false) {
      return NextResponse.json(
        {
          success: false,
          error: data?.error || data?.message || "Failed to verify OTP",
        },
        { status: 400 },
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data?.error || data?.message || "Failed to verify OTP",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data ?? { success: true }, {
      headers: { "x-request-id": requestId },
    });
  } catch (error) {
    console.error(`[${requestId}] OTP verify API error:`, error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
