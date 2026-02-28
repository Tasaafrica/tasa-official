"use client";
import React, { useState, useEffect } from "react";
import { Home, LogIn, Search, User, LogOut, Settings } from "lucide-react";
import ExploreDropdown from "./exploreDropdown";
import SearchModal from "./searchModal";
import LoginModal from "./loginModal";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";

interface HeaderProps {
  variant?: "transparent" | "white" | "auto";
  invert?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  variant = "auto",
  invert = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState<"login" | "signup">(
    "login"
  );
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Get authentication state
  const { user, isAuthenticated, logout } = useAuth();

  // Close user menu when clicking outside
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100); // Show white header after 100px scroll
    };

    // Only add scroll listener if variant is "auto"
    if (variant === "auto") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [variant]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignInClick = () => {
    setLoginModalMode("login");
    setIsLoginModalOpen(true);
  };

  const handleJoinClick = () => {
    setLoginModalMode("signup");
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    // Handle successful login - could redirect or update UI
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
  };

  const HeaderContent = ({ isWhite = false }: { isWhite?: boolean }) => {
    const shouldUseWhiteText = invert ? !isWhite : isWhite;

    return (
      <div className="container-responsive">
        <div className="flex items-center justify-between header-height">
          {/* Logo and Mobile Menu Button Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Menu Button - Next to logo */}
            <button
              onClick={toggleMobileMenu}
              className={`lg:hidden p-2 rounded-md transition-colors duration-200 focus-visible ${
                shouldUseWhiteText
                  ? "text-gray-800 hover:bg-gray-100"
                  : "text-[#0F766E] hover:text-[#0D5F59]"
              }`}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex-shrink-0">
              <a
                href="/"
                className="flex items-center transition-transform duration-200 hover:scale-105"
              >
                <img
                  src={
                    shouldUseWhiteText
                      ? "/logo/text_teal.png"
                      : "/logo/text_teal.png"
                  }
                  alt="TASA Logo"
                  className="h-7 w-auto sm:h-8 md:h-9 lg:h-10"
                />
              </a>
            </div>
          </div>

          {/* Navigation Links - Centered */}
          <nav className="hidden lg:flex items-center justify-center flex-1 px-4 xl:px-8">
            <div className="flex items-center space-x-6 xl:space-x-8">
              <a
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus-visible ${
                  shouldUseWhiteText
                    ? "text-gray-800 hover:text-teal-600 hover:bg-gray-50"
                    : "text-[#0F766E] hover:text-[#0D5F59]"
                }`}
              >
                Home
              </a>
              <ExploreDropdown /* Hidden for now */
                className={`hidden px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus-visible ${
                  shouldUseWhiteText
                    ? "text-gray-800 hover:text-teal-600 hover:bg-gray-50"
                    : "text-[#0F766E] hover:text-[#0D5F59]"
                }`}
              />
              <a
                href="/services"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus-visible ${
                  shouldUseWhiteText
                    ? "text-gray-800 hover:text-teal-600 hover:bg-gray-50"
                    : "text-[#0F766E] hover:text-[#0D5F59]"
                }`}
              >
                About
              </a>
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus-visible flex items-center ${
                  shouldUseWhiteText
                    ? "text-gray-800 hover:text-teal-600 hover:bg-gray-50"
                    : "text-[#0F766E] hover:text-[#0D5F59]"
                }`}
              >
                <Search className="w-4 h-4 mr-2" />
                <span className="hidden xl:inline">Find a Service</span>
                <span className="xl:hidden">Search</span>
              </button>
            </div>
          </nav>

          {/* Auth Buttons or User Profile */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {isAuthenticated && user ? (
              /* User Profile Dropdown */
              <div className="relative" data-user-menu>
                <button
                  onClick={() => {
                    // Only allow dropdown on the active header
                    if (isWhite && !isScrolled) return; // Don't open on white header when not scrolled
                    if (!isWhite && isScrolled) return; // Don't open on transparent header when scrolled
                    setIsUserMenuOpen(!isUserMenuOpen);
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 focus-visible ${
                    shouldUseWhiteText
                      ? "text-gray-800 hover:bg-gray-50"
                      : "text-[#0F766E] hover:text-[#0D5F59]"
                  }`}
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-medium">
                      {getUserInitials(user.name || "User")}
                    </div>
                  )}
                  <span className="text-sm font-medium">{user.name}</span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen &&
                  // Only show dropdown on the active header
                  ((isWhite && isScrolled) || (!isWhite && !isScrolled)) && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>

                      <a
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Profile Settings
                      </a>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
              </div>
            ) : (
              /* Sign In/Join Buttons */
              <>
                <button
                  onClick={handleSignInClick}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus-visible ${
                    shouldUseWhiteText
                      ? "text-gray-800 hover:text-teal-600 hover:bg-gray-50"
                      : "text-[#0F766E] hover:text-[#0D5F59]"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={handleJoinClick}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus-visible ${
                    shouldUseWhiteText
                      ? "bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                      : "bg-[#0F766E] hover:bg-[#0D5F59] text-white shadow-sm"
                  }`}
                >
                  Join
                </button>
              </>
            )}
          </div>

          {/* Mobile Auth Button or User Profile */}
          {isAuthenticated && user ? (
            <div className="lg:hidden flex items-center space-x-2 px-3 py-2">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-medium">
                  {getUserInitials(user.name || "User")}
                </div>
              )}
              <span className="text-sm font-medium text-white">
                {user.name}
              </span>
            </div>
          ) : (
            <button
              onClick={handleJoinClick}
              className={`lg:hidden px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus-visible ${
                shouldUseWhiteText
                  ? "bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                  : "bg-[#0F766E] hover:bg-[#0D5F59] text-white shadow-sm"
              }`}
            >
              Join
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render based on variant
  if (variant === "transparent") {
    // Always transparent header
    return (
      <>
        <header className="absolute top-0 left-0 right-0 z-40 bg-transparent">
          <HeaderContent />
        </header>

        {/* Sidebar */}
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          onSignInClick={handleSignInClick}
          onJoinClick={handleJoinClick}
          onSearchClick={() => setIsSearchModalOpen(true)}
        />

        {/* Search Modal */}
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
        />
      </>
    );
  }

  if (variant === "white") {
    // Always white header (no shadow)
    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
          <HeaderContent isWhite={true} />
        </header>

        {/* Sidebar */}
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          onSignInClick={handleSignInClick}
          onJoinClick={handleJoinClick}
          onSearchClick={() => setIsSearchModalOpen(true)}
        />

        {/* Search Modal */}
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
        />
      </>
    );
  }

  // Default "auto" behavior - transparent header only
  return (
    <>
      {/* Transparent Header - Scrolls with page */}
      <header
        className={`absolute top-0 left-0 right-0 z-40 bg-transparent ${
          isScrolled ? "pointer-events-none" : ""
        }`}
      >
        <HeaderContent />
      </header>

      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        onSignInClick={handleSignInClick}
        onJoinClick={handleJoinClick}
        onSearchClick={() => setIsSearchModalOpen(true)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      {/* Login Modal */}
      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        mode={loginModalMode}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default Header;
