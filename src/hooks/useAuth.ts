"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === "loading";
  const isAuthenticated = !!session?.user;

  const logout = async () => {
    // Clear NextAuth cookies and session
    await signOut({
      redirect: false,
      callbackUrl: "/",
    });

    // Clear any additional app-specific data
    if (typeof window !== "undefined") {
      // Clear localStorage if you store any auth data there
      localStorage.clear();
    }

    router.push("/");
  };

  const requireAuth = () => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
    }
  };

  return {
    user: session?.user,
    session,
    isLoading,
    isAuthenticated,
    logout,
    requireAuth,
  };
}
