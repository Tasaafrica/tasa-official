"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Home, User, Settings, LogOut, X, Search, LogIn } from "lucide-react";

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
  const { user, isAuthenticated, logout } = useAuth();

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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="lg:hidden fixed top-0 left-0 h-full w-72 sm:w-80 bg-white shadow-2xl transition-transform duration-300 ease-in-out z-60 overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          {isAuthenticated && user ? (
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-gray-50">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors absolute top-4 right-4"
              >
                <X className="w-5 h-5 text-black" />
              </button>
              <div className="text-center">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-teal-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-3 border-2 border-teal-200">
                    {getUserInitials(user.name || "User")}
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === "client"
                      ? "bg-teal-100 text-teal-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      user.role === "client" ? "bg-teal-500" : "bg-gray-500"
                    }`}
                  ></div>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
              </div>
            </div>
          ) : (
            /* Guest User Section */
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl font-bold mx-auto mb-3 border-2 border-gray-200">
                  <User className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                  Welcome Guest
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Sign in to access your profile
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onSignInClick();
                      onClose();
                    }}
                    className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onJoinClick();
                      onClose();
                    }}
                    className="w-full border border-teal-600 text-teal-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-50 transition-colors"
                  >
                    Join Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              <a
                href="/"
                className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={onClose}
              >
                <Home className="w-5 h-5 mr-3" />
                Home
              </a>

              <a
                href="/about"
                className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={onClose}
              >
                <User className="w-5 h-5 mr-3" />
                About
              </a>

              <button
                className="flex items-center w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => {
                  onSearchClick();
                  onClose();
                }}
              >
                <Search className="w-5 h-5 mr-3" />
                Find a Service
              </button>

              <a
                href="/vendor"
                className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={onClose}
              >
                <span className="bg-gradient-to-r from-teal-500 via-black to-teal-600 bg-clip-text text-transparent font-bold">
                  Become a Vendor
                </span>
              </a>
            </div>
          </nav>

          {/* User Actions (if authenticated) */}
          {isAuthenticated && user && (
            <div className="p-6 border-t border-gray-200">
              <div className="space-y-2">
                <a
                  href="/profile"
                  className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={onClose}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Profile Settings
                </a>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
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
