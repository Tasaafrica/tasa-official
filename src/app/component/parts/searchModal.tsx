"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  ChevronRight,
  CornerDownLeft,
  Globe,
  Layers,
  Loader2,
  Search,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { skillApi } from "@/lib/api";

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
    _id?: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    name: string;
    slug: string;
  };
}

export interface SearchScope {
  categorySlug?: string;
  categoryName?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialScope?: SearchScope;
  onClearScope?: () => void;
}

const POPULAR_BY_CATEGORY: Record<string, string[]> = {
  "graphics-design": [
    "Logo Design",
    "Brand Identity",
    "UI/UX Design",
    "Illustration",
    "Packaging Design",
    "Social Media Graphics",
  ],
  "programming-tech": [
    "Web Development",
    "Mobile Apps",
    "Frontend Development",
    "Backend API",
    "WordPress",
    "DevOps",
  ],
  "digital-marketing": [
    "Social Media Marketing",
    "SEO Optimization",
    "Content Strategy",
    "Paid Advertising",
    "Email Marketing",
  ],
  "video-animation": [
    "Video Editing",
    "2D Animation",
    "Motion Graphics",
    "Explainer Videos",
    "Short Form Content",
  ],
  "writing-translation": [
    "Content Writing",
    "Copywriting",
    "Proofreading",
    "Translation",
    "Technical Writing",
  ],
  "business-consulting": [
    "Business Plan",
    "Market Research",
    "Pitch Decks",
    "Financial Consulting",
    "Brand Strategy",
  ],
  "data-ai": [
    "Data Analytics",
    "Machine Learning",
    "Python Automation",
    "Data Visualization",
    "AI Integration",
  ],
};

const GLOBAL_POPULAR = [
  "Graphic Design",
  "Web Development",
  "Mobile Apps",
  "Social Media Marketing",
  "Video Editing",
  "Brand Identity",
];

