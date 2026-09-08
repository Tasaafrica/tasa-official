# Changelog - 2026-07-18

## Summary
Revamped the vendor portfolio process across frontend settings and public pages, and updated the backend model database schema and route controllers to support high-converting, narrative case study portfolios. Additionally, resolved layout responsiveness for headers, text areas, and tooltips on mobile viewports, and fixed project editing/deleting state management errors resulting from MongoDB subdocument ID schema formatting.

## Modifications

### Backend (tasa-server)
- **File:** [VendorProjects.ts (Model)](file:///C:/Users/David%20Anderson/Documents/Github/TASA/tasa-server/src/models/VendorProjects.ts)
  - **Lines 10-20 & 44-70:** Added case study fields (`description`, `problem`, `process`, `solution`, `results`, `brandPersonality`, `strategicGoals`, `creativeRationale`) to the schema definition.
- **File:** [VendorProjects.ts (Routes)](file:///C:/Users/David%20Anderson/Documents/Github/TASA/tasa-server/src/routes/VendorProjects.ts)
  - **Lines 95-105 & 184-196:** Modified POST route to read and save new case study details.
  - **Lines 230-240 & 270-305:** Modified PUT route to parse and set case study updates.

### Frontend (tasa-user)
- **File:** [vendor.ts (API Library)](file:///c:/Users/David%20Anderson/Documents/Github/TASA/tasa-user/src/lib/vendor.ts)
  - **Lines 508-520 & 560-575:** Appended new fields to project creation and update requests.
  - **Lines 568-571:** Added `.startsWith("data:")` checks to filter out existing Cloudinary URLs, preventing `dataURLtoBlob` decoding crashes.
  - **Lines 638-658:** Expanded interface declarations to define case study variables.
  - **Lines 653-657:** Added `id: string` and marked `_id?: string` as optional on the `VendorProject` interface.
- **File:** [portfolio/page.tsx (Settings Page)](file:///c:/Users/David%20Anderson/Documents/Github/TASA/tasa-user/src/app/v/portfolio/page.tsx)
  - **Lines 22-277:** Implemented edit project form bindings, state resets, and payload updates.
  - **Lines 225 & 355:** Corrected edit mode triggering and project lists mapping to read `project.id` instead of `project._id`.
  - **Lines 280-565:** Added form inputs, setup masterclass tips card, and card overlay triggers.
  - **Lines 487-672:** Increased textareas default row counts (`rows={4}`) and added minimum heights (`min-h-[110px]`) to reveal long placeholders on mobile layouts.
  - **Lines 680-684, 934-938 & 985-1025:** Added `InfoTooltip` click-handling component, bound touch state togglers, updated grid button responsive visibility, and fixed button wrap flow.
  - **Lines 919 & 943:** Synchronized the rendering key and the `handleDeleteProject` selector to pass `project.id` instead of `project._id`.
- **File:** [layout.tsx (Dashboard Layout)](file:///c:/Users/David%20Anderson/Documents/Github/TASA/tasa-user/src/app/v/layout.tsx)
  - **Lines 91-105:** Added responsive header title padding, hid header descriptions on mobile, and created an outer banner placement for descriptions in mobile containers.
- **File:** [VendorsPage.tsx (Public Page)](file:///c:/Users/David%20Anderson/Documents/Github/TASA/tasa-user/src/component-pages/VendorsPage.tsx)
  - **Lines 17-20 & 91:** Imported icons and set selectedProject state.
  - **Lines 373:** Changed button map key to `project.id` for schema consistency.
  - **Lines 363-403 & 501-730:** Updated project grid click triggers and created the case study modal popup with custom layout styles.

## Commit Drafts

### Short
`feat: revamp vendor portfolio process with case study fields and tips`

### Long
`Upgraded vendor portfolios to support detailed case study breakdowns instead of static thumbnail grids. Updated backend schema and controllers to process and save description, problem, process, solution, and results fields. Expanded vendor dashboard forms with masterclass conversion tips, label tooltips, and project edit features. Redesigned public vendor profile to show case studies in an interactive overlay with booking CTA cards.`
