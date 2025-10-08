import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { categoryApi, subcategoryApi } from "@/lib/api";
import type { Category, Subcategory } from "@/lib/types";

interface CategoryDataContextType {
  categories: Category[];
  subcategories: Subcategory[];
  loading: boolean;
  error: string | null;
  getCategoryBySlug: (slug: string) => Category | undefined;
  getSubcategoryBySlug: (slug: string) => Subcategory | undefined;
  getSubcategoriesByCategory: (categoryId: string) => Subcategory[];
  refreshData: () => Promise<void>;
  clearCache: () => void;
  cacheStatus: {
    isFromCache: boolean;
    lastUpdated: Date | null;
    nextRefresh: Date | null;
  };
}

const CategoryDataContext = createContext<CategoryDataContextType | undefined>(
  undefined
);

export const useCategoryData = () => {
  const context = useContext(CategoryDataContext);
  if (!context) {
    throw new Error(
      "useCategoryData must be used within a CategoryDataProvider"
    );
  }
  return context;
};

interface CategoryDataProviderProps {
  children: React.ReactNode;
  cacheDuration?: number; // Cache duration in milliseconds (default: 1 hour)
  enableBackgroundRefresh?: boolean; // Enable background refresh (default: true)
}

// Cache keys for localStorage
const CACHE_KEYS = {
  CATEGORIES: "tasa_categories",
  SUBCATEGORIES: "tasa_subcategories",
  LAST_FETCH: "tasa_last_fetch",
  CACHE_VERSION: "tasa_cache_version",
};

const CACHE_VERSION = "1.0.0"; // Increment when data structure changes

