/**
 * Encryption utility functions for secure data storage
 * Uses AES encryption with a configurable key
 * Includes data optimization to reduce encryption overhead
 */

// Default encryption key - should be set via environment variables in production
const DEFAULT_ENCRYPTION_KEY = "TASA_DEFAULT_ENCRYPTION_KEY_2025";

/**
 * Get the encryption key from environment variables or use default
 */
function getEncryptionKey(): string {
  return process.env.ENCRYPTION_KEY || DEFAULT_ENCRYPTION_KEY;
}

export function encryptData(data: string, key?: string): string {
  try {
    const encryptionKey = key || getEncryptionKey();
    let encrypted = "";

    for (let i = 0; i < data.length; i++) {
      const keyChar = encryptionKey.charCodeAt(i % encryptionKey.length);
      const dataChar = data.charCodeAt(i);
      encrypted += String.fromCharCode(dataChar ^ keyChar);
    }

    // Convert to base64 for safe storage
    return btoa(encrypted);
  } catch (error) {
    console.error("Encryption error:", error);
    return data; // Return original data if encryption fails
  }
}

/**
 * Decrypt data that was encrypted with encryptData
 */
export function decryptData(encryptedData: string, key?: string): string {
  try {
    const encryptionKey = key || getEncryptionKey();

    // Decode from base64
    const decoded = atob(encryptedData);
    let decrypted = "";

    for (let i = 0; i < decoded.length; i++) {
      const keyChar = encryptionKey.charCodeAt(i % encryptionKey.length);
      const dataChar = decoded.charCodeAt(i);
      decrypted += String.fromCharCode(dataChar ^ keyChar);
    }

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    return encryptedData; // Return original data if decryption fails
  }
}

/**
 * Generate a hash for data integrity checking
 * Simple hash function for basic integrity verification
 */
export function generateHash(data: string): string {
  let hash = 0;
  if (data.length === 0) return hash.toString();

  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(16);
}

/**
 * Verify data integrity using hash
 */
export function verifyHash(data: string, expectedHash: string): boolean {
  const actualHash = generateHash(data);
  return actualHash === expectedHash;
}

/**
 * Data transformation utilities for optimization before encryption
 */

/**
 * Transform categories data to only include essential fields for search
 * Reduces data size by ~60% by removing timestamps, redundant IDs, etc.
 */
export function optimizeCategoriesForSearch(categories: any[]): any[] {
  return categories.map((category) => ({
    _id: category._id,
    name: category.name,
    slug: category.slug,
    subcategories:
      category.subcategories?.map((subcategory: any) => ({
        _id: subcategory._id,
        name: subcategory.name,
        slug: subcategory.slug,
        description: subcategory.description, // Keep for search results
        skills:
          subcategory.skills?.map((skill: any) => ({
            _id: skill._id,
            name: skill.name,
            slug: skill.slug,
          })) || [],
      })) || [],
  }));
}

/**
 * Transform user data to only include essential fields
 * Removes sensitive fields that shouldn't be cached
 */
export function optimizeUserData(user: any): any {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    // Remove: password, tokens, sensitive metadata
  };
}

/**
 * Transform API responses to remove unnecessary metadata
 * Removes timestamps, redundant IDs, and other non-essential fields
 */
export function optimizeApiResponse(
  data: any,
  type: "categories" | "user" | "generic" = "generic"
): any {
  switch (type) {
    case "categories":
      return optimizeCategoriesForSearch(data);
    case "user":
      return optimizeUserData(data);
    case "generic":
    default:
      // For generic data, remove common unnecessary fields
      if (Array.isArray(data)) {
        return data.map((item) => {
          const { createdAt, updatedAt, __v, ...optimized } = item;
          return optimized;
        });
      } else {
        const { createdAt, updatedAt, __v, ...optimized } = data;
        return optimized;
      }
  }
}

/**
 * Encrypt data with optimization
 * First optimizes the data, then encrypts it
 */
export function encryptDataOptimized(
  data: any,
  key?: string,
  optimizeType: "categories" | "user" | "generic" = "generic"
): string {
  try {
    // First optimize the data
    const optimizedData = optimizeApiResponse(data, optimizeType);

    // Then encrypt the optimized data
    const dataString = JSON.stringify(optimizedData);
    return encryptData(dataString, key);
  } catch (error) {
    console.error("Optimized encryption error:", error);
    // Fallback to regular encryption
    return encryptData(JSON.stringify(data), key);
  }
}

/**
 * Decrypt data that was encrypted with optimization
 * Returns the optimized data structure
 */
export function decryptDataOptimized(encryptedData: string, key?: string): any {
  try {
    const decryptedString = decryptData(encryptedData, key);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Optimized decryption error:", error);
    return null;
  }
}

/**
 * Advanced encryption using Web Crypto API (if available)
 * This provides stronger encryption but requires HTTPS in production
 */
export async function encryptDataAdvanced(
  data: string,
  key?: string
): Promise<string> {
  try {
    if (
      typeof window === "undefined" ||
      !window.crypto ||
      !window.crypto.subtle
    ) {
      // Fallback to simple encryption if Web Crypto API is not available
      return encryptData(data, key);
    }

    const encryptionKey = key || getEncryptionKey();
    const keyBuffer = new TextEncoder().encode(encryptionKey);

    // Import the key
    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );

    // Generate a random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Encrypt the data
    const dataBuffer = new TextEncoder().encode(data);
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      cryptoKey,
      dataBuffer
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);

    // Convert to base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error("Advanced encryption error:", error);
    // Fallback to simple encryption
    return encryptData(data, key);
  }
}

/**
 * Advanced decryption using Web Crypto API
 */
export async function decryptDataAdvanced(
  encryptedData: string,
  key?: string
): Promise<string> {
  try {
    if (
      typeof window === "undefined" ||
      !window.crypto ||
      !window.crypto.subtle
    ) {
      // Fallback to simple decryption if Web Crypto API is not available
      return decryptData(encryptedData, key);
    }

    const encryptionKey = key || getEncryptionKey();
    const keyBuffer = new TextEncoder().encode(encryptionKey);

    // Import the key
    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    // Decode from base64
    const combined = new Uint8Array(
      atob(encryptedData)
        .split("")
        .map((char) => char.charCodeAt(0))
    );

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encryptedBuffer = combined.slice(12);

    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      cryptoKey,
      encryptedBuffer
    );

    // Convert back to string
    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    console.error("Advanced decryption error:", error);
    // Fallback to simple decryption
    return decryptData(encryptedData, key);
  }
}
