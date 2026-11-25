# Signup Flow: OTP Verification Before Account Creation & Email Domain Typo Detection

## Date
2026-11-25

## Summary
1. Updated the sign-up stepper flow in `LoginModal` so that email OTP verification occurs immediately after inputting credentials (email and password), before account creation (`credentials` -> `otp` -> `personal` -> account creation). Replaced the outdated post-creation OTP message with a clean verification prompt, added a verified-email status chip on the personal details step, and replaced legacy teal styling with TASA brand colors (Slate `#334155` and Ocean Blue `#489FB5`).
2. Implemented intelligent email domain typo detection and auto-suggestion across the client and server. If a user mistypes their email domain (e.g. `gamil.com`, `gmial.com`, `yaho.com`, `outlok.com`, `hotmial.com`, `iclud.com`, or `.con` TLDs), the UI flags the mistake with an amber highlight, blocks sending OTPs to non-existent addresses, displays an interactive suggestion chip ("Did you mean user@gmail.com? [Fix email]"), and automatically applies the correction upon clicking. Added server-side validation to `/api/otp/send` and `/api/auth/check-email` to reject typo domains.

## Modifications
- `src/lib/email-validator.ts` (NEW):
  - Created standalone email domain validation and typo detection utility.
  - Implemented `POPULAR_DOMAINS` catalog and `COMMON_DOMAIN_TYPOS` lookup dictionary.
  - Implemented `COMMON_TLD_TYPOS` check for common TLD mistakes (e.g., `.con`, `.comm`, `.coom`, `.cpm`, `.vom`, `.ner`, `.ogr`).
  - Added Damerau-Levenshtein distance calculation (accounting for deletions, insertions, substitutions, and adjacent transpositions) to detect typos with edit distance 1.
  - Exported `getEmailDomainSuggestion(email)`, `isEmailDomainTypo(email)`, and `validateEmailDomain(email)`.
- `src/app/component/parts/loginModal.tsx`:
  - Lines 18-21: Imported `EmailDomainSuggestion` and `getEmailDomainSuggestion` from `@/lib/email-validator`.
  - Lines 43-57: Added `.superRefine` rule to `signupSchema` to validate that the email has no domain typos.
  - Lines 185-191: Added `emailDomainSuggestion` state.
  - Lines 285-290: Reset `emailDomainSuggestion` in `resetSignupEmailAvailability`.
  - Lines 360-375: In `verifySignupEmailAvailability`, check for typo domains and return `"invalid"` immediately without querying backend.
  - Lines 455-495: In `scheduleSignupEmailCheck`, detect typos in real time, set suggestion state, and show error message.
  - Lines 525-545: Added `handleSignupEmailBlur` typo check and `handleApplyEmailSuggestion` for 1-click email typo correction.
  - Lines 1060-1070: In `handleSignIn`, include suggestion hint if login fails with invalid credentials.
  - Lines 1305-1320: In `handleSignupNextFromCredentials`, prevent advancing to OTP if a domain typo is present.
  - Lines 1770-1845: In JSX for `signupEmail`, render amber focus ring when suggestion is active, and display an interactive suggestion chip banner with a "Fix email" button right below the input field.
  - Lines 1895-1940: Redesigned Step 2 (OTP) screen with "Verify your email" header, code input, "Change email", and "Resend OTP" button.
  - Lines 1941-1980: Added email verified confirmation badge on Step 3 (Personal), and updated inputs to brand focus rings.
  - Lines 2060-2100: Aligned stepper action buttons with proper step labels ("Next", "Verify Code", "Create Account") and Slate `#334155` styling.
- `src/app/api/otp/send/route.ts`:
  - Lines 2, 28-39: Added server-side validation using `getEmailDomainSuggestion` to reject typo domains with status 400 before attempting to dispatch OTP emails.
- `src/app/api/auth/check-email/route.ts`:
  - Lines 2, 35-48: Added server-side validation using `getEmailDomainSuggestion` to reject typo domains with status 400.
- `src/components/auth/OtpInput.tsx`:
  - Line 66: Replaced `focus:ring-teal-500` with brand Ocean Blue `focus:ring-[#489FB5]`.

## Commit Draft - Short
`feat: add email domain typo detection and OTP verification before signup`

## Commit Draft - Long
```text
feat: add email domain typo detection and OTP verification before signup

- Create email domain validation utility using Damerau-Levenshtein distance and common typo dictionaries
- Flag mistyped domains like 'gamil.com', 'gmial.com', 'yaho.com', 'outlok.com', and '.con' TLDs in real time
- Display interactive 1-click email correction chip ("Did you mean user@gmail.com? [Fix email]")
- Block dispatching OTP emails to typo domains across frontend and backend API endpoints
- Refactor signup stepper flow to credentials -> otp -> personal
- Require OTP email verification prior to creating an account in the database
- Replace legacy teal/mint styling with TASA brand palette (Slate #334155 and Ocean Blue #489FB5)
```
