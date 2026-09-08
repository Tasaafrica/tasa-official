**Date:** 2026-09-08

**Summary:** Replaced all legacy domain references (`tasa.com.ng` and `dash.tasa.com.ng`) with `tasaafrica.com` across auth options, cookies, middleware, contact views, and image assets. Converted external dashboard redirects to internal user dashboard routes (`/v/dashboard` for vendors, `/c/dashboard` for clients).

**Modifications:**
- `src/middleware.ts`: Line 6 (Updated production cookie domain to `.tasaafrica.com`)
- `src/lib/auth.ts`: Line 102 (Updated `cookieDomain` to `.tasaafrica.com`)
- `src/app/api/auth/login/route.ts`: Lines 46-48 (Updated production token cookie domain to `.tasaafrica.com`)
- `src/app/api/auth/token-cookie/route.ts`: Lines 17, 34 (Updated `authToken` cookie domain to `.tasaafrica.com`)
- `src/components/auth/TokenSync.tsx`: Line 14 (Updated domain comments for `tasaafrica.com`)
- `src/components/auth/UserProfile.tsx`: Line 59 (Replaced external `dash.tasa.com.ng` link with internal `/v/dashboard` and `/c/dashboard` routing)
- `src/app/profile/route.ts`: Lines 9-13 (Replaced external redirect with role-based internal routing to `/v/dashboard` or `/c/dashboard`)
- `src/app/become-a-vendor/page.tsx`: Line 630 (Updated registration success redirect to internal `/v/dashboard`)
- `src/app/contact/ContactClient.tsx`: Line 44 (Updated `supportEmail` to `support@tasaafrica.com`)
- `src/app/api/og/route.tsx`: Line 144 (Updated logo image domain to `www.tasaafrica.com`)

**Commit Draft - Short:** feat: migrate auth cookies & dashboard redirects from legacy domain to tasaafrica.com

**Commit Draft - Long:** 
Updated authentication configuration, middleware cookie scoping, and route redirects across the project to transition from `tasa.com.ng` / `dash.tasa.com.ng` to `tasaafrica.com`. All production authentication cookies (`next-tasa.auth-token`, `_secure_tasaxx`, `authToken`, `token`) now target `.tasaafrica.com`. External dashboard redirects have been eliminated in favor of direct internal routing to `/v/dashboard` (vendors) and `/c/dashboard` (clients).
