"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import CategoryHero from "@/app/component/parts/categoryHero";
import SubcategoryGroupCard from "@/app/component/parts/subcategoryGroupCard";
import { Button } from "@/app/component/ui/button";
import { Briefcase } from "lucide-react";
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

  // Filter subcategories based on search query
  const filteredSubcategories = useMemo(() => {
    if (!searchQuery.trim()) return subcategories;

    const query = searchQuery.toLowerCase();
    return subcategories.filter(
      (subcategory) =>
        subcategory.name.toLowerCase().includes(query) ||
        subcategory.description?.toLowerCase().includes(query),
    );
  }, [subcategories, searchQuery]);

  // Capitalize first letter utility
  const capitalizeFirstLetter = (slug: string) => {
    return slug.charAt(0).toUpperCase() + slug.slice(1);
  };

  const categoryName = capitalizeFirstLetter(categorySlug);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <CategoryHero
        title={categoryName}
        categorySlug={categorySlug}
        description={`Discover specialized services and expertise within ${categoryName.toLowerCase()}. Find the perfect professional for your needs.`}
        breadcrumbs={[
          { label: "Categories", href: "/categories" },
          { label: categoryName },
        ]}
        onSearch={setSearchQuery}
      />

      {/* Subcategories Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse All Subcategories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {searchQuery.trim()
                ? `Found ${filteredSubcategories.length} subcategorie${
                    filteredSubcategories.length !== 1 ? "s" : ""
                  }`
                : `Choose a subcategory to explore available ${categoryName.toLowerCase()} services`}
            </p>
          </div>

          {filteredSubcategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSubcategories.map((subcategory, index) => (
                <SubcategoryGroupCard
                  key={subcategory._id}
                  subcategory={subcategory}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery.trim()
                  ? "No subcategories match your search"
                  : "No Subcategories Yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery.trim()
                  ? "Try a different search term."
                  : "This category doesn't have any subcategories yet. Check back later for new services."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Need Something Specific?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our professionals are ready to
            help with custom solutions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                Contact Us
              </Button>
            </Link>
            <Link href="/categories">
              <Button size="lg" variant="outline" className="bg-[var(--indigo)] hover:bg-[var(--indigo)]/70">
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
