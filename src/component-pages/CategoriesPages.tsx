"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import CategoryHero from "@/app/component/parts/categoryHero";
import SubcategoryGroupCard from "@/app/component/parts/subcategoryGroupCard";
import VendorCard from "@/app/component/parts/vendorCard";
import { Button } from "@/app/component/ui/button";
import { ArrowRight, Briefcase, Search, Sparkles, Users } from "lucide-react";
import Header from "@/app/component/parts/header";

interface Skill {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId?: string;
  skills?: Skill[];
  icon?: string;
}

interface CategoriesPageProps {
  categorySlug: string;
  subcategories: Subcategory[];
}

export default function CategoriesPage({
  categorySlug,
  subcategories,
}: CategoriesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter groups based on search query
  const filteredSubcategories = useMemo(() => {
    if (!searchQuery.trim()) return subcategories;

    const query = searchQuery.toLowerCase();
    return subcategories.filter(
      (subcategory) =>
        subcategory.name.toLowerCase().includes(query) ||
        subcategory.description?.toLowerCase().includes(query),
    );
  }, [subcategories, searchQuery]);

  const formatCategoryName = (slug: string) => {
    const decodedSlug = decodeURIComponent(slug);
    const normalized = decodedSlug
      .replace(/[-_]+/g, " ")
      .replace(/\band\b/gi, "&")
      .replace(/\s*&\s*/g, " & ")
      .replace(/\s+/g, " ")
      .trim();

    return normalized
      .split(" ")
      .map((word) =>
        word === "&" ? word : word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join(" ");
  };

  const categoryName = formatCategoryName(categorySlug);
  const allSkills = useMemo(
    () => subcategories.flatMap((subcategory) => subcategory.skills || []),
    [subcategories],
  );
  const featuredSkills = useMemo(() => allSkills.slice(0, 12), [allSkills]);
  const remainingSkills = useMemo(() => allSkills.slice(12), [allSkills]);

  const vendorShowcase = [
    {
      id: "v1",
      imageAlt: "Branding consultant workspace",
      imageUrl: "/images/featured-service-1.webp",
      vendorAvatar: "/images/azeez-avatar.png",
      vendorName: "Amina Creative Studio",
      vendorLevel: "Top Rated",
      title: "Complete branding and visual identity package for modern businesses",
      rating: 4.9,
      reviews: 248,
      startingPrice: 120,
    },
    {
      id: "v2",
      imageAlt: "Developer building a mobile app",
      imageUrl: "/images/featured-service-2.webp",
      vendorAvatar: "/images/female-digital-marketing.png",
      vendorName: "CodeCraft Labs",
      vendorLevel: "Level 2",
      title: "Custom web and mobile application development with clean architecture",
      rating: 4.8,
      reviews: 186,
      startingPrice: 200,
    },
    {
      id: "v3",
      imageAlt: "Marketing strategist preparing campaign plan",
      imageUrl: "/images/featured-service-3.webp",
      vendorAvatar: "/images/male-ui-ux.png",
      vendorName: "MarketPulse Agency",
      vendorLevel: "Top Rated",
      title: "Performance marketing and paid ads strategy to accelerate growth",
      rating: 4.9,
      reviews: 312,
      startingPrice: 150,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <CategoryHero
        title={categoryName}
        categorySlug={categorySlug}
        description={`Discover specialized services and expertise within ${categoryName.toLowerCase()}. Find the perfect vendor for your needs.`}
        breadcrumbs={[
          { label: "Categories", href: "/categories" },
          { label: categoryName },
        ]}
        onSearch={setSearchQuery}
      />

      <section className="py-8 sm:py-10">
        <div className="container mx-auto px-4 sm:px-8 md:px-10 lg:px-16">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-5 sm:px-6 md:px-8 md:py-6 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Skills
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {allSkills.length}+
                </p>
              </div>
              <div className="rounded-xl bg-teal-50 p-4 border border-teal-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                  Discover Faster
                </p>
                <p className="mt-2 text-sm text-teal-900">
                  Use search to quickly find relevant skills and top vendors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="container mx-auto px-4 sm:px-8 md:px-10 lg:px-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-teal-600" />
              Featured Skills
            </h2>
          </div>

          {featuredSkills.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredSkills.map((skill) => (
                <Link
                  key={skill._id}
                  href={`/skills/${skill.slug}`}
                  className="group rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-200 hover:shadow-md transition-all"
                >
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {skill.name}
                  </p>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                    {skill.description ||
                      `Explore expert ${skill.name.toLowerCase()} services and qualified vendors.`}
                  </p>
                  <span className="mt-4 inline-flex items-center text-xs font-semibold text-teal-700">
                    View Skill <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-600">No featured skills available yet.</p>
            </div>
          )}
        </div>
      </section>

      

      <section className="py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-8 md:px-10 lg:px-16">
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-600" />
              Top Vendors In {categoryName}
            </h2>
            <p className="mt-2 text-slate-600">
             Pro tip: View more specialised vendors by clicking a skill.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendorShowcase.map((vendor) => (
              <VendorCard
                key={vendor.id}
                imageAlt={vendor.imageAlt}
                imageUrl={vendor.imageUrl}
                vendorAvatar={vendor.vendorAvatar}
                vendorName={vendor.vendorName}
                vendorLevel={vendor.vendorLevel}
                title={vendor.title}
                rating={vendor.rating}
                reviews={vendor.reviews}
                startingPrice={vendor.startingPrice}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-8 md:px-10 lg:px-16">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 md:p-8">
            <div className="mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 text-center sm:text-left">
                More Skills In {categoryName}
              </h3>
            </div>

            {remainingSkills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 justify-items-center sm:justify-items-start">
                {remainingSkills.map((skill) => (
                  <Link
                    key={skill._id}
                    href={`/skills/${skill.slug}`}
                    className="text-sm text-slate-700 hover:text-teal-700 transition-colors py-1 text-center sm:text-left"
                  >
                    {skill.name}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No additional skills available yet.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-slate-100">
        <div className="container mx-auto px-4 sm:px-8 md:px-10 lg:px-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Need Something Specific?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our professionals are ready to
            help with custom solutions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700">
                Contact Us
              </Button>
            </Link>
            <Link href="/categories">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-200"
              >
                Explore All Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <FooterLinksSection />
    </div>
  );
}
