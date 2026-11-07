# Artisans and Professionals Section Implementation (2026-10-20)

## Date
2026-10-20

## Summary
Created and integrated a new dedicated "Artisans & Professionals Section" (`ArtisansProfessionalsSection`) placed immediately after the Creative Section on the homepage. The section celebrates Africa's elite tier of corporate executives, tech specialists, and certified consultants alongside master craftsmen, custom woodworkers, and skilled fabricators. Features two high-resolution editorial portrait visuals—a stylish African female executive adjusting her eyeglasses with one hand and hand akimbo on her hip (`/image/female-professional.jpg`), and a proud master male artisan in his woodworking studio (`/image/male-artisan.jpg`). The layout includes a concise storytelling narrative, verified trust indicators, specialty tags, interactive card actions, and a talent invitation banner.

## Modifications
- `src/app/component/parts/artisansProfessionalsSection.tsx`:
  - **L1-L276**: Created the new `ArtisansProfessionalsSection` component featuring:
    - Section header with eyebrow badge ("Excellence & Precision"), bold headline ("For the Artisans & Professionals."), and short creative storytelling copy.
    - Responsive 2-column showcase grid pairing female professional and male artisan cards.
    - Verified status badges, floating indicator pills, service specialty tags, and direct CTA buttons.
    - Responsive Framer Motion transitions with reduced motion preference support (`useReducedMotion`).
    - Talent invitation banner connecting certified professionals and artisans to `/become-a-vendor`.
- `public/image/female-professional.jpg`:
  - Added high-resolution editorial portrait of a stylish African female professional adjusting her glasses with hand akimbo.
- `public/image/male-artisan.jpg`:
  - Added high-resolution editorial portrait of a master African male craftsman in his woodworking studio.
- `src/app/page.tsx`:
  - **L9**: Imported `ArtisansProfessionalsSection`.
  - **L30-L32**: Rendered `<ArtisansProfessionalsSection />` directly below `<CreativeSection />`.

## Commit Draft - Short
`feat(home): add artisans and professionals section with dual editorial visuals and narrative`

## Commit Draft - Long
`feat(home): add artisans and professionals section with dual editorial visuals and narrative

- Created ArtisansProfessionalsSection component positioned directly after CreativeSection in page.tsx
- Generated and included two high-resolution editorial portraits: a stylish female executive with glasses and hand akimbo, and a master male artisan in a woodworking workshop
- Added creative narrative contrasting strategic boardroom counsel with physical handcrafted mastery
- Integrated verified trust pills, specialty tags, and dual conversion CTAs
- Styled strictly in accordance with TASA brand design system and responsive layout guidelines`

---

## Update: Simplified Layout & Isolated Transparent Cutout Visuals (2026-10-21)

### Date
2026-10-21

### Summary
Refactored the Artisans & Professionals section (`ArtisansProfessionalsSection`) to mirror the clean, minimal, uncluttered visual rhythm of the Creative Section:
1. **Isolated Transparent Cutouts (No Background)**:
   - Generated and processed isolated PNG cutouts with 100% transparent backgrounds for both featured figures.
   - **Female Professional**: An African corporate executive in a navy tailored blazer stylishly holding eyeglasses with hand akimbo on her hip (`/image/female-professional.png`).
   - **Male Artisan Engineer**: A skilled African field engineer/plumber in navy industrial overalls holding a pipe wrench and toolbox (`/image/male-artisan.png`).
2. **Simplified Layout Architecture**:
   - Replaced heavy boxed card frames with a clean, open 3-column composition directly matching `creativeSection.tsx`.
   - **Left Column (`lg:col-span-3`)**: Bold *"For the Artisans & Professionals."* headline, concise narrative storytelling copy, and primary *"Join as a Talent"* CTA button.
   - **Center Column (`lg:col-span-5`)**: Dual transparent cutout figures floating together seamlessly with subtle ambient drop shadows and soft atmospheric backlight glow.
   - **Right Column (`lg:col-span-4`)**: 3 clean talent highlights (`01 Corporate & Technical Advisory`, `02 Plumbing & Mechanical Engineering`, `03 Construction & Precision Trades`) with sleek left border lines, followed by a *"Learn more"* button linking to categories.

### Modifications
- `public/image/female-professional.png`:
  - Created transparent PNG cutout of the female professional.
