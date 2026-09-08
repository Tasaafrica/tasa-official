**Date:** 2026-09-08

**Summary:** Applied the TASA Africa branding, typography, color palette, and clean list-based layout from the Privacy Policy page to the Terms of Service page.

**Modifications:**
- `src/app/terms-of-service/page.tsx`:
  - Updated font to Poppins (`font-poppins`).
  - Converted all slate body and heading text colors to solid black (`text-black`).
  - Replaced all blue/teal accents with TASA's signature `#0f766e` teal color.
  - Added Quick Navigation Shortcuts header list at the top.
  - Removed heading icon blocks for a clean text flow.
  - Removed outer card containers and shadows, rendering sections as a continuous list with subtle dividers.
  - Renamed Section 7 to 'Contact Us' pointing to Legal & Support team (`legal@tasaafrica.com` / `support@tasaafrica.com`).
  - Updated contact designation in sidebar card and Section 7 to specifically reference the **Legal and Support team**.
  - Increased font sizes across body copy (16px-18px) and headings (24px-30px).

**Commit Draft - Short:** feat: align Terms of Service page with TASA Africa branding and Legal & Support contact info

**Commit Draft - Long:** 
Updated the Terms of Service page (`/terms-of-service`) to match the new TASA Africa branding and design system established on the Privacy Policy page. Applied global Poppins typography, solid black text colors, TASA teal (`#0f766e`) accents, quick navigation shortcuts, icon-less section titles, comfortable body font sizing, and dedicated Legal and Support team contact channels (`legal@tasaafrica.com` / `support@tasaafrica.com`).
