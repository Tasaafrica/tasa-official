import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const providers: NextAuthOptions["providers"] = [];

if (googleClientId && googleClientSecret) {
  providers.push(
    // Google OAuth Provider
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "user", // Default role for Google OAuth users
        };
      },
    })
  );
} else if (process.env.NODE_ENV === "development") {
  console.warn(
    "Google OAuth is disabled: GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET not set."
  );
}

providers.push(
  // Credentials Provider for Email/Password
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        console.log("Missing credentials for authentication");
        return null;
      }

      try {
        // Call your API to authenticate user
        const baseUrl =
          process.env.PRODUCTION_URL || "https://tasa-server.onrender.com";
        console.log("Attempting to authenticate with:", baseUrl);
        console.log("Credentials:", {
          email: credentials.email,
          password: "[REDACTED]",
        });

        const response = await fetch(`${baseUrl}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Auth failed:", response.status, errorText);
          return null;
        }

        const result = await response.json();

          if (result.success && result.data && result.data.user) {
            return {
              id: result.data.user._id,
              email: result.data.user.email,
              name: result.data.user.name,
              image: result.data.user.profileImage,
              role: result.data.user.role,
              emailVerificationStatus: result.data.user.emailVerificationStatus,
              authToken: result.data.token,
            };
          }

        console.log("Auth result missing required fields:", {
          success: result.success,
          hasData: !!result.data,
          hasUser: !!(result.data && result.data.user),
        });
        return null;
      } catch (error) {
        console.error("Authentication error:", error);
        return null;
      }
    },
  })
);

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.role = user?.role;
        token.emailVerificationStatus = (user as any)?.emailVerificationStatus;
        token.image = user?.image;
      }
      if ((user as any)?.authToken) {
        token.authToken = (user as any).authToken;
      }
      // Also handle image from user object (for Google OAuth)
      if (user?.image) {
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
        session.user.image = token.image as string;
        (session.user as any).emailVerificationStatus =
          token.emailVerificationStatus;
        session.authToken = token.authToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
