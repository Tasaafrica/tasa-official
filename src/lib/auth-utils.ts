import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }
  return user;
}

export async function requireRole(role: string) {
  const user = await requireAuth();
  if (user.role !== role) {
    redirect("/unauthorized");
  }
  return user;
}

export function isAuthenticated(session: any): boolean {
  return !!session?.user;
}

export function hasRole(session: any, role: string): boolean {
  return session?.user?.role === role;
}
