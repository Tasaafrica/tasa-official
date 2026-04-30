# Google Social Auth: Implementation and Critical Review

Last reviewed: 2026-04-23

## 1) Documentation status in this repo

Google social auth is mentioned in:

- `AUTHENTICATION_SETUP.md`
- `README.md`

But there is no dedicated, implementation-accurate document for Google social sign-in/sign-up.  
Current auth docs are partly outdated (for example, they describe a MongoDB adapter flow that is not present in `src/lib/auth.ts`).

This document maps what is actually implemented in code now.

## 2) What is implemented

### 2.1 Provider registration

File: `src/lib/auth.ts`

- Google provider is enabled only when both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set.
- If missing, Google is disabled (warns only in development).
- Credentials provider is always enabled.

Important implementation detail:
- Google profile mapping sets default `role: "client"` before backend exchange.

### 2.2 Google callback exchange with backend API

File: `src/lib/auth.ts` (`callbacks.signIn`)

When `account.provider === "google"`:

1. Frontend sends this payload to backend login endpoint:
   - `email: user.email`
   - `provider: "google"`
   - `token: account.id_token`
2. Endpoint called: `${NEXT_PUBLIC_API_URL}/api/auth/login`
3. On success, code mutates NextAuth user object with backend values:
   - `user.id = backend user _id`
   - `role`
   - `isEmailVerified`
   - `authToken` (backend JWT)
4. If backend fails, callback returns `false` and NextAuth blocks sign-in.

This means Google "sign-up" and Google "sign-in" both rely on backend behavior behind `/api/auth/login` for account creation/linking.

### 2.3 JWT and session fields

File: `src/lib/auth.ts` (`callbacks.jwt`, `callbacks.session`) and `src/types/auth.ts`

- JWT stores custom fields: `role`, `isEmailVerified`, `authToken`, `image`, optional OAuth `accessToken`.
- Session exposes:
  - `session.user.id`
  - `session.user.role`
  - `session.user.image`
  - `session.user.isEmailVerified`
  - `session.authToken`
  - `session.accessToken`

### 2.4 UI entry points for Google

#### A) `/auth/signin`
File: `src/app/auth/signin/page.tsx`

- Uses `getProviders()` and only renders Google button when `providers.google` exists.
- Google click: `signIn("google", { callbackUrl: "/" })`.

#### B) `/auth/signup`
File: `src/app/auth/signup/page.tsx`

- Google button is always shown.
- Google click: `signIn("google", { callbackUrl: "/" })`.
- No provider existence guard before triggering Google sign-in.

#### C) Login modal
File: `src/app/component/parts/loginModal.tsx`

- Uses `getProviders()` and checks `providers.google`.
- Google click uses `redirect: false` and current path as `callbackUrl`.
- Handles `OAuthAccountNotLinked` explicitly.
- On success, reads session and stores `session.authToken` in localStorage.

## 3) Token and cookie behavior (current)

There are multiple auth cookies/tokens in play:

1. NextAuth session token cookie  
   File: `src/lib/auth.ts`
   - Name: `__Secure-next-tasa.auth-token` (prod) or `next-tasa.auth-token` (dev)
   - `sameSite: "lax"`
   - Domain: `.tasa.com.ng` in production

2. Backend JWT cookie `token`  
   File: `src/app/api/auth/login/route.ts`
   - Set after credentials login proxy call
   - `sameSite: "none"`, `secure: true`
   - Domain `.tasa.com.ng` in production

3. Extra cookie `authToken`  
   File: `src/app/api/auth/token-cookie/route.ts`
   - Set by `/api/auth/token-cookie`
   - Domain `.tasa.com.ng` (hardcoded)
   - `sameSite: "lax"`

4. Middleware cookie `_secure_tasaxx`  
   File: `src/middleware.ts`
   - Set from `token.authToken` when present
   - `sameSite: "none"`, `secure: true`
   - Middleware matcher currently only runs on `/`

5. localStorage fallback
   - `auth_token` stored from session in multiple places.

## 4) Critical implementation findings

1. Existing docs are stale vs code:
- `AUTHENTICATION_SETUP.md` describes MongoDB adapter/session storage, but current `auth.ts` uses JWT strategy with no adapter configured.

2. Google sign-up is implicit, not explicit:
- Social sign-up path is not a separate registration endpoint.
- It depends on backend `/api/auth/login` accepting `{ provider: "google", token }` and auto-provisioning/linking account.

3. Provider checks are inconsistent:
- `/auth/signin` and modal check provider availability.
- `/auth/signup` always renders Google/Apple buttons and attempts OAuth regardless of configured providers.

4. Token synchronization path is fragmented:
- Multiple cookie names and mechanisms (`next-tasa.auth-token`, `token`, `authToken`, `_secure_tasaxx`, `auth_token`).
- `TokenSync` exists but is not mounted in `src/app/layout.tsx`.

5. Middleware scope is narrow:
- `_secure_tasaxx` sync runs only when matcher hits `/`.
- If user never hits `/` after auth callback, sync behavior may be inconsistent.

6. Server-side environment choice:
- Server callbacks use `NEXT_PUBLIC_API_URL` for backend calls.
- Works, but this is a client-exposed variable; a server-only variable would be cleaner.

## 5) Expected backend contract for Google social

Frontend assumes backend `/api/auth/login` accepts:

```json
{
  "email": "user@example.com",
  "provider": "google",
  "token": "<google-id-token>"
}
```

And returns:

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "role": "client",
      "isEmailVerified": true,
      "profileImage": "..."
    },
    "token": "<backend-jwt>"
  }
}
```

If backend response shape changes, Google login/signup will fail in NextAuth callback.

## 6) Practical verification checklist

1. Confirm `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, and API base URL are set.
2. On `/auth/signin`, confirm Google button appears only when provider is configured.
3. On Google success, confirm session contains `user.id`, `role`, and `authToken`.
4. Confirm backend receives Google payload (`provider`, `token`).
5. Verify cookie/localStorage behavior needed by your cross-domain flow.
6. Check account-linking edge case (`OAuthAccountNotLinked`) in login modal.

