"use client";

/**
 * SearchModal Component
 *
 * Fetches fresh data from API on every search
 * No caching - always provides up-to-date results
 */

import { useState, useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import { ChevronRight, Zap } from "lucide-react";
import Link from "next/link";

interface SearchResult {
  type: "skill";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        const selectedResult = results[selectedIndex];
        if (selectedResult) {
          window.location.href = selectedResult.url;
          onClose();
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

  // Search function with debouncing - API-based search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setSelectedIndex(-1);
      setLoading(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      const searchResults: SearchResult[] = [];

      try {
        const baseUrl =
          process.env.PRODUCTION_URL || "https://tasa-server.onrender.com";

        // Search skills
        const skillsResponse = await fetch(
          `${baseUrl}/api/skills/search/${encodeURIComponent(query)}`,
          {
            cache: "no-store",
          }
        );

        // Process skills results
        if (skillsResponse.ok) {
          try {
            const skillsResult = await skillsResponse.json();

            // Handle different response formats
            let skillsData: Skill[] = [];
            if (Array.isArray(skillsResult)) {
              skillsData = skillsResult;
            } else if (skillsResult.success && skillsResult.data) {
              skillsData = skillsResult.data;
            } else if (skillsResult.data) {
              skillsData = skillsResult.data;
            }

            if (skillsData && skillsData.length > 0) {
              skillsData.forEach((skill) => {
                searchResults.push({
                  type: "skill",
                  id: skill._id,
                  name: skill.name,
                  slug: skill.slug,
                  url: `/skills/${skill._id}`,
                  description:
                    skill.description || `Professional ${skill.name} services`,
                  categoryName: skill.category?.name,
                  categorySlug: skill.category?.slug,
                  subcategoryName: skill.subcategory?.name,
                  subcategorySlug: skill.subcategory?.slug,
                });
              });
            }
          } catch (parseError) {
            console.error("Error parsing skills response:", parseError);
          }
        } else {
          console.error(
            "Skills API response not ok:",
            skillsResponse.status,
            skillsResponse.statusText
          );
        }

        // Results are already in the correct order (skills only)

        setResults(searchResults);
      } catch (err) {
        console.error("Error during search:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  const getResultIcon = (type: string) => {
    return <Zap className="w-4 h-4 text-purple-600" />;
  };

  const getResultLabel = (result: SearchResult) => {
    return `${result.categoryName} › ${result.subcategoryName} › Skill`;
  };

  const handleResultClick = () => {
    onClose();
    // Navigation will be handled by the Link component
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in-0 zoom-in-95"
      >
        {/* Search Input */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <CiSearch className="w-6 h-6 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-lg outline-none placeholder-gray-400 text-gray-600"
          />
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoIosClose className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <span className="ml-3 text-gray-600">Searching...</span>
            </div>
          ) : query.length < 2 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <CiSearch className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium mb-2">Search TASA</p>
              <p className="text-sm">Find skills and services</p>
            </div>
          ) : results.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <p className="text-lg font-medium mb-2">No results found</p>
              <p className="text-sm">Try searching for something else</p>
            </div>
          ) : (
            <div className="py-2">
              {results.map((result, index) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.url}
                  onClick={handleResultClick}
                  className={`flex items-center px-6 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                    index === selectedIndex ? "bg-gray-50" : ""
                  }`}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    {getResultIcon(result.type)}
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {result.name}
                        </p>
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                          {result.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {getResultLabel(result)}
                      </p>
                      {result.description && (
                        <p className="text-xs text-gray-400 truncate mt-1">
                          {result.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
                </Link>
              ))}
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
  );
}
