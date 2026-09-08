"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/app/component/parts/header";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import { Button } from "@/app/component/ui/button";
import { ChevronDown, Filter, Users, X, Check, Banknote, ShieldCheck, MapPin, Star, ArrowUp } from "lucide-react";
import PlainHero from "@/app/component/parts/plainHero";
import {Separator} from "@/app/component/ui/separator";
import VendorCard from "@/app/component/parts/vendorCard";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { vendorApi } from "@/lib/vendor";

// Custom Dropdown Component
interface DropdownProps {
    label: string;
    value: string;
    options: { label: string; value: string }[];
    onChange: (value: string) => void;
    icon?: React.ReactNode;
}

function FilterDropdown({ label, value, options, onChange, icon }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                ref={buttonRef}
                onClick={toggleDropdown}
                className={`flex items-center justify-center lg:justify-start gap-2 h-10 px-3 lg:px-4 lg:py-2.5 rounded-xl border transition-all text-sm font-medium min-w-[3.5rem] lg:w-full lg:w-auto whitespace-nowrap ${
                    value !== 'all' 
                    ? 'bg-teal-50 border-teal-200 text-teal-700' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm lg:shadow-none'
                }`}
            >
                {icon && <span className={`${value !== 'all' ? 'text-teal-600' : 'opacity-70'}`}>{icon}</span>}
                <span className="hidden lg:block flex-1 text-left">{value === 'all' ? label : selectedOption?.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 opacity-50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        style={{
                            position: 'fixed',
                            top: coords.top - window.scrollY + 8,
                            left: Math.min(coords.left, typeof window !== 'undefined' ? window.innerWidth - 220 : coords.left),
                            minWidth: '200px',
                            zIndex: 9999
                        }}
                        className="bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-1.5">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                                        value === option.value 
                                        ? 'bg-teal-50 text-teal-700 font-semibold' 
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {option.label}
                                    {value === option.value && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


interface Professional {
  _id: string;
  name: string;
  title: string;
  bio: string;
  location: string;
  rating: number;
  reviewCount: number;
  profileImage: string;
  skills: string[];
  priceFrom: number;
  priceCurrency: string;
  verified: boolean;
}

const dummyProfessionals: Professional[] = [];

interface Skill {
  subcategory: any;
  category: any;
  _id: string;
  name: string;
  slug: string;
  description?: string;
  providers?: number;
  popular?: boolean;
  rating?: number;
  reviewCount?: number;
  categoryId?: string;
  subcategoryId?: string;
  icon?: string;
}

interface SkillsPageProps {
  skill: Skill;
}

export default function SkillsPage({ skill }: SkillsPageProps) {
  const category = skill.category;
  const subcategory = skill.subcategory;

  const { data: session } = useSession();

  // Vendor states
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const LIMIT = 12;

  // Filter states
  const [budgetFilter, setBudgetFilter] = useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [reviewsFilter, setReviewsFilter] = useState<string>("all");

  const fetchVendors = async (targetPage: number, isLoadMore: boolean = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const result = await vendorApi.getVendorsBySkill(
        skill.slug,
        session?.authToken || undefined,
        targetPage,
        LIMIT
      );

      if (result.success && result.data) {
        const fetchedList = Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data.vendors)
          ? result.data.vendors
          : [];

        const pagination = result.data.pagination;
        
        setVendors((prev) => (isLoadMore ? [...prev, ...fetchedList] : fetchedList));

        if (pagination) {
          setHasMore(targetPage < (pagination.pages || 1));
        } else {
          setHasMore(fetchedList.length >= LIMIT);
        }
      } else {
        setError(result.message || "Failed to load vendors for this skill.");
      }
    } catch (err) {
      console.error("Error in fetchVendors:", err);
      setError("An unexpected error occurred while fetching vendors.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setVendors([]);
    setPage(1);
    fetchVendors(1, false);
  }, [skill.slug, session?.authToken]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchVendors(nextPage, true);
  };

  // Map VendorData to Professional structure
  const mappedProfessionals = useMemo(() => {
    return vendors.map((vendor) => {
      const stateVal = vendor.state || "";
      const countryVal = vendor.country || "";
      const locationStr = stateVal && countryVal
        ? `${stateVal}, ${countryVal}`
        : stateVal || countryVal || vendor.location || "Lagos, Nigeria";

      const skillNames = Array.isArray(vendor.skills)
        ? vendor.skills.map((s: any) => typeof s === "string" ? s : s.name)
        : [];

      return {
        _id: vendor._id || vendor.id,
        name: vendor.name || "Professional Vendor",
        title: vendor.category || "Specialist",
        bio: vendor.bio || vendor.about_me || "Expert delivering high-quality results.",
        location: locationStr,
        rating: typeof vendor.rating === "number" ? vendor.rating : 4.8,
        reviewCount: typeof vendor.reviewCount === "number" ? vendor.reviewCount : 5,
        profileImage: vendor.profileImage || "/placeholder-avatar.jpg",
        skills: skillNames.length > 0 ? skillNames.slice(0, 3) : ["Expert", "Verified"],
        priceFrom: typeof vendor.priceFrom === "number" ? vendor.priceFrom : 12000,
        priceCurrency: vendor.priceCurrency || "₦",
        verified: vendor.isEmailVerified || false,
        slug: vendor.slug || vendor._id || vendor.id,
      };
    });
  }, [vendors]);

  // Get unique locations dynamically from loaded vendors
  const uniqueLocations = useMemo(() => {
    return Array.from(
      new Set(mappedProfessionals.map((p) => p.location)),
    ).sort();
  }, [mappedProfessionals]);

  // Options for custom dropdowns
  const budgetOptions = [
    { label: "All Budgets", value: "all" },
    { label: "₦5k - ₦10k", value: "budget-low" },
    { label: "₦10k - ₦15k", value: "budget-medium" },
    { label: "₦15k+", value: "budget-high" },
  ];

  const verificationOptions = [
    { label: "All Professionals", value: "all" },
    { label: "Verified Only", value: "verified" },
  ];

  const locationOptions = useMemo(() => {
    return [
      { label: "All Locations", value: "all" },
      ...uniqueLocations.map(loc => ({ label: loc, value: loc }))
    ];
  }, [uniqueLocations]);

  const ratingOptions = [
    { label: "All Ratings", value: "all" },
    { label: "4.8 - 5.0 ⭐", value: "reviews-high" },
    { label: "4.5 - 4.7 ⭐", value: "reviews-medium" },
    { label: "4.0 - 4.4 ⭐", value: "reviews-low" },
  ];

  // Filter professionals based on selected filters
  const filteredProfessionals = useMemo(() => {
    return mappedProfessionals.filter((professional) => {
      // Budget filter
      if (budgetFilter !== "all") {
        if (budgetFilter === "budget-low" && professional.priceFrom > 10000)
          return false;
        if (
          budgetFilter === "budget-medium" &&
          (professional.priceFrom < 10000 || professional.priceFrom > 15000)
        )
          return false;
        if (budgetFilter === "budget-high" && professional.priceFrom < 15000)
          return false;
      }

      // Verified filter
      if (verifiedFilter === "verified" && !professional.verified) return false;

      // Location filter
      if (locationFilter !== "all" && professional.location !== locationFilter)
        return false;

      // Reviews filter
      if (reviewsFilter !== "all") {
        if (reviewsFilter === "reviews-high" && professional.rating < 4.8)
          return false;
        if (
          reviewsFilter === "reviews-medium" &&
          (professional.rating < 4.5 || professional.rating >= 4.8)
        )
          return false;
        if (reviewsFilter === "reviews-low" && professional.rating >= 4.5)
          return false;
      }

      return true;
    });
  }, [mappedProfessionals, budgetFilter, verifiedFilter, locationFilter, reviewsFilter]);

  // Breadcrumbs logic
  const categorySlug =
    category?.slug ||
    category?.name?.toLowerCase().replace(/\s+/g, "-") ||
    "category";

  // Scroll to filters logic for mobile
  const filterRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (filterRef.current) {
        const filterBottom = filterRef.current.getBoundingClientRect().bottom;
        setShowScrollTop(filterBottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToFilters = () => {
    filterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header />
      <PlainHero
        title={skill.name}
        description={skill.description || `Explore ${skill.name.toLowerCase()} services and project specialists`}
        breadcrumbSeparator=">"
        breadcrumbs={[
          {
            label: category?.name || "Category",
            href: `/categories/${categorySlug}`,
          },
          { label: skill.name },
        ]}
      />

      {/* Main Content Area */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-8 md:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row-reverse gap-8 items-start">
            
            {/* Filter Sidebar (Desktop) / Header (Mobile) */}
            <aside className="w-full lg:w-80 lg:sticky lg:top-24 z-30" ref={filterRef}>
              <div className="bg-white border border-slate-100 lg:border-slate-200 p-5 py-6 lg:rounded-3xl lg:p-6 lg:shadow-sm rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-teal-600" />
                        <h3 className="font-bold text-slate-900">Filters</h3>
                    </div>
                    {(budgetFilter !== "all" || verifiedFilter !== "all" || locationFilter !== "all" || reviewsFilter !== "all") && (
                        <button
                            onClick={() => {
                                setBudgetFilter("all");
                                setVerifiedFilter("all");
                                setLocationFilter("all");
                                setReviewsFilter("all");
                            }}
                            className="text-xs text-teal-600 hover:text-teal-700 font-semibold"
                         >
                            Reset
                        </button>
                    )}
                </div>

                {/* Filters container: Horizontal on mobile, vertical on desktop */}
                <div className="flex flex-nowrap justify-center lg:justify-start overflow-x-auto lg:overflow-visible lg:flex-col gap-3 pb-2 lg:pb-0 scrollbar-hide">
                    <FilterDropdown 
                        label="Budget" 
                        value={budgetFilter} 
                        options={budgetOptions} 
                        onChange={setBudgetFilter}
                        icon={<Banknote className="w-4 h-4" />}
                    />
                    <FilterDropdown 
                        label="Verification" 
                        value={verifiedFilter} 
                        options={verificationOptions} 
                        onChange={setVerifiedFilter}
                        icon={<ShieldCheck className="w-4 h-4" />}
                    />
                    <FilterDropdown 
                        label="Location" 
                        value={locationFilter} 
                        options={locationOptions} 
                        onChange={setLocationFilter}
                        icon={<MapPin className="w-4 h-4" />}
                    />
                    <FilterDropdown 
                        label="Rating" 
                        value={reviewsFilter} 
                        options={ratingOptions} 
                        onChange={setReviewsFilter}
                        icon={<Star className="w-4 h-4" />}
                    />
                </div>
              </div>

              {/* Stats Box (Desktop Only) */}
              <div className="hidden lg:block mt-4 bg-teal-600 rounded-3xl p-6 text-white overflow-hidden relative group">
                  <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  <p className="text-teal-100 text-sm font-medium mb-1">Available Vendors</p>
                  <h4 className="text-3xl font-bold">{filteredProfessionals.length}</h4>
                  <p className="text-xs text-teal-100/80 mt-4 leading-relaxed">
                      Pro tip: Use filters to find specialists in your location or budget range.
                  </p>
              </div>
            </aside>

            {/* Professionals Grid Content */}
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                   {skill.name} Experts
                   <span className="text-sm font-normal text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{filteredProfessionals.length} found</span>
                </h2>
              </div>

              {loading && vendors.length === 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm h-full animate-pulse flex flex-col items-center justify-between min-h-[300px]">
                      <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-slate-100 mb-5" />
                      <div className="h-4 bg-slate-100 rounded w-2/3 mb-3" />
                      <div className="h-3 bg-slate-100 rounded w-1/2 mb-4" />
                      <div className="h-10 bg-slate-50 rounded w-full mt-auto" />
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="bg-red-50/50 border border-dashed border-red-200 rounded-[2.5rem] py-20 px-10 text-center">
                  <h3 className="text-xl font-bold text-red-900 mb-2">Failed to load experts</h3>
                  <p className="text-red-700/70 max-w-md mx-auto mb-8">{error}</p>
                  <Button onClick={() => fetchVendors(1, false)} className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2.5 rounded-xl border-none">
                    Try Again
                  </Button>
                </div>
              ) : filteredProfessionals.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                    {filteredProfessionals.map((professional) => (
                      <Link 
                        href={`/vendors/${(professional as any).slug || professional._id}`} 
                        key={professional._id}
                        className="block h-full transition-transform duration-300 hover:-translate-y-1"
                      >
                        <VendorCard
                          vendorId={professional._id}
                          imageAlt={`${professional.name} profile`}
                          imageUrl={professional.profileImage}
                          vendorAvatar={professional.profileImage}
                          vendorName={professional.name}
                          vendorLevel={professional.verified ? "Top Rated" : "Level 2"}
                          title={`${professional.title} - ${professional.bio}`}
                          rating={professional.rating}
                          reviews={professional.reviewCount}
                          startingPrice={professional.priceFrom}
                          currency={professional.priceCurrency}
                        />
                      </Link>
                    ))}
                  </div>

                  {hasMore && (
                    <div className="flex justify-center mt-12">
                      <Button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-8 py-3 rounded-2xl shadow-md transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center gap-2 border-none"
                      >
                        {loadingMore ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Loading more...
                          </>
                        ) : (
                          "See More"
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white border border-dashed border-slate-200 rounded-[2.5rem] py-20 px-10 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No Matching Experts</h3>
                  <p className="text-slate-500 max-w-md mx-auto mb-8">
                    We couldn't find any professionals matching these specific filters. Try expanding your search criteria or resetting the filters.
                  </p>
                  <Button 
                    onClick={() => {
                        setBudgetFilter("all");
                        setVerifiedFilter("all");
                        setLocationFilter("all");
                        setReviewsFilter("all");
                    }}
                    variant="outline"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-8 md:px-10 lg:px-16 text-center">
          <div className="max-w-3xl mx-auto rounded-[3rem] bg-slate-950 p-12 relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,184,166,0.1)_0%,transparent_50%)]" />
             <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 relative z-10">
                Can't find the right expert?
             </h2>
             <p className="text-slate-400 text-lg mb-10 relative z-10">
                Our team can help you find and vet the perfect professional for your specific project requirements.
             </p>
             <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                <Link href="/contact">
                   <Button size="lg" className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-10 rounded-2xl">
                      Contact Support
                   </Button>
                </Link>
                <Link href={`/categories`}>
                   <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-2xl px-10">
                      Browse All Categories
                   </Button>
                </Link>
             </div>
          </div>
        </div>
      </section>

      <FooterLinksSection />

      {/* Mobile Floating Scroll to Filter Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToFilters}
            className="fixed bottom-6 right-6 z-[60] lg:hidden p-4 bg-teal-600 text-white rounded-2xl shadow-2xl hover:bg-teal-500 active:scale-95 transition-all flex items-center justify-center border border-white/20"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
