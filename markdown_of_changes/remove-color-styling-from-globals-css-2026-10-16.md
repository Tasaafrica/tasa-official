# Remove Color Styling From Globals CSS (2026-10-16)

## Date
2026-10-16

## Summary
Removed all color property and variable declarations from `src/app/globals.css` to ensure full separation of concerns, routing all color palettes, theme variables, and brand tokens through `src/app/brand-colors.css`. Form inputs and custom scrollbars now derive their color tokens directly from the design system in `brand-colors.css`, while `globals.css` retains only layout, structure, typography, and animation rules.

## Modifications
- `src/app/globals.css`:
  - **L1-L3**: Set relative import `@import "./brand-colors.css";`.
  - **L6-L24**: Removed `:root` and dark mode `@media` color variables (`--background`, `--foreground`, `--color-1`, `--indigo`, `--cool-blue`, `--color-light`), keeping only structural `body` typography rules.
  - **L24-L39**: Removed hardcoded `input { color: black; }`.
  - **L88-L95**: Removed hardcoded accessibility focus outline color and scrollbar background colors (`#f1f5f9`, `#cbd5e1`, `#94a3b8`), preserving only structural width and border radius.
- `src/app/brand-colors.css`:
  - **L73-L75**: Added `--indigo: var(--color-brand-dark);` backward compatibility alias for existing component usages.
  - **L155-L174**: Added input/form control text color using `var(--color-text-primary)` and custom scrollbar colors using brand tokens (`--color-disabled-bg`, `--color-border-strong`, `--color-text-muted`).

## Commit Draft - Short
`style(css): remove color styling from globals.css and consolidate into brand-colors.css`

## Commit Draft - Long
`style(css): remove color styling from globals.css and consolidate into brand-colors.css

- Removed all color variables, dark mode media queries, and legacy colors from src/app/globals.css
- Stripped body background/color declarations and hardcoded input/scrollbar colors from globals.css
- Updated import to relative ./brand-colors.css for reliable module resolution
- Consolidated input text colors and scrollbar styling inside src/app/brand-colors.css using design tokens
- Added backward compatibility alias for --indigo in brand-colors.css`
