# Industries and Companies Section Implementation (2026-10-21)

## Date
2026-10-21

## Summary
Created and integrated a dedicated "Industries & Companies Section" (`IndustriesCompaniesSection`) immediately following the Artisans & Professionals Section on the homepage. Designed specifically for enterprise organizations, multinational corporations, industrial plants, and SMEs sourcing African technical talent, specialized contracting teams, and operational services. Built with a rich non-white Warm Neutral background (`#EDE7E3`, matching `var(--color-brand-warm)` and `.section-warm`), avoiding artificial/gimmicky AI decorations, and focusing purely on authentic corporate sectors, real operational capabilities, institutional governance guarantees, and streamlined B2B procurement pathways.

## Modifications
- `src/app/component/parts/industriesCompaniesSection.tsx`:
  - **L1-L220**: Created the `IndustriesCompaniesSection` component featuring:
    - Warm Neutral `#EDE7E3` background with subtle upper and lower dividing borders.
    - Centered section header: *"For Industries & Companies."* with eyebrow pill *"Enterprise & Corporate Procurement"* and concise narrative copy.
    - 6 core African industrial and corporate verticals (Manufacturing & Heavy Industry, Energy & Infrastructure, Banking & Fintech, Telecoms & Logistics, Agribusiness & Processing, Commercial Real Estate & Facilities) with specific capability tags.
    - Dedicated B2B governance and compliance card highlighting pre-screening, escrow milestone billing, dedicated account managers, and local labor compliance.
    - Clean conversion CTAs (*"Contact Enterprise Solutions"* linking to `/contact` and *"Explore All Sectors"* linking to `/categories`).
- `src/app/page.tsx`:
  - **L10**: Imported `IndustriesCompaniesSection`.
  - **L33**: Rendered `<IndustriesCompaniesSection />` directly below `<ArtisansProfessionalsSection />`.

## Commit Draft - Short
`feat(home): add industries and companies section with warm neutral background`

## Commit Draft - Long
`feat(home): add industries and companies section with warm neutral background

- Created IndustriesCompaniesSection positioned directly after ArtisansProfessionalsSection
- Styled with brand Warm Neutral background (#EDE7E3) to break the white background rhythm
- Avoided unnecessary AI icons or futuristic noise, prioritizing authentic enterprise sectors and capabilities
- Added 6 key industrial verticals with concrete service tags
- Added enterprise compliance and governance trust card for B2B procurement
- Provided clear enterprise contact and category exploration CTAs`

---

## Update: Dark Brand Background & Extreme Right Skyscrapers Architecture (2026-10-21)

### Date
2026-10-21

### Summary
Redesigned the Industries & Companies section (`IndustriesCompaniesSection`) according to updated specifications:
1. **Dark Brand Background**:
   - Swapped the background to a deep corporate dark brand slate (`#1E293B`, extending `--color-brand-dark`) with subtle atmospheric ambient backlighting.
2. **Left-Aligned Text Architecture**:
   - Structured the content to start from the left side (`lg:col-span-6`):
     - Enterprise eyebrow badge with shield icon.
     - Bold headline: *"For Industries & Companies."* with Sky Blue accent.
     - Concise executive narrative copy describing workforce scaling and SLA contracts.
     - Two key corporate trust checkpoints (Pre-vetted African specialists, Standardized corporate SLAs).
     - Call to action buttons styled in brand colors against the dark background:
       - Primary CTA: Ocean Blue `#489FB5` (*"Contact Enterprise Solutions"* linking to `/contact`).
       - Secondary CTA: Clean slate/white border (*"Learn more"* linking to `/categories`).
3. **Extreme Right Skyscraper Architecture**:
   - Positioned modern glass corporate skyscraper buildings on the extreme right (`lg:col-span-6`), rising tall with reflective facades.
   - Applied a seamless gradient fade from the dark background on the left of the image for a smooth editorial transition.

### Modifications
- `src/app/component/parts/industriesCompaniesSection.tsx`:
  - **L1-L165**: Redesigned layout to 2-column asymmetric grid (left-aligned content + extreme right skyscraper image), applied dark theme (`#1E293B`), and styled CTAs with brand colors.
- `public/image/skyscrapers-cluster.jpg`:
  - Added high-resolution architectural photography of modern corporate glass skyscraper buildings.

### Commit Draft - Short
`feat(home): redesign industries & companies section with dark brand background and skyscraper visual`

### Commit Draft - Long
`feat(home): redesign industries & companies section with dark brand background and skyscraper visual

- Applied deep dark brand background (#1E293B) with subtle ambient glow
- Left-aligned title, narrative copy, and dual conversion CTAs
- Arranged modern corporate glass skyscrapers visual on the extreme right with seamless gradient edge blending
- Styled primary CTA in brand Ocean Blue (#489FB5) and secondary CTA in clean slate outline for high contrast on dark surface`

---

## Update: Minimalist Refinement with Transparent Skyscraper PNG (2026-10-21)

### Date
2026-10-21

