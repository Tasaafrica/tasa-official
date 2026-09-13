import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.tasaafrica.com"
  ).replace(/\/+$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/c/",
        "/v/",
        "/client/",
        "/profile/",
        "/role/",
        "/component/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
