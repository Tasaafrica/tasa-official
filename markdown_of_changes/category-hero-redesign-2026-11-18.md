# Category Hero Redesign (2026-11-18)

## Date
2026-11-18

## Summary
Redesigned the Category Hero section (`src/app/component/parts/categoryHero.tsx`) rendered on `src/app/(public)/categories/[categorySlug]/page.tsx` to align with the platform's new design standard:
1. **Bright Modern Atmosphere**:
   - Replaced legacy dark `bg-slate-950` with clean dominant white and subtle neutral background gradients (`bg-gradient-to-b from-white via-white to-[var(--color-bg-subtle)]/40 border-b border-[var(--color-border)]`).
   - Integrated soft ambient brand radial glows (`bg-[var(--color-bg-brand-soft)]/50` and `bg-[var(--color-brand-secondary)]/15`).
   - Removed legacy teal gradients (`rgba(20,184,166,...)`) and hardcoded grid lines.
2. **Elevated Content & Typography**:
   - Added `Category Directory` pill badge with `Sparkles` icon.
   - Styled category heading in bold slate (`text-[var(--color-text-primary)]`, `#334155`) with high legibility.
   - Refined breadcrumbs with subtle home icon and slate navigation links.
   - Redesigned search bar with clean white glass card, Ocean Blue interactive button (`bg-[var(--color-brand-primary)]`), and crisp autocomplete dropdown.
   - Added verified metrics counter (Verified African Professionals, Escrow Payment Protected, Direct Milestone Delivery).
3. **Card-Framed Dynamic Visual**:
   - Upgraded right-column category illustration using Next.js `Image` with fallback handling inside an elevated visual card frame with backdrop glow.
4. **Color & Brand Token Compliance**:
   - Replaced all legacy teal elements in `src/component-pages/CategoriesPages.tsx` with standard brand tokens (`--color-brand-primary`, `--color-text-primary`, `--color-border`).

## Modifications
- `src/app/component/parts/categoryHero.tsx`:
  - **L1-L36**: Streamlined imports and interfaces, using `ArrowRight`, `ChevronDown`, `Home`, and Framer Motion's `AnimatePresence`.
  - **L37-L50**: Configured `isExpanded` state and dynamic category illustration paths referencing `/categoryHero/${categorySlug}.png`.
  - **L51-L126**: Centered navigation breadcrumbs and bold headline (`{title}`) matching the Students page hierarchy.
  - **L127-L151**: Wide image banner constrained to `max-h-[200px]` with `object-cover object-center` for proportional widescreen cropping without distortion.
  - **L152-L170**: Removed legacy search box. Added straight horizontal line directly beneath the hero image banner.
  - **L171-L195**: Positioned dropdown toggle chevron directly after the "Featured Skills" text button (`Featured Skills [v]`), removing horizontal scrolling (`overflow-hidden`) so the line remains strictly non-scrollable and maintains a single straight line across all screen sizes.
  - **L196-L208**: Added parallel dividing line across under the featured skills row.
  - **L209-L245**: Implemented responsive multi-column skills directory dropdown opening into 2 columns on mobile, 3 columns on tablet, and 4 columns on desktop (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`) upon clicking the dropdown trigger.
- `src/app/globals.css`:
  - **L187-L195**: Added `.no-scrollbar` utility for cross-browser hidden scrollbars on single-line horizontal navigation.
- `src/component-pages/CategoriesPages.tsx`:
  - **L104-L120**: Updated page background to `bg-[var(--color-bg-page)]` and `<Header variant="white" />`.
  - **L121-L220**: Replaced legacy teal classes with brand tokens across featured skills, subcategory links, and the bottom assistance banner.

## Commit Draft - Short
`feat(categories): replace search box with parallel lines, featured skills row and responsive multi-column dropdown`

## Commit Draft - Long
`feat(categories): replace search box with parallel lines, featured skills row and responsive multi-column dropdown

- Removed search box from CategoryHero component
- Added a straight horizontal line directly under the hero image banner
- Displayed arranged featured skills in a responsive, centered horizontal pill row
- Added a second parallel horizontal line spanning across with a dropdown icon button at the end
- Implemented smooth expandable multi-column directory opening into 2-cols (mobile), 3-cols (tablet), and 4-cols (desktop)
- Preserved widescreen hero image cropped to max 200px height with correct categoryHero assets

---

# Category Hero Mobile Icon & Scroll-Triggered Orange Border Glow (2026-11-19)

## Date
2026-11-19

## Summary
Updated the featured skills section on the Category Hero (`src/app/component/parts/categoryHero.tsx`) for mobile and responsive interaction:
1. **Mobile Icon Replacement**:
   - On mobile devices (`< 640px`), removed the text "Featured Skills".
   - Replaced it with a brand `Sparkles` icon (`lucide-react`) formatted as a compact 28x28px rounded button.
   - On larger screens (`sm:` and up), the "Featured Skills" text remains displayed.
   - The dropdown chevron (`ChevronDown`) is positioned immediately next to the mobile icon / desktop text.
2. **Scroll-Triggered Single-Shot Orange Border Glow**:
   - Implemented an intersection and scroll observer that detects when the user scrolls toward the featured skills bar.
   - When the area enters the viewport viewing zone upon scrolling, the mobile icon or desktop text badge lights up with a single-shot glow animation (`animate-orange-border-glow-once`).
   - The animation renders a crisp 1px thin border of Amber Orange (`#FFA62B` / `var(--color-brand-accent)`), peaks with a soft ambient orange glow halo (`box-shadow: 0 0 12px 2px rgba(255,166,43,0.65)`), and gently settles leaving the refined thin orange border.
   - Triggers strictly once per page view to prevent repetitive distraction.
   - Includes a fallback timer for large displays where the content is completely in-view without scrolling.

## Modifications
- `src/app/globals.css`:
  - **L214-L248**: Added `@keyframes orangeBorderGlowOnce` and `.animate-orange-border-glow-once` utility defining a 1.8s single-iteration glow pulse in `#FFA62B` that settles with a 1px solid border.
- `src/app/component/parts/categoryHero.tsx`:
  - **L1-L10**: Imported `Sparkles` icon from `lucide-react` and `useRef` from `react`.
  - **L40-L109**: Added `skillsBarRef` reference, `glowTriggered` state, and an effect combining `scroll` listener, `IntersectionObserver`, and fallback timer.
  - **L193-L245**: Replaced the "Featured Skills" text on mobile with `<Sparkles className="w-3.5 h-3.5 text-[var(--color-brand-accent)]" />` wrapped in a 7x7 rounded container, kept text on `sm:`, and applied `.animate-orange-border-glow-once` when `glowTriggered` is true.

## Commit Draft - Short
`feat(category-hero): replace featured skills text with icon on mobile and add scroll-triggered orange border glow`

## Commit Draft - Long
`feat(category-hero): replace featured skills text with icon on mobile and add scroll-triggered orange border glow

- Replaced "Featured Skills" text on mobile screens with a compact Sparkles icon
- Kept "Featured Skills" text on desktop screens with immediate dropdown chevron
- Added scroll and IntersectionObserver detection to trigger a one-time glow animation when users scroll toward the skills line
- Created @keyframes orangeBorderGlowOnce and .animate-orange-border-glow-once with Amber Orange (#FFA62B) thin border
- Verified clean build with tsc --noEmit``
