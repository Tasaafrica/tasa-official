"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Briefcase,
  ChevronDown,
  LogOut,
  Search,
  Settings,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { vendorApi } from "@/lib/vendor";
import { userApi } from "@/lib/user";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInClick: () => void;
  onJoinClick: () => void;
  onSearchClick: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  onSignInClick,
  onJoinClick,
  onSearchClick,
}: SidebarProps) {
  const { user, isAuthenticated, logout, session } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [isTalentsOpen, setIsTalentsOpen] = useState(true);

  useEffect(() => {
    if (isAuthenticated && session?.user?.id && (session as any).authToken) {
      fetchData();
    }
  }, [isAuthenticated, session]);
  const fetchData = async () => {
    try {
      const authToken = (session as any).authToken;
      if (!session?.user?.id || !authToken) return;

      const role = (session.user as any).role;
      let result;

      if (role === "vendor") {
        result = await vendorApi.getById(session.user.id, authToken);
      } else {
        result = await userApi.getById(session.user.id, authToken);
      }

      if (result.success && result.data) {
        setUserData(result.data);
      }
    } catch (error) {
      console.error("Sidebar data fetch error:", error);
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  // We handle visibility via CSS classes to allow for exit animations

  return (
    <>
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div 
        className={`lg:hidden fixed top-0 left-0 h-full w-4/5 max-w-xs bg-[var(--color-bg-page)] shadow-2xl z-60 overflow-y-auto transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          {isAuthenticated && user ? (
            <div className="p-6 border-b border-[var(--color-border)] bg-gradient-to-b from-[var(--color-bg-subtle)] to-[var(--color-bg-page)]">
              <button
                onClick={onClose}
                className="p-2 hover:bg-[var(--color-bg-subtle)] rounded-full transition-colors absolute top-4 right-4"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-[var(--color-text-primary)]" />
              </button>
              <div className="text-center">
                {userData?.profileImage || user.image || (user as any).profileImage ? (
                  <img
                    src={userData?.profileImage || user?.image || (user as any).profileImage}
                    alt={user?.name || "User"}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-[var(--color-border-brand)]/40 shadow-xs"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[var(--color-brand-dark)] flex items-center justify-center text-[var(--color-text-inverse)] text-xl font-bold mx-auto mb-3 border-2 border-[var(--color-border)] shadow-xs">
                    {getUserInitials(user.name || "User")}
                  </div>
                )}
                <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-0.5">
                  {userData?.name || user.name}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] mb-2.5 truncate max-w-[200px] mx-auto">
                  {userData?.email || user.email}
                </p>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === "client"
                      ? "bg-[var(--color-bg-brand-soft)] text-[var(--color-brand-primary)]"
                      : "bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      user.role === "client" ? "bg-[var(--color-brand-primary)]" : "bg-[var(--color-text-muted)]"
                    }`}
                  ></div>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
              </div>
            </div>
          ) : (
            /* Guest User Section */
            <div className="p-6 border-b border-[var(--color-border)] bg-gradient-to-b from-[var(--color-bg-subtle)] to-[var(--color-bg-page)]">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--color-bg-subtle)] flex items-center justify-center text-[var(--color-text-muted)] text-xl font-bold mx-auto mb-3 border border-[var(--color-border)]">
                  <User className="w-8 h-8 text-[var(--color-text-muted)]" />
                </div>
                <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-1">
                  Welcome to TASA
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] mb-4">
                  Sign in to explore Africa's premier talent network
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onSignInClick();
                      onClose();
                    }}
                    className="w-full bg-[var(--color-button-primary-bg)] text-[var(--color-button-primary-text)] px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--color-button-primary-hover)] shadow-xs transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onJoinClick();
                      onClose();
                    }}
                    className="w-full border border-[var(--color-border-brand)] text-[var(--color-brand-primary)] px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[var(--color-bg-brand-soft)] transition-colors"
                  >
                    Join Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 p-5 overflow-y-auto">
            <div className="space-y-1.5">
              <a
                href="/how-tasa-works"
                className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors"
                onClick={onClose}
              >
                <Briefcase className="w-5 h-5 mr-3 text-[var(--color-brand-primary)]" />
                For Business
              </a>

              {/* For Talents Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsTalentsOpen(!isTalentsOpen)}
                  className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors"
                >
                  <span className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-3 text-[var(--color-brand-primary)]" />
                    For Talents
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform duration-200 ${
                      isTalentsOpen ? "rotate-180 text-[var(--color-brand-primary)]" : ""
                    }`}
                  />
                </button>

                {isTalentsOpen && (
                  <div className="pl-11 pr-2 py-1 space-y-1">
                    <a
                      href="/creatives"
                      className="block px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-brand-soft)] rounded-lg transition-colors"
                      onClick={onClose}
                    >
                      For Creatives
                    </a>
                    <a
                      href="/professionals"
                      className="block px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-brand-soft)] rounded-lg transition-colors"
                      onClick={onClose}
                    >
                      For Professionals
                    </a>
                  </div>
                )}
              </div>

              <button
                className="flex items-center w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors"
                onClick={() => {
                  onSearchClick();
                  onClose();
                }}
              >
                <Search className="w-5 h-5 mr-3 text-[var(--color-brand-primary)]" />
                Find a Service
              </button>

              {isAuthenticated && user?.role === "client" && (
                <div className="pt-2">
                  <a
                    href="/become-a-vendor"
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[var(--color-highlight-soft)] text-[var(--color-warning)] border border-[var(--color-highlight-bg)]/40 hover:bg-[var(--color-highlight-bg)]/20 transition-colors"
                    onClick={onClose}
                  >
                    <span>Become a Vendor</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* User Actions (if authenticated) */}
          {isAuthenticated && user && (
            <div className="p-5 border-t border-[var(--color-border)] bg-[var(--color-bg-page)]">
              <div className="space-y-1.5">
                <a
                  href={user?.role === "vendor" ? "/v/dashboard" : "/c/dashboard"}
                  className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors"
                  onClick={onClose}
                >
                  <Settings className="w-5 h-5 mr-3 text-[var(--color-text-muted)]" />
                  Dashboard
                </a>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-[var(--color-error)] hover:bg-[var(--color-error-bg)] transition-colors cursor-pointer"
                >
                  <LogOut className="w-5 h-5 mr-3 text-[var(--color-error)]" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
