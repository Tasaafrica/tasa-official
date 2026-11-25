# How Do You Want to Use Tasa — Onboarding Setup (2026-11-24)

## Date
2026-11-24

## Summary
Created a clean, focused, white-dominant "How do you want to use Tasa?" onboarding flow triggered for new users immediately after account creation and for existing authenticated users who haven't completed their user type categorization:

1. **User Categorization Hierarchy**:
   - **Talent / Vendors (`vendor`)**:
     - **Students**: Students building portfolios, offering skills, and gaining industry experience.
     - **Creatives**: Designers, writers, visual artists, videographers, photographers, and animators.
     - **Professionals**: Consultants, developers, marketers, strategists, accountants, and specialists.
     - **Artisan**: Skilled craftspeople, technicians, builders, makers, and hands-on specialists.
     - **Businesses**: Agencies, studios, registered companies, and service firms offering talent.
   - **Clients (`client`)**:
     - **Businesses**: Companies, startups, and commercial enterprises looking to hire talent.
     - **Individuals**: Private clients, entrepreneurs, and individuals commissioning personal or work projects.
     - **Organisations**: Non-profit organizations, NGOs, academic institutions, and public entities.

2. **Clean Minimalist White-Dominant Design**:
   - Dominant white background (`bg-white`) with subtle, refined borders (`border-slate-200`).
   - Minimal brand color usage: Ocean Blue `#489FB5` (`var(--color-brand-primary)`) for selected state outlines and the primary action button.
   - No unnecessary decorative badges, gamified icons, or competing colors.
   - Clean, focused 2-step stepper: Step 1 (Main Category) → Step 2 (Specific Category Selection) with smooth back navigation.

3. **Global Onboarding State & Lifecycle Management**:
   - Built `OnboardingProvider` wrapped at the root layout level (`src/app/layout.tsx`).
   - Detects whether an authenticated user has filled the onboarding categorization (first checking fast local storage cache, then querying `/api/users/${userId}`).
   - Automatically opens the modal for any new user right after registration/OTP verification as well as existing users missing `userType` / `accountType`.
   - Persists choices via `PUT /api/users/${userId}` and updates the NextAuth session dynamically via NextAuth's `jwt` update trigger.
   - Smoothly routes vendors to `/v/dashboard` and clients to `/c/dashboard`.

## Modifications
- `src/components/onboarding/OnboardingModal.tsx`:
  - **L1-L325**: Created the 2-step modal with Talent/Vendors and Clients categories, subcategories, clean radio selectors, and profile persistence.
- `src/components/providers/OnboardingProvider.tsx`:
  - **L1-L105**: Created global provider checking onboarding status for authenticated users and listening to `tasa:open-onboarding` events.
- `src/app/layout.tsx`:
  - **L10, L136-L142**: Imported and placed `OnboardingProvider` within `SessionProvider` around `AuthModalProvider`.
- `src/lib/auth.ts`:
  - **L168-L184**: Added `trigger === "update"` support to the NextAuth `jwt` callback to update session role dynamically.
- `src/lib/user.ts`:
  - **L4-L14**: Extended `UserData` interface to include `userType`, `accountType`, and `onboardingCompleted`.
- `src/app/component/parts/loginModal.tsx`:
  - **L1208-L1214**: Dispatched `tasa:open-onboarding` immediately upon successful OTP verification and sign-in.

## Commit Draft - Short
`feat(onboarding): add "How do you want to use Tasa" categorization flow for new and existing users`

## Commit Draft - Long
`feat(onboarding): add "How do you want to use Tasa" categorization flow for new and existing users

- Built OnboardingModal with Talent/Vendors (Students, Creatives, Professionals, Artisan, Businesses) and Clients (Businesses, Individuals, Organisations)
- Designed clean, white-dominant cards using brand colors minimally without unnecessary icons or badges
- Created OnboardingProvider in RootLayout to detect missing onboarding status for existing users and post-registration flow
- Added dynamic NextAuth session updating on role change
- Updated UserData types and verified TypeScript compilation with tsc --noEmit (0 errors)`