### Summary
Streamlined the Industries & Companies section (`IndustriesCompaniesSection`) to focus strictly on essential elements:
1. **Updated Image Asset**: Swapped the right-side visual to the user-provided transparent PNG image (`/image/corporate-skyscrapers.png`), letting modern skyscrapers stand cleanly with realistic bottom drop shadows without artificial image frames or borders.
2. **Removed Clutter**:
   - Removed the eyebrow badge text and shield icon (`Enterprise & Corporate Solutions`).
   - Removed the checkmark trust bullets (`Pre-vetted African specialists` and `Standardized corporate SLAs`).
   - Removed the secondary *"Contact Enterprise Solutions"* button.
3. **Core Element Focus**:
   - Retained the strong left-aligned headline (*"For Industries & Companies."*).
   - Retained the concise executive descriptive narrative.
   - Featured the *"Learn more"* button prominently as the primary conversion CTA with brand Ocean Blue (`var(--color-brand-primary)` / `#489FB5`), hover feedback, and directional arrow icon.

### Modifications
- `src/app/component/parts/industriesCompaniesSection.tsx`:
  - **L4**: Cleaned up Lucide icon imports, keeping only `ArrowRight`.
  - **L71-L97**: Simplified left column to solely headline, description, and primary *"Learn more"* CTA.
  - **L104-L113**: Rendered transparent PNG `/image/corporate-skyscrapers.png` with bottom-right alignment and soft depth drop-shadow.

### Commit Draft - Short
`refactor(home): streamline industries section to headline, description, learn more CTA, and PNG skyscrapers`

### Commit Draft - Long
`refactor(home): streamline industries section to headline, description, learn more CTA, and PNG skyscrapers

- Swapped visual to corporate-skyscrapers.png transparent cutout with bottom-right alignment
- Removed eyebrow badge, trust bullet points, and contact button
- Retained headline, description, learn more button, and skyscraper visual
- Styled 'Learn more' as the prominent primary CTA using brand Ocean Blue`

---

## Update: Reduce Section Height and Compact Layout (2026-10-21)

### Date
2026-10-21

### Summary
Reduced the excessive vertical height of the Industries & Companies section (`IndustriesCompaniesSection`) to create a tighter, more balanced, and compact presentation that harmonizes with adjacent homepage sections:
1. **Vertical Padding Reduction**: Reduced section vertical padding from `py-14 sm:py-18 lg:py-24` down to `py-8 sm:py-10 lg:py-12`, eliminating ~96px of unnecessary empty space.
2. **Skyscraper Image Container Proportions**: Scaled down the right-hand skyscraper image container from `h-[300px] sm:h-[380px] md:h-[440px] lg:h-[480px] xl:h-[520px]` to `h-[180px] sm:h-[220px] md:h-[250px] lg:h-[280px] xl:h-[300px]` with `max-w-[460px]`, reducing vertical container height by over 200px while maintaining the skyscraper illustration clarity.
3. **Typography & Spacing Tightening**:
   - Adjusted headline font scale to `text-2xl sm:text-3xl lg:text-[2.25rem] xl:text-[2.5rem]` and bottom margin from `mb-4 sm:mb-5` to `mb-3 sm:mb-3.5`.
   - Reduced description paragraph bottom margin from `mb-8 sm:mb-9` to `mb-5 sm:mb-6`.
   - Compacted CTA button padding to `px-5 py-2.5 sm:px-6 sm:py-3`.
   - Scaled ambient glow background blur to `w-80 h-80` to match the tighter dimensions.

### Modifications
- `src/app/component/parts/industriesCompaniesSection.tsx`:
  - **L53**: Reduced section padding from `py-14 sm:py-18 lg:py-24` to `py-8 sm:py-10 lg:py-12`.
  - **L56**: Scaled ambient glow size from `w-[36rem] h-[36rem]` to `w-80 h-80`.
  - **L60**: Decreased grid gap to `gap-6 lg:gap-8 xl:gap-10`.
  - **L74-L82**: Compacted headline typography and margin.
  - **L85-L90**: Compacted paragraph spacing.
  - **L96**: Compacted CTA button padding.
  - **L109**: Reduced right image container height from up to 520px down to `h-[180px] sm:h-[220px] md:h-[250px] lg:h-[280px] xl:h-[300px]`.

### Commit Draft - Short
`style(home): reduce industries and companies section height and compact layout`

### Commit Draft - Long
`style(home): reduce industries and companies section height and compact layout

- Decreased vertical padding from py-14/py-24 to py-8/py-12
- Scaled skyscraper image container height down from max 520px to 300px
- Tightened headline, paragraph margins, and CTA button padding
- Scaled ambient background glow to match compact dimensions`

---

## Update: Ultra-Compact Height, Clipped Skyscraper Base & Sky Blue Hover State (2026-10-21)

### Date
2026-10-21

### Summary
Further optimized the Industries & Companies section (`IndustriesCompaniesSection`) to be ultra-compact, clipped the bottom base of the skyscraper image so rooftop machinery is hidden, and corrected the CTA button hover state:
1. **Ultra-Compact Section Height**:
   - Reduced vertical section padding to `py-5 sm:py-6 lg:py-8`.
   - Scaled down heading typography to `text-xl sm:text-2xl md:text-3xl lg:text-[2.1rem] xl:text-[2.35rem]` with `mb-2 sm:mb-2.5`.
   - Compacted body narrative copy to `text-xs sm:text-sm lg:text-[0.95rem]` with `mb-4 sm:mb-5`.
