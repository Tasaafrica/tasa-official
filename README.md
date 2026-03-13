# TASA – Skills & Services Marketplace

TASA is a Next.js 15 front‑end that lets businesses discover and hire vetted African talent while giving freelancers, vendors, and students a place to showcase services. The UI covers the full funnel—search, browse by category, rich vendor/skill pages, trust signals, and responsive marketing sections tailored to both enterprise buyers and emerging young professionals.

## What’s inside
- Modern app router setup using React 19, Server Components where possible, and Turbopack for fast local builds.
- Authentication with NextAuth (email/password + social providers) backed by MongoDB, including protected routes and session-aware layouts.
- Motion-rich marketing experience: hero search with autocomplete, “Trusted by” carousel, category highlights, Why Choose TASA, African talent spotlight, how‑it‑works journey, and student-specific CTA.
- Reusable UI building blocks (search modal, login modal, professional cards, category grids) ready to wire to the TASA API.
- API contract and auth flow documented in `API_DOCUMENTATION.md` and `AUTHENTICATION_SETUP.md`.

## Tech stack
- Next.js 15 (App Router) + React 19
- Tailwind CSS 4, framer-motion, lucide-react icons
- NextAuth for auth; Axios for API calls
- TypeScript, Biome for lint/format

## Getting started
1) Install dependencies: `npm install`
2) Create `.env.local` with at least:
   - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
   - `MONGODB_URI`
   - `PRODUCTION_URL` (points to your API base)
   - OAuth keys (e.g., `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`; add Apple if used)
3) Run dev server: `npm run dev` (opens on http://localhost:3000)

## Run checks
- Lint: `npm run lint`
- Format: `npm run format`
- Production build: `npm run build` then `npm start`

## Project map
- `src/app/page.tsx` – landing and search entry
- `src/component-pages/` – category, subcategory, skills, and vendors screens
- `src/lib/auth.ts` & `src/hooks/useAuth.ts` – auth wiring
- `API_DOCUMENTATION.md`, `AUTHENTICATION_SETUP.md` – backend contract and setup guidance

## Deployment notes
Deploy to Vercel or any Node environment. Be sure to copy `.env.local` values into your host, enable NextAuth callbacks, and point `PRODUCTION_URL` to the live TASA API before switching traffic to production.
