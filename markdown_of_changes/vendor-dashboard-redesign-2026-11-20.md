# Vendor Dashboard Redesign (2026-11-20)

## Date
2026-11-20

## Summary
Redesigned the Vendor Dashboard (`/v/dashboard`) to provide a world-class, professional command center for African creative professionals and vendors on TASA:
1. **Hero Welcome & Identity Card**:
   - Modern curved card with dark slate base (`#243042` to `#1e293b`), soft brand lighting (`var(--color-brand-primary)` and `var(--color-brand-secondary)`), and clean borders.
   - Dynamic time-of-day greeting ("Good morning / afternoon / evening, {Name}!").
   - Profile avatar with active status ring and verification badge.
   - Live availability badge ("Available for Projects") with glowing status indicator.
   - Category / industry tag and location indicator (`{city}, {country}`).
   - Quick action pill buttons: "View Public Profile" (direct link to `/vendors/{slug}`) and "Share Profile" with instant one-click clipboard copy and toast notification.
2. **Parallel Real-Time Data Fetching**:
   - Upgraded data fetching to fetch vendor profile (`vendorApi.getById`), statistics (`vendorApi.getStats`), and portfolio projects (`vendorApi.getProjects`) in parallel via `Promise.allSettled`.
3. **Elevated Key Metric Cards (KPI Grid)**:
   - **Active Orders**: In-progress milestone count with `Briefcase` icon and status pill.
   - **Escrow Earnings**: Formatted milestone earnings with `ShieldCheck` icon and "Protected by TASA Escrow" security guarantee.
   - **Client Rating & Trust**: Star rating in Amber Orange (`#FFA62B`) with client review count.
   - **Portfolio Projects**: Live project showcases count with direct link to add new work.
4. **Interactive Two-Column Dashboard**:
   - **Active Orders & Milestones Pipeline**: Real-time order monitoring with high-converting onboarding empty-state guide (3 actionable steps: Add Case Studies, Tag Core Skills, Share Profile).
   - **Portfolio Showcases Grid**: Visual preview of recent case studies with cover thumbnails, descriptions, and direct links.
   - **Verified Skills & Capabilities**: Clear visual grouping of **Core Skills** (primary specializations in Ocean Blue) and **Peripheral Skills** (complementary capabilities).
   - **Quick Actions Hub**: Fast shortcuts to upload projects, manage skills, edit profile details, and preview the public storefront.
   - **TASA Escrow Guarantee Box**: Highlighting 100% upfront milestone funding and direct bank payout security.
   - **Pro Vendor Tips**: Actionable best practices on cover images, turnaround time, and direct link outreach.
5. **Brand Color Alignment**:
   - Replaced all legacy teal (`#0F766E`, `teal-*`) and mint (`#CCFBF1`) with TASA brand tokens: Slate `#334155`, Ocean Blue `#489FB5`, Sky Blue `#82C0CC`, Warm Neutral `#EDE7E3`, and Amber Orange `#FFA62B`.
   - Updated `src/components/dashboard/AccountCompletion.tsx` and `src/app/v/component/VendorSidebar.tsx` for brand consistency.

## Modifications
- `src/app/v/dashboard/page.tsx`:
  - **L1-L100**: Added parallel data fetching for profile, stats, and portfolio projects via `vendorApi`. Added time-of-day greeting, clipboard copy, and skills processing.
  - **L101-L245**: Overhauled hero welcome banner with live status, location, bio, public profile link, and share button.
  - **L246-L340**: Implemented 4 elevated KPI cards with brand icons and micro-interactions.
  - **L341-L550**: Built project pipeline with actionable empty state, recent portfolio preview grid, and core/peripheral skills badges.
  - **L551-L756**: Built sidebar quick actions, TASA escrow guarantee card, and pro vendor tips.
- `src/components/dashboard/AccountCompletion.tsx`:
  - **L60-L163**: Replaced all legacy teal and emerald classes with brand tokens (`var(--color-brand-primary)`, `var(--color-brand-secondary)`, `var(--color-brand-accent)`).
- `src/app/v/component/VendorSidebar.tsx`:
  - **L1-L150**: Enhanced sidebar with TASA Vendor Portal logo header, public profile link, verified badge, brand token active state, and refined hover styles.
- `src/app/v/layout.tsx`:
  - **L65-L108**: Updated sidebar and header borders to `border-slate-200/80` and background to `bg-[var(--color-bg-page)]`.

## Commit Draft - Short
`feat(vendor-dashboard): redesign /v/dashboard with modern hero, KPI cards, portfolio preview, and brand tokens`

