"use client";

import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Settings,
  Briefcase,
  LogOut,
  User,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { vendorApi } from "@/lib/vendor";

const navItems = [
  { name: "Dashboard", href: "/v/dashboard", icon: Home },
  { name: "Portfolio", href: "/v/portfolio", icon: Briefcase },
  { name: "Settings", href: "/v/settings", icon: Settings },
];

interface VendorSidebarProps {
  onClose?: () => void;
}

export default function VendorSidebar({ onClose }: VendorSidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [vendorData, setVendorData] = useState<any>(null);

  useEffect(() => {
    if (session?.user?.id && session?.authToken) {
      fetchVendorData();
    }
  }, [session]);

  const fetchVendorData = async () => {
    try {
      if (!session?.user?.id || !session?.authToken) return;
      const result = await vendorApi.getById(
        session.user.id,
        session.authToken
      );
      if (result.success && result.data) {
        setVendorData(result.data);
      }
    } catch (error) {
      console.error("Sidebar data fetch error:", error);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const vendorSlug = vendorData?.slug || vendorData?._id || session?.user?.id;

  return (
    <aside className="w-full h-full flex flex-col bg-white">

      {/* Profile Section */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[var(--color-brand-dark)] flex items-center justify-center overflow-hidden ring-2 ring-white shadow-xs shrink-0">
            {vendorData?.profileImage || session?.user?.image ? (
              <img
                src={vendorData?.profileImage || session?.user?.image}
                alt={vendorData?.name || session?.user?.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-xs font-bold text-[var(--color-text-primary)] truncate">
                {vendorData?.name || session?.user?.name || "Vendor"}
              </p>
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-brand-primary)] shrink-0" />
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {session?.user?.email || ""}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 block">
          Menu
        </span>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 ${
                    isActive
                      ? "bg-[var(--color-brand-dark)] text-white font-semibold shadow-xs"
                      : "text-slate-600 hover:bg-slate-100 hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? "text-[var(--color-brand-secondary)]"
                          : "text-slate-500"
                      }`}
                    />
                    <span className="text-xs">{item.name}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section: View Public Profile & Logout */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        {vendorSlug && (
          <Link
            href={`/vendors/${vendorSlug}`}
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-[var(--color-brand-primary)] transition-all duration-150"
          >
            <div className="flex items-center space-x-3">
              <ExternalLink className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold">View Public Profile</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-150 cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-xs font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
