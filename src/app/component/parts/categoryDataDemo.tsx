import React from "react";
import { useCategoryData } from "@/app/component/parts/categoryDataProvider";

export default function CategoryDataDemo() {
  const {
    categories,
    subcategories,
    loading,
    error,
    getCategoryBySlug,
    getSubcategoryBySlug,
  } = useCategoryData();

  if (loading) {
    return (
      <div className="p-6 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">
          Loading Category Data...
        </h3>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-blue-200 rounded w-3/4"></div>
          <div className="h-4 bg-blue-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Error Loading Data
        </h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-green-50 rounded-lg">
      <h3 className="text-lg font-semibold text-green-800 mb-4">
        Category Data Loaded Successfully! 🎉
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories Section */}
        <div>
          <h4 className="font-medium text-green-700 mb-3">
            Categories ({categories.length})
          </h4>
          <div className="space-y-2">
            {categories.slice(0, 5).map((category) => (
              <div key={category.id} className="bg-white p-3 rounded border">
                <div className="font-medium text-gray-900">{category.name}</div>
                <div className="text-sm text-gray-600">
                  {category.description}
                </div>
                <div className="text-xs text-gray-500">
                  Slug: {category.slug}
                </div>
              </div>
            ))}
            {categories.length > 5 && (
              <div className="text-sm text-gray-500 text-center">
                +{categories.length - 5} more categories
              </div>
            )}
          </div>
        </div>

        {/* Subcategories Section */}
        <div>
          <h4 className="font-medium text-green-700 mb-3">
            Subcategories ({subcategories.length})
          </h4>
          <div className="space-y-2">
            {subcategories.slice(0, 5).map((subcategory) => (
              <div key={subcategory.id} className="bg-white p-3 rounded border">
                <div className="font-medium text-gray-900">
                  {subcategory.name}
                </div>
                <div className="text-sm text-gray-600">
                  {subcategory.description}
                </div>
                <div className="text-xs text-gray-500">
                  Category ID: {subcategory.categoryId} | Slug:{" "}
                  {subcategory.slug}
                </div>
              </div>
            ))}
            {subcategories.length > 5 && (
              <div className="text-sm text-gray-500 text-center">
                +{subcategories.length - 5} more subcategories
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Utility Functions Demo */}
      <div className="mt-6 p-4 bg-white rounded border">
        <h4 className="font-medium text-gray-900 mb-3">
          Utility Functions Demo
        </h4>
        <div className="space-y-2 text-sm">
          <div>
            <strong>getCategoryBySlug('tech'):</strong>{" "}
            {getCategoryBySlug("tech")?.name || "Not found"}
          </div>
          <div>
            <strong>getSubcategoryBySlug('programming-development'):</strong>{" "}
            {getSubcategoryBySlug("programming-development")?.name ||
              "Not found"}
          </div>
        </div>
      </div>
    </div>
  );
}
