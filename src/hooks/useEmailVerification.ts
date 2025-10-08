"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  checkEmailVerification,
  needsEmailVerification,
  clearUserVerificationCache,
} from "@/lib/verificationChecker";

interface VerificationStatus {
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
  requiresVerification: boolean;
}

interface UseEmailVerificationReturn {
  verificationStatus: VerificationStatus | null;
  isLoading: boolean;
  error: string | null;
  needsVerification: boolean;
  refreshVerificationStatus: () => Promise<void>;
  clearCache: () => void;
}

export function useEmailVerification(): UseEmailVerificationReturn {
  const { data: session, status } = useSession();
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshVerificationStatus = useCallback(async () => {
    if (!session?.user?.id) {
      setVerificationStatus(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await checkEmailVerification(session.user.id);

      if (result.success && result.data) {
        setVerificationStatus(result.data);
      } else {
        setError(result.error || "Failed to check verification status");
      }
    } catch (err) {
      setError("Network error while checking verification status");
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  const clearCache = useCallback(() => {
    if (session?.user?.id) {
      clearUserVerificationCache(session.user.id);
      setVerificationStatus(null);
    }
  }, [session?.user?.id]);

  // Check verification status when user signs in
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      refreshVerificationStatus();
    } else if (status === "unauthenticated") {
      setVerificationStatus(null);
      setError(null);
    }
  }, [status, session?.user?.id, refreshVerificationStatus]);

  // Listen for verification events
  useEffect(() => {
    const handleVerificationEvent = () => {
      if (session?.user?.id) {
        refreshVerificationStatus();
      }
    };

    window.addEventListener(
      "emailVerificationRequired",
      handleVerificationEvent
    );
    window.addEventListener("emailVerified", handleVerificationEvent);

    return () => {
      window.removeEventListener(
        "emailVerificationRequired",
        handleVerificationEvent
      );
      window.removeEventListener("emailVerified", handleVerificationEvent);
    };
  }, [session?.user?.id, refreshVerificationStatus]);

  const needsVerification = Boolean(
    verificationStatus?.requiresVerification &&
      !verificationStatus?.isEmailVerified
  );

  return {
    verificationStatus,
    isLoading,
    error,
    needsVerification,
    refreshVerificationStatus,
    clearCache,
  };
}
