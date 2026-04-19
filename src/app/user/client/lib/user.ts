import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { UserRecord } from "./user-types";

type UserApiResult = {
  user: UserRecord | null;
  error: string | null;
  status?: number;
};

function isUserRecord(value: unknown): value is UserRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v._id === "string" && typeof v.email === "string";
}

function extractUser(payload: unknown): UserRecord | null {
  if (isUserRecord(payload)) return payload;
  if (!payload || typeof payload !== "object") return null;

  const p = payload as Record<string, unknown>;
  const direct = p.user;
  if (isUserRecord(direct)) return direct;

  const data = p.data;
  if (isUserRecord(data)) return data;

  if (data && typeof data === "object") {
    const nested = (data as Record<string, unknown>).user;
    if (isUserRecord(nested)) return nested;
  }

  return null;
}

export async function getUserRecord(userId: string): Promise<UserApiResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.authToken) {
    return { user: null, error: "Unauthorized", status: 401 };
  }

  if (session.user.id !== userId && session.user.role !== "admin") {
    return { user: null, error: "Forbidden", status: 403 };
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    return {
      user: null,
      error: "Missing NEXT_PUBLIC_API_URL configuration",
      status: 500,
    };
  }

  const res = await fetch(`${baseUrl}/api/users/${userId}?t=${Date.now()}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${session.authToken}`,
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });

  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    const error =
      payload && typeof payload === "object"
        ? typeof (payload as Record<string, unknown>).error === "string"
          ? ((payload as Record<string, unknown>).error as string)
          : typeof (payload as Record<string, unknown>).message === "string"
            ? ((payload as Record<string, unknown>).message as string)
            : "Failed to fetch user"
        : "Failed to fetch user";

    return { user: null, error, status: res.status };
  }

  const user = extractUser(payload);
  if (!user) {
    return { user: null, error: "Unexpected API response", status: 502 };
  }

  return { user, error: null, status: 200 };
}