---

## Update: Remove Hover Effects and Use Slate Border on Step 1 Options (2026-11-24)

### Date
2026-11-24

### Summary
Refined the Step 1 options in `src/components/onboarding/OnboardingModal.tsx`:
1. **Removed Hover Effects**:
   - Removed hover background shifts (`hover:bg-slate-50/50`) and hover border shifts (`hover:border-slate-300`).
   - Removed text color transitions on hover (`group-hover:text-[var(--color-brand-primary)]`).
2. **Changed Selected Border to Slate**:
   - Replaced brand-primary selected border (`border-[var(--color-brand-primary)]`) with solid Slate (`border-slate-800 ring-1 ring-slate-800`).
   - Replaced brand-primary radio indicator with Slate (`border-slate-800 bg-slate-800 text-white`).
   - Kept unselected card borders in clean, subtle `border-slate-200`.

### Modifications
- `src/components/onboarding/OnboardingModal.tsx`:
  - **L233-L298**: Removed hover classes and updated selected border & radio styling to Slate.

### Commit Draft - Short
`style(onboarding): remove hover effects and update option borders to slate on step 1`

### Commit Draft - Long
`style(onboarding): remove hover effects and update option borders to slate on step 1

- Removed hover background and border color shifts on step 1 cards
- Changed selected option borders from brand-primary to slate-800
- Changed radio indicator from brand-primary to slate-800
- Verified TypeScript compilation with tsc --noEmit (0 errors)`

---

## Update: Slate Border for Step 2 and Modal Unpinned (2026-11-24)

### Date
2026-11-24

### Summary
1. **Step 2 Slate Border Alignment**:
   - Updated Step 2 subcategory cards in `src/components/onboarding/OnboardingModal.tsx` to use the same Slate border styling as Step 1 (`border-slate-800 ring-1 ring-slate-800 bg-slate-50/30`).
   - Replaced brand-primary radio selector indicator with solid Slate (`border-slate-800 bg-slate-800 text-white`).
   - Removed hover jumps to maintain a consistent, solid, and professional feel matching Step 1.
2. **Unpinned Onboarding Modal**:
   - Restored standard production lifecycle in `src/components/providers/OnboardingProvider.tsx`.
   - The modal no longer stays permanently forced open. It now opens conditionally when an authenticated user has not completed onboarding categorization, and can be dismissed or reopened via events/context.

### Modifications
- `src/components/onboarding/OnboardingModal.tsx`:
  - **L320-L355**: Updated Step 2 option cards and radio circles to Slate styling.
- `src/components/providers/OnboardingProvider.tsx`:
  - **L15-L95**: Restored normal conditional lifecycle checking and unpinned `isOpen`.

### Commit Draft - Short
`style(onboarding): apply slate border to step 2 options and unpin modal`

### Commit Draft - Long
`style(onboarding): apply slate border to step 2 options and unpin modal

- Updated Step 2 option cards to use slate-800 border and radio indicator matching Step 1
- Restored standard conditional state checking in OnboardingProvider
- Verified clean build with tsc --noEmit (0 errors)`


---

## Update: Wire Onboarding Modal to /api/auth/onboarding/user-type (2026-11-25)

### Date
2026-11-25

### Summary
Wired the onboarding modal submission directly to the backend endpoint `/api/auth/onboarding/user-type` with the contract payload:
```json
{
  "role": "client",
  "client_type": "business",
  "vendor_type": "student"
}
```
1. Created Next.js API proxy route `/api/auth/onboarding/user-type` that forwards authenticated requests with Bearer tokens to `${NEXT_PUBLIC_API_URL}/api/auth/onboarding/user-type` (handling both POST and PUT methods).
2. Added subtype mappers (`mapVendorSubtype`, `mapClientSubtype`) to convert UI selections into canonical singular values (`student`, `creative`, `professional`, `artisan`, `business`, `individual`, `organisation`).
3. Updated `OnboardingModal.tsx` to dispatch `{ role, client_type, vendor_type }` on submit.
4. Updated `OnboardingProvider.tsx` and `UserData` to recognize `client_type` and `vendor_type` when verifying completion status.

