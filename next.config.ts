import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure static generation for all pages
  output: undefined, // Remove any export configuration
  trailingSlash: false,

  // Enable static optimization
  experimental: {
    // Ensure proper static generation
    staticGenerationRetryCount: 3,
  },

  // Image optimization
  images: {
    domains: ["tasa-server.onrender.com"],
    unoptimized: false,
  },
};

export default nextConfig;