## Commit Draft - Long
`feat(vendor-dashboard): redesign /v/dashboard with modern hero, KPI cards, portfolio preview, and brand tokens

- Overhauled /v/dashboard with time-aware greeting, live availability badge, and public profile sharing
- Added parallel data loading for vendor profile, stats, and portfolio showcases
- Designed 4 elevated KPI cards for active orders, escrow earnings, client rating, and live projects
- Created project pipeline with actionable onboarding guide when orders count is 0
- Added recent portfolio showcases preview and core vs peripheral skills grouping
- Added quick action shortcuts, TASA escrow guarantee badge, and vendor tips
- Replaced all legacy teal colors in AccountCompletion and VendorSidebar with brand tokens
- Verified clean build and type check with tsc --noEmit`

---

## Update: Relocate Profile Completion UI to Settings Page (2026-11-24)

### Date
2026-11-24

### Summary
Restructured the vendor dashboard architecture for improved scalability and focus by moving the Profile Completion UI to the Vendor Settings page:
1. **Clean Dashboard Layout (`/v/dashboard`)**:
   - Removed `<AccountCompletion />` from the top of the dashboard.
   - The dashboard now opens directly with the prominent Hero Welcome & Profile Card, KPI grid, and project pipeline without intrusive onboarding banners.
2. **Context-Aware Settings Page (`/v/settings`)**:
   - Integrated `<AccountCompletion />` at the top of the Settings page.
   - Added `id="profile-info-section"` and `id="skills-selection-section"` with scroll offsets (`scroll-mt-24`).
   - Enhanced `AccountCompletion.tsx` using `usePathname()`: when viewed on the Settings page, missing field buttons smoothly scroll the vendor directly to the relevant field section (`Profile Information` or `Skills Selection`).
   - Adjusted the completion card footer to show helpful guidance on settings instead of a circular link to itself.

### Modifications
- `src/app/v/dashboard/page.tsx`:
  - **L27-L35**: Removed unused `AccountCompletion` import.
  - **L142-L150**: Removed `<AccountCompletion />` call from the dashboard layout.
- `src/app/v/settings/page.tsx`:
  - **L26-L28**: Replaced unused `VendorDashboard` import with `AccountCompletion`.
  - **L825-L832**: Rendered `<AccountCompletion />` directly above the form sections.
  - **L833, L1312**: Added `id="profile-info-section"` and `id="skills-selection-section"` with `scroll-mt-24`.
- `src/components/dashboard/AccountCompletion.tsx`:
  - **L1-L40**: Added `usePathname()` route detection (`isOnSettings`).
  - **L41-L55**: Added `scrollToSection` handler for smooth navigation to the active input sections.
  - **L140-L165**: Added contextual action buttons ("Complete" with smooth scroll when on settings vs "Add" redirect on other pages) and updated footer copy.

### Commit Draft - Short
`refactor(vendor): move profile completion UI from dashboard to settings page`

### Commit Draft - Long
`refactor(vendor): move profile completion UI from dashboard to settings page

- Removed AccountCompletion component from /v/dashboard to keep the dashboard focused on performance metrics and orders
- Embedded AccountCompletion at the top of /v/settings with anchor targets for profile and skills sections
- Enhanced AccountCompletion with smooth in-page scrolling to missing field sections when rendered on settings
- Removed unused imports and verified type check with tsc --noEmit`

---

## Update: Remove Dynamic Navbar & Header Context across Vendor Portal (2026-11-24)

### Date
2026-11-24

### Summary
Removed the redundant desktop dynamic navbar / top header and dynamic title context (`useVendorHeader`) across the vendor portal (`/v`), decluttering the dashboard view and reclaiming screen space:
1. **Layout Simplification (`src/app/v/layout.tsx`)**:
   - Removed the desktop dynamic `<header>` with redundant `{pageTitle}` and `{pageDescription}` that occupied 68px of vertical height.
   - Removed `pageTitle` and `pageDescription` state and `VendorHeaderContext.Provider` wrapper.
   - Reduced `<main>` padding from `pt-17` to `pt-14 lg:pt-0`, maximizing screen estate on desktop displays.
   - Replaced the desktop header with a minimal mobile-only navigation bar (`lg:hidden h-14`) to allow mobile users to easily open/close the `VendorSidebar` drawer.
2. **Context Cleanup (`src/app/v/context.tsx`)**:
   - Replaced context throwing behavior with safe, self-contained no-op functions (`setTitle: () => {}, setDescription: () => {}`) to prevent runtime crashes from legacy or cached chunks.
