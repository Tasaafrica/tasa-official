"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import Header from "@/app/component/parts/header";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import { Button } from "@/app/component/ui/button";
import {Users, X } from "lucide-react";
import PlainHero from "@/app/component/parts/plainHero";
import {Separator} from "@/app/component/ui/separator";
import ProfessionalCard from "@/app/component/parts/professionalCard";

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

const dummyProfessionals: Professional[] = [
  {
    _id: "prof1",
    name: "Kwame Osei",
    title: "Senior Expert",
    bio: "Highly experienced professional with 8+ years of expertise in this field.",
    location: "Accra, Ghana",
    rating: 4.9,
    reviewCount: 52,
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    skills: ["Advanced", "Certified", "Fast Delivery"],
    priceFrom: 15000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof2",
    name: "Amara Okafor",
    title: "Lead Professional",
    bio: "Expert in delivering high-quality results with attention to detail.",
    location: "Abuja, Nigeria",
    rating: 4.8,
    reviewCount: 38,
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    skills: ["Premium", "Verified", "Responsive"],
    priceFrom: 12000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof3",
    name: "Zuri Mutua",
    title: "Specialist",
    bio: "Specialized in delivering custom solutions tailored to your needs.",
    location: "Nairobi, Kenya",
    rating: 4.7,
    reviewCount: 31,
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    skills: ["Custom", "Professional", "Dedicated"],
    priceFrom: 13000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof4",
    name: "Thabo Mkhize",
    title: "Expert Developer",
    bio: "Specializing in cutting-edge solutions and best practices.",
    location: "Johannesburg, South Africa",
    rating: 4.6,
    reviewCount: 28,
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    skills: ["Modern Tech", "Scalable", "Reliable"],
    priceFrom: 16000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof5",
    name: "Ama Benneh",
    title: "Professional",
    bio: "Dedicated to providing excellent customer service and quality work.",
    location: "Lagos, Nigeria",
    rating: 4.8,
    reviewCount: 42,
    profileImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop",
    skills: ["Quality", "On-time", "Professional"],
    priceFrom: 10000,
    priceCurrency: "₦",
    verified: false,
  },
  {
    _id: "prof6",
    name: "Kofi Asante",
    title: "Senior Expert",
    bio: "Years of experience delivering exceptional results to clients.",
    location: "Dar es Salaam, Tanzania",
    rating: 4.9,
    reviewCount: 45,
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    skills: ["Mastery", "Excellence", "Trusted"],
    priceFrom: 18000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof7",
    name: "Naledi Khumalo",
    title: "Specialist",
    bio: "Focused on delivering innovative and creative solutions.",
    location: "Cape Town, South Africa",
    rating: 4.7,
    reviewCount: 35,
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    skills: ["Creative", "Innovative", "Fast"],
    priceFrom: 8000,
    priceCurrency: "₦",
    verified: false,
  },
  {
    _id: "prof8",
    name: "Juma Karanja",
    title: "Lead Developer",
    bio: "Expert in building scalable and robust solutions.",
    location: "Kampala, Uganda",
    rating: 4.6,
    reviewCount: 29,
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    skills: ["Scalable", "Robust", "Efficient"],
    priceFrom: 14000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof9",
    name: "Fatima Hassan",
    title: "Full Stack Expert",
    bio: "Comprehensive expertise across all aspects of the field.",
    location: "Dakar, Senegal",
    rating: 4.8,
    reviewCount: 39,
    profileImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop",
    skills: ["Full Stack", "Comprehensive", "Expert"],
    priceFrom: 11000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof10",
    name: "Sipho Ndlela",
    title: "Professional",
    bio: "Reliable and professional service delivery guaranteed.",
    location: "Gaborone, Botswana",
    rating: 4.5,
    reviewCount: 24,
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    skills: ["Reliable", "Professional", "Consistent"],
    priceFrom: 9000,
    priceCurrency: "₦",
    verified: false,
  },
  {
    _id: "prof11",
    name: "Abeba Tewolde",
    title: "Expert",
    bio: "Deep expertise combining theoretical and practical experience.",
    location: "Addis Ababa, Ethiopia",
    rating: 4.7,
    reviewCount: 32,
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    skills: ["Expert", "Experienced", "Knowledge"],
    priceFrom: 5000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof12",
    name: "Obi Nwosu",
    title: "Senior Professional",
    bio: "Senior level expertise with proven track record.",
    location: "Port Harcourt, Nigeria",
    rating: 4.6,
    reviewCount: 27,
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    skills: ["Senior", "Proven", "Trusted"],
    priceFrom: 13000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof13",
    name: "Hadiya Kimani",
    title: "Creative Expert",
    bio: "Creative problem solver with innovative approach.",
    location: "Kigali, Rwanda",
    rating: 4.8,
    reviewCount: 40,
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    skills: ["Creative", "Innovative", "Problem Solver"],
    priceFrom: 7000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof14",
    name: "Idriss Diallo",
    title: "Master Expert",
    bio: "Mastery level expertise with exceptional results.",
    location: "Kinshasa, DRC",
    rating: 4.9,
    reviewCount: 48,
    profileImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop",
    skills: ["Master", "Exceptional", "Excellence"],
    priceFrom: 20000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof15",
    name: "Zainab Traore",
    title: "Professional",
    bio: "Professional service with attention to quality and detail.",
    location: "Bamako, Mali",
    rating: 4.7,
    reviewCount: 33,
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    skills: ["Quality", "Detail", "Professional"],
    priceFrom: 6000,
    priceCurrency: "₦",
    verified: false,
  },
  {
    _id: "prof16",
    name: "Emeka Okonkwo",
    title: "Lead Expert",
    bio: "Leading the way in quality and innovation.",
    location: "Lagos, Nigeria",
    rating: 4.8,
    reviewCount: 41,
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    skills: ["Leadership", "Innovation", "Quality"],
    priceFrom: 17000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof17",
    name: "Grace Mensah",
    title: "Specialist",
    bio: "Specialized expertise in delivering specific solutions.",
    location: "Accra, Ghana",
    rating: 4.6,
    reviewCount: 26,
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    skills: ["Specialized", "Focused", "Expert"],
    priceFrom: 11000,
    priceCurrency: "₦",
    verified: false,
  },
  {
    _id: "prof18",
    name: "Hassan Ahmed",
    title: "Professional",
    bio: "Professional excellence in service delivery.",
    location: "Cairo, Egypt",
    rating: 4.7,
    reviewCount: 34,
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    skills: ["Professional", "Excellent", "Reliable"],
    priceFrom: 9500,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof19",
    name: "Chioma Nwankwo",
    title: "Expert Developer",
    bio: "Expert development with cutting-edge techniques.",
    location: "Lagos, Nigeria",
    rating: 4.8,
    reviewCount: 43,
    profileImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop",
    skills: ["Development", "Modern", "Efficient"],
    priceFrom: 14500,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof20",
    name: "Mohamed Ibrahim",
    title: "Senior Expert",
    bio: "Senior level expertise with comprehensive knowledge.",
    location: "Nairobi, Kenya",
    rating: 4.9,
    reviewCount: 50,
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    skills: ["Senior", "Knowledge", "Experience"],
    priceFrom: 19000,
    priceCurrency: "₦",
    verified: true,
  },
];

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

  // Filter states
  const [budgetFilter, setBudgetFilter] = useState<string>("all");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [reviewsFilter, setReviewsFilter] = useState<string>("all");

  // Get unique locations
  const uniqueLocations = Array.from(
    new Set(dummyProfessionals.map((p) => p.location)),
  ).sort();

  // Filter professionals based on selected filters
  const filteredProfessionals = useMemo(() => {
    return dummyProfessionals.filter((professional) => {
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
  }, [budgetFilter, verifiedFilter, locationFilter, reviewsFilter]);

  // Get category and subcategory slugs for breadcrumbs
  const categorySlug =
    category?.slug ||
    category?.name?.toLowerCase().replace(/\s+/g, "-") ||
    "category";
  const subcategorySlug =
    subcategory?.slug ||
    subcategory?.name?.toLowerCase().replace(/\s+/g, "-") ||
    subcategory?.name?.toLowerCase().replace(/\s+/g, "-") ||
    "subcategory";

  return (
    <div>
      <Header variant="transparent" invert={true} />
      <PlainHero
        title={skill.name}
        description={`Professional ${skill.name.toLowerCase()} services`}
        breadcrumbs={[
          {
            label: category?.name || "Category",
            href: `/categories/${categorySlug}`,
          },
          {
            label: subcategory?.name || "Subcategory",
            href: `/subcategories/${subcategorySlug}`,
          },
          { label: skill.name },
        ]}
      />
      <div className="w-full">
        <Separator />
      </div>

      {/* Professionals Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Available Professionals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with top professionals specializing in {skill.name}
            </p>
          </div>

          {/* Filter Section */}
          <div className="max-w-7xl mx-auto mb-8 bg-gray-50 p-6 rounded-lg">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                {(budgetFilter !== "all" ||
                  verifiedFilter !== "all" ||
                  locationFilter !== "all" ||
                  reviewsFilter !== "all") && (
                  <button
                    onClick={() => {
                      setBudgetFilter("all");
                      setVerifiedFilter("all");
                      setLocationFilter("all");
                      setReviewsFilter("all");
                    }}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
                  >
                    <X className="w-4 h-4" /> Clear Filters
                  </button>
                )}
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Budget Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget
                  </label>
                  <select
                    value={budgetFilter}
                    onChange={(e) => setBudgetFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">All Budgets</option>
                    <option value="budget-low">₦5k - ₦10k</option>
                    <option value="budget-medium">₦10k - ₦15k</option>
                    <option value="budget-high">₦15k+</option>
                  </select>
                </div>

                {/* Verified Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification
                  </label>
                  <select
                    value={verifiedFilter}
                    onChange={(e) => setVerifiedFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">All Professionals</option>
                    <option value="verified">Verified Only</option>
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">All Locations</option>
                    {uniqueLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reviews Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <select
                    value={reviewsFilter}
                    onChange={(e) => setReviewsFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">All Ratings</option>
                    <option value="reviews-high">4.8 - 5.0 ⭐</option>
                    <option value="reviews-medium">4.5 - 4.7 ⭐</option>
                    <option value="reviews-low">4.0 - 4.4 ⭐</option>
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <div className="text-sm text-gray-600 mt-2">
                Showing{" "}
                <span className="font-semibold">
                  {filteredProfessionals.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold">
                  {dummyProfessionals.length}
                </span>{" "}
                professionals
              </div>
            </div>
          </div>

          {/* Professionals Grid */}
          {filteredProfessionals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {filteredProfessionals.map((professional) => (
                <ProfessionalCard
                  key={professional._id}
                  professional={professional}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 max-w-7xl mx-auto">
              <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Professionals Found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters to find professionals matching your
                criteria.
              </p>
              <button
                onClick={() => {
                  setBudgetFilter("all");
                  setVerifiedFilter("all");
                  setLocationFilter("all");
                  setReviewsFilter("all");
                }}
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-teal-50 to-white">
        <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with our qualified {skill.name.toLowerCase()} professionals
            and get your project started today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href={`/subcategories/${subcategorySlug}`}>
              <Button
                size="lg"
                variant="outline"
                className="bg-teal-600 hover:bg-teal-700"
              >
                View All Skills
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <FooterLinksSection />
    </div>
  );
}
