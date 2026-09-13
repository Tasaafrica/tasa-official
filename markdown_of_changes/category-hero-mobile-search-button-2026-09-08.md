# Category Hero Mobile Search Button Update (2026-09-08)

## Date
2026-09-08

## Summary
Updated the search submit button in `CategoryHero` so that on mobile viewports (< `sm` breakpoint) it displays a compact Search icon, while retaining the full "Explore" text and Arrow Right icon on desktop viewports (`sm` and larger).

## Modifications
- `src/app/component/parts/categoryHero.tsx`:
  - **L1-L4**: Cleaned up unused Lucide icon imports (`MousePointer2`, `Zap`, `Shield`, `Sparkles`) and sorted import declarations.
  - **L150-L157**: Updated submit button responsive styling (`p-3 sm:px-6 sm:py-3`), added `<Search className="w-5 h-5 sm:hidden" />` for mobile viewports, and hidden text/arrow icon on screens smaller than `sm`.

## Commit Draft - Short
`style(category-hero): render search icon on mobile for hero search button`

## Commit Draft - Long
`feat(category-hero): adjust category hero search button for mobile screens`

`Updated the submit button in the CategoryHero search bar component to display a Search icon on mobile screens (< sm breakpoint) for a more compact and mobile-friendly UI layout. On larger screens (sm+), the button retains its full "Explore" label with the Arrow Right icon. Also cleaned up unused Lucide icon imports.`
