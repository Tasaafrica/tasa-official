import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Signup request body:", body);

    const { firstName, middleName, surname, email, password, phone } = body;

    if (!firstName || !surname || !email || !password) {
      console.log("Missing required fields:", {
        firstName,
        surname,
        email,
        password: !!password,
      });
      return NextResponse.json(
        { success: false, error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Call your backend API for user registration
    const baseUrl = process.env.PRODUCTION_URL || "http://localhost:5000";
    const registrationData = {
      name: `${firstName} ${
        middleName ? middleName + " " : ""
      }${surname}`.trim(),
      email,
      password,
      role: "client", // Default role for new users
    };

    console.log("Calling backend API:", `${baseUrl}/api/auth/register`);
    console.log("Registration data:", {
      ...registrationData,
      password: "[REDACTED]",
    });

    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    });

    console.log("Backend response status:", response.status);
    const data = await response.json();
    console.log("Backend response data:", data);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || data.message || "Registration failed",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
