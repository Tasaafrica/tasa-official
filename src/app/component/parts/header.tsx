"use client";
import { ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useAuthModal } from "@/components/providers/AuthModalProvider";
import { useSearchModal } from "@/components/providers/SearchModalProvider";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  variant?: "transparent" | "white" | "auto";
  invert?: boolean;
  categorySlug?: string;
  categoryName?: string;
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

const CATEGORY_NAME_MAP: Record<string, string> = {
  "graphics-design": "Graphics & Design",
  "programming-tech": "Programming & Tech",
  "digital-marketing": "Digital Marketing",
  "video-animation": "Video & Animation",
  "writing-translation": "Writing & Translation",
  "business-consulting": "Business & Consulting",
  "data-ai": "Data & AI",
  "music-audio": "Music & Audio",
  "lifestyle-wellness": "Lifestyle & Wellness",
  "events-logistics": "Events & Logistics",
  "home-maintenance": "Home Maintenance",
  "personal-errand-services": "Personal & Errand Services",
};

const KNOWN_CATEGORY_SLUGS = Object.keys(CATEGORY_NAME_MAP);

const Header: React.FC<HeaderProps> = ({
  variant = "auto",
  invert = false,
  categorySlug,
  categoryName,
}) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { openLogin, openSignup } = useAuthModal();
  const { openSearch } = useSearchModal();

  // Helper to format category slug into human-friendly title
  const formatCategoryName = (slug: string) => {
    if (CATEGORY_NAME_MAP[slug]) return CATEGORY_NAME_MAP[slug];
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
      .replace(/\bAnd\b/g, "&");
  };

  // Determine active category: props take priority, otherwise infer from route
  const pathSegment = pathname?.replace(/^\//, "").split("/")[0]?.split("?")[0];
  const isKnownCategoryPath = Boolean(
    pathSegment && KNOWN_CATEGORY_SLUGS.includes(pathSegment)
  );

  const currentCategorySlug =
    categorySlug ||
    (pathname?.startsWith("/categories/")
      ? pathname.split("/categories/")[1]?.split("/")[0]?.split("?")[0]
      : isKnownCategoryPath
        ? pathSegment
        : undefined);

  const currentCategoryName =
    categoryName ||
    (currentCategorySlug ? formatCategoryName(currentCategorySlug) : undefined);

  // Attention glow state: glows until clicked by user or after 50s timeout
  const [hasInteractedWithSearch, setHasInteractedWithSearch] = useState(false);
  const [isGlowTimedOut, setIsGlowTimedOut] = useState(false);

  useEffect(() => {
    setHasInteractedWithSearch(false);
    setIsGlowTimedOut(false);

    if (!currentCategorySlug) return;

    // Automatically stop glowing after 50 seconds whether interacted with or not
    const timer = setTimeout(() => {
      setIsGlowTimedOut(true);
    }, 50000);

    return () => clearTimeout(timer);
  }, [currentCategorySlug]);

  const handleSearchClick = () => {
    setHasInteractedWithSearch(true);
    openSearch(
      currentCategorySlug
        ? {
            categorySlug: currentCategorySlug,
            categoryName: currentCategoryName,
          }
        : undefined
    );
  };

  const isCategoryActive = Boolean(currentCategoryName);
  const shouldGlow =
    isCategoryActive && !hasInteractedWithSearch && !isGlowTimedOut;

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

                {/* Dynamic Search Industry / Category Button */}
                <button
                  type="button"
                  onClick={handleSearchClick}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm transition-all focus-visible cursor-pointer relative ${
                    isCategoryActive
                      ? `bg-[var(--color-highlight-soft)] border border-[var(--color-brand-accent)] text-[var(--color-brand-dark)] shadow-sm ${
                          shouldGlow ? "animate-orange-glow" : ""
                        } hover:bg-[var(--color-brand-accent)]/20 font-semibold`
                      : isTransparent
                        ? "text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] hover:bg-white/40 font-medium"
                        : "text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-subtle)] font-medium"
                  }`}
                  aria-label={
                    currentCategoryName
                      ? `Search in ${currentCategoryName}`
                      : "Search Industry"
                  }
                  title={
                    currentCategoryName
                      ? `Search within ${currentCategoryName}`
                      : "Search across all industries"
                  }
                >
                  {shouldGlow && (
                    <span className="relative flex h-2 w-2 mr-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand-accent)] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-brand-accent)]" />
                    </span>
                  )}
                  <Search
                    className={`w-4 h-4 transition-colors ${
                      isCategoryActive
                        ? "text-[var(--color-brand-accent)]"
                        : "text-[var(--color-brand-primary)]"
                    }`}
                  />
                  <span>
                    {currentCategoryName
                      ? `Search in ${currentCategoryName}`
                      : "Search Industry"}
                  </span>
                </button>


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
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors"
                          >
                            Workspace
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
                onClick={handleSearchClick}
                className={`p-1.5 rounded-lg transition-all cursor-pointer relative ${
                  isCategoryActive
                    ? `bg-[var(--color-highlight-soft)] border border-[var(--color-brand-accent)] text-[var(--color-brand-dark)] shadow-sm ${
                        shouldGlow ? "animate-orange-glow" : ""
                      }`
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-subtle)]"
                }`}
                aria-label={
                  currentCategoryName
                    ? `Search in ${currentCategoryName}`
                    : "Search Industry"
                }
                title={
                  currentCategoryName
                    ? `Search in ${currentCategoryName}`
                    : "Search Industry"
                }
              >
                <Search
                  className={`w-5 h-5 ${
                    isCategoryActive
                      ? "text-[var(--color-brand-accent)]"
                      : ""
                  }`}
                />
                {shouldGlow && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand-accent)] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-brand-accent)]" />
                  </span>
                )}
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
        categoryName={currentCategoryName}
        shouldGlow={shouldGlow}
        onSearchClick={handleSearchClick}
      />
    </>
  );
};

export default Header;
