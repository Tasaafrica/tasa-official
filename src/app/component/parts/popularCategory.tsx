"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getIcon } from "@/lib/icon";
import {
  getOptimizedSecureCacheData,
  setOptimizedSecureCacheData,
} from "@/lib/secureCache";

interface PopularCategoryProps {
  layout?: "horizontal" | "vertical";
}

interface Skill {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  providers?: number;
  averageRating?: number;
  totalReviews?: number;
  tags?: string[];
  popular?: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  skillsCount?: number;
  topSkills?: Skill[];
  stats?: {
    totalProviders?: number;
    averageRating?: number;
    totalReviews?: number;
  };
  displayOrder?: number;
  icon?: string;
}

interface FeaturedCategoriesApiResponse {
  success: boolean;
  data: Category[];
  message?: string;
}

export default function PopularCategory({
  layout = "horizontal",
}: PopularCategoryProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchPopularCategories = async () => {
      try {
        // Check cache first for optimized data
        const cacheKey = "featured_categories";
        const cacheOptions = {
          ttl: 20 * 60 * 1000, // 20 minutes cache
          version: "1.0.1",
          storage: "localStorage" as const,
          encrypt: true,
          verifyIntegrity: true,
          encryptionKey: "TASA_FEATURED_CATEGORIES_ENCRYPTION_KEY_2025",
        };

        const cachedData = getOptimizedSecureCacheData(
          cacheKey,
          "generic",
          cacheOptions
        );

        if (cachedData && Array.isArray(cachedData)) {
          setCategories(cachedData);
          return;
        }

        // Fetch fresh data from API if not in cache
        const baseUrl = process.env.PRODUCTION_URL || "http://localhost:5000";
        const response = await fetch(`${baseUrl}/api/featured-categories`, {
          cache: "no-store",
        });
        const result: FeaturedCategoriesApiResponse = await response.json();

        if (result.success && result.data) {
          setCategories(result.data);

          // Cache the optimized data for future use
          setOptimizedSecureCacheData(
            cacheKey,
            result.data,
            "generic",
            cacheOptions
          );
        }
      } catch (err) {
        console.error("Error fetching popular categories:", err);
      }
    };

    fetchPopularCategories();
  }, []);

  const isVertical = layout === "vertical";

  // Choose items to render: popular categories
  const items = categories.slice(0, isVertical ? 10 : 9);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-6 bg-transparent">
      <div className="mx-auto px-2 lg:px-8">
        <div
          className={
            isVertical
              ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
              : "flex flex-row flex-nowrap overflow-x-auto gap-3 md:overflow-hidden"
          }
        >
          {items.map((category) => {
            const Icon = getIcon(category.icon || "HelpCircle");

            return (
              <Link
                key={category._id}
                href={`/categories/${category.slug}`}
                className={`
                  flex flex-col items-center justify-center 
                  ${
                    isVertical
                      ? "w-full bg-white rounded-lg shadow-sm border border-slate-100 px-2 py-3"
                      : "min-w-[100px] md:w-full bg-white rounded-lg shadow-sm border border-slate-100 px-2 py-3"
                  }
                  cursor-pointer transform ease-in-out hover:scale-95 transition-all duration-200
                `}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full mb-3 mx-auto">
                  <Icon className="h-6 w-6 text-black" />
                </div>
                <span className="text-xs font-medium text-slate-700 text-center whitespace-pre-line">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