3. **Cleaned Vendor Pages (`/v/dashboard`, `/v/portfolio`, `/v/settings`)**:
   - Removed `useVendorHeader` import, destructuring, and redundant title/description `useEffect` hooks from `src/app/v/dashboard/page.tsx`, `src/app/v/portfolio/page.tsx`, and `src/app/v/settings/page.tsx`.

### Modifications
- `src/app/v/layout.tsx`:
  - **L1-L100**: Removed `pageTitle`, `pageDescription`, and `VendorHeaderContext`. Added minimal mobile-only drawer bar and adjusted main content padding (`pt-14 lg:pt-0`).
- `src/app/v/context.tsx`:
  - **L1-L22**: Updated `useVendorHeader` and `VendorHeaderContext` to return safe no-op functions.
- `src/app/v/dashboard/page.tsx`:
  - **L30-L55**: Removed `useVendorHeader` import and title/description `useEffect`.
- `src/app/v/portfolio/page.tsx`:
  - **L20-L70**: Removed `useVendorHeader` import and title/description `useEffect`.
- `src/app/v/settings/page.tsx`:
  - **L24-L95**: Removed `useVendorHeader` import and title/description `useEffect`.

### Commit Draft - Short
`refactor(vendor): remove dynamic top navbar and header context from vendor portal`

### Commit Draft - Long
`refactor(vendor): remove dynamic top navbar and header context from vendor portal

- Removed redundant desktop top navbar and dynamic title/description states from VendorLayout
- Provided a lightweight mobile-only bar for the sidebar drawer toggle
- Adjusted main layout padding from pt-17 to pt-14 lg:pt-0 to reclaim screen space
- Removed useVendorHeader and title/description useEffect calls across /v/dashboard, /v/portfolio, and /v/settings
- Replaced VendorHeaderContext with safe no-op implementation
- Verified clean build and type check with tsc --noEmit`

---

## Update: Minimalist Dashboard Header & Refined Sidebar Actions (2026-11-24)

### Date
2026-11-24

### Summary
Streamlined the vendor portal layout and visual hierarchy according to user feedback:
1. **Sidebar Refinements (`src/app/v/component/VendorSidebar.tsx`)**:
   - Relocated the "View Public Profile" action to the bottom action section directly on top of the Logout button.
   - Removed the orange dot (`var(--color-brand-accent)`) indicator from the active nav items for a cleaner, unified active tab appearance.
2. **Minimalist Dashboard Header (`src/app/v/dashboard/page.tsx`)**:
   - Removed the heavy dark slate background hero card, ambient background glows, and extraneous greetings/badges.
   - Implemented a clean, light, focused header structure:
     - Prominent `{vendorName}` heading.
     - Subtle horizontal divider line (`border-t border-slate-200/80`).
     - Metadata line displaying location (with pin icon), star rating with review count, and primary category.
     - Minimalist right-aligned action buttons (View Public Profile, Share Profile).

### Modifications
- `src/app/v/component/VendorSidebar.tsx`:
  - **L97-L107**: Removed "View Public Profile" button from the top profile card.
  - **L123-L135**: Removed orange dot indicator from active navigation link.
  - **L140-L158**: Added "View Public Profile" link directly above the Logout button in the bottom section.
- `src/app/v/dashboard/page.tsx`:
  - **L88-L95**: Removed unused `getGreeting` helper.
  - **L125-L175**: Replaced dark slate hero card with clean minimal heading, divider line, location, reviews, and category tag.

### Commit Draft - Short
`style(vendor): clean dashboard header to minimal layout and move public profile link above logout in sidebar`

### Commit Draft - Long
`style(vendor): clean dashboard header to minimal layout and move public profile link above logout in sidebar

- Moved "View Public Profile" button to bottom section above Logout in VendorSidebar
- Removed active orange dot indicator from navigation menu links
- Removed dark slate gradient hero container and ambient glows from /v/dashboard
- Created clean vendor header displaying {vendorName}, divider line, and location/reviews
- Verified TypeScript compilation with tsc --noEmit (0 errors)`

---

## Update: Remove Stats, Escrow, and Verified Score Metrics (2026-11-24)

### Date
2026-11-24

### Summary
Removed unnecessary KPI statistics cards and promotional escrow banners to keep the vendor dashboard uncluttered, direct, and actionable:
1. **Removed Key Performance Metrics (KPI Grid)**:
   - Removed the 4-card KPI grid from `src/app/v/dashboard/page.tsx`, which contained Active Orders, Escrow Protected earnings, Verified Score rating, and Live Case Studies counts.