- `public/image/male-artisan.png`:
  - Created transparent PNG cutout of the male engineer in overalls holding plumbing tools.
- `src/app/component/parts/artisansProfessionalsSection.tsx`:
  - **L1-L200**: Refactored component layout to match Creative Section architecture with dual floating cutouts, streamlined typography, and minimalist numbered highlights.

### Commit Draft - Short
`refactor(home): align artisans & professionals section with creative section layout and transparent cutouts`

### Commit Draft - Long
`refactor(home): align artisans & professionals section with creative section layout and transparent cutouts

- Replaced enclosed photo cards with clean floating transparent PNG cutouts
- Created female professional cutout (holding glasses, hand akimbo) and male engineer cutout (overalls, plumbing tools)
- Standardized layout to 3-column architecture (left: narrative copy & CTA, center: dual cutouts, right: 3 talent highlights & Learn more button)
- Aligned styling, typography, and atmospheric glow with CreativeSection design tokens`

---

## Update: Centered Layout & Dual Circular Breakout Frames (2026-10-21)

### Date
2026-10-21

### Summary
Redesigned the layout and visual presentation of the Artisans & Professionals section (`ArtisansProfessionalsSection`):
1. **Centered Header & Symmetrical Architecture**:
   - Shifted the main section title (*"For the Artisans & Professionals."*) and narrative description to be horizontally centered at the top of the section.
   - Positioned the two featured showcase visuals side-by-side horizontally at the center of the section with subtle, balanced spacing between them.
2. **Female Professional Breakout Frame**:
   - Integrated the user's transparent cutout `/image/female-professional.png`.
   - Placed a circular frame behind her core/torso filled with brand Sky Blue (`var(--color-brand-secondary)`) without any border color.
   - Sized the circular frame proportionally (`w-[68%]` diameter) so that multiple parts of her body break out dramatically past the frame—her head and glasses at the top, both arms and elbows on the sides, and lower body.
3. **Male Artisan Custom Breakout Frame**:
   - Restored the original master woodworker editorial portrait in his woodworking workshop.
   - Implemented a custom 3D out-of-bounds breakout circular graphic (`/image/male-artisan-breakout.png`): the circular frame captures the established workshop background, tools, workbench, and blue apron, while his head, hair, and neck break out above the circular frame against a transparent background, seamlessly connecting with the body inside the circle.
4. **Talent Highlights & Conversion CTAs**:
   - Positioned the 3 skill highlights (`01 Corporate & Technical Advisory`, `02 Plumbing & Mechanical Engineering`, `03 Construction & Precision Trades`) in a responsive 3-column row below the visual frames.
   - Centered dual conversion CTA buttons (*"Join as a Talent"* and *"Explore Services"*) at the bottom of the section.

### Modifications
- `src/app/component/parts/artisansProfessionalsSection.tsx`:
  - **L84-L215**: Restructured layout to centered column hierarchy; implemented dual side-by-side circular breakout frames; aligned typography and CTAs.
- `public/image/male-artisan-breakout.png`:
  - Created composite image capturing the woodworking studio inside a circular frame with head breakout and transparent outer alpha channel.

### Commit Draft - Short
`feat(home): center artisans & professionals section with dual circular breakout frames`

### Commit Draft - Long
`feat(home): center artisans & professionals section with dual circular breakout frames

- Horizontally centered section title and narrative copy at the top
- Positioned artisan and professional circular frames side by side at center with clean spacing
- Applied breakout frame effect for female professional with reduced circular brand disc (no border)
- Created male-artisan-breakout.png preserving workshop background within the circular frame with head and neck breakout above
- Arranged 3 skill highlight cards in a 3-column responsive grid below the visual showcase
- Centered dual action CTAs (Join as a Talent & Explore Services) for unified flow`

---

## Update: Aligned Female Professional Breakout Frame (2026-10-21)

### Date
2026-10-21

### Summary
Resolved the framing alignment for the Female Professional so she is properly nested inside the circular frame rather than detached or floating outside it:
1. **Perfected Circular Framing & Breakout Geometry**:
   - Created `/image/female-professional-breakout.png` matching the exact canvas dimension (1024x1024), circle radius ($R=390\text{px}$), center coordinate, and baseline of the Male Artisan graphic.
   - Her tailored corporate suit, white blouse, and waist/hips are cleanly anchored inside the Sky Blue circular frame (`#82C0CC`, no border) with her trousers curving naturally along the lower perimeter.
   - Her head, glasses, braided hair, and hand adjusting her glasses break out over the top rim of the circular frame into the transparent page background.
