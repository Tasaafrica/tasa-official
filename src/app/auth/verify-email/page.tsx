"use client";

// This is a client component that should not be statically generated
export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";

function VerifyEmailContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update } = useSession();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setMessage("Invalid verification link. Please request a new one.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "/api/email-verification/verify-magic-link",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        const result = await response.json();

        if (response.ok) {
          setMessage(
            "Email verified successfully! You can now access all features."
          );
          setIsSuccess(true);

          // Dispatch verification success event
          const event = new CustomEvent("emailVerified", {
            detail: { timestamp: Date.now() },
          });
          window.dispatchEvent(event);

          // Update the session to reflect the new verification status
          await update();
        } else {
          setMessage(
            result.error || "Failed to verify email. Please try again."
          );
        }
      } catch (error) {
        setMessage(
          "An error occurred while verifying your email. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, update]);

  const handleContinue = () => {
    router.push("/");
  };

  const handleRequestNewLink = () => {
    router.push("/auth/signin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <FiLoader className="h-12 w-12 text-teal-600 animate-spin mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verifying Email
              </h2>
              <p className="text-gray-600">
                Please wait while we verify your email address...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {isSuccess ? (
                <FiCheckCircle className="h-12 w-12 text-green-600 mb-4" />
              ) : (
                <FiAlertCircle className="h-12 w-12 text-red-600 mb-4" />
              )}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isSuccess ? "Email Verified!" : "Verification Failed"}
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>

              <div className="space-y-3">
                {isSuccess ? (
                  <button
                    onClick={handleContinue}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Continue to Dashboard
                  </button>
                ) : (
                  <button
                    onClick={handleRequestNewLink}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Request New Verification Link
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
