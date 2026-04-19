"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileLoader() {
  const router = useRouter();

  useEffect(() => {
    // This page acts as a loader while middleware handles redirection
    const timer = setTimeout(() => {
      router.replace("/"); // Fallback in case middleware fails
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mb-4"></div>
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    </div>
  );
}
