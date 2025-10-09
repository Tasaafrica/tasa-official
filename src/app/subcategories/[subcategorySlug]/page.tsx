import { notFound } from "next/navigation";
import Link from "next/link";
import { getIcon } from "@/lib/icon";

import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import { Button } from "@/app/component/ui/button";
import { ArrowLeft, Briefcase, ArrowRight } from "lucide-react";
import PopularSkillsScroll from "./PopularSkillsScroll";
import Header from "@/app/component/parts/header";
import PlainHero from "@/app/component/parts/plainHero";

interface Skill {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  providers?: number;
  popular?: boolean;
  rating?: number;
  reviewCount?: number;
  category?: string;
  icon?: string;
}

interface SkillCollections {
  popular: Skill[]; // Skills marked with popular: true (max 10)
  topRated: Skill[]; // Highest rated skills with reviews (max 10)
  mostPopular: Skill[]; // Skills with most providers (max 10)
  all: Skill[]; // All skills
}

interface SkillStatistics {
  total: number;
  popular: number;
  topRated: number;
  mostPopular: number;
}

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId?: string;
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ subcategorySlug: string }>;
}) {
  const baseUrl =
    process.env.PRODUCTION_URL || "https://tasa-server.onrender.com";
  const { subcategorySlug } = await params;

  // Fetch subcategory details
  const apiResponse = await fetch(
    `${baseUrl}/api/subcategories/slug/${subcategorySlug}`,
    {
      cache: "no-store",
    }
  );
  //if (!apiResponse.ok) return notFound();
  const subcategory = await apiResponse.json();

  // Fetch skills for this subcategory
  const skillsRes = await fetch(
    `${baseUrl}/api/subcategories/${subcategorySlug}/skills`,
    {
      cache: "no-store",
    }
  );
  if (!skillsRes.ok) return notFound();
  const skillsJson = await skillsRes.json();
  const skills = skillsJson.data || [];

  return (
    <div>
      {/* Header */}
      <Header variant="transparent" invert={true} />

      {/* Hero Section */}
      <PlainHero
        title={subcategory.name}
        description={
          subcategory.description ||
          `Explore ${subcategory.name} skills and find the perfect professional for your needs.`
        }
        breadcrumbs={[
          { label: "Categories", href: "/categories" },
          {
            label: subcategory.category?.name || "Category",
            href: subcategory.category
              ? `/categories/${subcategory.category.slug}`
              : "/categories",
          },
          { label: subcategory.name },
        ]}
      />

      {/* Popular Skills Section */}
      {skills.popularSkills.length > 0 && (
        <PopularSkillsScroll
          skills={skills.popularSkills}
          subcategoryName={subcategory.name}
        />
      )}

      {/* All Skills Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore All Skills
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover all available skills in {subcategory.name.toLowerCase()}.
              Find the perfect professional for your needs.
            </p>
          </div>

          {skills.allSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skills.allSkills.map((skill: Skill) => {
                const Icon = getIcon(skill.icon || "HelpCircle");
                return (
                  <Link
                    key={skill._id}
                    href={`/skills/${skill._id}`}
                    className="group"
                  >
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg hover:border-teal-300 transition-all duration-200 group-hover:-translate-y-1">
                      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mb-4 mx-auto">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center group-hover:text-teal-600 transition-colors">
                        {skill.name}
                      </h3>

                      <div className="mt-4 text-center">
                        <span className="inline-flex items-center text-teal-600 font-medium text-sm group-hover:text-teal-700">
                          Explore Skill
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
                No Skills Available Yet
              </h3>
              <p className="text-gray-600 mb-6">
                This subcategory doesn't have any skills yet. Check back later
                for new services.
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
            {subcategory.category && (
              <Link href={`/categories/${subcategory.category.slug}`}>
                <Button size="lg" variant="outline">
                  Browse Category
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <FooterLinksSection />
    </div>
  );
}
