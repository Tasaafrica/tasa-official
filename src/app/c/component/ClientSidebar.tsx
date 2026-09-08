"use client";

import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, LogOut, User, Heart } from "lucide-react";
import { userApi } from "@/lib/user";

const navItems = [
  { name: "Dashboard", href: "/c/dashboard", icon: Home },
  { name: "Bookmarks", href: "/c/bookmarks", icon: Heart },
  { name: "Settings", href: "/c/settings", icon: Settings },
];

interface ClientSidebarProps {
  onClose?: () => void;
}

export default function ClientSidebar({ onClose }: ClientSidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (session?.user?.id && session?.authToken) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      if (!session?.user?.id || !session?.authToken) return;
      const result = await userApi.getById(
        session.user.id,
        session.authToken
      );
      if (result.success && result.data) {
        setUserData(result.data);
      }
    } catch (error) {
      console.error("Sidebar data fetch error:", error);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleNavClick = () => {
    // Call onClose if provided (closes mobile menu)
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className="w-full h-full flex flex-col">
      {/* Profile Section */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#334155] flex items-center justify-center overflow-hidden shadow-sm">
            {userData?.profileImage || session?.user?.image ? (
              <img
                src={userData?.profileImage || session?.user?.image}
                alt={session?.user?.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">
              {userData?.name || session?.user?.name || "Client"}
            </p>
            <p className="text-[11px] text-gray-500 truncate">
              {session?.user?.email || ""}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-[#334155] text-gray-100 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-xs font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