### Modifications
- `src/app/api/auth/onboarding/user-type/route.ts` (NEW):
  - **L1-L115**: Created route handling POST/PUT, extracting session/auth tokens, and forwarding payload to `${NEXT_PUBLIC_API_URL}/api/auth/onboarding/user-type`.
- `src/components/onboarding/OnboardingModal.tsx`:
  - **L25-L65**: Added `mapVendorSubtype` and `mapClientSubtype` mapping to canonical singular values.
  - **L145-L210**: Updated `handleSubmit` to POST to `/api/auth/onboarding/user-type` with `{ role, client_type, vendor_type }`.
  - **L420-L430**: Cleaned footer to only render the Back button when on `step === 2`.
- `src/components/providers/OnboardingProvider.tsx`:
  - **L75-L95**: Updated status check to detect `userData?.client_type` and `userData?.vendor_type`.
- `src/lib/user.ts`:
  - **L11-L12**: Added `client_type` and `vendor_type` to `UserData` interface.

### Commit Draft - Short
`feat(onboarding): wire OnboardingModal to /api/auth/onboarding/user-type endpoint`

### Commit Draft - Long
```text
feat(onboarding): wire OnboardingModal to /api/auth/onboarding/user-type endpoint

- Create Next.js API proxy route /api/auth/onboarding/user-type forwarding to backend with Bearer token
- Map OnboardingModal category selections to canonical singular subtypes (student, creative, professional, artisan, business, individual, organisation)
- Submit payload { role, client_type, vendor_type } upon completing onboarding
- Update OnboardingProvider and UserData interface to check client_type and vendor_type
- Verified clean build with tsc --noEmit (0 errors)
```


---

## Update: Enable Onboarding Modal on Home Page for New and Uncompleted Users & Workspace Redirection (2026-11-25)

### Date
2026-11-25

### Summary
1. **Allowed Onboarding Modal on Home Page**:
   - Removed the home page suppression check (`if (pathname === "/") return;`) in `OnboardingProvider.tsx`.
   - Newly signed up users and existing users who have not yet completed their onboarding categorization will now see the onboarding modal pop up even if they are on the home page.
2. **Targeted Display for Incomplete Users Only**:
   - Users who have already made their selection (`client_type`, `vendor_type`, `userType`, `accountType`, `onboardingCompleted`) will never see the modal pop up.
   - Cleared session dismissal flag upon fresh account creation so new signups always see the modal.
3. **Workspace Redirection**:
   - Once a user selects their categorization on the modal and submits, their selection is saved, completion is permanently cached, and they are redirected immediately to their respective dashboard:
     - Talent/Vendors &rarr; `/v/dashboard` (vendor workspace)
     - Clients &rarr; `/c/dashboard` (client workspace)
4. **Clean Modal Transition**:
   - Sequence-aligned `tasa:open-onboarding` event dispatch in `loginModal.tsx` immediately as the login modal closes to prevent visual overlap.

### Modifications
- `src/components/providers/OnboardingProvider.tsx`:
  - **L30-L55**: Removed home page bypass so new/uncompleted users see the modal regardless of page.
  - **L21-L26, L125-L135**: Cleared session dismissal flag on manual open events.
- `src/app/component/parts/loginModal.tsx`:
  - **L1142-L1146**: Triggered `tasa:open-onboarding` cleanly upon closing `loginModal`.

### Commit Draft - Short
`feat(onboarding): enable onboarding modal on home page for new users and redirect to dashboard`

### Commit Draft - Long
```text
feat(onboarding): enable onboarding modal on home page for new users and redirect to dashboard

- Remove home page suppression in OnboardingProvider so new and uncompleted users can categorize from the home page
- Ensure modal only opens for users without client_type/vendor_type/userType/accountType
- Redirect users upon onboarding completion to /v/dashboard (vendors) or /c/dashboard (clients)
- Prevent completed users from ever seeing the onboarding modal again
- Verified TypeScript compilation with tsc --noEmit (0 errors)
```
