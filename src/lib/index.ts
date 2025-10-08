/**
 * Library exports for encryption and caching services
 */

// Encryption utilities
export {
  encryptData,
  decryptData,
  generateHash,
  verifyHash,
  encryptDataAdvanced,
  decryptDataAdvanced,
} from "./encryption";

// Basic cache utilities
export {
  setCacheData,
  getCacheData,
  removeCacheData,
  clearAllCache,
  getCacheStats,
  cleanupExpiredCache,
  hasValidCache,
  type CacheOptions,
  type CacheItem,
} from "./cache";

// Secure cache service (combines encryption + caching)
export {
  setSecureCacheData,
  getSecureCacheData,
  removeSecureCacheData,
  clearAllSecureCache,
  getSecureCacheStats,
  cleanupExpiredSecureCache,
  hasValidSecureCache,
  getSecureCacheDataWithRefresh,
  setMultipleSecureCacheData,
  getMultipleSecureCacheData,
  invalidateSecureCacheByPattern,
  type SecureCacheOptions,
  type SecureCacheItem,
} from "./secureCache";

// Cache utilities for TASA application
export {
  CACHE_KEYS,
  CACHE_OPTIONS,
  getCachedCategories,
  setCachedCategories,
  clearCategoriesCache,
  getCacheInfo,
  cleanupAllCache,
  clearAllAppCache,
  logCacheStatus,
  hasCachedCategories,
  getCacheAge,
} from "./cacheUtils";
