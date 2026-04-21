"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import CategoryHero from "@/app/component/parts/categoryHero";
import SubcategoryGroupCard from "@/app/component/parts/subcategoryGroupCard";
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

  // Capitalize first letter utility
  const capitalizeFirstLetter = (slug: string) => {
    return slug.charAt(0).toUpperCase() + slug.slice(1);
  };

  const categoryName = capitalizeFirstLetter(categorySlug);
  const allSkills = useMemo(
    () => subcategories.flatMap((subcategory) => subcategory.skills || []),
    [subcategories],
  );
  const featuredSkills = useMemo(() => allSkills.slice(0, 12), [allSkills]);

  const vendorShowcase = [
    {
      id: "v1",
      name: "Amina Creative Studio",
      specialty: "Branding and Visual Identity",
      rating: 4.9,
      jobs: "120+ completed projects",
    },
    {
      id: "v2",
      name: "CodeCraft Labs",
      specialty: "Web and Mobile Development",
      rating: 4.8,
      jobs: "95+ completed projects",
    },
    {
      id: "v3",
      name: "MarketPulse Agency",
      specialty: "Growth Marketing and Ads",
      rating: 4.9,
      jobs: "150+ completed projects",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

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

      <section className="py-10">
        <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 md:px-8 md:py-6 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Skill Groups
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {subcategories.length}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Skills
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {allSkills.length}
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
        <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
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

      <section className="py-12 bg-white border-y border-slate-200">
        <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Search className="h-5 w-5 text-teal-600" />
              Browse Skill Groups
            </h2>
            <p className="mt-2 text-slate-600">
              {searchQuery.trim()
                ? `Found ${filteredSubcategories.length} skill group${
                    filteredSubcategories.length !== 1 ? "s" : ""
                  } matching "${searchQuery}".`
                : `Explore curated ${categoryName.toLowerCase()} skill groups and open each to view available skills.`}
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
                  ? "No skill groups match your search"
                  : "No Skills Yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery.trim()
                  ? "Try a different search term."
                  : "This category doesn't have any skills yet. Check back later for new services."}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-600" />
              Top Vendors In This Category
            </h2>
            <p className="mt-2 text-slate-600">
              A preview of high-performing vendors. This section is ready for
              your upcoming dedicated vendor card component.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vendorShowcase.map((vendor) => (
              <div
                key={vendor.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">
                    {vendor.name}
                  </h3>
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                    {vendor.rating} ★
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{vendor.specialty}</p>
                <p className="mt-2 text-xs font-medium text-slate-500">
                  {vendor.jobs}
                </p>
                <Button
                  variant="outline"
                  className="mt-5 w-full border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  View Profile
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-100">
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
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-200"
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
