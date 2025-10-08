/**
 * Secure Cache Service
 * Combines encryption and caching for secure data storage
 * Provides a unified interface for encrypted caching operations
 */

import {
  encryptData,
  decryptData,
  encryptDataOptimized,
  decryptDataOptimized,
  generateHash,
  verifyHash,
} from "./encryption";
import {
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

export interface SecureCacheOptions extends CacheOptions {
  encrypt?: boolean; // Whether to encrypt the data (default: true)
  verifyIntegrity?: boolean; // Whether to verify data integrity (default: true)
  encryptionKey?: string; // Custom encryption key
  optimize?: boolean; // Whether to optimize data before encryption (default: false)
  optimizeType?: "categories" | "user" | "generic"; // Type of optimization to apply
}

export interface SecureCacheItem<T = any> extends CacheItem<T> {
  encrypted: boolean;
  integrityHash?: string;
}

/**
 * Default secure cache configuration
 */
const DEFAULT_SECURE_CACHE_CONFIG: Required<SecureCacheOptions> = {
  ttl: 5 * 60 * 1000, // 5 minutes
  version: "1.0.0",
  storage: "localStorage",
  forceRefresh: false,
  encrypt: true,
  verifyIntegrity: true,
  encryptionKey: "",
  optimize: false,
  optimizeType: "generic",
};

/**
 * Generate a secure cache key with prefix and optional encryption
 */
function generateSecureCacheKey(
  key: string,
  encrypt: boolean = false,
  encryptionKey?: string
): string {
  const prefixedKey = `tasa_${key}`;

  if (encrypt && encryptionKey) {
    // Encrypt the key for additional security
    return encryptData(prefixedKey, encryptionKey);
  }

  return prefixedKey;
}

/**
 * Set data in secure cache with encryption
 */
export function setSecureCacheData<T>(
  key: string,
  data: T,
  options: SecureCacheOptions = {}
): boolean {
  try {
    const config = { ...DEFAULT_SECURE_CACHE_CONFIG, ...options };
    const secureKey = generateSecureCacheKey(
      key,
      config.encrypt,
      config.encryptionKey
    );

    // Prepare data for caching
    let dataToCache = data;
    let integrityHash: string | undefined;

    // Generate integrity hash if verification is enabled
    if (config.verifyIntegrity) {
      const dataString = JSON.stringify(data);
      integrityHash = generateHash(dataString);
    }

    // Encrypt data if encryption is enabled
    if (config.encrypt) {
      if (config.optimize) {
        // Use optimized encryption (reduces data size before encryption)
        const encryptedData = encryptDataOptimized(
          data,
          config.encryptionKey,
          config.optimizeType
        );
        dataToCache = encryptedData as T;
      } else {
        // Use regular encryption
        const dataString = JSON.stringify(data);
        const encryptedData = encryptData(dataString, config.encryptionKey);
        dataToCache = encryptedData as T;
      }
    }

    // Create secure cache item
    const secureCacheItem: SecureCacheItem<T> = {
      data: dataToCache,
      timestamp: Date.now(),
      expiresAt: Date.now() + config.ttl,
      version: config.version,
      encrypted: config.encrypt,
      integrityHash,
    };

    // Store in cache
    const success = setCacheData(secureKey, secureCacheItem, {
      ttl: config.ttl,
      version: config.version,
      storage: config.storage,
    });

    if (success) {
    }

    return success;
  } catch (error) {
    console.error("Error setting secure cache data:", error);
    return false;
  }
}

/**
 * Get data from secure cache with decryption
 */
export function getSecureCacheData<T>(
  key: string,
  options: SecureCacheOptions = {}
): T | null {
  try {
    const config = { ...DEFAULT_SECURE_CACHE_CONFIG, ...options };
    const secureKey = generateSecureCacheKey(
      key,
      config.encrypt,
      config.encryptionKey
    );

    // Get cache item
    const cacheItem = getCacheData<SecureCacheItem<T>>(secureKey, {
      ttl: config.ttl,
      version: config.version,
      storage: config.storage,
    });

    if (!cacheItem) {
      return null;
    }

    let decryptedData = cacheItem.data;

    // Decrypt data if it was encrypted
    if (cacheItem.encrypted && config.encrypt) {
      try {
        if (config.optimize) {
          // Use optimized decryption
          decryptedData = decryptDataOptimized(
            decryptedData as string,
            config.encryptionKey
          );
        } else {
          // Use regular decryption
          const decryptedString = decryptData(
            decryptedData as string,
            config.encryptionKey
          );
          decryptedData = JSON.parse(decryptedString);
        }
      } catch (decryptError) {
        console.error("Error decrypting cache data:", decryptError);
        return null;
      }
    }

    // Verify integrity if enabled
    if (config.verifyIntegrity && cacheItem.integrityHash) {
      const dataString = JSON.stringify(decryptedData);
      if (!verifyHash(dataString, cacheItem.integrityHash)) {
        // Silently remove corrupted cache entry without logging
        removeSecureCacheData(key, config.storage);
        return null;
      }
    }

    return decryptedData;
  } catch (error) {
    console.error("Error getting secure cache data:", error);
    return null;
  }
}

/**
 * Remove data from secure cache
 */
export function removeSecureCacheData(
  key: string,
  storage: "localStorage" | "sessionStorage" = "localStorage",
  options: SecureCacheOptions = {}
): boolean {
  const config = { ...DEFAULT_SECURE_CACHE_CONFIG, ...options };
  const secureKey = generateSecureCacheKey(
    key,
    config.encrypt,
    config.encryptionKey
  );
  return removeCacheData(secureKey, storage);
}

/**
 * Clear all secure cache data
 */
export function clearAllSecureCache(
  storage: "localStorage" | "sessionStorage" = "localStorage"
): boolean {
  return clearAllCache(storage);
}

/**
 * Get secure cache statistics
 */
export function getSecureCacheStats(
  storage: "localStorage" | "sessionStorage" = "localStorage"
): {
  totalKeys: number;
  cacheKeys: number;
  encryptedKeys: number;
  expiredKeys: number;
  totalSize: number;
} {
  try {
    const stats = getCacheStats(storage);
    const storageObj =
      storage === "localStorage" ? localStorage : sessionStorage;

    if (!storageObj) {
      return { ...stats, encryptedKeys: 0 };
    }

    const keys = Object.keys(storageObj);
    const cacheKeys = keys.filter((key) => key.startsWith("tasa_cache_"));
    let encryptedKeys = 0;

    cacheKeys.forEach((key) => {
      try {
        const cachedData = storageObj.getItem(key);
        if (cachedData) {
          const cacheItem: SecureCacheItem = JSON.parse(cachedData);
          if (cacheItem.encrypted) {
            encryptedKeys++;
          }
        }
      } catch (error) {
        console.error(`Error parsing secure cache item ${key}:`, error);
      }
    });

    return {
      ...stats,
      encryptedKeys,
    };
  } catch (error) {
    console.error("Error getting secure cache stats:", error);
    return {
      totalKeys: 0,
      cacheKeys: 0,
      encryptedKeys: 0,
      expiredKeys: 0,
      totalSize: 0,
    };
  }
}

/**
 * Clean up expired secure cache entries
 */
export function cleanupExpiredSecureCache(
  storage: "localStorage" | "sessionStorage" = "localStorage"
): number {
  return cleanupExpiredCache(storage);
}

/**
 * Check if secure cache exists and is valid
 */
export function hasValidSecureCache(
  key: string,
  options: SecureCacheOptions = {}
): boolean {
  const config = { ...DEFAULT_SECURE_CACHE_CONFIG, ...options };
  const secureKey = generateSecureCacheKey(
    key,
    config.encrypt,
    config.encryptionKey
  );

  return hasValidCache(secureKey, {
    ttl: config.ttl,
    version: config.version,
    storage: config.storage,
  });
}

/**
 * Cache with automatic refresh functionality
 * This will check if cache is stale and refresh in background
 */
export async function getSecureCacheDataWithRefresh<T>(
  key: string,
  fetchFunction: () => Promise<T>,
  options: SecureCacheOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_SECURE_CACHE_CONFIG, ...options };

  // Try to get from cache first
  const cachedData = getSecureCacheData<T>(key, config);

  if (cachedData && !config.forceRefresh) {
    // Check if cache is stale (older than 80% of TTL)
    const staleThreshold = config.ttl * 0.8;
    const cacheAge = Date.now() - (Date.now() - staleThreshold);

    if (cacheAge < staleThreshold) {
      // Cache is fresh, return it
      return cachedData;
    } else {
      // Cache is stale, refresh in background
      fetchFunction()
        .then((freshData) => {
          setSecureCacheData(key, freshData, config);
        })
        .catch((error) => {
          console.error(`Background refresh failed for key: ${key}:`, error);
        });

      // Return stale data while refreshing
      return cachedData;
    }
  }

  // No cache or force refresh, fetch fresh data
  const freshData = await fetchFunction();
  setSecureCacheData(key, freshData, config);
  return freshData;
}

