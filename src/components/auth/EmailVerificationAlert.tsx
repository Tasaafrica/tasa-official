"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FiMail, FiX, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useEmailVerification } from "@/hooks/useEmailVerification";

interface EmailVerificationAlertProps {
  onDismiss?: () => void;
}

export default function EmailVerificationAlert({
  onDismiss,
}: EmailVerificationAlertProps) {
  const { data: session, update } = useSession();
  const { verificationStatus, needsVerification, refreshVerificationStatus } =
    useEmailVerification();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Show dialog when verification is needed
  useEffect(() => {
    if (needsVerification && !isDismissed) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [needsVerification, isDismissed]);

  // Don't show if email is verified or doesn't require verification
  if (!needsVerification || isDismissed || !isOpen) {
    return null;
  }

  const handleSendMagicLink = async () => {
    try {
      setIsLoading(true);
      setMessage(null);

      const response = await fetch("/api/email-verification/send-magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session?.user?.email }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Verification email sent! Please check your inbox.");
        // Refresh verification status after sending magic link
        refreshVerificationStatus();
      } else {
        setMessage(
          result.error || "Failed to send verification email. Please try again."
        );
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsOpen(false);
    onDismiss?.();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-transparent bg-opacity-20 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-red-50 px-6 py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-900">
                  Email Verification Required
                </h3>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="text-sm text-gray-600 mb-4">
              <p>
                Please verify your email address{" "}
                <strong>{session?.user?.email}</strong> to access all features
                and ensure account security.
              </p>
            </div>

            {message && (
              <div
                className={`mb-4 flex items-center p-3 rounded-md ${
                  message.includes("sent")
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message.includes("sent") ? (
                  <FiCheckCircle className="h-4 w-4 mr-2" />
                ) : (
                  <FiAlertCircle className="h-4 w-4 mr-2" />
                )}
                <span className="text-sm">{message}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleSendMagicLink}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiMail className="h-4 w-4 mr-2" />
                {isLoading ? "Sending..." : "Send Verification Email"}
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
