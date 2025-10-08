interface VerificationStatus {
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
  requiresVerification: boolean;
  lastChecked: number;
}

interface VerificationCache {
  [userId: string]: VerificationStatus;
}

class VerificationStatusCache {
  private cache: VerificationCache = {};
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  set(userId: string, status: Omit<VerificationStatus, "lastChecked">): void {
    this.cache[userId] = {
      ...status,
      lastChecked: Date.now(),
    };
  }

  get(userId: string): VerificationStatus | null {
    const cached = this.cache[userId];

    if (!cached) {
      return null;
    }

    // Check if cache is expired
    const isExpired = Date.now() - cached.lastChecked > this.CACHE_DURATION;

    if (isExpired) {
      delete this.cache[userId];
      return null;
    }

    return cached;
  }

  has(userId: string): boolean {
    const cached = this.cache[userId];
    if (!cached) return false;

    const isExpired = Date.now() - cached.lastChecked > this.CACHE_DURATION;
    if (isExpired) {
      delete this.cache[userId];
      return false;
    }

    return true;
  }

  clear(userId: string): void {
    delete this.cache[userId];
  }

  clearAll(): void {
    this.cache = {};
  }

  // Get cache statistics for debugging
  getStats() {
    const now = Date.now();
    const entries = Object.entries(this.cache);

    return {
      totalEntries: entries.length,
      expiredEntries: entries.filter(
        ([_, status]) => now - status.lastChecked > this.CACHE_DURATION
      ).length,
      validEntries: entries.filter(
        ([_, status]) => now - status.lastChecked <= this.CACHE_DURATION
      ).length,
    };
  }
}

// Create a singleton instance
export const verificationCache = new VerificationStatusCache();

// Helper functions for easier usage
export const getCachedVerificationStatus = (
  userId: string
): VerificationStatus | null => {
  return verificationCache.get(userId);
};

export const setCachedVerificationStatus = (
  userId: string,
  status: Omit<VerificationStatus, "lastChecked">
): void => {
  verificationCache.set(userId, status);
};

export const clearCachedVerificationStatus = (userId: string): void => {
  verificationCache.clear(userId);
};

export const isVerificationStatusCached = (userId: string): boolean => {
  return verificationCache.has(userId);
};
