"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function TokenSync() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Sync the token when the session is loaded
    if (status === "authenticated" && (session as any)?.authToken) {
      const currentToken = (session as any).authToken;
      
      // We call the API to update the HttpOnly, Secure cookie across subdomains
      // This is crucial for cross-domain auth between tasa.com.ng and dash.tasa.com.ng
      fetch("/api/auth/token-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: currentToken }),
      }).catch((err) => console.error("Failed to sync token cookie:", err));
      
      // Update localStorage for legacy/client-side use on same domain
      if (localStorage.getItem("auth_token") !== currentToken) {
        localStorage.setItem("auth_token", currentToken);
      }
    } else if (status === "unauthenticated") {
       // Cleanup cookie on logout if needed
       fetch("/api/auth/token-cookie", { method: "DELETE" }).catch(() => {});
       localStorage.removeItem("auth_token");
    }
  }, [session, status]);

  return null; // This component doesn't render anything
}
