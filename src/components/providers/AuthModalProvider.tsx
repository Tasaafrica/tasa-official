"use client";

import React, { createContext, useContext, useState } from "react";
import LoginModal from "@/app/component/parts/loginModal";

interface AuthModalContextType {
  openLogin: () => void;
  openSignup: () => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  const openLogin = () => {
    setMode("login");
    setIsOpen(true);
  };

  const openSignup = () => {
    setMode("signup");
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider value={{ openLogin, openSignup, closeModal }}>
      {children}
      <LoginModal 
        open={isOpen} 
        onClose={closeModal} 
        mode={mode} 
        onSuccess={() => window.location.reload()} 
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
