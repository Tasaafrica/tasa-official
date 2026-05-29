# Role-Based Routing Implementation

**Date:** May 3, 2026  
**Type:** Feature  
**Files Modified:** 2 files created, 3 directories created

## Changes Made

### Created Files

- `src/app/[role]/layout.tsx` - Role-based layout with authentication and validation
- `src/app/[role]/page.tsx` - Role-based redirect page

### Created Directories

- `src/app/[role]/client/` - Client-specific pages directory
- `src/app/[role]/vendor/` - Vendor-specific pages directory
- `src/app/[role]/components/` - Shared components directory

## Implementation Details

### Role Mapping

The system uses two mapping constants to handle the distinction between URL parameters and user roles:

- **URL Parameters (short codes):** `c` (client), `v` (vendor)
- **User Roles (from API):** `client`, `vendor`
- **Final URLs:** `/c/dashboard`, `/v/dashboard`

```typescript
// Map URL role parameter to full user role
const urlParamToRole: Record<string, string> = {
  c: "client",
  v: "vendor",
};

// Map full user role to URL parameter
const roleToUrlParam: Record<string, string> = {
  client: "c",
  vendor: "v",
};
```

### Layout (layout.tsx)

- Validates role parameter (only accepts 'c' for client or 'v' for vendor)
- Checks user authentication using `getCurrentUser()`
- Redirects unauthenticated users to `/auth/signin`
- Validates that user role matches the route parameter using mapping
- Redirects to correct role route if mismatch detected
- Handles unrecognized user roles gracefully by redirecting to home

### Page (page.tsx)

- Implements role-based redirect logic
- Redirects `/c` to `/c/dashboard`
- Redirects `/v` to `/v/dashboard`
- Redirects invalid role parameters to home page
- Redirects unauthenticated users to signin

## Directory Structure

```
src/app/[role]/
├── layout.tsx          # Role validation and authentication
├── page.tsx            # Role-based redirects
├── client/             # Client-specific pages
├── vendor/             # Vendor-specific pages
└── components/         # Shared components
```

## Usage

- `/c` - Redirects authenticated clients to `/c/dashboard`
- `/v` - Redirects authenticated vendors to `/v/dashboard`
- Invalid roles redirect to home
- Unauthenticated users redirect to signin
