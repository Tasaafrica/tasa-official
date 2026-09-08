"use client";

import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import VendorSidebar from "@/app/v/component/VendorSidebar";
import { VendorHeaderContext } from "./context";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pageTitle, setPageTitle] = useState("");
  const [pageDescription, setPageDescription] = useState("");
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
    <VendorHeaderContext.Provider
      value={{
        setTitle: setPageTitle,
        setDescription: setPageDescription,
      }}
    >
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
            w-64 bg-white border-r border-gray-100
            transform transition-transform duration-300 ease-in-out
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <VendorSidebar onClose={() => setMobileMenuOpen(false)} />
        </aside>

        {/* Header */}
        <header className="fixed top-0 left-0 lg:left-64 right-0 bg-white border-b border-gray-100 z-30 h-17 flex items-center px-4 lg:px-6">
          {/* Hamburger Menu Button */}
          <button
            data-mobile-menu-toggle
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-800"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <div className="pt-1.5 lg:pt-0">
            <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 leading-tight truncate max-w-[200px] sm:max-w-xs md:max-w-md lg:max-w-none">{pageTitle}</h1>
            <p className="hidden lg:block text-xs text-gray-500 mt-0.5">{pageDescription}</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 pt-17">
          <div className="py-6 px-4 lg:px-10 max-w-7xl mx-auto">
            {pageDescription && (
              <p className="lg:hidden text-xs text-gray-500 mb-6 bg-slate-50 border border-slate-100 p-3.5 rounded-xl leading-relaxed">
                {pageDescription}
              </p>
            )}
            {children}
          </div>
        </main>
      </div>
    </VendorHeaderContext.Provider>
  );
}
