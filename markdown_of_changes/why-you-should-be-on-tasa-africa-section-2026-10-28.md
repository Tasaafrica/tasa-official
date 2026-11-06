# Why You Should Be On Tasa Africa Section (2026-10-28)

## Date
2026-10-28

## Summary
Created and integrated a new high-impact section titled **"Why you should be on Tasa Africa"** positioned on the homepage directly above the footer:
1. **Visual Frame & Styling (Consistent with Student CTA)**:
   - Built with the dark slate navy container frame (`bg-[#1E293B]`, `border border-slate-700/60`, `rounded-2xl lg:rounded-3xl`, `shadow-2xl`) and ambient brand glow effects (`bg-[var(--color-brand-primary)]/15` and `bg-[var(--color-brand-secondary)]/10`).
   - Outer container has top padding and `overflow-visible` to support vertical visual breakouts.
2. **Breakout Woman Centerpiece (`woman-pointing-forward.png`)**:
   - Centered horizontally (`left-1/2 -translate-x-1/2`) with the bottom touching the bottom border of the frame (`bottom-0`, `align-bottom block`).
   - Sized taller than the container (`h-[530px] xl:h-[580px]` against a ~460px-500px card) so her head sticks out beyond the upper border of the frame.
   - On mobile/tablet, visual is centered at the bottom touching the bottom border cleanly.
3. **Flanking Editorial Layout & Value Pillars**:
   - **Left Column**: Eyebrow badge ("Built for Africa's Brightest"), main headline ("Why you should be on Tasa Africa"), narrative copy, and dual action CTAs ("Join Tasa Africa" and "Explore Talents").
   - **Right Column**: 3 value pillars with icons and glass cards:
     1. *Milestone Escrow Protection* (ShieldCheck)
     2. *Pan-African & Global Reach* (Globe)
     3. *Verified African Excellence* (CheckCircle2)
4. **Homepage Integration**:
   - Registered and placed `<WhyBeOnTasaSection />` in `src/app/page.tsx` right before `<FooterLinksSection />`.

## Modifications
- `src/app/component/parts/whyBeOnTasaSection.tsx`:
  - **L1-L245**: Created the new component featuring responsive desktop breakout and mobile-optimized layouts with Framer Motion animations.
- `src/app/page.tsx`:
  - **L15**: Imported `WhyBeOnTasaSection`.
  - **L53-L56**: Rendered `<WhyBeOnTasaSection />` directly before `<FooterLinksSection />`.

## Commit Draft - Short
`feat(home): add Why You Should Be On Tasa Africa breakout section before footer`

## Commit Draft - Long
`feat(home): add Why You Should Be On Tasa Africa breakout section before footer

- Created WhyBeOnTasaSection using the #1E293B dark frame styling consistent with StudentCTA
- Positioned woman-pointing-forward.png in the center with bottom touching container border and head sticking out beyond top border
- Implemented flanking left copy and right 3-pillar value cards with escrow, global reach, and verified excellence
- Added responsive mobile layout with bottom-anchored visual
- Integrated section into page.tsx directly before the footer`

---

## Update: Bolder Headline, Left Lower Shadow & "FIND OUT WHY" Audience Links (2026-10-28)

### Date
2026-10-28

### Summary
Enhanced `WhyBeOnTasaSection` with bolder typography, directional shadow effects, and dedicated audience exploration links:
1. **Bolder Headline**:
   - Scaled display typography to `text-3xl sm:text-4xl lg:text-[2.65rem] xl:text-[3.15rem]` with `font-extrabold tracking-[-0.035em]`, placing *"Tasa Africa"* on a prominent separate line in Sky Blue (`text-[var(--color-brand-secondary)]`).
2. **Left-Hand Lower Shadow on Visual**:
   - Applied a directional drop-shadow towards the lower-left (`drop-shadow-[-28px_32px_40px_rgba(0,0,0,0.7)]`) paired with an ambient lower-left shadow pool (`w-64 h-36 bg-black/65 blur-3xl -left-12 bottom-2`) to ground the woman figure authentically against the frame.
