## Date
2026-07-18

## Summary
Standardized all font loading across the application to exclusively use \
ext/font\ to improve performance, prevent layout shifts, and eliminate third-party network requests for fonts.

## Modifications
- Modified src/app/layout.tsx - Imported and configured Climate_Crisis, Source_Sans_3, and Poppins from next/font/google. Bound them to CSS variables globally in the body tag.
- Modified src/app/globals.css - Removed external Google Fonts imports for Climate Crisis and Source Sans 3. Replaced font-family values with the new CSS variables and created a new .font-poppins utility class.
- Modified src/app/page.tsx - Removed local Poppins import and switched to using the global font-poppins CSS class.
- Modified src/app/become-a-vendor/page.tsx - Removed local Poppins import and switched to using the global font-poppins CSS class.

## Commit Draft - Short
refactor: standardize all fonts to use next/font/google

## Commit Draft - Long
This commit refactors font loading across the application to use the built-in \
ext/font/google\ module instead of third-party network requests. \Climate_Crisis\, \Source_Sans_3\, and \Poppins\ have been hoisted to the root layout and exposed as global CSS variables. This ensures self-hosted fonts without CLS (Cumulative Layout Shift) issues and cleans up local instantiations in individual page components.- Modified src/app/globals.css and src/app/layout.tsx - Enforced Poppins globally on the body tag to prevent browser system defaults from overriding the chosen font across all other pages.
- Modified src/app/contact/ContactClient.tsx - Removed the hardcoded 'font-sans' class from the root wrapper so that it correctly inherits the global Poppins font from the layout body.
