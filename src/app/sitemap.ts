import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.tasaafrica.com"
  ).replace(/\/+$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/how-tasa-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/become-a-vendor`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiBaseUrl) {
      const res = await fetch(`${apiBaseUrl}/api/categories`, {
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const categories = await res.json();
        const categoryList = Array.isArray(categories)
          ? categories
          : categories?.data && Array.isArray(categories.data)
            ? categories.data
            : [];

        for (const cat of categoryList) {
          if (cat.slug) {
            dynamicRoutes.push({
              url: `${baseUrl}/categories/${cat.slug}`,
              lastModified: cat.updatedAt
                ? new Date(cat.updatedAt)
                : new Date(),
              changeFrequency: "weekly",
              priority: 0.8,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching dynamic sitemap routes:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
