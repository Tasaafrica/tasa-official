"use client";

import { useSession } from "next-auth/react";
import BackgroundVerificationInitializer from "@/components/auth/BackgroundVerificationInitializer";

interface EmailVerificationWrapperProps {
  children: React.ReactNode;
}

export default function EmailVerificationWrapper({
  children,
}: EmailVerificationWrapperProps) {
  const { data: session, status } = useSession();

  if (status === "loading" || !session) {
    return <>{children}</>;
  }

  return (
    <>
      <BackgroundVerificationInitializer />
      {children}
    </>
  );
}