2. **Preserved Artisan Graphic**:
   - Retained `/image/male-artisan-breakout.png` without any modifications per user instructions.
3. **Component Integration**:
   - Updated `artisansProfessionalsSection.tsx` to render `female-professional-breakout.png`, ensuring perfect visual symmetry, diameter, and baseline alignment with the artisan card.

### Modifications
- `public/image/female-professional-breakout.png`:
  - Created composite graphic with Sky Blue circular frame, anchored lower body, and top breakout.
- `src/app/component/parts/artisansProfessionalsSection.tsx`:
  - **L139-L155**: Swapped professional image container to cleanly render `female-professional-breakout.png`.

### Commit Draft - Short
`fix(home): anchor female professional within circular breakout frame`

### Commit Draft - Long
`fix(home): anchor female professional within circular breakout frame

- Created female-professional-breakout.png with matched 1024x1024 dimensions and aligned circular frame
- Anchored female professional's suit and lower body inside the Sky Blue brand frame (no border)
- Allowed head, eyeglasses, and upper shoulders to pop out above the top edge
- Preserved male-artisan-breakout.png without any changes
- Maintained symmetrical side-by-side layout at center`

---

## Update: Remove Highlight Boxes & Rename CTA Button (2026-10-21)

### Date
2026-10-21

### Summary
Cleaned up and streamlined the Artisans & Professionals section (`ArtisansProfessionalsSection`):
1. **Removed Talent Highlight Boxes**:
   - Removed the 3-column talent highlight boxes (`TALENT_HIGHLIGHTS`) to give the section an uncluttered, focused editorial feel.
   - Removed unused icons (`Briefcase, Wrench, Hammer`) and unused array definition.
2. **Updated CTA Label**:
   - Renamed the second action button from *"Explore Services"* to *"Learn more"*, directly linking to `/categories`.

### Modifications
- `src/app/component/parts/artisansProfessionalsSection.tsx`:
  - **L4**: Cleaned up icon imports to only import `ArrowRight`.
  - **L12-L34**: Removed `TALENT_HIGHLIGHTS` constant.
  - **L135-L165**: Removed the 3 highlight cards and updated the CTA button label to *"Learn more"*.

### Commit Draft - Short
`refactor(home): streamline artisans & professionals section and update CTA to learn more`

### Commit Draft - Long
`refactor(home): streamline artisans & professionals section and update CTA to learn more

- Removed the 3 talent highlight boxes to create a cleaner visual hierarchy
- Updated the secondary action button text from Explore Services to Learn more
- Cleaned up unused Lucide icons and array constants`

---

## Update: Replace Dual Breakout Images with Female Professional Visual (2026-10-28)

### Date
2026-10-28

### Summary
Replaced the dual circular breakout imagery (male artisan + female professional) on the homepage's Artisans & Professionals section (`ArtisansProfessionalsSection`) with the unified `/image/female professional.png` centerpiece:
1. **Unified Visual Focus**:
   - Removed the dual-circle layout (`male-artisan-breakout.png` and `female-professional-breakout.png`).
   - Integrated the high-resolution transparent PNG `/image/female%20professional.png` (1200x896) as a centered centerpiece.
   - Preserved a soft atmospheric glow aura (`rounded-3xl blur-2xl`) and realistic drop shadow (`drop-shadow-[0_16px_36px_rgba(51,65,85,0.14)]`).
2. **Clean Typography & Routing**:
   - Maintained clean responsive layout with the "Join as a Talent" and "Learn more" (pointing to `/professionals`) CTAs centered beneath the visual.

### Modifications
- `src/app/component/parts/artisansProfessionalsSection.tsx`:
  - **L93-L111**: Replaced the dual image grid with the centered `<Image src="/image/female%20professional.png" ... />` container with atmospheric backing.

### Commit Draft - Short
`feat(home): replace dual circular breakout images with female professional centerpiece`

### Commit Draft - Long
`feat(home): replace dual circular breakout images with female professional centerpiece

- Replaced male artisan and female professional circular breakout cutouts with the unified transparent female professional PNG visual
- Added soft ambient background aura and shadow to elevate visual hierarchy
- Updated link destination for the learn more CTA to /professionals`


