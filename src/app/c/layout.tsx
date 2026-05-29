"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import ClientSidebar from "@/app/c/component/ClientSidebar";

interface ClientHeaderContextType {
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
}

const ClientHeaderContext = createContext<ClientHeaderContextType | null>(null);

export const useClientHeader = () => {
  const context = useContext(ClientHeaderContext);
  if (!context) {
    throw new Error("useClientHeader must be used within ClientLayout");
  }
  return context;
};

export default function ClientLayout({
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
      router.push("/auth/signin");
    } else if (status === "authenticated" && session?.user?.role !== "client") {
      if (session.user.role === "vendor") {
        router.push("/v/dashboard");
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

  if (session?.user?.role !== "client") {
    return null;
  }

  return (
    <ClientHeaderContext.Provider
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
          <ClientSidebar onClose={() => setMobileMenuOpen(false)} />
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
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1>
            <p className="text-xs text-gray-500">{pageDescription}</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 pt-17">
          <div className="py-6 px-4 lg:px-10 max-w-7xl mx-auto text-gray-800">{children}</div>
        </main>
      </div>
    </ClientHeaderContext.Provider>
  );
}