2. **Removed Escrow Guarantee Promotion Card**:
   - Removed the "TASA Escrow Guarantee" box from the sidebar column to eliminate redundant marketing text.
3. **Cleaned Unused Imports**:
   - Removed unused icons (`Layers`, `ShieldCheck`, `Sparkles`, `TrendingUp`, `User`, `UserCheck`, `Wallet`) and Next.js `Image` component.

### Modifications
- `src/app/v/dashboard/page.tsx`:
  - **L3-L27**: Cleaned unused Lucide icon imports and unused Next.js Image import.
  - **L193-L285**: Removed the 4-card Key Performance Metrics (KPI Grid).
  - **L515-L545**: Removed the TASA Escrow Guarantee Box.

### Commit Draft - Short
`refactor(vendor): remove KPI stats cards, escrow guarantee box, and unused icons from dashboard`

### Commit Draft - Long
`refactor(vendor): remove KPI stats cards, escrow guarantee box, and unused icons from dashboard

- Removed 4-card KPI metrics grid (Active Orders, Escrow Protected, Verified Score, Projects)
- Removed TASA Escrow Guarantee promotional box from dashboard right sidebar
- Cleaned unused Lucide icon imports and Next.js Image import
- Verified clean build with tsc --noEmit (0 errors)`

---

## Update: Remove Project Pipeline, Quick Actions, and Pro Tips (2026-11-24)

### Date
2026-11-24

### Summary
Further decluttered the Vendor Dashboard (`/v/dashboard`) by removing low-signal widgets and promotional helper cards, establishing an expansive and focused showcase of the vendor's actual work:
1. **Removed Project Pipeline & Milestones**:
   - Removed the Active Orders Pipeline and the 3-step onboarding card from `src/app/v/dashboard/page.tsx`.
2. **Removed Quick Actions Card**:
   - Removed the secondary shortcuts block from the dashboard.
3. **Removed Pro Vendor Tips**:
   - Removed the helper tips section.
4. **Elevated Portfolio Showcases & Verified Skills Layout**:
   - Transitioned the layout from an asymmetrical two-column grid into a clean, full-width responsive workspace (`space-y-6`).
   - Expanded the Portfolio Showcases grid to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` displaying up to 6 case studies prominently.
   - Cleaned unused Lucide icon imports (`Briefcase`, `HelpCircle`, `SlidersHorizontal`, `UserCog`, `Eye`).

### Modifications
- `src/app/v/dashboard/page.tsx`:
  - **L3-L20**: Removed unused icons (`Briefcase`, `HelpCircle`, `SlidersHorizontal`, `UserCog`, `Eye`).
  - **L185-L335**: Replaced two-column split and removed project pipeline, quick actions, and pro tips; expanded portfolio grid to 3 columns.

### Commit Draft - Short
`refactor(vendor): remove project pipeline, quick actions, and pro tips from dashboard`

### Commit Draft - Long
`refactor(vendor): remove project pipeline, quick actions, and pro tips from dashboard

- Removed project pipeline & milestones section
- Removed quick actions and pro vendor tips cards
- Upgraded portfolio showcases to full-width 3-column responsive grid
- Cleaned unused Lucide icon imports
- Verified TypeScript compilation with tsc --noEmit (0 errors)`


---

## 2026-11-24: Vendor Portfolio Page Outer Boxes & Unnecessary Icons Removal

### Summary
Revamped the vendor portfolio management page (`/v/portfolio`) to match the clean, unboxed, minimalist design of `/v/dashboard`:
1. **Added Minimalist Page Header**:
   - Added clean header with `Portfolio` heading, subtitle "Manage and showcase your projects and case studies", and divider line `<hr className="border-t border-slate-200/80" />`.
2. **Removed Outer Boxes & Nested Cards**:
   - Replaced heavy boxed card around project form (`bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-sm`) with an unboxed container (`scroll-mt-6 space-y-6`).
   - Removed nested case study box (`border border-slate-100 rounded-2xl p-5 bg-slate-50/50`) and replaced with a clean divider-separated section.
   - Removed the "Masterclass Setup Tips" box (`bg-slate-50 border border-slate-200/60 rounded-2xl p-5`) and its numbered badges.
   - Replaced heavy empty-state container (`bg-white rounded-3xl border border-slate-100 p-12`) with a clean dashed border container (`py-12 text-center border border-dashed border-slate-200 rounded-2xl`).
   - Cleaned project gallery cards into un-inflated cards with standard border.
3. **Removed Unnecessary Icons & Tooltips**:
   - Removed `Briefcase` teal icon container from the form header.
   - Removed `Sparkles` icon and "Attracts 3x More Clients" badge.
   - Removed `BookOpen` icon and numbered badges from tips.
   - Removed all `InfoTooltip` question mark components (`HelpCircle`) next to form labels.
   - Removed `Briefcase` icon circle from the empty state.
   - Replaced icon buttons with clean semantic action buttons.
4. **Enforced Color Palette & Design Tokens**:
   - Removed legacy teal colors (`text-teal-700 hover:text-teal-850`, `bg-teal-50`) and aligned links with `text-[var(--color-brand-primary)]`.
   - Used Slate tokens for primary buttons and text.

### Modifications
- `src/app/v/portfolio/page.tsx`:
  - **L3-L12**: Cleaned Lucide icon imports (removed `Briefcase`, `HelpCircle`, `Lightbulb`, `BookOpen`, `Sparkles`, `Save`, `CheckCircle2`, `Plus`).
  - **L350-L750**: Added unboxed page header, removed outer box and nested case study box, removed Masterclass setup tips card, removed all label tooltips, and simplified the empty state and project cards.
  - Removed `InfoTooltip` component definition and helper props.

### Commit Draft - Short
`refactor(vendor): remove outer boxes and unnecessary icons from portfolio page`

### Commit Draft - Long
`refactor(vendor): remove outer boxes and unnecessary icons from portfolio page

