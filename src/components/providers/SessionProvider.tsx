"use client";

import {
  SessionProvider as NextAuthSessionProvider,
  useSession,
} from "next-auth/react";
import { ReactNode, useEffect } from "react";

interface SessionProviderProps {
  children: ReactNode;
}

function SessionSync({ children }: SessionProviderProps) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.authToken) {
      localStorage.setItem("auth_token", session.authToken);
    }
  }, [session?.authToken]);

  return <>{children}</>;
}

export function SessionProvider({ children }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider>
      <SessionSync>{children}</SessionSync>
    </NextAuthSessionProvider>
  );
}
