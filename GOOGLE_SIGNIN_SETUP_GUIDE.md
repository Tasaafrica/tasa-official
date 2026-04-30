# Google Sign-In Setup Guide (Step by Step)

Last updated: 2026-04-23

This guide shows how to set up Google Sign-In in this Next.js app using NextAuth and the existing backend auth API.

## Step 1: Create Google OAuth credentials

1. Open Google Cloud Console: https://console.cloud.google.com/
2. Create/select a project.
3. Configure OAuth consent screen.
4. Create OAuth 2.0 Client ID for a **Web application**.
5. Add these URLs:

- Authorized JavaScript origins:
  - `http://localhost:3000`
  - `https://your-domain.com`
- Authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google`
  - `https://your-domain.com/api/auth/callback/google`

Copy the generated `Client ID` and `Client Secret`.

## Step 2: Add environment variables

In `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_API_URL=https://api.your-domain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Step 3: Configure Google provider in NextAuth

File: `src/lib/auth.ts`

```ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const providers: NextAuthOptions["providers"] = [];

if (googleClientId && googleClientSecret) {
  providers.push(
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "client",
        };
      },
    }),
  );
}

providers.push(
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      // existing email/password auth
      return null;
    },
  }),
);
```

## Step 4: Exchange Google token with your backend

Still in `src/lib/auth.ts`, use `callbacks.signIn` to pass Google ID token to your backend:

```ts
callbacks: {
  async signIn({ user, account }) {
    if (account?.provider === "google") {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          provider: "google",
          token: account.id_token,
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        user.id = result.data.user._id;
        (user as any).role = result.data.user.role;
        (user as any).isEmailVerified = result.data.user.isEmailVerified;
        (user as any).authToken = result.data.token;
        return true;
      }

      return false;
    }

    return true;
  },
}
```

## Step 5: Register NextAuth API route

File: `src/app/api/auth/[...nextauth]/route.ts`

```ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

## Step 6: Add Google button in your sign-in page

File: `src/app/auth/signin/page.tsx`

```tsx
import { getProviders, signIn } from "next-auth/react";

const providers = await getProviders();
const hasGoogle = !!providers?.google;

const handleGoogleSignIn = async () => {
  if (!hasGoogle) return;
  await signIn("google", { callbackUrl: "/" });
};
```

Button example:

```tsx
{hasGoogle && (
  <button type="button" onClick={handleGoogleSignIn}>
    Continue with Google
  </button>
)}
```

## Step 7: Backend contract expected by this frontend

Request to backend login endpoint:

```json
{
  "email": "user@example.com",
  "provider": "google",
  "token": "<google-id-token>"
}
```

Expected success response:

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "abc123",
      "role": "client",
      "isEmailVerified": true,
      "profileImage": "https://..."
    },
    "token": "backend-jwt-token"
  }
}
```

## Step 8: Confirm session values after login

Example check:

```tsx
import { useSession } from "next-auth/react";

const { data: session } = useSession();
console.log(session?.user?.id);
console.log(session?.user?.role);
console.log(session?.authToken);
```

## Step 9: Test checklist

1. Run app: `npm run dev`
2. Open `/auth/signin`
3. Click Google button
4. Complete Google consent flow
5. Confirm redirect back to app
6. Confirm backend JWT exists in `session.authToken`
7. Confirm role and user id exist in session

## Common issues and fixes

- `Google sign-in is not configured`
  - Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`
- Redirect URI mismatch
  - Ensure Google Console redirect URI exactly matches `/api/auth/callback/google`
- Backend login exchange fails
  - Verify `NEXT_PUBLIC_API_URL` and backend `/api/auth/login` response shape
- Session missing custom fields
  - Confirm `jwt` and `session` callbacks copy `authToken`, `role`, and `isEmailVerified`
