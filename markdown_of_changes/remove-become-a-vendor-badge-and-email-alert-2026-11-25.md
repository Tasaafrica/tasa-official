# Remove Become-a-Vendor Badge & Email Verification Alert

**Date:** 2026-11-25

## Summary
Removed two intrusive UI elements from the global app:
1. The "Become a Vendor" badge/link that appeared in the header nav for client-role users.
2. The email verification warning popup that showed globally on every page.

## Modifications

| File | Lines Affected | Change |
|---|---|---|
| `src/app/component/parts/header.tsx` | ~380–387 | Removed the `{mounted && isAuthenticated && user?.role === "client" && <Link href="/become-a-vendor">Become a Vendor</Link>}` block |
| `src/components/layout/EmailVerificationWrapper.tsx` | Lines 4, 24 | Removed `EmailVerificationAlert` import and `<EmailVerificationAlert />` render |

## Commit Draft — Short
```
chore: remove become-a-vendor badge and email verification alert
```

## Commit Draft — Long
```
Remove two globally visible UI elements that are no longer needed:

1. Header: The "Become a Vendor" pill/badge (shown to client-role
   authenticated users in the desktop nav) has been removed.
   The become-a-vendor page remains accessible but is no longer
   promoted from the header.

2. EmailVerificationWrapper: The <EmailVerificationAlert /> component
   rendered globally on every page is now removed. The
   BackgroundVerificationInitializer is kept (it runs silently in the
   background) but the popup alert UI is no longer rendered.
```
