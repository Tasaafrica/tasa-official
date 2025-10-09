import { notFound } from "next/navigation";
import Link from "next/link";
import { getIcon } from "@/lib/icon";

import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import Hero from "@/app/component/parts/hero";
import { Button } from "@/app/component/ui/button";
import { ArrowLeft, Briefcase } from "lucide-react";
import Header from "@/app/component/parts/header";
//import ErrorBoundary from "@/app/component/parts/ErrorBoundary";

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

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

// Generate static params for common categories
export async function generateStaticParams() {
  // Fetch actual categories to pre-generate common pages
  try {
    const baseUrl =
      process.env.PRODUCTION_URL || "https://tasa-server.onrender.com";
    const response = await fetch(`${baseUrl}/api/categories/structured/all`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.warn("Failed to fetch categories for static generation");
      return [];
    }

    const categories = await response.json();
    const categoryList = Array.isArray(categories)
      ? categories
      : categories.data || [];

    // Return first 10 categories for static generation
    return categoryList.slice(0, 10).map((category: any) => ({
      categorySlug:
        category.slug || category.name?.toLowerCase().replace(/\s+/g, "-"),
    }));
  } catch (error) {
    console.warn("Error fetching categories for static generation:", error);
    return [];
  }
}

// Allow both static and dynamic generation
export const dynamicParams = true;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const baseUrl =
    process.env.PRODUCTION_URL || "https://tasa-server.onrender.com";
  const { categorySlug } = await params;

  //method
  const apiResponse = await fetch(
    `${baseUrl}/api/categories/${categorySlug}/subcategories`,
    {
      next: { revalidate: 3600 }, // Revalidate every hour
    }
  );
  if (!apiResponse.ok) return notFound();
  const responseJson = await apiResponse.json();
  const subcategories: Subcategory[] = responseJson.data || [];

  //function to capitalize the first letter of the category slug
  const capitalizeFirstLetter = (slug: string) => {
    return slug.charAt(0).toUpperCase() + slug.slice(1);
  };

  return (
    <div>
      <Header />
      {/* Hero Section */}
      <Hero
        title={capitalizeFirstLetter(categorySlug)}
        description={`Explore ${capitalizeFirstLetter(
          categorySlug
        )} services and find the perfect professional for your needs.`}
        breadcrumbs={[
          { label: "Categories", href: "/categories" },
          { label: capitalizeFirstLetter(categorySlug) },
        ]}
        variant="teal"
        showStats={true}
      />

      {/* Subcategories Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore {capitalizeFirstLetter(categorySlug)} Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover specialized services and expertise within{" "}
              {capitalizeFirstLetter(categorySlug).toLowerCase()}. Find the
              perfect professional for your needs.
            </p>
          </div>

          {subcategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {subcategories.map((subcategory) => {
                const Icon = getIcon(subcategory.icon || "HelpCircle");
                return (
                  <Link
                    key={subcategory._id}
                    href={`/subcategories/${encodeURIComponent(
                      subcategory.slug ||
                        subcategory.name.toLowerCase().replace(/\s+/g, "-")
                    )}`}
                    className="group"
                  >
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg hover:border-teal-300 transition-all duration-200 group-hover:-translate-y-1">
                      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mb-4 mx-auto">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center group-hover:text-teal-600 transition-colors">
                        {subcategory.name}
                      </h3>
                      <p className="text-gray-600 text-center text-sm leading-relaxed">
                        {subcategory.description || "No description available."}
                      </p>
                      <div className="mt-4 text-center">
                        <span className="inline-flex items-center text-teal-600 font-medium text-sm group-hover:text-teal-700">
                          Explore Services
                          <ArrowLeft className="ml-1 h-4 w-4 rotate-180" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Subcategories Yet
              </h3>
              <p className="text-gray-600 mb-6">
                This category doesn't have any subcategories yet. Check back
                later for new services.
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
              <Button size="lg" variant="outline">
                Browse All Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <FooterLinksSection />
    </div>
  );
}
