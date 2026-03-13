"use client";

import {
  getCachedVerificationStatus,
  setCachedVerificationStatus,
  isVerificationStatusCached,
} from "./verificationCache";

interface VerificationStatus {
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
  requiresVerification: boolean;
}

interface VerificationCheckResult {
  success: boolean;
  data?: VerificationStatus;
  error?: string;
}

// Track in-flight requests and last check time
let inFlightRequest: Promise<VerificationCheckResult> | null = null;
let lastCheckTime = 0;
const CHECK_COOLDOWN = 30000; // 30 seconds cooldown for fresh API checks

/**
 * Check email verification status for a user
 * Uses cache first, then fetches from API if needed
 */
export async function checkEmailVerification(
  userId: string
): Promise<VerificationCheckResult> {
  // 1. Return in-flight request if exists
  if (inFlightRequest) return inFlightRequest;

  const now = Date.now();

  try {
    // 2. Check cache first
    const cachedStatus = getCachedVerificationStatus(userId);
    
    // If we have cached data and it's not too old, return it
    // Note: getCachedVerificationStatus already handles TTL, but we add an extra layer here
    if (cachedStatus && (now - lastCheckTime < CHECK_COOLDOWN)) {
      return {
        success: true,
        data: {
          isEmailVerified: cachedStatus.isEmailVerified,
          emailVerifiedAt: cachedStatus.emailVerifiedAt,
          requiresVerification: cachedStatus.requiresVerification,
        },
      };
    }

    // 3. Create a new request and track it
    inFlightRequest = (async () => {
      try {
        const response = await fetch(`/api/auth/verify-status/${userId}`);
        const result = await response.json();

        if (result.success && result.data) {
          setCachedVerificationStatus(userId, result.data);
          lastCheckTime = Date.now();
          return {
            success: true,
            data: result.data,
          };
        } else {
          return {
            success: false,
            error: result.error || "Failed to check verification status",
          };
        }
      } catch (error) {
        console.error("Error checking verification status:", error);
        return {
          success: false,
          error: "Network error while checking verification status",
        };
      } finally {
        // Clear in-flight tracker
        inFlightRequest = null;
      }
    })();

    return inFlightRequest;
  } catch (error) {
    inFlightRequest = null;
    return {
      success: false,
      error: "Unexpected error during verification check",
    };
  }
}

/**
 * Check if user needs email verification
 */
export async function needsEmailVerification(userId: string): Promise<boolean> {
  const result = await checkEmailVerification(userId);

  if (result.success && result.data) {
    return result.data.requiresVerification && !result.data.isEmailVerified;
  }

  return false;
}

/**
 * Show email verification prompt
 * This function can be customized based on your UI framework
 */
export function showEmailVerificationPrompt(): void {
  // Dispatch a custom event that the EmailVerificationAlert can listen to
  const event = new CustomEvent("emailVerificationRequired", {
    detail: { timestamp: Date.now() },
  });

  window.dispatchEvent(event);
}

/**
 * Background verification checker
 * This should be called after user signs in
 */
export async function startBackgroundVerificationCheck(
  userId: string
): Promise<void> {
  try {
    const result = await checkEmailVerification(userId);

    if (result.success && result.data) {
      const { isEmailVerified, requiresVerification } = result.data;

      if (requiresVerification && !isEmailVerified) {
        showEmailVerificationPrompt();
      } else {
      }
    } else {
      console.error("Failed to check verification status:", result.error);
    }
  } catch (error) {
    console.error("Error in background verification check:", error);
  }
}

/**
 * Clear verification cache for a user
 * Useful when user verifies their email
 */
export function clearUserVerificationCache(userId: string): void {
  const { clearCachedVerificationStatus } = require("./verificationCache");
  clearCachedVerificationStatus(userId);
}