- Added clean unboxed page header with divider line matching /v/dashboard
- Removed outer boxed containers around project creation form and case study breakdown
- Removed Masterclass setup tips card and question-mark tooltips across all form fields
- Removed unnecessary icons (Briefcase, Sparkles, BookOpen, HelpCircle, Save) and badges
- Replaced legacy teal links with brand primary tokens
- Verified TypeScript compilation with tsc --noEmit (0 errors)`


---

## 2026-11-24 — Custom Skill Submission Feature Moved to Settings

### Summary
Moved the "Can't find your skill?" custom skill submission feature from the `become-a-vendor` page into the vendor dashboard **Settings → Skills Selection** section, so active vendors can also request new skills for review without having to re-register.

### What Changed

**Feature ported from `become-a-vendor/page.tsx`:**
- Custom skill text input with Enter-key support
- Input is disabled when the 7-skill limit is reached
- Duplicate checking against existing available skills (prevents adding skills already in the list)
- Duplicate checking against already-selected skills
- Skills normalized (title-cased, trimmed)
- Custom skills auto-assigned as `peripheral` (they have no ID, so cannot be core)
- On save, custom skills are POSTed to `/api/vendors/SkillReview` for admin review (non-blocking, best-effort)

**Visual indicator in selected skills summary:**
- Custom (pending review) peripheral skills now render with an amber border and a small `review` badge so vendors know their status

### Modifications

| File | Lines Affected | Change |
|---|---|---|
| `src/app/v/settings/page.tsx` | ~102–108 | Added `customSkillInput` and `isSubmittingCustomSkill` state |
| `src/app/v/settings/page.tsx` | ~742–815 | Added `normalizeSkillName`, `handleAddCustomSkill`, `handleSubmitCustomSkillsForReview` handlers |
| `src/app/v/settings/page.tsx` | ~826–842 | `handleSaveSkills` now identifies custom skills and calls review submission before saving |
| `src/app/v/settings/page.tsx` | ~1439–1470 | Custom peripheral skills rendered with amber "review" badge |
| `src/app/v/settings/page.tsx` | ~1594–1635 | "Can't find your skill?" UI block added below the skills grid |
| `src/app/v/settings/page.tsx` | Line 3 | Added `Plus` to lucide-react import |

### TypeScript
`tsc --noEmit` → exit code 0, 0 errors.

### Commit Draft — Short
```
feat(settings): add custom skill submission to vendor skills section
```

### Commit Draft — Long
```
Move the "Can't find your skill?" feature from become-a-vendor into the
vendor dashboard Settings page, so existing vendors can suggest new skills
for admin review without re-registering.

- Added normalizeSkillName, handleAddCustomSkill, and
  handleSubmitCustomSkillsForReview handlers to VendorSettings.
- Custom skills are auto-labelled as peripheral (no DB ID = cannot be core).
- handleSaveSkills now POSTs any custom (ID-less) skills to
  /api/vendors/SkillReview before the main update call.
- Selected skills summary shows a small amber "review" badge on custom skills.
- Input is disabled at the 7-skill cap; Enter key supported.
- TypeScript: 0 errors.
```