export default function CategoryDataProvider({
  children,
  cacheDuration = 60 * 60 * 1000, // Default: 1 hour
  enableBackgroundRefresh = true,
}: CategoryDataProviderProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheStatus, setCacheStatus] = useState({
    isFromCache: false,
    lastUpdated: null as Date | null,
    nextRefresh: null as Date | null,
  });

  // Check if cached data is still valid
  const isCacheValid = useCallback((): boolean => {
    try {
      const lastFetch = localStorage.getItem(CACHE_KEYS.LAST_FETCH);
      const cacheVersion = localStorage.getItem(CACHE_KEYS.CACHE_VERSION);

      if (!lastFetch || cacheVersion !== CACHE_VERSION) return false;

      const lastFetchTime = parseInt(lastFetch);
      const now = Date.now();

      return now - lastFetchTime < cacheDuration;
    } catch {
      return false;
    }
  }, [cacheDuration]);

  // Load data from cache
  const loadFromCache = useCallback((): boolean => {
    try {
      const cachedCategories = localStorage.getItem(CACHE_KEYS.CATEGORIES);
      const cachedSubcategories = localStorage.getItem(
        CACHE_KEYS.SUBCATEGORIES
      );
      const lastFetch = localStorage.getItem(CACHE_KEYS.LAST_FETCH);

      if (cachedCategories && cachedSubcategories && lastFetch) {
        const parsedCategories = JSON.parse(cachedCategories);
        const parsedSubcategories = JSON.parse(cachedSubcategories);
        const lastFetchTime = parseInt(lastFetch);

        setCategories(parsedCategories);
        setSubcategories(parsedSubcategories);

        const lastUpdated = new Date(lastFetchTime);
        const nextRefresh = new Date(lastFetchTime + cacheDuration);

        setCacheStatus({
          isFromCache: true,
          lastUpdated,
          nextRefresh,
        });

        return true;
      }
    } catch (err) {
      console.warn("Failed to load from cache:", err);
    }
    return false;
  }, [cacheDuration]);

  // Save data to cache
  const saveToCache = useCallback(
    (categoriesData: Category[], subcategoriesData: Subcategory[]) => {
      try {
        localStorage.setItem(
          CACHE_KEYS.CATEGORIES,
          JSON.stringify(categoriesData)
        );
        localStorage.setItem(
          CACHE_KEYS.SUBCATEGORIES,
          JSON.stringify(subcategoriesData)
        );
        localStorage.setItem(CACHE_KEYS.LAST_FETCH, Date.now().toString());
        localStorage.setItem(CACHE_KEYS.CACHE_VERSION, CACHE_VERSION);
      } catch (err) {
        console.warn("Failed to save to cache:", err);
      }
    },
    []
  );

  // Clear cache
  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_KEYS.CATEGORIES);
      localStorage.removeItem(CACHE_KEYS.SUBCATEGORIES);
      localStorage.removeItem(CACHE_KEYS.LAST_FETCH);
      localStorage.removeItem(CACHE_KEYS.CACHE_VERSION);

      setCacheStatus({
        isFromCache: false,
        lastUpdated: null,
        nextRefresh: null,
      });
    } catch (err) {
      console.warn("Failed to clear cache:", err);
    }
  }, []);

  // Fetch fresh data from API
  const fetchFreshData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories and subcategories in parallel
      const [categoriesResponse, subcategoriesResponse] = await Promise.all([
        categoryApi.getAll(),
        subcategoryApi.getAll(),
      ]);

      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      } else {
        throw new Error("Failed to fetch categories");
      }

      if (subcategoriesResponse.success && subcategoriesResponse.data) {
        setSubcategories(subcategoriesResponse.data);
      } else {
        throw new Error("Failed to fetch subcategories");
      }

      // Save to cache
      saveToCache(categoriesResponse.data, subcategoriesResponse.data);

      // Update cache status
      const now = new Date();
      const nextRefresh = new Date(now.getTime() + cacheDuration);

      setCacheStatus({
        isFromCache: false,
        lastUpdated: now,
        nextRefresh,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      console.error("Error fetching category data:", err);
    } finally {
      setLoading(false);
    }
  }, [saveToCache, cacheDuration]);

  // Manual refresh function
  const refreshData = useCallback(async (): Promise<void> => {
    await fetchFreshData();
  }, [fetchFreshData]);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      // First, try to load from cache if it's valid
      if (isCacheValid() && loadFromCache()) {
        setLoading(false);

        // If background refresh is enabled, fetch fresh data in background
        if (enableBackgroundRefresh) {
          // Small delay to ensure UI is rendered first
          setTimeout(() => {
            fetchFreshData().catch(console.error);
          }, 1000);
        }
      } else {
        // Cache is invalid or doesn't exist, fetch fresh data
        await fetchFreshData();
      }
    };

    initializeData();
  }, [isCacheValid, loadFromCache, fetchFreshData, enableBackgroundRefresh]);

  // Set up periodic refresh
  useEffect(() => {
    if (!enableBackgroundRefresh) return;

    const interval = setInterval(() => {
      // Only refresh if user is active and cache is stale
      if (!document.hidden && !isCacheValid()) {
        fetchFreshData().catch(console.error);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [enableBackgroundRefresh, isCacheValid, fetchFreshData]);

  // Listen for visibility changes (when user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && enableBackgroundRefresh && !isCacheValid()) {
        // User returned to tab and cache is stale, refresh data
        fetchFreshData().catch(console.error);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [enableBackgroundRefresh, isCacheValid, fetchFreshData]);

  // Utility functions
  const getCategoryBySlug = useCallback(
    (slug: string): Category | undefined => {
      return categories.find((cat) => cat.slug === slug);
    },
    [categories]
  );

  const getSubcategoryBySlug = useCallback(
    (slug: string): Subcategory | undefined => {
      return subcategories.find((sub) => sub.slug === slug);
    },
    [subcategories]
  );

  const getSubcategoriesByCategory = useCallback(
    (categoryId: string): Subcategory[] => {
      return subcategories.filter((sub) => sub.categoryId === categoryId);
    },
    [subcategories]
  );

  const value: CategoryDataContextType = {
    categories,
    subcategories,
    loading,
    error,
    getCategoryBySlug,
    getSubcategoryBySlug,
    getSubcategoriesByCategory,
    refreshData,
    clearCache,
    cacheStatus,
  };

  return (
    <CategoryDataContext.Provider value={value}>
      {children}
    </CategoryDataContext.Provider>
  );
}
