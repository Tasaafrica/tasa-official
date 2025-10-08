/**
 * Test file to demonstrate encryption functionality
 * This file can be removed after testing
 */

import {
  setSecureCacheData,
  getSecureCacheData,
  logCacheStatus,
  CACHE_KEYS,
  CACHE_OPTIONS,
} from "./index";

/**
 * Test encryption functionality
 */
export function testEncryption() {
  console.group("🔐 Testing Encryption & Caching");

  // Test data
  const testData = {
    categories: [
      { id: 1, name: "Design", slug: "design" },
      { id: 2, name: "Development", slug: "development" },
    ],
    timestamp: Date.now(),
  };

  console.log("📝 Original data:", testData);

  // Test with encryption enabled
  const encrypted = setSecureCacheData("test_encrypted_data", testData, {
    ...CACHE_OPTIONS.STATIC_DATA,
    encrypt: true,
    encryptionKey: "TEST_ENCRYPTION_KEY_2025",
  });

  console.log("✅ Data encrypted and cached:", encrypted);

  // Retrieve encrypted data
  const decrypted = getSecureCacheData("test_encrypted_data", {
    ...CACHE_OPTIONS.STATIC_DATA,
    encrypt: true,
    encryptionKey: "TEST_ENCRYPTION_KEY_2025",
  });

  console.log("🔓 Decrypted data:", decrypted);
  console.log(
    "✅ Data integrity check:",
    JSON.stringify(testData) === JSON.stringify(decrypted)
  );

  // Show cache status
  logCacheStatus();

  console.groupEnd();

  return {
    encrypted,
    decrypted,
    integrity: JSON.stringify(testData) === JSON.stringify(decrypted),
  };
}

/**
 * Test key encryption
 */
export function testKeyEncryption() {
  console.group("🔑 Testing Key Encryption");

  // Test with different encryption keys
  const testKeys = [
    "categories_structured_all",
    "user_profile_data",
    "search_results_123",
  ];

  testKeys.forEach((key) => {
    const encrypted = setSecureCacheData(
      key,
      { test: "data", key },
      {
        ttl: 5 * 60 * 1000,
        encrypt: true,
        encryptionKey: "KEY_ENCRYPTION_TEST_2025",
      }
    );

    const decrypted = getSecureCacheData(key, {
      ttl: 5 * 60 * 1000,
      encrypt: true,
      encryptionKey: "KEY_ENCRYPTION_TEST_2025",
    });

    console.log(`Key: ${key}`);
    console.log(`Encrypted: ${encrypted}`);
    console.log(`Decrypted:`, decrypted);
    console.log("---");
  });

  console.groupEnd();
}

// Auto-run tests if this file is imported
if (typeof window !== "undefined") {
  console.log("🧪 Running encryption tests...");
  testEncryption();
  testKeyEncryption();
}