3. **"FIND OUT WHY" Audience Navigation**:
   - Replaced generic pillars on the right with an interactive audience directory:
     - *FIND OUT WHY* (tracking-widest uppercase header)
     - **Business & Enterprise Leaders** (`/industries`)
     - **Creatives** (`/creatives`)
     - **Artisans & Professionals** (`/professionals`)
     - **Student Talents** (`/students`)
   - Styled each item as an interactive glass card with hover translation and arrow icons.

### Modifications
- `src/app/component/parts/whyBeOnTasaSection.tsx`:
  - **L8-L27**: Defined `AUDIENCE_CATEGORIES` pointing to `/industries`, `/creatives`, `/professionals`, and `/students`.
  - **L82-L91**: Increased headline size, line-height, and weight.
  - **L118-L151**: Integrated the "FIND OUT WHY" navigation list in place of previous pillar cards on desktop.
  - **L153-L170**: Added lower-left drop shadow and ambient shadow pool to the centered visual.
  - **L180-L240**: Mirrored the bolder headline and "FIND OUT WHY" navigation cards into the mobile layout.

### Commit Draft - Short
`feat(home): bolder headline, left lower shadow, and audience links on whyBeOnTasaSection`

### Commit Draft - Long
`feat(home): bolder headline, left lower shadow, and audience links on whyBeOnTasaSection

- Increased headline scale and presence with font-extrabold and dedicated line for Tasa Africa
- Added lower-left directional shadow and ambient pool behind woman-pointing-forward.png
- Added FIND OUT WHY audience navigation to the right for Business, Creatives, Artisans & Professionals, and Students`

---

## Update: Overlay "FIND OUT WHY" Links Directly On Woman Visual (2026-10-28)

### Date
2026-10-28

### Summary
Adjusted the desktop layout in `WhyBeOnTasaSection` so the right-hand **"FIND OUT WHY"** navigation cards overlay directly on the woman image:
1. **Layering & Z-Index Rebalance**:
   - Elevated the Right Column from `z-20` to `z-40` with `pointer-events-auto` so all cards float in front of the woman graphic.
   - Sized the visual centerpiece at `z-20` with `pointer-events-none`.
2. **Inward Grid Shift & Overlap**:
   - Adjusted column grid positioning to start at `lg:col-start-7 xl:col-start-8` (`col-span-6 xl:col-span-5`), overlapping the right side of the woman cutout.
   - Preserved clear visibility for the woman's head, face, and forward-pointing hand in the center space (cols 5–6).
3. **Glassmorphism Backdrop**:
   - Enhanced the link cards with `bg-[#1E293B]/85 backdrop-blur-md border border-slate-600/70 shadow-lg` for readable, high-contrast overlay presentation.

### Modifications
- `src/app/component/parts/whyBeOnTasaSection.tsx`:
  - **L114-L149**: Reconfigured grid to start at `col-start-7`, elevated z-index to `z-40`, applied frosted glass blur backdrop, and reduced spacer.
  - **L151-L167**: Positioned centerpiece at `z-20` underneath the interactive overlay cards.

### Commit Draft - Short
`style(home): overlay right-hand audience links on whyBeOnTasaSection visual`

### Commit Draft - Long
`style(home): overlay right-hand audience links on whyBeOnTasaSection visual

- Adjusted right-hand audience column to start at col-start-7 (z-40) directly overlapping the woman graphic
- Applied frosted glass background (bg-[#1E293B]/85 backdrop-blur-md) with slate-600 borders for high contrast
- Maintained clear center headroom for the woman's head and forward pointing gesture`

---

## Update: Transparent Glass Blurry Background, No Hover States & Zero Left Overlap (2026-10-28)

### Date
2026-10-28

