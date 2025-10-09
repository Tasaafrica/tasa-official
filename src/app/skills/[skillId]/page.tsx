import { notFound } from "next/navigation";
import Link from "next/link";

import Header from "@/app/component/parts/header";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import { Button } from "@/app/component/ui/button";
import { ArrowLeft, Briefcase, Users } from "lucide-react";
import PlainHero from "@/app/component/parts/plainHero";
import Separator from "@/app/component/ui/separator";
import UserCard from "@/app/component/parts/userCard";
import { getIcon } from "@/lib/icon";

interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  experience?: string;
  hourlyRate?: string;
  rating?: number;
  skills?: string[];
  businessName?: string;
  businessType?: string;
  availability?: string;
  portfolio?: string;
  profileImage?: string;
}

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

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId?: string;
}

// Generate static params for common skills
export async function generateStaticParams() {
  // Return empty array to allow on-demand generation
  // This ensures the page can be statically generated when accessed
  return [];
}

// Allow both static and dynamic generation
export const dynamicParams = true;

export default async function SkillPage({
  params,
}: {
  params: Promise<{ skillId: string }>;
}) {
  const baseUrl =
    process.env.PRODUCTION_URL || "https://tasa-server.onrender.com";
  const { skillId } = await params;

  // Validate skillId
  if (!skillId || skillId.trim() === "") {
    throw new Error("Invalid skill ID provided");
  }

  try {
    // Test API connectivity first
    try {
      const healthResponse = await fetch(`${baseUrl}/api/health`, {
        next: { revalidate: 3600 },
        method: "GET",
      });
    } catch (healthError) {
      console.warn(
        "API health check failed, but continuing with skill fetch:",
        healthError
      );
    }

    //fetch skill details
    const skillResponse = await fetch(`${baseUrl}/api/skills/${skillId}`, {
      next: { revalidate: 3600 },
    });

    if (!skillResponse.ok) {
      if (skillResponse.status === 404) {
        throw new Error(`Skill with ID '${skillId}' not found`);
      } else if (skillResponse.status >= 500) {
        throw new Error(
          `Server error: ${skillResponse.status} ${skillResponse.statusText}`
        );
      } else {
        throw new Error(
          `Failed to fetch skill: ${skillResponse.status} ${skillResponse.statusText}`
        );
      }
    }

    const skillData = await skillResponse.json();

    const skill: Skill = skillData.data || skillData;

    if (!skill || !skill._id) {
      throw new Error("Invalid skill data received");
    }

    const category = skill.category;
    const subcategory = skill.subcategory;

    // Fetch vendors with this skill
    const vendorsResponse = await fetch(
      `${baseUrl}/api/vendors/skill/id/${skillId}?page=1&limit=20&sortBy=rating&sortOrder=desc`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!vendorsResponse.ok) {
      console.warn(
        `Failed to fetch vendors: ${vendorsResponse.status} ${vendorsResponse.statusText}`
      );
      // Continue without vendors rather than failing completely
    }

    let vendors = [];
    if (vendorsResponse.ok) {
      const vendorsData = await vendorsResponse.json();

      const vendorsWithSkill = vendorsData.data || vendorsData || [];
      vendors = vendorsWithSkill.vendors || [];
    } else {
      console.warn("Vendors fetch failed, continuing without vendors");
    }

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
        <Header variant="white" />
        <PlainHero
          title={skill.name}
          description={`Professional ${skill.name.toLowerCase()} services with ${
            vendors.length
          } qualified providers`}
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
        <Separator />

        {/* Available Providers Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
            <div className="max-w-6xl mx-auto">
              {/* Header with Provider Count */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                    {skill.icon ? (
                      <div className="h-8 w-8 text-white">
                        {(() => {
                          const Icon = getIcon(skill.icon);
                          return <Icon className="h-8 w-8 text-white" />;
                        })()}
                      </div>
                    ) : (
                      <Briefcase className="h-8 w-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {skill.name}
                    </h1>
                    <p className="text-gray-600">
                      {subcategory?.name || "Subcategory"} •{" "}
                      {category?.name || "Category"}
                    </p>
                  </div>
                </div>

                {/* Provider Count Badge */}
                <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-teal-600" />
                    <div className="text-center">
                      <span className="text-3xl font-bold text-teal-700 block">
                        {vendors.length}
                      </span>
                      <p className="text-teal-600 font-medium text-sm">
                        Available Providers
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Available Users Grid */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Available Providers
                </h2>

                {vendors.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Users className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-lg font-medium text-gray-600">
                        No providers found
                      </p>
                      <p className="text-sm text-gray-500">
                        There are currently no providers available for this
                        skill.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vendors.map((vendor: any) => (
                      <UserCard key={vendor._id} user={vendor} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-teal-50 to-white">
          <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with our qualified {skill.name.toLowerCase()}{" "}
              professionals and get your project started today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                Browse Providers
              </Button>
              <Link href={`/subcategories/${subcategorySlug}`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-teal-300 text-teal-600 hover:bg-teal-50"
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
  } catch (error) {
    console.error("Error in SkillPage:", error);

    return (
      <div>
        <Header variant="white" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {error instanceof Error &&
              error.message.includes("Failed to fetch skill")
                ? "API Connection Error"
                : "Skill Not Found"}
            </h1>
            <p className="text-gray-600 mb-6">
              {error instanceof Error &&
              error.message.includes("Failed to fetch skill")
                ? "Unable to connect to the API server. Please check if the backend is running."
                : "The skill you are looking for does not exist."}
            </p>
            {process.env.NODE_ENV === "development" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <p className="text-sm text-red-600 font-mono">
                  Debug Info:{" "}
                  {error instanceof Error ? error.message : String(error)}
                </p>
                <p className="text-xs text-red-500 mt-2">
                  API URL:{" "}
                  {process.env.PRODUCTION_URL ||
                    "https://tasa-server.onrender.com"}
                </p>
                <p className="text-xs text-red-500">Skill ID: {skillId}</p>
              </div>
            )}
            <div className="space-y-4">
              <Link href="/">
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
