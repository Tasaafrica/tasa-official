"use client";

/**
 * SearchModal Component
 *
 * Fetches fresh data from API on every search
 * No caching - always provides up-to-date results
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { CiSearch } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import { ChevronRight, Zap, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { skillApi, categoryApi, subcategoryApi } from "@/lib/api";
import { Folder, Layers } from "lucide-react";

interface SearchResult {
  type: "skill" | "category" | "subcategory";
  id: string;
  name: string;
  slug?: string;
  url: string;
  description?: string;
  categoryName?: string;
  categorySlug?: string;
  subcategoryName?: string;
  subcategorySlug?: string;
}

interface Skill {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId?: string;
  subcategoryId?: string;
  category?: {
    name: string;
    slug: string;
  };
  subcategory?: {
    name: string;
    slug: string;
  };
}

interface SkillsSearchApiResponse {
  success: boolean;
  data: Skill[];
  message?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Reset search status when query changes - BUT keep results if we have them
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setHasSearched(false);
    }
  }, [query]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key and click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0) {
          e.preventDefault();
          const selectedResult = results[selectedIndex];
          if (selectedResult) {
            router.push(selectedResult.url);
            onClose();
          }
        } else if (query.trim()) {
          // If no result selected but we have a query, perform search or go to search page
          e.preventDefault();
          performSearch();
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, selectedIndex, results]);

  // Helper function to create slug from name
  const createSlug = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  // Manual trigger search function
  const performSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      // Fetch skills from its dedicated search endpoint
      // Fetch all categories and subcategories to filter client-side as suggested by user requirements
      const [skillsData, categoriesRes, subcategoriesRes] = await Promise.all([
        skillApi.search(query),
        categoryApi.getAll(),
        subcategoryApi.getAll()
      ]);

      const categoriesData = categoriesRes?.data || [];
      const subcategoriesData = subcategoriesRes?.data || [];

      const searchResults: SearchResult[] = [];

      // Process Categories
      if (categoriesData && categoriesData.length > 0) {
        const filteredCategories = categoriesData.filter((cat: any) => 
          cat.name.toLowerCase().includes(query.toLowerCase())
        );
        filteredCategories.forEach((cat: any) => {
          searchResults.push({
            type: "category",
            id: cat._id || cat.id,
            name: cat.name,
            slug: cat.slug,
            url: `/categories/${cat.slug}`,
            description: cat.description || `Browse all services in ${cat.name}`,
          });
        });
      }

      // Process Subcategories
      if (subcategoriesData && subcategoriesData.length > 0) {
        const filteredSubcategories = subcategoriesData.filter((sub: any) => 
          sub.name.toLowerCase().includes(query.toLowerCase())
        );
        filteredSubcategories.forEach((sub: any) => {
          searchResults.push({
            type: "subcategory",
            id: sub._id || sub.id,
            name: sub.name,
            slug: sub.slug,
            url: `/subcategories/${sub.slug}`,
            description: sub.description || `Explore ${sub.name} services`,
            categoryName: sub.category?.name,
            categorySlug: sub.category?.slug,
          });
        });
      }

      // Process Skills
      if (skillsData && skillsData.length > 0) {
        skillsData.forEach((skill: Skill) => {
          searchResults.push({
            type: "skill",
            id: skill._id,
            name: skill.name,
            slug: skill.slug,
            url: `/skills/${skill.slug}`,
            description: skill.description || `Professional ${skill.name} services`,
            categoryName: skill.category?.name || "Uncategorized",
            categorySlug: skill.category?.slug,
            subcategoryName: skill.subcategory?.name || "Skill",
            subcategorySlug: skill.subcategory?.slug,
          });
        });
      }

      setResults(searchResults);
    } catch (err) {
      console.error("Error in SearchModal:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  // Debounced search for automatic results
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  // Reset selected index when results change
  useEffect(() => {
    // Only reset if results actually changed to avoid jumpy UI
    if (results.length > 0) {
      setSelectedIndex(-1);
    }
  }, [results]);

  const getResultIcon = (type: string) => {
    switch (type) {
      case "category":
        return <Folder className="w-4 h-4 text-amber-600" />;
      case "subcategory":
        return <Layers className="w-4 h-4 text-teal-600" />;
      default:
        return <Zap className="w-4 h-4 text-purple-600" />;
    }
  };

  const getResultLabel = (result: SearchResult) => {
    if (result.type === "category") return "Main Service Category";
    if (result.type === "subcategory") return `Category › ${result.categoryName || "General"}`;
    return `${result.categoryName || "Uncategorized"} › ${result.subcategoryName || "Skill"}`;
  };

  const handleResultClick = () => {
    onClose();
    // Navigation will be handled by the Link component
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-md transition-all duration-300 overflow-y-auto">
      <div className="container-responsive py-4 sm:py-20 flex justify-center h-fit min-h-full">
        <div
          ref={modalRef}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 flex flex-col h-fit"
        >
        {/* Search Input */}
        <form 
          onSubmit={performSearch} 
          className="flex items-center px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 group transition-all"
        >
          <div className="flex items-center flex-1">
            <button 
              type="submit"
              className="p-1 focus:outline-none flex-shrink-0"
              aria-label="Submit search"
            >
              <CiSearch className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200 ${query ? "text-teal-600" : "text-gray-400"}`} />
            </button>
            <input
              ref={inputRef}
              type="text"
              placeholder="What service are you looking for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 ml-2 text-base sm:text-xl outline-none placeholder-gray-400 text-gray-800 bg-transparent w-full font-medium"
            />
          </div>
          <button //hidden
            type="button"
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors ml-1 sm:ml-2 flex-shrink-0"
          >
            <IoIosClose className="w-6 h-6 sm:w-7 sm:h-7 text-gray-500" />
          </button>
        </form>

        {/* Loading Indicator for subsequent searches */}
        {loading && results.length > 0 && (
          <div className="absolute top-[80px] sm:top-[100px] left-0 right-0 h-0.5 bg-teal-100 overflow-hidden z-10">
            <div className="h-full bg-teal-600 animate-progress origin-left w-full"></div>
          </div>
        )}

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto max-h-[60vh] sm:max-h-[70vh]">
          {loading && results.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
              <span className="ml-3 text-gray-600 font-medium">Finding the best skills...</span>
            </div>
          ) : query.length < 2 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <CiSearch className="w-16 h-16 mx-auto mb-4 text-gray-200" />
              <p className="text-xl font-semibold text-gray-800 mb-2">Search TASA</p>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Discover professional skills, services, and talented freelancers.
              </p>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CiSearch className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-lg font-medium text-gray-800 mb-1">No results for "{query}"</p>
              <p className="text-sm text-gray-500">Try checking your spelling or using different keywords</p>
            </div>
          ) : (
            <div className={`py-2 transition-opacity duration-200 ${loading ? "opacity-60" : "opacity-100"}`}>
              {results.slice(0, 15).map((result, index) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.url}
                  onClick={handleResultClick}
                  className={`flex items-center px-4 sm:px-6 py-3 hover:bg-teal-50/50 transition-colors cursor-pointer ${
                    index === selectedIndex ? "bg-teal-50/80 ring-1 ring-inset ring-teal-100" : ""
                  }`}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    {getResultIcon(result.type)}
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {result.name}
                        </p>
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full hidden sm:inline-block">
                          {result.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {getResultLabel(result)}
                      </p>
                     
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                </Link>
              ))}

              {results.length > 0 && (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="flex items-center justify-center px-4 sm:px-6 py-3 mt-1 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 transition-all border-t border-gray-100 group"
                >
                  <span className="flex items-center gap-2">
                    View all results
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {query.length >= 2 && results.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Use ↑↓ to navigate, Enter to select, Esc to close
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
