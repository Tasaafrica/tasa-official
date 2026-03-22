"use client";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/app/component/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
  getOptimizedSecureCacheData,
  setOptimizedSecureCacheData,
} from "@/lib/secureCache";

// Define the data structure based on the actual API response from /api/categories/structured/all
interface Skill {
  _id: string;
  name: string;
  slug: string;
}

interface SubCategory {
  _id: string;
  name: string;
  skills: Skill[];
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  subcategories: SubCategory[];
}

interface ExploreDropdownProps {
  className?: string;
}

// Shared in-memory cache to avoid duplicate network calls across mounts/strict mode
let categoriesCache: Category[] | null = null;
let categoriesCachePromise: Promise<Category[]> | null = null;

export default function ExploreDropdown({ className }: ExploreDropdownProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Timed call to structured/all removed as requested
    setLoading(false);
    setCategories([]);
  }, []);

  // Helper function to create slug from name (fallback)
  const createSlug = (name: string): string => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className={`${className || ""} flex items-center gap-1 font-medium`}
      >
        Explore Services <ChevronDown className="w-4 h-4 mt-0.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-[220px] bg-white rounded-xl shadow-lg p-0 overflow-hidden"
      >
        {loading ? (
          <div key="loading" className="p-4 text-center text-gray-500">
            Loading categories...
          </div>
        ) : error ? (
          <div key="error" className="p-4 text-center text-red-500">
            {error}
          </div>
        ) : categories.length === 0 ? (
          <div key="empty" className="p-4 text-center text-gray-500">
            No categories available
          </div>
        ) : (
          <>
            {categories.map((category, categoryIndex) => {
              const categorySubcategories = category.subcategories || [];

              return (
                <DropdownMenuSub
                  key={`category-${category._id || `idx-${categoryIndex}`}`}
                >
                  <DropdownMenuSubTrigger className="flex items-center justify-between w-full px-5 py-3 text-base text-gray-800 transition font-normal cursor-pointer hover:!bg-gray-100 hover:text-gray-800 focus:!bg-gray-100 focus:text-gray-800 data-[state=open]:!bg-white data-[state=open]:text-gray-800 [&[data-highlighted]]:!bg-gray-100 [&[data-highlighted]]:text-gray-800">
                    <span>{category.name}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal
                    key={`portal-${category._id || `idx-${categoryIndex}`}`}
                  >
                    <DropdownMenuSubContent className="bg-white rounded-xl shadow-lg p-0 overflow-hidden">
                      <div className="flex flex-row flex-wrap gap-1 w-full max-w-[600px] mx-auto">
                        {categorySubcategories.map(
                          (subCategory, subCategoryIndex) => {
                            const subcategorySkills = subCategory.skills || [];
                            // Create slug from name since subcategories don't have slug in the API response
                            const subcategorySlug = createSlug(
                              subCategory.name
                            );

                            return (
                              <div
                                key={`subcategory-${
                                  subCategory._id ||
                                  `${categoryIndex}-${subCategoryIndex}`
                                }`}
                                className="border-b border-gray-100 last:border-b-0"
                              >
                                <div className="px-4 py-2">
                                  <a
                                    href={`/subcategories/${subcategorySlug}`}
                                    className="font-semibold text-sm text-gray-900 hover:text-teal-600"
                                  >
                                    {subCategory.name}
                                  </a>
                                </div>
                                <div className="px-4 py-2">
                                  {subcategorySkills.length > 0 ? (
                                    <div className="space-y-1">
                                      {subcategorySkills
                                        .slice(0, 5)
                                        .map((skill, skillIndex) => (
                                          <a
                                            key={`skill-${
                                              skill._id ||
                                              `${categoryIndex}-${subCategoryIndex}-${skillIndex}`
                                            }`}
                                            href={`/skills/${skill.slug}`}
                                            className="block text-sm text-gray-600 hover:text-teal-500 hover:bg-gray-50 px-2 py-1 rounded"
                                          >
                                            {skill.name}
                                          </a>
                                        ))}
                                      {subcategorySkills.length > 5 && (
                                        <a
                                          key={`more-skills-${
                                            subCategory._id ||
                                            `${categoryIndex}-${subCategoryIndex}`
                                          }`}
                                          href={`/subcategories/${subcategorySlug}`}
                                          className="block text-xs text-teal-600 hover:text-teal-700 px-2 py-1"
                                        >
                                          +{subcategorySkills.length - 5} more
                                          skills
                                        </a>
                                      )}
                                    </div>
                                  ) : (
                                    <p
                                      key={`no-skills-${
                                        subCategory._id ||
                                        `${categoryIndex}-${subCategoryIndex}`
                                      }`}
                                      className="text-xs text-gray-400 px-2"
                                    >
                                      No skills available
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              );
            })}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
