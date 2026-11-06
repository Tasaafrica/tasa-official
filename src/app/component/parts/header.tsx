"use client";
import { ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useAuthModal } from "@/components/providers/AuthModalProvider";
import { useSearchModal } from "@/components/providers/SearchModalProvider";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  variant?: "transparent" | "white" | "auto";
  invert?: boolean;
}

interface TalentsDropdownProps {
  isTransparent?: boolean;
}

const TalentsDropdown: React.FC<TalentsDropdownProps> = ({
  isTransparent = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible flex items-center gap-1.5 cursor-pointer ${
          isOpen
            ? "text-[var(--color-brand-primary)] bg-[var(--color-bg-brand-soft)]"
            : isTransparent
              ? "text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] hover:bg-white/40"
              : "text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-subtle)]"
        }`}
      >
        <span>For Talents</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen
              ? "rotate-180 text-[var(--color-brand-primary)]"
              : "text-[var(--color-text-muted)]"
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[var(--color-bg-page)] shadow-lg border border-[var(--color-border)] p-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
          <div className="space-y-0.5">
            <Link
              href="/creatives"
              onClick={() => setIsOpen(false)}
              className="group block px-3 py-2 rounded-lg hover:bg-[var(--color-bg-brand-soft)] transition-colors duration-150 text-left"
            >
              <p className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-primary)] transition-colors">
                For Creatives
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] leading-snug mt-0.5">
                Designers, animators, writers, video & audio artists
              </p>
            </Link>

            <Link
              href="/professionals"
              onClick={() => setIsOpen(false)}
              className="group block px-3 py-2 rounded-lg hover:bg-[var(--color-bg-brand-soft)] transition-colors duration-150 text-left"
            >
              <p className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-primary)] transition-colors">
                For Professionals
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] leading-snug mt-0.5">
                Developers, marketers, consultants & tech specialists
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({
  variant = "auto",
  invert = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { openLogin, openSignup } = useAuthModal();
  const { openSearch } = useSearchModal();

  // Get authentication state
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("login") === "true") {
        openLogin();
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, [mounted, openLogin]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isUserMenuOpen) {
        const target = event.target as Element;
        if (!target.closest("[data-user-menu]")) {
          setIsUserMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const handleSignInClick = () => {
    openLogin();
  };
  const handleJoinClick = () => {
    openSignup();
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
    setIsUserMenuOpen(false);
    window.location.reload();
  };

  const isTransparent = variant === "transparent";
  const headerBgClass = isTransparent
    ? "bg-transparent"
    : "bg-[var(--color-bg-page)]";

  return (
    <>
      <header
        className={`relative w-full z-40 transition-colors ${headerBgClass}`}
      >
        <div className="container-responsive">
          <div className="flex items-center justify-between header-height">
            {/* Left: Mobile Menu Trigger & Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 -ml-2 rounded-lg text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors focus-visible cursor-pointer"
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Toggle mobile menu</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <div className="flex-shrink-0">
                <Link
                  href="/"
                  className="flex items-center mt-0 sm:mt-6 transition-transform duration-200 hover:scale-[1.02]"
                >
                  <Image
                    src="/logos/TAL_1.png"
                    alt="TASA Logo"
                    width={240}
                    height={200}
                    priority
                    className="h-10 w-auto sm:h-16"
                  />
                </Link>
              </div>
            </div>

            {/* Right: Navigation Links, Search Pill, & Auth Actions */}
            <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
              <nav className="flex items-center space-x-1">
                <Link
                  href="/how-tasa-works"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible ${
                    isTransparent
                      ? "text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] hover:bg-white/40"
                      : "text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-subtle)]"
                  }`}
                >
                  For Business
                </Link>

                <TalentsDropdown isTransparent={isTransparent} />

                {/* Search Industry Button */}
                <button
                  type="button"
                  onClick={openSearch}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible cursor-pointer ${
                    isTransparent
                      ? "text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] hover:bg-white/40"
                      : "text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-subtle)]"
                  }`}
                  aria-label="Search Industry"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Industry</span>
                </button>

                {mounted && isAuthenticated && user?.role === "client" && (
                  <Link
                    href="/become-a-vendor"
                    className="ml-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-highlight-soft)] text-[var(--color-warning)] hover:bg-[var(--color-highlight-bg)]/20 border border-[var(--color-highlight-bg)]/40 transition-colors"
                  >
                    Become a Vendor
                  </Link>
                )}
              </nav>

              {/* Vertical Divider */}
              <div className="h-5 w-px bg-[var(--color-border)]" />

              {/* Auth Buttons or User Profile */}
              <div className="flex items-center space-x-2">
                {mounted && isAuthenticated && user ? (
                  <div className="relative" data-user-menu>
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 p-1 rounded-full transition-colors focus-visible cursor-pointer"
                      aria-label="User menu"
                    >
                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt={user?.name || "User"}
                          width={34}
                          height={34}
                          priority
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-[var(--color-border)]"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[var(--color-brand-dark)] text-[var(--color-text-inverse)] flex items-center justify-center text-xs font-semibold ring-2 ring-[var(--color-border)]">
                          {getUserInitials(user?.name || "User")}
                        </div>
                      )}
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[var(--color-bg-page)] shadow-lg border border-[var(--color-border)] py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                        <div className="px-4 py-2 border-b border-[var(--color-border)]">
                          <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                            {user?.name}
                          </p>
                          <p
                            className="text-xs text-[var(--color-text-secondary)] truncate"
                            title={user?.email || ""}
                          >
                            {user?.email}
                          </p>
                        </div>

                        <div className="py-1">
                          <Link
                            href={
                              user?.role === "vendor"
                                ? "/v/dashboard"
                                : "/c/dashboard"
                            }
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors"
                          >
                            Dashboard
                          </Link>

                          <button
                            type="button"
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-[var(--color-error)] hover:bg-[var(--color-error-bg)] transition-colors cursor-pointer"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleSignInClick}
                      className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors cursor-pointer"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={handleJoinClick}
                      className="px-4 py-1.5 rounded-full text-sm font-semibold text-[var(--color-button-primary-text)] bg-[var(--color-button-primary-bg)] hover:bg-[var(--color-button-primary-hover)] active:scale-[0.98] shadow-xs transition-colors cursor-pointer"
                    >
                      Join
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Header Right CTA */}
            <div className="lg:hidden flex items-center space-x-1.5">
              <button
                type="button"
                onClick={openSearch}
                className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {mounted && isAuthenticated && user ? (
                <div className="flex items-center">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user?.name || "User"}
                      width={32}
                      height={32}
                      priority
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-[var(--color-border)]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[var(--color-brand-dark)] flex items-center justify-center text-[var(--color-text-inverse)] text-xs font-semibold">
                      {getUserInitials(user.name || "User")}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleJoinClick}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[var(--color-button-primary-text)] bg-[var(--color-button-primary-bg)] hover:bg-[var(--color-button-primary-hover)] shadow-xs transition-colors cursor-pointer"
                >
                  Join
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        onSignInClick={handleSignInClick}
        onJoinClick={handleJoinClick}
        onSearchClick={openSearch}
      />
    </>
  );
};

export default Header;
