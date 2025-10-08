# Encryption and Caching Services

This library provides secure data caching with encryption capabilities for the TASA application.

## Features

- **Encryption**: Simple XOR encryption and advanced Web Crypto API encryption
- **Caching**: localStorage and sessionStorage with TTL and versioning
- **Integrity**: Data integrity verification with hash checking
- **Security**: Encrypted cache storage with configurable keys
- **Performance**: Background refresh and batch operations

## Services

### 1. Encryption Service (`encryption.ts`)

Basic encryption utilities for secure data storage.

```typescript
import {
  encryptData,
  decryptData,
  generateHash,
  verifyHash,
} from "@/lib/encryption";

// Simple encryption
const encrypted = encryptData("sensitive data");
const decrypted = decryptData(encrypted);

// Hash verification
const hash = generateHash("data to verify");
const isValid = verifyHash("data to verify", hash);
```

### 2. Cache Service (`cache.ts`)

Basic caching utilities with TTL and versioning.

```typescript
import { setCacheData, getCacheData, removeCacheData } from "@/lib/cache";

// Set cache with 5 minute TTL
setCacheData("user_data", userData, { ttl: 5 * 60 * 1000 });

// Get cached data
const cachedData = getCacheData("user_data");

// Remove cache
removeCacheData("user_data");
```

### 3. Secure Cache Service (`secureCache.ts`)

Combines encryption and caching for secure data storage.

```typescript
import {
  setSecureCacheData,
  getSecureCacheData,
  getSecureCacheDataWithRefresh,
} from "@/lib/secureCache";

// Set encrypted cache
setSecureCacheData("sensitive_data", data, {
  ttl: 10 * 60 * 1000, // 10 minutes
  encrypt: true,
  verifyIntegrity: true,
  storage: "localStorage",
});

// Get encrypted cache
const data = getSecureCacheData("sensitive_data");

// Cache with automatic refresh
const data = await getSecureCacheDataWithRefresh(
  "api_data",
  () => fetchFromAPI(),
  { ttl: 5 * 60 * 1000 }
);
```

## Configuration

### Environment Variables

```env
# Optional: Custom encryption key
ENCRYPTION_KEY=your_custom_encryption_key_here
```

### Default Settings

- **TTL**: 5 minutes
- **Version**: '1.0.0'
- **Storage**: localStorage
- **Encryption**: Enabled
- **Integrity**: Enabled

## Usage Examples

### API Response Caching

```typescript
import { getSecureCacheDataWithRefresh } from "@/lib/secureCache";

async function fetchCategories() {
  return getSecureCacheDataWithRefresh(
    "categories_data",
    async () => {
      const response = await fetch("/api/categories");
      return response.json();
    },
    {
      ttl: 15 * 60 * 1000, // 15 minutes
      version: "1.0.0",
    }
  );
}
```

### User Data Caching

```typescript
import { setSecureCacheData, getSecureCacheData } from "@/lib/secureCache";

// Store user profile
setSecureCacheData("user_profile", userProfile, {
  ttl: 30 * 60 * 1000, // 30 minutes
  storage: "sessionStorage", // Session-only storage
});

// Retrieve user profile
const profile = getSecureCacheData("user_profile");
```

### Batch Operations

```typescript
import {
  setMultipleSecureCacheData,
  getMultipleSecureCacheData,
} from "@/lib/secureCache";

// Set multiple cache entries
setMultipleSecureCacheData(
  [
    { key: "categories", data: categories },
    { key: "skills", data: skills },
    { key: "users", data: users },
  ],
  { ttl: 10 * 60 * 1000 }
);

// Get multiple cache entries
const { categories, skills, users } = getMultipleSecureCacheData([
  "categories",
  "skills",
  "users",
]);
```

### Cache Management

```typescript
import {
  getSecureCacheStats,
  cleanupExpiredSecureCache,
  invalidateSecureCacheByPattern,
} from "@/lib/secureCache";

// Get cache statistics
const stats = getSecureCacheStats();
console.log(`Cache size: ${stats.totalSize} bytes`);

// Clean up expired entries
const cleaned = cleanupExpiredSecureCache();

// Invalidate cache by pattern
const invalidated = invalidateSecureCacheByPattern("api_");
```

## Security Considerations

1. **Encryption Key**: Use environment variables for production encryption keys
2. **TTL**: Set appropriate TTL values based on data sensitivity
3. **Storage**: Use sessionStorage for sensitive data that should not persist
4. **Integrity**: Enable integrity verification for critical data
5. **Cleanup**: Regularly clean up expired cache entries

## Performance Tips

1. **Background Refresh**: Use `getSecureCacheDataWithRefresh` for automatic stale data refresh
2. **Batch Operations**: Use batch functions for multiple cache operations
3. **Pattern Invalidation**: Use pattern-based invalidation for related data
4. **Storage Selection**: Choose appropriate storage type (localStorage vs sessionStorage)

## Error Handling

All functions include comprehensive error handling and will:

- Log errors to console
- Return fallback values on failure
- Clean up corrupted cache entries
- Provide meaningful error messages

## Browser Compatibility

- **Encryption**: Works in all modern browsers
- **Web Crypto API**: Available in HTTPS contexts
- **Storage**: localStorage and sessionStorage support
- **Fallbacks**: Graceful degradation for unsupported features
