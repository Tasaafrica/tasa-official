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
          role: "client", // Default role
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
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
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
            isEmailVerified: result.data.user.isEmailVerified,
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
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL;
          const response = await fetch(`${baseUrl}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              provider: "google",
              token: account.id_token, // Google ID Token
            }),
          });

          const result = await response.json();

          if (result.success && result.data) {
            // Update the user object with backend data
            user.id = result.data.user._id;
            (user as any).role = result.data.user.role;
            (user as any).isEmailVerified = result.data.user.isEmailVerified;
            (user as any).authToken = result.data.token;
            return true;
          }
          console.error("Backend login failed:", result.message);
          return false;
        } catch (error) {
          console.error("Error during social login exchange:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Initial sign in or first time OAuth
        token.role = (user as any).role;
        token.isEmailVerified = (user as any).isEmailVerified;
        token.authToken = (user as any).authToken;
        token.image = user.image;
        if (account) {
          token.accessToken = account.access_token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.image = token.image as string;
        (session.user as any).isEmailVerified = token.isEmailVerified;
        session.accessToken = token.accessToken as string;
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