2. **Skyscraper Image Bottom Clipped Inside**:
   - Enclosed the skyscraper visual inside an `overflow-hidden` outer wrapper (`h-[130px] sm:h-[155px] md:h-[175px] lg:h-[195px] xl:h-[210px]`).
   - Anchored the inner skyscraper artwork (`h-[200px] sm:h-[240px] md:h-[270px] lg:h-[300px] xl:h-[320px]`) to the top (`object-top lg:object-right-top`).
   - The lower rooftop mechanical units and horizontal cut-off at the base of the image are cleanly clipped inside and not revealed, while preserving the soaring towers and glass architecture.
   - Added a subtle bottom gradient mask (`bg-gradient-to-t from-[#1E293B] to-transparent`) for an imperceptible transition.
3. **CTA Button Hover State Correction**:
   - Replaced hardcoded muddy teal hex `hover:bg-[#367F92]` with the official Sky Blue brand accent token (`var(--color-brand-secondary)` / `#82C0CC`) and deep slate text (`hover:text-[#1E293B]`).
   - Coordinated the arrow icon with `group-hover:text-[#1E293B] group-hover:translate-x-0.5`.
   - Creates vibrant contrast against the dark `#1E293B` background and matches the Sky Blue "Industries" headline accent.

### Modifications
- `src/app/component/parts/industriesCompaniesSection.tsx`:
  - **L53**: Decreased section padding to `py-5 sm:py-6 lg:py-8`.
  - **L56**: Scaled ambient glow to `w-64 h-64`.
  - **L74-L82**: Compacted headline typography and margin.
  - **L85-L90**: Compacted paragraph typography and margin.
  - **L94-L101**: Updated CTA button hover styling to Sky Blue `hover:bg-[var(--color-brand-secondary)] hover:text-[#1E293B]` and coordinated icon interaction.
  - **L109-L122**: Re-architected skyscraper visual container with `overflow-hidden` clipping outer height and taller top-anchored inner image so bottom rooftops are not revealed.

### Commit Draft - Short
`style(home): ultra-compact industries section, clip skyscraper base, and fix CTA hover color`

### Commit Draft - Long
`style(home): ultra-compact industries section, clip skyscraper base, and fix CTA hover color

- Decreased section padding to py-5 sm:py-6 lg:py-8 for ultra-compact vertical footprint
- Clipped bottom rooftop machinery of corporate-skyscrapers.png inside an overflow-hidden wrapper
- Replaced murky teal hover hex (#367F92) with brand Sky Blue token (#82C0CC) and dark slate text
- Coordinated arrow icon hover color and micro-interaction`

---

## Update: Bottom Alignment of Skyscraper Image & Hide Requested Homepage Sections (2026-10-21)

### Date
2026-10-21

### Summary
1. **Industries & Companies Skyscraper Image Bottom Alignment**:
   - Replaced vertical centering (`items-center`) with bottom alignment (`grid items-end`) on the section grid.
   - Anchored the right skyscraper visual firmly to the bottom of the section with `self-end -mb-5 sm:-mb-6 lg:-mb-8`. The skyscrapers now rise directly from the bottom border of the section instead of floating vertically in the middle.
   - Retained `self-center` on the left text column to maintain balanced vertical padding around the narrative copy and CTA button.
2. **Hidden Homepage Sections**:
   - Commented out the imports and rendering of three sections from `src/app/page.tsx`:
     - `ImpressedServiceSection` (containing "...ON TASA").
     - `AfricanTalent` (containing "Diverse Talents & Services").
     - `WhyChooseTasa` (section immediately following "Diverse Talents & Services").
   - Resulted in a direct, streamlined homepage flow from "For Industries & Companies" into "Student Enrollment" (`StudentCTA`).

### Modifications
- `src/app/component/parts/industriesCompaniesSection.tsx`:
  - **L60**: Changed grid alignment to `grid items-end`.
  - **L68**: Set `self-center py-2 sm:py-3` on the left text column.
  - **L106**: Applied `self-end -mb-5 sm:-mb-6 lg:-mb-8` on the right skyscraper visual column.
- `src/app/page.tsx`:
  - **L9-L11**: Commented out unused imports for `ImpressedServiceSection`, `AfricanTalent`, and `WhyChooseTasa`.
  - **L38-L42**: Commented out rendering of `<ImpressedServiceSection />`, `<AfricanTalent />`, and `<WhyChooseTasa />`.

### Commit Draft - Short
`style(home): align skyscraper image to bottom and hide legacy homepage sections`

### Commit Draft - Long
`style(home): align skyscraper image to bottom and hide legacy homepage sections

- Changed skyscraper image container from vertical center alignment to bottom-aligned flush with section border
- Kept left text content balanced with self-center in the grid
- Hidden ImpressedServiceSection ("On TASA..."), AfricanTalent ("Diverse Talents & Services"), and WhyChooseTasa on homepage`