/**
 * Batch operations for multiple cache keys
 */
export function setMultipleSecureCacheData<T>(
  items: Array<{ key: string; data: T }>,
  options: SecureCacheOptions = {}
): { success: number; failed: number } {
  let success = 0;
  let failed = 0;

  items.forEach(({ key, data }) => {
    if (setSecureCacheData(key, data, options)) {
      success++;
    } else {
      failed++;
    }
  });

  return { success, failed };
}

export function getMultipleSecureCacheData<T>(
  keys: string[],
  options: SecureCacheOptions = {}
): Record<string, T | null> {
  const results: Record<string, T | null> = {};

  keys.forEach((key) => {
    results[key] = getSecureCacheData<T>(key, options);
  });

  return results;
}

/**
 * Set optimized secure cache data (with data optimization before encryption)
 * This reduces the amount of data that needs to be encrypted and stored
 */
export function setOptimizedSecureCacheData<T>(
  key: string,
  data: T,
  optimizeType: "categories" | "user" | "generic" = "generic",
  options: SecureCacheOptions = {}
): boolean {
  const optimizedOptions: SecureCacheOptions = {
    ...options,
    optimize: true,
    optimizeType,
  };

  return setSecureCacheData(key, data, optimizedOptions);
}

/**
 * Get optimized secure cache data
 */
