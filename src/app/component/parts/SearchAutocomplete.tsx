"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ArrowRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { skillApi } from "@/lib/api";

interface SearchAutocompleteProps {
  placeholder?: string;
  className?: string;
}

export default function SearchAutocomplete({
  placeholder = "What service are you looking for?",
  className,
}: SearchAutocompleteProps) {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchResults = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const items = await skillApi.search(searchTerm);
      // Take first 4 results as requested
      setResults(items.slice(0, 4));
    } catch (error) {
      console.error("Search error in SearchAutocomplete:", error);
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
          : `/skills/${item.slug || item._id}`;

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
        suppressHydrationWarning
        autoComplete="off"
        className={cn(
          "group flex items-stretch gap-1.5 sm:gap-3 bg-[var(--color-bg-page)] border-2 border-[var(--color-border)] p-1 shadow-sm transition-all duration-300 ring-offset-white",
          "hover:border-[var(--color-brand-secondary)]/60 hover:shadow-md",
          "focus-within:border-[var(--color-brand-secondary)] focus-within:ring-4 focus-within:ring-[var(--color-brand-secondary)]/20",
          isOpen && results.length > 0 ? "rounded-t-2xl" : "rounded-2xl"
        )}
      >
        <div className="flex items-center gap-3 flex-1 px-3">
          {loading ? (
            <Loader2 className="h-5 w-5 text-[var(--color-brand-primary)] animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-[var(--color-text-muted)] group-focus-within:text-[var(--color-brand-primary)] transition-colors duration-200" />
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
            autoComplete="off"
            spellCheck={false}
            suppressHydrationWarning
            className="w-full bg-transparent py-3 text-base font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
          />
          {query && (
            <button 
              type="button"
              onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}
              className="p-1 rounded-full hover:bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="h-auto aspect-square sm:aspect-auto px-4 sm:px-8 rounded-[12px] sm:rounded-[14px] bg-[var(--color-button-primary-bg)] hover:bg-[var(--color-button-primary-hover)] text-[var(--color-button-primary-text)] font-semibold transition-colors shadow-xs flex items-center justify-center cursor-pointer"
        >
          <Search className="w-5 h-5 sm:hidden" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      <AnimatePresence>
        {isOpen && query.trim().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-50 top-[calc(100%-2px)] left-0 right-0 bg-[var(--color-bg-page)] border-2 border-[var(--color-border)] rounded-b-2xl shadow-xl overflow-hidden"
          >
            <div className="flex flex-col py-1">
              {loading ? (
                <div className="px-5 py-8 text-center">
                  <Loader2 className="h-6 w-6 text-[var(--color-brand-primary)] animate-spin mx-auto mb-2" />
                  <p className="text-sm text-[var(--color-text-secondary)]">Searching for services...</p>
                </div>
              ) : results.length > 0 ? (
                <>
                  {results.slice(0, 4).map((item) => (
                    <button
                      key={item._id}
                      onClick={() => handleSelect(item)}
                      className="flex items-center gap-4 px-5 py-3 text-left hover:bg-[var(--color-bg-brand-soft)] transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-subtle)] flex items-center justify-center text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-primary)]">
                        <Search className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[var(--color-text-primary)] truncate text-sm">{item.name}</p>
                        <p className="text-[10px] text-[var(--color-text-muted)] truncate uppercase tracking-wider font-bold">
                          {item.category?.name} {item.subcategory?.name && `• ${item.subcategory.name}`}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)]" />
                    </button>
                  ))}
                  
                  <button
                    onClick={handleViewAll}
                    className="flex items-center justify-between px-5 py-3.5 bg-[var(--color-bg-subtle)] hover:bg-[var(--color-brand-primary)] hover:text-white transition-all text-[var(--color-text-secondary)] group mt-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-full bg-white shadow-xs group-hover:bg-white/20">
                        <ExternalLink className="w-3.5 h-3.5 group-hover:text-white" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-[0.08em]">View all results for &ldquo;{query}&rdquo;</span>
                    </div>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="px-5 py-8 text-center">
                  <div className="w-12 h-12 bg-[var(--color-bg-subtle)] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search className="h-6 w-6 text-[var(--color-text-muted)]" />
                  </div>
                  <p className="font-semibold text-[var(--color-text-primary)] text-sm mb-1">No results found</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">We couldn&apos;t find any services matching &ldquo;{query}&rdquo;</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
