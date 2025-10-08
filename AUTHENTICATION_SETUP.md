# 🔐 Authentication Setup Guide

This guide explains the complete authentication system implemented using NextAuth.js with email/password and social login support.

## 📋 Overview

The authentication system uses:

- **NextAuth.js** for session management
- **Email/Password** authentication via API endpoints
- **Social Login** (Google, Apple) via NextAuth providers
- **MongoDB** for session storage
- **JWT** for session strategy

## 🏗️ Architecture

### Authentication Flow

1. **Email/Password Login**:
   - User submits credentials → NextAuth credentials provider → API endpoint → Database verification
2. **Social Login**:

   - User clicks social provider → NextAuth OAuth provider → Database user creation/update

3. **Session Management**:
   - JWT tokens for client-side sessions
   - MongoDB adapter for server-side session storage

## 📁 File Structure

```
src/
├── lib/
│   ├── auth.ts                 # NextAuth configuration
│   └── auth-utils.ts           # Server-side auth utilities
├── app/
│   ├── api/auth/
│   │   ├── [...nextauth]/route.ts  # NextAuth API handler
│   │   ├── login/route.ts          # Login API endpoint
│   │   └── signup/route.ts         # Signup API endpoint
│   └── auth/
│       ├── signin/page.tsx         # Sign in page
│       ├── signup/page.tsx         # Sign up page
│       └── error/page.tsx          # Auth error page
├── components/
│   ├── providers/
│   │   └── SessionProvider.tsx     # NextAuth session provider
│   └── auth/
│       ├── ProtectedRoute.tsx       # Route protection component
│       └── UserProfile.tsx         # User profile dropdown
├── hooks/
│   └── useAuth.ts               # Client-side auth hook
├── types/
│   └── auth.ts                 # TypeScript auth types
└── middleware.ts               # Route protection middleware
```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Database
MONGODB_URI=mongodb://localhost:27017/tasa

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# API Configuration
PRODUCTION_URL=http://localhost:5000
```

### NextAuth Configuration

The main configuration is in `src/lib/auth.ts`:

```typescript
export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({ ... }),
    CredentialsProvider({ ... })
  ],
  session: { strategy: "jwt" },
  callbacks: { ... },
  pages: { ... }
};
```

## 🚀 Usage

### Client-Side Authentication

```typescript
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

### Server-Side Authentication

```typescript
import { getCurrentUser, requireAuth } from "@/lib/auth-utils";

// Get current user (can be null)
const user = await getCurrentUser();

// Require authentication (redirects if not authenticated)
const user = await requireAuth();

// Require specific role
const admin = await requireRole("admin");
```

### Protected Routes

```typescript
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  );
}
```

## 🔧 API Endpoints

### Authentication Endpoints

- `POST /api/auth/login` - Email/password login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/[...nextauth]` - NextAuth handlers

### Backend API Integration

The system integrates with your backend API:

```typescript
// Login endpoint
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Signup endpoint
POST /api/users
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "client"
}
```

## 🎨 UI Components

### Login Modal

The existing `LoginModal` component has been updated to use NextAuth:

```typescript
import { signIn } from "next-auth/react";

// Email/password login
await signIn("credentials", {
  email: "user@example.com",
  password: "password123",
});

// Social login
await signIn("google");
```

### User Profile

The `UserProfile` component shows authentication status:

```typescript
import { UserProfile } from "@/components/auth/UserProfile";

// In your header or navigation
<UserProfile />;
```

## 🛡️ Security Features

### Route Protection

Middleware protects routes automatically:

```typescript
// middleware.ts
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/api/protected/:path*"],
};
```

### Session Security

- JWT tokens for stateless sessions
- Secure session storage in MongoDB
- Automatic token refresh
- CSRF protection

## 🔄 Authentication States

### Loading State

```typescript
const { isLoading } = useAuth();

if (isLoading) {
  return <div>Loading...</div>;
}
```

### Error Handling

```typescript
// In signin/signup pages
const [error, setError] = useState<string | null>(null);

// Handle authentication errors
if (result?.error) {
  setError("Invalid credentials");
}
```

## 📱 Social Login Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`

### Apple OAuth

1. Go to [Apple Developer Console](https://developer.apple.com/)
2. Create a new App ID
3. Create a Services ID
4. Configure Sign in with Apple
5. Add redirect URLs

## 🧪 Testing

### Test Authentication

```typescript
// Test login
const result = await signIn("credentials", {
  email: "test@example.com",
  password: "password123",
  redirect: false,
});

console.log(result); // { ok: true } or { error: "..." }
```

### Test Protected Routes

```typescript
// Test route protection
const { isAuthenticated } = useAuth();
console.log(isAuthenticated); // true or false
```

## 🚨 Troubleshooting

### Common Issues

1. **"Configuration" error**: Check environment variables
2. **"AccessDenied" error**: Check OAuth provider configuration
3. **Session not persisting**: Check MongoDB connection
4. **Redirect loops**: Check middleware configuration

### Debug Mode

Enable debug logging:

```typescript
// In auth.ts
debug: process.env.NODE_ENV === "development";
```

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [MongoDB Adapter](https://authjs.dev/reference/adapter/mongodb)
- [OAuth Provider Setup](https://next-auth.js.org/providers/)

---

## ✅ Setup Checklist

- [ ] Environment variables configured
- [ ] MongoDB connection working
- [ ] OAuth providers configured
- [ ] API endpoints responding
- [ ] UI components working
- [ ] Protected routes tested
- [ ] Social login tested
- [ ] Error handling verified

The authentication system is now fully set up and ready to use! 🎉
