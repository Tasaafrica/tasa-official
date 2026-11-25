# Dark Mode Light Favicon Support (2026-11-04)

## Date
2026-11-04

## Summary
Configured dual-theme favicon support for Tasa Africa with automatic OS and browser theme detection (`prefers-color-scheme`):
- **Light Theme**: Serves dark slate brand mark icons on light browser tabs (`/icon0.svg`, `/icon1.png`, `/favicon.ico`, `/apple-icon.png`).
- **Dark Theme**: Serves white brand mark icons on dark browser tabs (`/icon0-light.svg`, `/icon1-light.png`, `/favicon-light.ico`, `/apple-icon-light.png`).
- **Asset Distribution**: Synchronized all light and dark icon variants across `src/app/` and `public/` (including `public/tasa_africa-favicon/` for web app manifests).
- **Web App Manifests**: Configured `manifest.json` and `manifest-light.json` with correct names ("Tasa Africa"), theme colors, and respective manifest icon paths.
- **Root Layout Integration**: Configured both `metadata.icons` and `<head>` link elements in `src/app/layout.tsx` targeting `(prefers-color-scheme: light)` and `(prefers-color-scheme: dark)`.

## Modifications
- `src/app/layout.tsx`:
  - **L43-L101**: Added comprehensive `metadata.icons` and `manifest` definitions for light and dark schemes.
  - **L115-L127**: Added explicit `<link rel="icon" ... media="(prefers-color-scheme: ...)">` elements to `<head>`.
- `src/app/manifest.json`:
  - Updated app name to "Tasa Africa" and ensured consistent branding.
- `src/app/manifest-light.json`:
  - Pointed icons to light variant assets with dark theme background.
- `public/`:
  - Synchronized all favicon files and created `public/tasa_africa-favicon/` with 192x192 and 512x512 assets.

## Commit Draft - Short
`feat(branding): add dark-mode adaptive white favicon support`

## Commit Draft - Long
`feat(branding): add dark-mode adaptive white favicon support

- Configured metadata.icons and HTML head links with prefers-color-scheme media queries
- Served standard brand icons in light mode and -light (white) icons in dark mode
- Synchronized favicon, apple-icon, icon SVG/PNG, and manifest assets in public/ and app/
- Updated web app manifests with Tasa Africa branding
- Verified clean compilation with tsc --noEmit`

---

## Update: Resolved Conflicting Public and Page File for /manifest.json (2026-11-08)

### Date
2026-11-08

### Summary
Resolved Next.js route collision error (`A conflicting public file and page file was found for path /manifest.json`):
- **Conflict Cause**: Next.js App Router automatically generates a metadata route handler from `src/app/manifest.json`. Having a duplicate static file at `public/manifest.json` caused a collision over the root URL route `/manifest.json`.
- **Resolution**:
  - Removed `public/manifest.json` so Next.js natively manages and serves `src/app/manifest.json`.
  - Removed duplicate App Router conventions from `public/` (`public/favicon.ico`, `public/apple-icon.png`, `public/icon0.svg`, `public/icon1.png`) to avoid further route collisions.
  - Retained static dark-mode assets (`favicon-light.ico`, `icon0-light.svg`, `icon1-light.png`, `apple-icon-light.png`, `manifest-light.json`, and `public/tasa_africa-favicon/` icons) in `public/`.
  - Removed redundant `manifest: "/manifest.json"` from `metadata` in `src/app/layout.tsx` to let Next.js automatically inject the manifest link tag.

### Modifications
- `public/`:
  - Removed duplicate `public/manifest.json`, `public/favicon.ico`, `public/apple-icon.png`, `public/icon0.svg`, and `public/icon1.png`.
- `src/app/layout.tsx`:
  - Removed redundant `manifest` key from `metadata` object.

### Commit Draft - Short
`fix(metadata): resolve conflicting public and page file for manifest.json and favicons`

### Commit Draft - Long
`fix(metadata): resolve conflicting public and page file for manifest.json and favicons

- Removed public/manifest.json to resolve route collision with src/app/manifest.json
- Removed duplicate favicon.ico, apple-icon.png, icon0.svg, and icon1.png from public folder
- Preserved static -light favicon assets in public for dark mode query links
- Removed redundant manifest key in layout metadata
- Verified clean TypeScript compilation with tsc --noEmit`


