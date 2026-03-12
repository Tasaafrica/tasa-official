import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      isEmailVerified?: boolean;
    } & DefaultSession["user"];
    accessToken?: string;
    authToken?: string;
  }

  interface User extends DefaultUser {
    role: string;
    isEmailVerified?: boolean;
    authToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
    accessToken?: string;
    authToken?: string;
    isEmailVerified?: boolean;
  }
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  firstName: string;
  middleName?: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: {
      _id: string;
      name: string;
      email: string;
      role: string;
      profileImage?: string;
      isEmailVerified: boolean;
    };
    token: string;
  };
  error?: string;
}
