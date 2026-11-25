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
    domains: ["tasa-server.onrender.com", "lh3.googleusercontent.com", "images.unsplash.com"],
    unoptimized: false,
  },

  // Permanent redirects for category routes
  async redirects() {
    return [
      {
        source: "/categories/:slug",
        destination: "/:slug",
        permanent: true,
      },
      {
        source: "/category/:slug",
        destination: "/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
