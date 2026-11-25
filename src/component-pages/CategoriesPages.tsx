"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import CategoryHero from "@/app/component/parts/categoryHero";
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
  categoryName?: string;
  subcategories: Subcategory[];
}

export default function CategoriesPage({
  categorySlug,
  categoryName: initialCategoryName,
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

  const categoryName = initialCategoryName || categorySlug.replace(/-/g, " ");

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
    <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-primary)]">
      <Header
        variant="white"
        categoryName={categoryName}
        categorySlug={categorySlug}
      />

      <CategoryHero
        title={categoryName}
        categorySlug={categorySlug}
        description={`Discover specialized services and expertise within ${categoryName.toLowerCase()}. Find the perfect vendor for your needs.`}
        breadcrumbs={[
          { label: "Categories", href: "/industries" },
          { label: categoryName },
        ]}
        onSearch={setSearchQuery}
        totalSkills={allSkills.length}
        skills={allSkills}
      />


      <section className="pb-12 sm:pb-16">
        <div className="container-responsive">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:p-6 md:p-8 shadow-xs">
            <div className="mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] text-center sm:text-left">
                More Skills & Services In {categoryName}
              </h3>
            </div>

            {remainingSkills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 justify-items-center sm:justify-items-start">
                {remainingSkills.map((skill) => (
                  <Link
                    key={skill._id}
                    href={`/skills/${skill.slug}`}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] transition-colors py-1 text-center sm:text-left"
                  >
                    {skill.name}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--color-text-secondary)]">
                No additional skills available yet.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[var(--color-bg-subtle)] border-t border-[var(--color-border)]">
        <div className="container-responsive text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-4">
            Need Something Specific?
          </h2>
          <p className="text-base sm:text-lg text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
            Can&apos;t find what you&apos;re looking for? Our professionals are ready to
            help with custom solutions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto bg-[var(--color-brand-primary)] hover:bg-[var(--color-button-secondary-hover)] text-white font-semibold">
                Contact Us
              </Button>
            </Link>
            <Link href="/categories">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-[var(--color-border-strong)] text-[var(--color-text-primary)] hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] bg-white"
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
