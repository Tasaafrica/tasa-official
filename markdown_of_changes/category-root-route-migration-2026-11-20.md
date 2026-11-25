# Category Root Route Migration (2026-11-20)

## Date
2026-11-20

## Summary
Migrated category / industry routes from `/categories/[categorySlug]` to root-level `/[categorySlug]` (e.g. `/graphics-design`, `/digital-marketing`, `/video-animation`):
1. **Next.js Root Dynamic Route**:
   - Created `src/app/(public)/[categorySlug]/page.tsx` mapping directly to root dynamic slug URLs.
   - Integrated strict category validation: if a requested slug does not match a valid category in the database, it triggers Next.js `notFound()`, cleanly rendering the custom 404 page.
   - Replaced `src/app/(public)/categories/[categorySlug]/page.tsx` with an immediate router-level redirect to `/${categorySlug}`.
2. **Server-Level Permanent Redirects (SEO & Backwards Compatibility)**:
   - Added permanent HTTP 308 redirects in `next.config.ts`:
     - `/categories/:slug` -> `/:slug`
     - `/category/:slug` -> `/:slug`
   - Preserves existing bookmarks, external links, and search engine ranking.
3. **Route Detection in Header**:
   - Enhanced `src/app/component/parts/header.tsx` with `KNOWN_CATEGORY_SLUGS` and root path segment matching, ensuring the Amber Orange attention glow and scoped category search trigger seamlessly when visiting root category URLs.
4. **Platform-Wide Link Updates**:
   - Updated category navigation links across `footerLinksSection.tsx`, `homeHeroSection.tsx`, `industries/page.tsx`, `popularCategory.tsx`, `SearchAutocomplete.tsx`, `creatives/page.tsx`, `NotFoundHero.tsx`, `SkillsPage.tsx`, `SubCategoryPage.tsx`, and `sitemap.ts` to point directly to `/[categorySlug]`.

## Modifications
- `src/app/(public)/[categorySlug]/page.tsx`:
  - **L1-L135**: Created root category dynamic route wrapper with metadata generation, API data fetching, and `notFound()` error guard.
- `src/app/(public)/categories/[categorySlug]/page.tsx`:
  - **L1-L8**: Replaced legacy category route with immediate client/server redirect to `/${categorySlug}`.
- `next.config.ts`:
  - **L21-L35**: Added `redirects()` configuration for permanent 308 redirects from `/categories/:slug` and `/category/:slug` to `/:slug`.
- `src/app/component/parts/header.tsx`:
  - **L120-L135**: Defined `CATEGORY_NAME_MAP` and `KNOWN_CATEGORY_SLUGS`.
  - **L147-L170**: Inferred active category from root pathname segment (`pathSegment`) with fallback to legacy `/categories/`.
- `src/app/component/parts/footerLinksSection.tsx`:
  - **L13-L62**: Updated all 12 category footer links from `/categories/[slug]` to `/[slug]`.
- `src/app/component/parts/homeHeroSection.tsx`:
  - **L314-L322**: Updated hero industry quick links to `/${cat.slug}`.
- `src/app/industries/page.tsx`:
  - **L202-L211**: Updated industry catalog cards to `/${cat.slug}`.
- `src/app/component/parts/popularCategory.tsx`:
  - **L144-L151**: Updated category card link to `/${category.slug}`.
- `src/app/component/parts/SearchAutocomplete.tsx`:
  - **L83-L91**: Updated category search dropdown navigation destination to `/${item.slug || item._id}`.
- `src/app/creatives/page.tsx`:
  - **L463-L472**: Updated creative industry link to `/graphics-design`.
- `src/app/component/parts/NotFoundHero.tsx`:
  - **L331-L340**: Updated 404 recovery industry links to `/${cat.slug}`.
- `src/component-pages/SkillsPage.tsx`:
  - **L364-L371**: Updated breadcrumb link to `/${categorySlug}`.
- `src/component-pages/SubCategoryPage.tsx`:
  - **L315-L330**: Updated breadcrumb category link to `/${subcategory.category.slug}`.
  - **L466-L474**: Updated "Browse Category" button to `/${subcategory.category.slug}`.
- `src/component-pages/CategoriesPages.tsx`:
  - **L115-L119**: Updated breadcrumb root link to `/industries`.
- `src/app/sitemap.ts`:
  - **L99-L110**: Updated XML sitemap URLs for categories to `${baseUrl}/${cat.slug}`.

## Commit Draft - Short
`feat(routes): migrate category pages from /categories/[slug] to root /[slug]`

## Commit Draft - Long
`feat(routes): migrate category pages from /categories/[slug] to root /[slug]

- Moved CategoryPageWrapper to src/app/(public)/[categorySlug]/page.tsx
- Added 404 guard when requested slug is not a valid category in the database
- Configured 308 permanent redirects in next.config.ts for /categories/:slug and /category/:slug
- Updated Header active category detection to resolve root path segments
- Updated all navigation links across footer, home hero, industries catalog, popular categories, autocomplete, and breadcrumbs to root /[slug]
- Verified build and TypeScript types with tsc --noEmit`
