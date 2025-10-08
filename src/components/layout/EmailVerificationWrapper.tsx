"use client";

import { useSession } from "next-auth/react";
import EmailVerificationAlert from "@/components/auth/EmailVerificationAlert";
import BackgroundVerificationInitializer from "@/components/auth/BackgroundVerificationInitializer";

interface EmailVerificationWrapperProps {
  children: React.ReactNode;
}

export default function EmailVerificationWrapper({
  children,
}: EmailVerificationWrapperProps) {
  const { data: session, status } = useSession();

  // Only show the alert if user is authenticated
  if (status === "loading" || !session) {
    return <>{children}</>;
  }

  return (
    <>
      <BackgroundVerificationInitializer />
      <EmailVerificationAlert />
      {children}
    </>
  );
}
