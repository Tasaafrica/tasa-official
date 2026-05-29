"use client";

import React, { useState, useEffect, useRef } from "react";
import { Home, Info, Search, UserPlus, RefreshCw, Link as LinkIcon, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSearchModal } from "@/components/providers/SearchModalProvider";

export default function CustomContextMenu({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { openSearch } = useSearchModal();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleContextMenu = (e: MouseEvent) => {
      // Disable on mobile (touch devices usually handle their own context menus)
      if (window.innerWidth < 768) return;

      e.preventDefault();
      setIsVisible(true);
      
      // Calculate position relative to viewport (since we use fixed positioning)
      const x = Math.min(e.clientX, window.innerWidth - 220);
      const y = Math.min(e.clientY, window.innerHeight - 300);
      
      setPosition({ x, y });
    };

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsVisible(false);
      } else {
        // Hide if any menu item was clicked
        setIsVisible(false);
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", () => setIsVisible(false));

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", () => setIsVisible(false));
    };
  }, []);

  const menuItems = [
    { 
      label: "Home", 
      icon: Home, 
      action: () => router.push("/") 
    },
    { 
      label: "Browse Services", 
      icon: Search, 
      action: () => openSearch() 
    },
    { 
      label: "About TASA", 
      icon: Info, 
      action: () => router.push("/about") 
    },
    { type: "divider" },
    { 
      label: "Refresh Page", 
      icon: RefreshCw, 
      action: () => window.location.reload() 
    },
    { 
      label: "Copy Website URL", 
      icon: LinkIcon, 
      action: () => {
        navigator.clipboard.writeText(window.location.origin);
        toast.success("URL copied to clipboard!");
      } 
    },
  ];

  if (!mounted) return <div className="relative min-h-screen">{children}</div>;

  return (
    <div className="relative min-h-screen">
      {children}
      
      {isVisible && (
        <div
          ref={menuRef}
          className="fixed z-[100] w-52 bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl py-2 animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
          style={{ top: position.y, left: position.x }}
        >
          <div className="px-3 py-1.5 mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">TASA Toolbox</span>
          </div>
          
          {menuItems.map((item, index) => (
            item.type === "divider" ? (
              <div key={index} className="h-px bg-gray-100 my-1 mx-2" />
            ) : (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-teal-500 hover:text-white transition-all group"
              >
                {item.icon && <item.icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />}
                <span className="font-medium">{item.label}</span>
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}
