"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import OnboardingModal from "@/components/onboarding/OnboardingModal";

interface OnboardingContextType {
  openOnboarding: () => void;
  closeOnboarding: () => void;
  isOpen: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const openOnboarding = () => setIsOpen(true);
  const closeOnboarding = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("tasa_onboarding_dismissed", "true");
    }
  };

  useEffect(() => {
    // Only check when user is fully authenticated
    if (status !== "authenticated" || !session?.user?.id) {
      setIsOpen(false);
      return;
    }

    // Do NOT automatically open on the public home page
    if (pathname === "/") {
      setIsOpen(false);
      return;
    }

    // If dismissed in this browser session, do not auto-open
    if (typeof window !== "undefined" && sessionStorage.getItem("tasa_onboarding_dismissed") === "true") {
      return;
    }

    const userId = session.user.id;
    const localFlag = typeof window !== "undefined" ? localStorage.getItem(`tasa_onboarding_completed_${userId}`) : null;

    // If already marked completed in local storage, do not reopen automatically
    if (localFlag === "true") {
      return;
    }

    let isMounted = true;

    const checkOnboardingStatus = async () => {
      try {
        const authToken = (session as any).authToken;
        const res = await fetch(`/api/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
        });

        if (!res.ok) {
          return;
        }

        const json = await res.json().catch(() => null);
        const userData = json?.data || json?.user || json;

        if (!isMounted) return;

        // If the user already has a userType or accountType or onboardingCompleted
        if (userData?.userType || userData?.accountType || userData?.onboardingCompleted) {
          localStorage.setItem(`tasa_onboarding_completed_${userId}`, "true");
          if (userData?.userType) {
            localStorage.setItem("tasa_user_type", userData.userType);
          }
          if (userData?.role) {
            localStorage.setItem("tasa_user_category", userData.role);
          }
          setIsOpen(false);
        } else {
          // Only auto-open if not dismissed and not on home page
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Failed to check onboarding status:", err);
      }
    };

    checkOnboardingStatus();

    return () => {
      isMounted = false;
    };
  }, [session, status, pathname]);

  // Listen for manual trigger events (e.g. from registration or login)
  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener("tasa:open-onboarding", handleOpenEvent);
    return () => {
      window.removeEventListener("tasa:open-onboarding", handleOpenEvent);
    };
  }, []);

  return (
    <OnboardingContext.Provider value={{ openOnboarding, closeOnboarding, isOpen }}>
      {children}
      <OnboardingModal isOpen={isOpen} onClose={closeOnboarding} canDismiss={true} />
    </OnboardingContext.Provider>
  );
}

export function useOnboardingModal() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboardingModal must be used within an OnboardingProvider");
  }
  return context;
}
