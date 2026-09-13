**Date:** 2026-09-13

**Summary:** Added dynamic sitemap (`/sitemap.xml`) and robots policy (`/robots.txt`) for SEO optimization in Next.js 15 App Router using standard metadata routes.

**Modifications:**
- `src/app/sitemap.ts`: Lines 1-95 (Created dynamic sitemap generator targeting `https://www.tasaafrica.com` base URL and fetching public categories dynamically with static route fallbacks)
- `src/app/robots.ts`: Lines 1-25 (Created dynamic robots.txt policy allowing public indexing while disallowing private/dashboard/auth routes)

**Commit Draft - Short:** feat: add dynamic sitemap.xml and robots.txt metadata routes

**Commit Draft - Long:** 
Configured standard Next.js 15 MetadataRoute implementations for `sitemap.xml` and `robots.txt`. The sitemap indexes core public routes (`/`, `/about`, `/contact`, `/faq`, `/how-tasa-works`, `/become-a-vendor`, `/privacy-policy`, `/terms-of-service`) and dynamically includes category routes fetched from backend endpoints when available. The `robots.txt` configuration instructs search crawlers to index public pages while disallowing sensitive internal endpoints (`/api/`, `/c/`, `/v/`, `/client/`, `/profile/`, `/role/`, `/component/`) and linking directly to `https://www.tasaafrica.com/sitemap.xml`.