### Summary
Refined `WhyBeOnTasaSection` per user feedback:
1. **Zero Left-Hand Overlap**:
   - Strictly bounded the left copy container (`w-[36%] max-w-[360px] xl:max-w-[400px]`) and positioned the woman centerpiece at `left-[56%] xl:left-[55%] -translate-x-1/2` so the left-hand text, heading, and CTAs never touch or overlap the woman figure.
2. **Transparent Frosted Glass Styling**:
   - Converted the right-hand "FIND OUT WHY" links into transparent frosted glass pills using `bg-white/[0.08] backdrop-blur-md border border-white/15 shadow-sm` across desktop and mobile.
3. **Removed Hover States**:
   - Completely stripped all hover background shifts, hover border color changes, hover translations, and group-hover states, keeping the links in a steady, elegant transparent glass aesthetic.

### Modifications
- `src/app/component/parts/whyBeOnTasaSection.tsx`:
  - **L64-L108**: Replaced 12-column grid with a flex layout bounding the left text to 36% width to eliminate all overlap with the woman.
  - **L110-L149**: Applied `bg-white/[0.08] backdrop-blur-md border border-white/15` and removed all hover transitions and transforms.
  - **L151-L168**: Fine-tuned woman positioning to `left-[56%] xl:left-[55%]` to balance space between the clear left copy and the overlaid right glass links.
  - **L185-L215**: Updated mobile layout with the same transparent glass blur and removed hover states.

### Commit Draft - Short
`style(home): transparent glass blur on audience links and eliminate left text overlap`

### Commit Draft - Long
`style(home): transparent glass blur on audience links and eliminate left text overlap

- Strictly constrained left-hand text column width to prevent any overlap on the woman graphic
- Converted right-hand audience links to transparent frosted glass (bg-white/[0.08] backdrop-blur-md border border-white/15)
- Removed all hover transitions and state shifts for a clean, stable glass appearance`

---

## Update: Bolder Headline, Direct Section Background for "FIND OUT WHY" & Brand Teal Arrow Hover (2026-10-29)

### Date
2026-10-29

### Summary
Applied targeted styling adjustments to `WhyBeOnTasaSection`:
1. **Boldened Headline**:
   - Scaled the main heading typography to `text-3xl sm:text-4xl lg:text-[2.85rem] xl:text-[3.35rem]` with `font-black leading-[1.08] tracking-[-0.035em]` on desktop, and `text-2xl sm:text-3xl font-black` on mobile.
2. **Direct Background for "FIND OUT WHY"**:
   - Removed the glassmorphic background container and border from *"FIND OUT WHY"*, rendering the tracking-widest text directly on the section's background.
3. **Brand Teal Arrow Hover**:
   - Added `group-hover:bg-[var(--color-brand-primary)] group-hover:text-white` to the link arrow buttons on both desktop and mobile, lighting up with TASA's signature ocean blue/teal accent while preserving the static frosted glass card backgrounds.

### Modifications
- `src/app/component/parts/whyBeOnTasaSection.tsx`:
  - **L75-L83**: Applied `font-black` and scaled sizes to the desktop headline.
  - **L94-L98**: Stripped glass background classes from the desktop "FIND OUT WHY" header.
  - **L104-L113**: Added `group-hover:bg-[var(--color-brand-primary)] group-hover:text-white` to the link arrow containers.
  - **L147-L175**: Mirrored `font-black` headline, direct "FIND OUT WHY" text, and arrow hover teal states to the mobile view.

### Commit Draft - Short
`style(home): bolden headline, remove FIND OUT WHY glass bg, and add teal arrow hover`

### Commit Draft - Long
`style(home): bolden headline, remove FIND OUT WHY glass bg, and add teal arrow hover

- Scaled headline typography to font-black text-[2.85rem] xl:text-[3.35rem]
- Rendered FIND OUT WHY text directly onto the dark frame background without glass pill wrapping
- Added brand teal hover effect (group-hover:bg-[var(--color-brand-primary)]) to the link arrow icons`





