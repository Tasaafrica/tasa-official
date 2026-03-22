import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { firstName, middleName, surname, email, password } = body;

    if (!firstName || !surname || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Required fields are missing" },
        { status: 400 },
      );
    }

    // Call your backend API for user registration
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const registrationData = {
      name: `${firstName} ${
        middleName ? `${middleName} ` : ""
      }${surname}`.trim(),
      email,
      password,
      role: "client", // Default role for new users
    };

    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    });

    const data = await response.json();

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
          error: data.error || data.message || "Registration failed",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
