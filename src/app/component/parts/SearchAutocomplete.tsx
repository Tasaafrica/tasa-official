"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ArrowRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SearchAutocompleteProps {
  placeholder?: string;
  className?: string;
}

export default function SearchAutocomplete({
  placeholder = "What service are you looking for?",
  className,
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchResults = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(
        `${baseUrl.replace(/\/$/, "")}/api/skills/search/${encodeURIComponent(
          searchTerm
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        // Take first 4 results as requested
        setResults(items.slice(0, 4));
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 0) {
        fetchResults(query);
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: any) => {
    setIsOpen(false);
    setQuery(item.name);

    const itemType =
      item.type ||
      (Array.isArray(item.subcategories)
        ? "category"
        : Array.isArray(item.skills)
          ? "subcategory"
          : "skill");

    const destination =
      itemType === "category"
        ? `/categories/${item.slug || item._id}`
        : itemType === "subcategory"
          ? `/subcategories/${item.slug || item._id}`
          : `/skills/${item._id || item.slug}`;

    router.push(destination);
  };

  const handleViewAll = () => {
    setIsOpen(false);
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    handleViewAll();
  };

  return (
    <div className={cn("relative w-full max-w-2xl", className)} ref={dropdownRef}>
      <form 
        onSubmit={handleSearchSubmit}
        className={cn(
          "group flex items-stretch gap-1.5 sm:gap-3 bg-white border-2 border-slate-200/60 p-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ring-offset-white",
          "hover:border-teal-500/30 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)]",
          "focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-600/10",
          isOpen && results.length > 0 ? "rounded-t-2xl" : "rounded-2xl"
        )}
      >
        <div className="flex items-center gap-3 flex-1 px-3">
          {loading ? (
            <Loader2 className="h-5 w-5 text-teal-600 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors duration-300" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => { if (query.length > 0) setIsOpen(true); }}
            placeholder={placeholder}
            className="w-full bg-transparent py-3 text-base font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button 
              type="button"
              onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="h-auto aspect-square sm:aspect-auto px-4 sm:px-8 rounded-[12px] sm:rounded-[14px] bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all duration-300 shadow-[0_4px_12px_rgba(13,148,136,0.2)] flex items-center justify-center"
        >
          <Search className="w-5 h-5 sm:hidden" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-50 top-[calc(100%-2px)] left-0 right-0 bg-white border-2 border-teal-600/10 rounded-b-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            <div className="flex flex-col py-1">
              {results.map((item) => (
                <button
                  key={item._id}
                  onClick={() => handleSelect(item)}
                  className="flex items-center gap-4 px-5 py-3 text-left hover:bg-teal-50/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-teal-600">
                    <Search className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate text-sm">{item.name}</p>
                    <p className="text-[10px] text-slate-400 truncate uppercase tracking-wider font-bold">
                      {item.category?.name} {item.subcategory?.name && `• ${item.subcategory.name}`}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-200" />
                </button>
              ))}
              
              <button
                onClick={handleViewAll}
                className="flex items-center justify-between px-5 py-3.5 bg-slate-50/80 hover:bg-teal-600 hover:text-white transition-all text-slate-600 group mt-1"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-full bg-white shadow-sm group-hover:bg-white/20">
                    <ExternalLink className="w-3.5 h-3.5 group-hover:text-white" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.1em]">View all results for "{query}"</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
