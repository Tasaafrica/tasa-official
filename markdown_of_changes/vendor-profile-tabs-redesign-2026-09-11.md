# Vendor Profile Tabs & Card Container Removal (2026-09-11)

## Date
2026-09-11

## Summary
Removed the outer container white box styling around the tab navigation bar ("About", "Portfolio", "Reviews"), the "About Me" section, the "Skills & Expertise" section, as well as the Portfolio and Reviews section containers on `VendorsPage.tsx`. The tabs now display as clean, plain-text tab navigation with an active underline indicator, and section content renders cleanly without boxed enclosures. Additionally, portfolio project cards now link directly to project URLs in a new tab without opening an intermediate modal overlay.

## Modifications
- `src/component-pages/VendorsPage.tsx`:
  - **L309-L323**: Replaced boxed tab wrapper (`bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm`) with a clean plain-text tab bar (`border-b border-slate-200`) featuring inline active indicator styling.
  - **L337-L340**: Stripped `bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm` outer card box from the "About Me" section.
  - **L345-L357**: Stripped `bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm` outer card box from the "Skills & Expertise" section.
  - **L371**: Stripped outer card box container from the Recent Work section in the Portfolio tab.
  - **L385-L428**: Updated Portfolio project card items from button elements opening a modal overlay to direct `<a>` link elements targeting `project.link` directly (`target="_blank"`). Added `formatProjectLink` helper to sanitize URLs. Removed modal overlay.
  - **L445, L469**: Stripped outer card box containers from the Overall Rating and Individual Reviews blocks in the Reviews tab.

## Commit Draft - Short
`style(vendor-profile): direct-link portfolio cards and remove tab outer boxes`

## Commit Draft - Long
`feat(vendor-profile): simplify tabs layout and direct-link portfolio project cards`

`Removed heavy background box enclosures from tab navigation buttons and section wrappers in VendorsPage.tsx. Converted portfolio project cards from modal triggers to direct external links opening project URLs in a new tab.`
