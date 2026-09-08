# Date: 2026-08-19

## Summary
Removed the hardcoded fallback API URL (`https://api.tasa.com.ng`) across the codebase to strictly rely on the `NEXT_PUBLIC_API_URL` environment variable.

## Modifications
- `src/lib/vendor.ts`: Lines 145, 182, 346, 379, 413, 461, 505, 563, 619
- `src/lib/user.ts`: Lines 55, 91, 122
- `src/component-pages/VendorsPage.tsx`: Line 105
- `src/app/v/settings/page.tsx`: Line 523

## Commit Draft - Short
refactor: remove hardcoded api url fallbacks

## Commit Draft - Long
refactor: remove hardcoded api url fallbacks

Removed the hardcoded fallback URL (`https://api.tasa.com.ng`) that was used when the `NEXT_PUBLIC_API_URL` environment variable was undefined. The codebase now strictly relies on the environment variable, preventing accidental requests to the old domain after a domain change. This modification affects API calls across `vendor.ts`, `user.ts`, `VendorsPage.tsx`, and the settings `page.tsx`.