export function getOptimizedSecureCacheData<T>(
  key: string,
  optimizeType: "categories" | "user" | "generic" = "generic",
  options: SecureCacheOptions = {}
): T | null {
  const optimizedOptions: SecureCacheOptions = {
    ...options,
    optimize: true,
    optimizeType,
  };

  return getSecureCacheData<T>(key, optimizedOptions);
}

/**
 * Clear corrupted cache entries for specific keys
 * Useful when cache integrity checks fail
 */
export function clearCorruptedCache(
  keys: string[],
  storage: "localStorage" | "sessionStorage" = "localStorage"
): void {
  keys.forEach((key) => {
    try {
      removeSecureCacheData(key, storage);
    } catch (error) {
      // Silently ignore errors when clearing corrupted cache
    }
  });
}

/**
 * Cache invalidation by pattern
 */
export function invalidateSecureCacheByPattern(
  pattern: string,
  storage: "localStorage" | "sessionStorage" = "localStorage"
): number {
  try {
    const storageObj =
      storage === "localStorage" ? localStorage : sessionStorage;
    if (!storageObj) {
      return 0;
    }

    const keys = Object.keys(storageObj);
    const cacheKeys = keys.filter(
      (key) => key.startsWith("tasa_cache_") && key.includes(pattern)
    );

    let removedCount = 0;
    cacheKeys.forEach((key) => {
      storageObj.removeItem(key);
      removedCount++;
    });

    return removedCount;
  } catch (error) {
    console.error("Error invalidating cache by pattern:", error);
    return 0;
  }
}
