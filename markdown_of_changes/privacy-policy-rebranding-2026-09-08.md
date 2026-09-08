**Date:** 2026-09-08

**Summary:** Completely redesigned the Privacy Policy page for TASA Africa into a compact, professional, Fiverr-inspired layout with quick shortcut links, sticky sidebar navigation, interactive print option, and comprehensive legal provisions covering Nigeria (NDPA 2023), South Africa (POPIA), Pan-Africa (AU Malabo), EU/UK (GDPR), and United States (CCPA/CPRA).

**Modifications:**
- `src/app/privacy-policy/page.tsx`: Lines 4-20 (enhanced SEO metadata & OpenGraph with regional privacy keywords)
- `src/app/privacy-policy/PrivacyPolicyClient.tsx`:
  - Completely rewritten UI with compact cards, category sidebar, and shortcut links header.
  - Added explicit section for **Nigeria NDPA 2023** compliance, NDPC guidelines, and local KYC (NIN/BVN) handling for Nigerian payout compliance.
  - Added **Pan-African Privacy Framework** section covering South Africa (POPIA), Kenya DPA 2019, Ghana DPA 2012, and AU Malabo Convention alignment.
  - Added **EU/UK GDPR** section detailing 8 data subject rights and Standard Contractual Clauses (SCCs).
  - Added **US CCPA/CPRA** declaration confirming no sale/sharing of personal data.
  - Added tabular **Data Retention & Deletion Schedule** and **Third-Party Sub-Processors Matrix** (Paystack, Flutterwave, Stripe, AWS, Smile ID).
  - Added Mobile Application Telemetry, Push Notifications, and Privacy Team Contact Card (`privacy@tasaafrica.com`).
  - Removed heading icons for a cleaner text flow.
  - Removed section outer card boxes and shadows to render as a clean, continuous list.
  - Renamed Section 11 to 'Contact Us' matching standard list items.
  - Applied Poppins font globally to the client view.
  - Converted all slate text colors to solid black (`text-black`).
  - Replaced all blue color accents and badges with TASA's signature teal color (`#0f766e`).
  - Adjusted font sizes across body copy to 14px - 16px (`text-sm md:text-base`) and headings to 20px - 24px (`text-xl md:text-2xl`) for a compact, clean desktop layout.
  - Formatted the Contact section into a clean list containing Email (`dpo@tasaafrica.com` / `privacy@tasaafrica.com`), Address (`Lagos, Nigeria`), and Website (`www.tasaafrica.com`) with brand icons (`Mail`, `MapPin`, `Globe`).
  - Updated contact designation in sidebar card and Section 11 to specifically reference the **Data Protection Officer (DPO)**.

**Commit Draft - Short:** feat: overhaul Privacy Policy with compact UI, DPO contact channels, and global NDPA/POPIA/GDPR/CCPA compliance

**Commit Draft - Long:** 
Redesigned the Privacy Policy page for TASA Africa to deliver a compact, modern, highly structured UI with quick shortcut links, sticky sidebar, print functionality, and clear summary callouts. Significantly expanded the policy content to ensure compliance across key jurisdictions: Nigeria (NDPA 2023 & NDPC guidelines), South Africa (POPIA), Pan-Africa (AU Malabo Convention & regional DPAs), Europe/UK (GDPR 8 fundamental rights & SCCs), and California (CCPA/CPRA no-sale declaration). Included detailed disclosures for Client vs Vendor data, KYC/identity verification, payment processors, mobile app telemetry, data retention schedules, and dedicated Data Protection Officer (DPO) contact channels (`dpo@tasaafrica.com`).
