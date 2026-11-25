"use client";

import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import VendorSidebar from "@/app/v/component/VendorSidebar";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/?login=true");
    } else if (status === "authenticated" && session?.user?.role !== "vendor") {
      if (session.user.role === "client") {
        router.push("/c/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (session?.user?.role !== "vendor") {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          w-64 bg-white border-r border-slate-200/80
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <VendorSidebar onClose={() => setMobileMenuOpen(false)} />
      </aside>

      {/* Mobile Top Bar (sidebar toggle only, desktop navbar removed) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 z-30 h-14 flex items-center justify-between px-4">
        <button
          data-mobile-menu-toggle
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-800"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Vendor Portal
        </span>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 bg-[var(--color-bg-page)] min-h-screen">
        <div className="py-6 px-4 lg:px-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
