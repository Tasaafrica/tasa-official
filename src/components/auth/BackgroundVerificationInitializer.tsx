"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  initializeBackgroundVerification,
  cleanupBackgroundVerification,
} from "@/lib/backgroundVerification";

export default function BackgroundVerificationInitializer() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      // Initialize background verification for authenticated user
      initializeBackgroundVerification(session.user.id);
    } else if (status === "unauthenticated") {
      // Clean up when user signs out
      cleanupBackgroundVerification();
    }

    // Cleanup on unmount
    return () => {
      cleanupBackgroundVerification();
    };
  }, [status, session?.user?.id]);

  // This component doesn't render anything
  return null;
}
