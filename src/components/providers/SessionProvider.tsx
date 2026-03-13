"use client";

import {
  SessionProvider as NextAuthSessionProvider,
  useSession,
} from "next-auth/react";
import type { Session } from "next-auth";
import { ReactNode, useEffect } from "react";

interface SessionProviderProps {
  children: ReactNode;
  session?: Session | null;
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

export function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider session={session}>
      <SessionSync>{children}</SessionSync>
    </NextAuthSessionProvider>
  );
}
