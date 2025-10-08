"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === "loading";
  const isAuthenticated = !!session?.user;

  const logout = async () => {
    await signOut({ redirect: false });
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
