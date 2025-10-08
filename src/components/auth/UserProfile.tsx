"use client";

import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { FiUser, FiLogOut, FiSettings } from "react-icons/fi";

export function UserProfile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center space-x-4">
        <a
          href="/auth/signin"
          className="text-gray-700 hover:text-teal-600 font-medium"
        >
          Sign In
        </a>
        <a
          href="/auth/signup"
          className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 font-medium"
        >
          Join
        </a>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-teal-600"
      >
        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
          <FiUser className="w-4 h-4 text-teal-600" />
        </div>
        <span className="font-medium">{user.name}</span>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <a
            href="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FiSettings className="w-4 h-4 mr-2" />
            Profile Settings
          </a>

          <button
            onClick={() => signOut()}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FiLogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
