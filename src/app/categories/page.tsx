import Link from "next/link";
import Header from "@/app/component/parts/header";

// Force dynamic rendering to avoid build-time API calls
export const dynamic = "force-dynamic";

interface Skill {
  _id: string;
  name: string;
  slug: string;
}

interface Subcategory {
  _id: string;
  name: string;
  skills: Skill[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  subcategories: Subcategory[];
}

async function getCategories(): Promise<Category[]> {
  try {
    const baseUrl =
      process.env.PRODUCTION_URL || "https://tasa-server.onrender.com";
    const response = await fetch(`${baseUrl}/api/categories/structured/all`, {
      cache: "no-store", // Force dynamic rendering
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const result = await response.json();

    // The API returns the categories array directly, not wrapped in success/data
    if (Array.isArray(result)) {
      return result;
    }

    // Fallback: check if it's wrapped in a success/data structure
    if (result.success && result.data) {
      return result.data;
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-white">
      <Header variant="transparent" invert={true} />
      <div className="pt-25 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Explore All Skills & Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover talented professionals across various categories. Find
              the perfect match for your project needs.
            </p>
          </div>

          {/* Hierarchical Skills Display - Multi-column layout like the image */}
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No categories available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {categories.map((category) => (
                <div key={category._id} className="space-y-3">
                  {/* Category Header */}
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {category.name}
                    </h2>
                  </div>

                  {/* Skills List - Hierarchical structure like the image */}
                  <div className="space-y-3">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory._id} className="space-y-1">
                        {/* Subcategory Name - Top level (like "Logo Design", "Voice Over", etc.) */}
                        <div>
                          <Link
                            href={`/subcategories/${
                              (subcategory as any).slug ||
                              subcategory.name
                                .toLowerCase()
                                .replace(/\s+/g, "-")
                            }`}
                            className="text-gray-900 hover:text-teal-600 transition-colors font-medium text-sm block"
                          >
                            {subcategory.name}
                          </Link>
                        </div>

                        {/* Skills List - Indented (like "Character Design", "Props & Objects", etc.) */}
                        {subcategory.skills.length > 0 && (
                          <ul className="ml-4 space-y-1">
                            {subcategory.skills.map((skill) => (
                              <li key={skill._id} className="relative">
                                <Link
                                  href={`/skills/${skill._id}`}
                                  className="text-gray-600 hover:text-teal-600 transition-colors text-sm block py-0.5"
                                >
                                  {skill.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Section */}
          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-teal-600 mb-2">
                  {categories.length}
                </div>
                <div className="text-gray-600">Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal-600 mb-2">
                  {categories.reduce(
                    (acc, cat) => acc + cat.subcategories.length,
                    0
                  )}
                </div>
                <div className="text-gray-600">Subcategories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal-600 mb-2">
                  {categories.reduce(
                    (acc, cat) =>
                      acc +
                      cat.subcategories.reduce(
                        (subAcc, sub) => subAcc + sub.skills.length,
                        0
                      ),
                    0
                  )}
                </div>
                <div className="text-gray-600">Skills & Services</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-teal-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Find Your Perfect Match?
              </h2>
              <p className="text-gray-600 mb-6">
                Browse our talented professionals and start your next project
                today.
              </p>
              <Link
                href="/vendor"
                className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Browse All Vendors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
