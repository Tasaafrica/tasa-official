/**
 * Cache utility functions for TASA application
 * Provides convenient methods for common caching operations
 */

import {
  getSecureCacheData,
  setSecureCacheData,
  getOptimizedSecureCacheData,
  setOptimizedSecureCacheData,
  removeSecureCacheData,
  getSecureCacheStats,
  cleanupExpiredSecureCache,
  type SecureCacheOptions,
} from "./secureCache";
import { encryptData } from "./encryption";

/**
 * Cache keys used throughout the application
 */
export const CACHE_KEYS = {
  CATEGORIES_STRUCTURED_ALL: "categories_structured_all",
  USER_PROFILE: "user_profile",
  USER_PREFERENCES: "user_preferences",
  SEARCH_RESULTS: "search_results",
  API_RESPONSES: "api_responses",
} as const;

/**
 * Default cache options for different types of data
 */
export const CACHE_OPTIONS = {
  // Long-term cache for relatively static data (15 minutes)
  STATIC_DATA: {
    ttl: 15 * 60 * 1000,
    version: "1.0.1", // Bumped to clear corrupted cache
    storage: "localStorage" as const,
    encrypt: true, // Encrypt for security
    verifyIntegrity: true,
    encryptionKey: "TASA_STATIC_DATA_ENCRYPTION_KEY_2025",
  },

  // Medium-term cache for user data (30 minutes)
  USER_DATA: {
    ttl: 30 * 60 * 1000,
    version: "1.0.0",
    storage: "sessionStorage" as const,
    encrypt: true,
    verifyIntegrity: true,
    encryptionKey: "TASA_USER_DATA_ENCRYPTION_KEY_2025",
  },

  // Short-term cache for search results (5 minutes)
  SEARCH_DATA: {
    ttl: 5 * 60 * 1000,
    version: "1.0.0",
    storage: "localStorage" as const,
    encrypt: true,
    verifyIntegrity: true,
    encryptionKey: "TASA_SEARCH_DATA_ENCRYPTION_KEY_2025",
  },

  // API responses cache (10 minutes)
  API_DATA: {
    ttl: 10 * 60 * 1000,
    version: "1.0.0",
    storage: "localStorage" as const,
    encrypt: true,
    verifyIntegrity: true,
    encryptionKey: "TASA_API_DATA_ENCRYPTION_KEY_2025",
  },
} as const;

/**
 * Get categories data from cache (optimized)
 * Uses optimized encryption to reduce storage size by ~60%
 */
export function getCachedCategories(): any[] | null {
  return getOptimizedSecureCacheData(
    CACHE_KEYS.CATEGORIES_STRUCTURED_ALL,
    "categories",
    CACHE_OPTIONS.STATIC_DATA
  );
}

/**
 * Set categories data in cache (optimized)
 * Uses optimized encryption to reduce storage size by ~60%
 */
export function setCachedCategories(categories: any[]): boolean {
  return setOptimizedSecureCacheData(
    CACHE_KEYS.CATEGORIES_STRUCTURED_ALL,
    categories,
    "categories",
    CACHE_OPTIONS.STATIC_DATA
  );
}

/**
 * Clear categories cache
 */
export function clearCategoriesCache(): boolean {
  return removeSecureCacheData(
    CACHE_KEYS.CATEGORIES_STRUCTURED_ALL,
    "localStorage",
    CACHE_OPTIONS.STATIC_DATA
  );
}

/**
 * Get cache statistics for debugging
 */
export function getCacheInfo() {
  const stats = getSecureCacheStats("localStorage");
  const sessionStats = getSecureCacheStats("sessionStorage");

  return {
    localStorage: stats,
    sessionStorage: sessionStats,
    total: {
      keys: stats.cacheKeys + sessionStats.cacheKeys,
      size: stats.totalSize + sessionStats.totalSize,
      encrypted: stats.encryptedKeys + sessionStats.encryptedKeys,
    },
  };
}

/**
 * Clean up all expired cache entries
 */
export function cleanupAllCache(): {
  localStorage: number;
  sessionStorage: number;
} {
  return {
    localStorage: cleanupExpiredSecureCache("localStorage"),
    sessionStorage: cleanupExpiredSecureCache("sessionStorage"),
  };
}

/**
 * Clear all application cache
 */
export function clearAllAppCache(): boolean {
  try {
    // Clear localStorage cache
    const localStorageKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("tasa_")
    );
    localStorageKeys.forEach((key) => localStorage.removeItem(key));

    // Clear sessionStorage cache
    const sessionStorageKeys = Object.keys(sessionStorage).filter((key) =>
      key.startsWith("tasa_")
    );
    sessionStorageKeys.forEach((key) => sessionStorage.removeItem(key));

    return true;
  } catch (error) {
    console.error("Error clearing app cache:", error);
    return false;
  }
}

/**
 * Debug function to log cache status
 */
export function logCacheStatus(): void {
  const info = getCacheInfo();
  console.group("🔍 TASA Cache Status");
  console.groupEnd();
}

/**
 * Check if categories are cached
 */
export function hasCachedCategories(): boolean {
  const cached = getCachedCategories();
  return cached !== null && Array.isArray(cached) && cached.length > 0;
}

/**
 * Get cache age for a specific key
 */
export function getCacheAge(
  key: string,
  storage: "localStorage" | "sessionStorage" = "localStorage",
  options: SecureCacheOptions = {}
): number | null {
  try {
    const config = { ...CACHE_OPTIONS.STATIC_DATA, ...options };
    const storageObj =
      storage === "localStorage" ? localStorage : sessionStorage;

    // Generate the same encrypted key that would be used for storage
    const secureKey =
      config.encrypt && config.encryptionKey
        ? encryptData(`tasa_${key}`, config.encryptionKey)
        : `tasa_${key}`;

    const cachedData = storageObj.getItem(secureKey);

    if (!cachedData) return null;

    const cacheItem = JSON.parse(cachedData);
    return Date.now() - cacheItem.timestamp;
  } catch (error) {
    console.error("Error getting cache age:", error);
    return null;
  }
}
