# Vendor Registration Updates - April 30, 2026

## Summary
Fixed vendor registration form by removing unused fields, updating API payload structure, adding validation for custom skills, and implementing toast notifications.

## Changes Made

### 1. Form Cleanup (src/app/vendor/page.tsx)

#### Removed Unused Fields
- **FormData Interface**: Removed personal info, business info, and bio fields
  - Removed: `firstName`, `lastName`, `email`, `phone`, `password`, `confirmPassword`
  - Removed: `businessName`, `businessType`, `experience`, `location`
  - Removed: `bio`
  - Kept: `skills`, `skillTypes`, `skillIds`, `agreeToTerms`, `agreeToMarketing`

#### Removed Unused State Variables
- Removed `showPassword` and `showConfirmPassword` state variables

#### Removed Unused Imports
- Removed icon imports: `User`, `Mail`, `Phone`, `MapPin`, `Eye`, `EyeOff`, `Check`
- Kept: `Briefcase`, `Star`, `ArrowRight`, `BadgeCheck`, `Clock3`, `Rocket`, `ShieldCheck`, `Sparkles`, `TrendingUp`

#### Updated Validation
- Removed validation for deleted fields from `validateForm()`
- Kept validation for: category, skills, skill types, core skills limit, terms agreement

### 2. API Payload Updates

#### Peripheral Skills Structure
- Changed from array of objects to array of skill IDs
- **Before**: `[{ skillId: "xxx", label: "React" }]`
- **After**: `["xxx"]`
- Both `coreSkillIds` and `peripheralSkills` are now arrays of skill IDs

### 3. Custom Skills Validation

#### Prevent Core Skill Assignment
- **UI Validation**: Disabled "Core" option in skill type dropdown for custom skills (skills without skillIds)
- **Backend Validation**: Added check in `handleSkillTypeChange()` to prevent custom skills from being set as "core"
- Error message: "Custom skills cannot be set as core skills."

#### Prevent Duplicate Skills
- Added check in `handleAddCustomSkill()` to prevent adding skills that already exist in `availableSkills`
- Compares both `name` and `slug` fields (case-insensitive)
- Error message: `"Skill Name" already exists in the available skills list. Please select it from the list instead."

### 4. Toast Notifications

#### Added Sonner Toast Library
- Imported `toast` and `Toaster` from `sonner`
- Added `<Toaster />` component to JSX

#### Success Notification
- Shows "Registration successful! Redirecting to dashboard..." on successful registration
- Uses `toast.success()`

#### Error Notification
- Shows error message from API response on registration failure
- Uses `toast.error()`

### 5. Dashboard Redirect

#### Updated Redirect URL
- Changed from `/vendor/dashboard` to external dashboard URL
- **Production**: `https://dash.tasa.com.ng`
- **Development**: `http://localhost:5173`
- Matches the URL used in UserProfile component

### 6. Debug Logging

#### Added Console Logs
- Logs vendor registration payload (JSON formatted)
- Logs user ID
- Logs whether auth token is present or missing
- Helps debug 500 Internal Server Error issues

## Files Modified
- `src/app/vendor/page.tsx`

## Testing Notes
- Registration button now works when terms are checked and form validations pass
- Custom skills cannot be set as core skills
- Duplicate skills from API list cannot be added as custom skills
- Toast notifications provide feedback on registration status
- Redirects to external dashboard on success