export default function SearchModal({
  isOpen,
  onClose,
  initialScope,
  onClearScope,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [scope, setScope] = useState<SearchScope | undefined>(initialScope);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setScope(initialScope);
  }, [initialScope, isOpen]);

  // Reset results if query is empty
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setHasSearched(false);
      setSelectedIndex(-1);
    }
  }, [query]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keyboard navigation & Shortcuts
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
        if (selectedIndex >= 0 && results[selectedIndex]) {
          e.preventDefault();
          router.push(results[selectedIndex].url);
          onClose();
        } else if (query.trim()) {
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
  }, [isOpen, onClose, selectedIndex, results, query, router]);

  const performSearch = useCallback(
    async (
      overrideQuery?: string,
      overrideScope?: SearchScope | null
    ) => {
      const activeQuery = (overrideQuery ?? query).trim();
      if (!activeQuery) {
        setResults([]);
        setSelectedIndex(-1);
        return;
      }

      setLoading(true);
      setHasSearched(true);

      const effectiveScope =
        overrideScope === null ? undefined : (overrideScope ?? scope);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      try {
        let skillsData: Skill[] = [];

        if (effectiveScope?.categorySlug) {
          // 1. Scoped category search: fetch skills from category endpoint
          let categorySkills: Skill[] = [];
          try {
            const catRes = await fetch(
              `${baseUrl}/api/categories/${effectiveScope.categorySlug}/skills`
            );
            if (catRes.ok) {
              const catJson = await catRes.json();
              const raw = catJson.data || catJson;
              if (Array.isArray(raw)) categorySkills = raw;
              else if (raw.allSkills && Array.isArray(raw.allSkills))
                categorySkills = raw.allSkills;
              else if (raw.skills && Array.isArray(raw.skills))
                categorySkills = raw.skills;
            }
          } catch (err) {
            console.error("Error fetching category skills:", err);
          }

          const qLower = activeQuery.toLowerCase();
          const localMatches = categorySkills.filter(
            (s) =>
              s.name.toLowerCase().includes(qLower) ||
              s.description?.toLowerCase().includes(qLower)
          );

          // 2. Also search via API and filter to matching category
          const apiMatches = await skillApi.search(activeQuery);
          const filteredApiMatches = apiMatches.filter((s: Skill) => {
            const sSlug = s.category?.slug;
            const sName = s.category?.name;
            if (sSlug) {
              return (
                sSlug.toLowerCase() ===
                effectiveScope.categorySlug?.toLowerCase()
              );
            }
            if (sName && effectiveScope.categoryName) {
              return sName
                .toLowerCase()
                .includes(effectiveScope.categoryName.toLowerCase());
            }
            return false;
          });

          // Deduplicate
          const seen = new Set<string>();
          for (const item of [...localMatches, ...filteredApiMatches]) {
            const key = item._id || item.slug || item.name;
            if (!seen.has(key)) {
              seen.add(key);
              skillsData.push(item);
            }
          }
        } else {
          // Global search: search across the entire platform
          skillsData = await skillApi.search(activeQuery);
        }

        const searchResults: SearchResult[] = [];
        if (skillsData && skillsData.length > 0) {
          skillsData.forEach((skill: Skill) => {
            searchResults.push({
              type: "skill",
              id: skill._id,
              name: skill.name,
              slug: skill.slug,
              url: `/skills/${skill.slug}`,
              description:
                skill.description || `Verified ${skill.name} services & talent`,
              categoryName:
                skill.category?.name ||
                effectiveScope?.categoryName ||
                "Specialized Skill",
              categorySlug:
                skill.category?.slug || effectiveScope?.categorySlug,
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
    },
    [query, scope]
  );

  // Debounced search when user types
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch();
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const handleClearScope = () => {
    setScope(undefined);
    if (onClearScope) onClearScope();
    if (query.trim().length >= 2) {
      performSearch(query, null);
    }
  };

  const handlePillClick = (pillText: string) => {
    setQuery(pillText);
    performSearch(pillText);
  };

  if (!isOpen) return null;

  const popularPills =
    scope?.categorySlug && POPULAR_BY_CATEGORY[scope.categorySlug]
      ? POPULAR_BY_CATEGORY[scope.categorySlug]
      : GLOBAL_POPULAR;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search skills and services"
      className="fixed inset-0 z-[100] flex items-start justify-center p-3 sm:p-5 pt-[8vh] sm:pt-[11vh] bg-slate-950/65 backdrop-blur-md transition-all duration-200 overflow-y-auto"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[var(--color-border)] overflow-hidden flex flex-col max-h-[84vh] sm:max-h-[80vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Decorative Brand Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-[var(--color-brand-primary)] via-[var(--color-brand-secondary)] to-[var(--color-brand-accent)] shrink-0" />

        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-5 flex items-center gap-3 border-b border-[var(--color-border)]/70 bg-white shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-brand-soft)] flex items-center justify-center shrink-0 text-[var(--color-brand-primary)]">
            <Search className="w-5 h-5" />
          </div>

          <div className="flex-1 flex items-center min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                scope?.categoryName
                  ? `Search in ${scope.categoryName}...`
                  : "Search skills, services, or specialists..."
              }
              className="w-full text-base sm:text-lg font-medium text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] bg-transparent border-none outline-none focus:outline-none focus:ring-0 px-1 py-1"
            />
          </div>

          {/* Quick Clear Query Button */}
          {query.trim().length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors cursor-pointer"
              title="Clear input"
              aria-label="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Close Modal Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
            aria-label="Close search"
          >
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold text-[var(--color-text-muted)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded-md select-none">
              ESC
            </kbd>
            <X className="w-5 h-5 sm:hidden" />
          </button>
        </div>

        {/* Segmented Scope Switcher Bar (Only rendered when initialScope was provided) */}
        {initialScope?.categoryName && (
          <div className="px-4 sm:px-6 py-2.5 bg-[var(--color-bg-subtle)]/80 border-b border-[var(--color-border)]/60 flex items-center justify-between gap-3 text-xs shrink-0 flex-wrap">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[var(--color-border)] shadow-2xs">
              {/* Category Scoped Tab */}
              <button
                type="button"
                onClick={() => {
                  setScope(initialScope);
                  if (query.trim().length >= 2) performSearch(query, initialScope);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  scope?.categorySlug
                    ? "bg-[var(--color-highlight-soft)] text-[var(--color-brand-dark)] border border-[var(--color-brand-accent)] shadow-2xs"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] border border-transparent"
                }`}
              >
                <Sparkles
                  className={`w-3.5 h-3.5 ${
                    scope?.categorySlug
                      ? "text-[var(--color-brand-accent)]"
                      : "text-[var(--color-text-muted)]"
                  }`}
                />
                <span className="truncate max-w-[160px] sm:max-w-[220px]">
                  {initialScope.categoryName}
                </span>
              </button>

              {/* All Industries Tab */}
              <button
                type="button"
                onClick={handleClearScope}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  !scope?.categorySlug
                    ? "bg-[var(--color-brand-primary)] text-white shadow-2xs"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>All Industries</span>
              </button>
            </div>

            <span className="text-[11px] text-[var(--color-text-muted)] hidden md:inline">
              {scope?.categorySlug
                ? `Filtered strictly to ${scope.categoryName}`
                : "Searching all platform categories"}
            </span>
          </div>
        )}

        {/* Loading Progress Bar */}
        {loading && (
          <div className="h-0.5 bg-[var(--color-bg-brand-soft)] overflow-hidden w-full shrink-0">
            <div className="h-full bg-[var(--color-brand-primary)] animate-pulse origin-left w-full" />
          </div>
        )}

        {/* Modal Body Area */}
        <div className="flex-1 overflow-y-auto min-h-[260px] max-h-[58vh]">
          {/* State 1: Loading with no existing results */}
          {loading && results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-bg-brand-soft)] flex items-center justify-center mb-3">
                <Loader2 className="w-6 h-6 text-[var(--color-brand-primary)] animate-spin" />
              </div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                {scope?.categoryName
                  ? `Searching skills in ${scope.categoryName}...`
                  : "Searching all verified skills..."}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Finding the best matching professionals
              </p>
            </div>
          ) : query.trim().length < 2 ? (
            /* State 2: Discovery State (Query is empty / initial view) */
            <div className="p-5 sm:p-7">
              <div className="mb-5">
                <span className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider block mb-3">
                  {scope?.categoryName
                    ? `Popular in ${scope.categoryName}`
                    : "Trending Services & Skills"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {popularPills.map((pill) => (
                    <button
                      key={pill}
                      type="button"
                      onClick={() => handlePillClick(pill)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[var(--color-text-primary)] bg-[var(--color-bg-subtle)] hover:bg-[var(--color-bg-brand-soft)] hover:text-[var(--color-brand-primary)] border border-[var(--color-border)] hover:border-[var(--color-brand-primary)]/40 transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-[var(--color-brand-primary)]" />
                      <span>{pill}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick helper tip banner */}
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[var(--color-bg-subtle)] to-[var(--color-bg-brand-soft)]/40 border border-[var(--color-border)]/70 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-[var(--color-border)] flex items-center justify-center shrink-0 text-[var(--color-brand-primary)] shadow-2xs">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-text-primary)]">
                    Instant Milestone Match
                  </p>
                  <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
                    Type any keyword, tool, or specialization. You can view
                    verified portfolios, ratings, and hire directly with escrow
                    protection.
                  </p>
                </div>
              </div>
            </div>
          ) : results.length === 0 && !loading ? (
            /* State 3: Zero Results */
            <div className="py-16 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] flex items-center justify-center mx-auto mb-4 text-[var(--color-text-muted)] shadow-2xs">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                No skills found for &ldquo;{query}&rdquo;
                {scope?.categoryName ? ` in ${scope.categoryName}` : ""}
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-sm mx-auto">
                Check your spelling or try alternative keywords.
              </p>

              {scope?.categoryName && (
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleClearScope}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-button-secondary-hover)] font-semibold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Search across all industries</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* State 4: Matching Search Results */
            <div
              className={`p-2 sm:p-3 space-y-1 transition-opacity duration-150 ${
                loading ? "opacity-60" : "opacity-100"
              }`}
            >
              <div className="px-3 py-1 flex items-center justify-between text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                <span>Services & Skills ({results.length})</span>
                {scope?.categoryName && (
                  <span className="text-[var(--color-brand-accent)] font-semibold normal-case">
                    within {scope.categoryName}
                  </span>
                )}
              </div>

              {results.map((result, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <Link
                    key={`${result.type}-${result.id}-${index}`}
                    href={result.url}
                    onClick={onClose}
                    className={`group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[var(--color-bg-brand-soft)] ring-1 ring-[var(--color-brand-primary)]/40 border-l-4 border-[var(--color-brand-primary)] shadow-2xs"
                        : "hover:bg-[var(--color-bg-subtle)]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[var(--color-border)] flex items-center justify-center shrink-0 shadow-2xs group-hover:border-[var(--color-brand-primary)]/50 group-hover:text-[var(--color-brand-primary)] transition-colors">
                        <Briefcase className="w-4 h-4 text-[var(--color-brand-primary)]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-primary)] transition-colors truncate">
                            {result.name}
                          </p>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                            {result.categoryName || "Specialization"}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--color-text-secondary)] truncate mt-0.5">
                          {result.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pl-3 shrink-0">
                      <span className="text-xs font-semibold text-[var(--color-brand-primary)] opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
                        Explore
                      </span>
                      <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-primary)] group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                );
              })}

              {results.length > 0 && (
                <div className="pt-2 pb-1 text-center border-t border-[var(--color-border)]/60 mt-2">
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}${
                      scope?.categorySlug ? `&category=${scope.categorySlug}` : ""
                    }`}
                    onClick={onClose}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[var(--color-brand-primary)] hover:bg-[var(--color-bg-brand-soft)]/50 transition-colors"
                  >
                    <span>View all matching results</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Command Bar Footer with Keyboard Shortcuts */}
        <div className="px-4 sm:px-6 py-3 bg-[var(--color-bg-subtle)] border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-secondary)] shrink-0 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="font-semibold text-[var(--color-text-primary)]">
              TASA Talent Search
            </span>
            <span>•</span>
            <span>Verified African Professionals</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] text-[var(--color-text-muted)]">
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[var(--color-border)] font-mono text-[10px]">
                ↑↓
              </kbd>{" "}
              Navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[var(--color-border)] font-mono text-[10px]">
                ↵
              </kbd>{" "}
              Select
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[var(--color-border)] font-mono text-[10px]">
                ESC
              </kbd>{" "}
              Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
