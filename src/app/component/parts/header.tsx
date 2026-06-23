"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LogOut, Search, User } from "lucide-react";
import ExploreDropdown from "./exploreDropdown";
import SearchModal from "./searchModal";
import LoginModal from "./loginModal";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { vendorApi } from "@/lib/vendor";
import { userApi } from "@/lib/user";
import { useAuthModal } from "@/components/providers/AuthModalProvider";
import { useSearchModal } from "@/components/providers/SearchModalProvider";

interface HeaderProps {
  variant?: "transparent" | "white" | "auto";
  invert?: boolean;
}

// Separated HeaderContent component to avoid recreation on every render and fix hydration
const HeaderContent = ({
  isWhite = false,
  invert,
  toggleMobileMenu,
  openSearch,
  handleSignInClick,
  handleJoinClick,
  isAuthenticated,
  user,
  isUserMenuOpen,
  setIsUserMenuOpen,
  handleLogout,
  getUserInitials,
  isScrolled,
  userData,
}: any) => {
  const shouldUseWhiteText = invert ? !isWhite : isWhite;

  return (
    <div className="container-responsive">
      <div className="flex items-center justify-between header-height">
        {/* Logo and Mobile Menu Button Section */}
        <div className="flex items-center space-x-2 sm:space-x-3">
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
                src="/logo/teal_logo.png"
                alt="TASA Logo"
                className="h-5 w-auto sm:h-5 md:h-7 lg:h-7"
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
            <a
              href="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus-visible ${
                shouldUseWhiteText
                  ? "text-gray-800 hover:text-teal-600 hover:bg-gray-50"
                  : "text-[#0F766E] hover:text-[#0D5F59]"
              }`}
            >
              About
            </a>
            <button
              onClick={openSearch}
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
            {isAuthenticated && user?.role === "client" && (
              <a
                href="/vendor"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus-visible ${
                  shouldUseWhiteText
                    ? "text-gray-800 hover:text-teal-600 hover:bg-gray-50"
                    : "text-[#0F766E] hover:text-[#0D5F59]"
                }`}
              >
                <span className="bg-gradient-to-r from-teal-500 via-black to-teal-600 bg-clip-text text-transparent font-bold">
                  Become a Vendor
                </span>
              </a>
            )}
          </div>
        </nav>

        {/* Auth Buttons or User Profile */}
        <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
          {isAuthenticated && user ? (
            <div className="relative" data-user-menu>
              <button
                onClick={() => {
                  if (isWhite && !isScrolled) return;
                  if (!isWhite && isScrolled) return;
                  setIsUserMenuOpen(!isUserMenuOpen);
                }}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 focus-visible ${
                  shouldUseWhiteText
                    ? "text-gray-800 hover:bg-gray-50"
                    : "text-[#0F766E] hover:text-[#0D5F59]"
                }`}
              >
                {userData?.profileImage || user.image ? (
                  <img
                    src={userData?.profileImage || user.image}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white text-base font-medium">
                    {getUserInitials(user.name || "User")}
                  </div>
                )}
              </button>

              {isUserMenuOpen &&
                ((isWhite && isScrolled) || (!isWhite && !isScrolled)) && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {userData?.name || user.name}
                      </p>
                      <p
                        className="text-sm text-gray-500 truncate"
                        title={userData?.email || user.email || ""}
                      >
                        {userData?.email || user.email}
                      </p>
                    </div>

                    <Link
                      href={user?.role === "vendor" ? "/v/dashboard" : "/c/dashboard"}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>

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

        {/* Mobile User Profile */}
        {isAuthenticated && user ? (
          <div className="lg:hidden flex items-center px-3 py-2">
            {userData?.profileImage || user.image ? (
              <img
                src={userData?.profileImage || user.image}
                alt={user.name || "User"}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-medium">
                {getUserInitials(user.name || "User")}
              </div>
            )}
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

const Header: React.FC<HeaderProps> = ({
  variant = "auto",
  invert = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { openLogin, openSignup } = useAuthModal();
  const { openSearch } = useSearchModal();

  // Get authentication state
  const { user, isAuthenticated, logout, session } = useAuth();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated && session?.user?.id && (session as any).authToken) {
      fetchHeaderData();
    }
  }, [isAuthenticated, session]);

  const fetchHeaderData = async () => {
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
      console.error("Header data fetch error:", error);
    }
  };

  // Fix hydration issues by only showing client stuff after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const params = new URLSearchParams(window.location.search);
      if (params.get("login") === "true") {
        openLogin();
        // Remove the query parameter from URL bar so it doesn't open again on page refresh
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    if (variant === "auto") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [variant]);

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
    window.location.reload(); // Force a clean refresh to clear all states
  };

  const commonProps = {
    invert,
    toggleMobileMenu,
    openSearch,
    handleSignInClick,
    handleJoinClick,
    isAuthenticated: mounted ? isAuthenticated : false, // Prevent hydration mismatch
    user: mounted ? user : null,
    isUserMenuOpen,
    setIsUserMenuOpen,
    handleLogout,
    getUserInitials,
    isScrolled,
    userData,
  };

  return (
    <>
      <header
        className={`absolute top-0 left-0 right-0 z-40 bg-transparent transition-opacity duration-300 ${
          isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <HeaderContent {...commonProps} isWhite={false} />
      </header>

      {/* Sticky White Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm transition-all duration-300 transform ${
          isScrolled
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <HeaderContent {...commonProps} isWhite={true} />
      </header>

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
