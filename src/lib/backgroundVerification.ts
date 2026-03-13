"use client";

import { startBackgroundVerificationCheck } from "./verificationChecker";

/**
 * Initialize background email verification checking
 * This should be called after user signs in
 */
export function initializeBackgroundVerification(userId: string): void {
  // Clean up any existing interval first to prevent duplicates
  cleanupBackgroundVerification();

  // Start the background check
  startBackgroundVerificationCheck(userId);

  // Set up periodic checks (every 10 minutes)
  const intervalId = setInterval(() => {
    startBackgroundVerificationCheck(userId);
  }, 10 * 60 * 1000);

  // Store interval ID for cleanup
  (window as any).__verificationIntervalId = intervalId;
}

/**
 * Clean up background verification
 * This should be called when user signs out
 */
export function cleanupBackgroundVerification(): void {
  const intervalId = (window as any).__verificationIntervalId;
  if (intervalId) {
    clearInterval(intervalId);
    (window as any).__verificationIntervalId = null;
  }
}

/**
 * Manual trigger for verification check
 * This can be called from anywhere in the app
 */
export function triggerVerificationCheck(userId: string): void {
  startBackgroundVerificationCheck(userId);
}
