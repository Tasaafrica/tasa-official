
import { ApiResponse } from "./vendor";

export interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  isEmailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const userApi = {
  getById: async (
    userId: string,
    authToken: string
  ): Promise<ApiResponse<UserData>> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/api/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: result.success !== undefined ? result.success : true,
        data: result.data || result.user || result,
        ...result,
      };
    } catch (error) {
      console.error("Error fetching user data:", error);
      return {
        success: false,
        message: "Failed to fetch user data",
      };
    }
  },

  updateById: async (
    userId: string,
    authToken: string,
    data: any
  ): Promise<ApiResponse<UserData>> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.tasa.com.ng";
      const response = await fetch(`${baseUrl}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: result.success !== undefined ? result.success : true,
        data: result.data || result,
        ...result,
      };
    } catch (error) {
      console.error("Error updating user data:", error);
      return {
        success: false,
        message: "Failed to update user data",
      };
    }
  },

  requestEmailChange: async (
    userId: string,
    authToken: string,
    oldEmail: string,
    newEmail: string
  ): Promise<ApiResponse<any>> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.tasa.com.ng";
      const response = await fetch(`${baseUrl}/api/users/${userId}/change-email/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ old_email: oldEmail, new_email: newEmail }),
      });

      const result = await response.json();
      return {
        success: response.ok,
        status: response.status,
        ...result,
      };
    } catch (error) {
      console.error("Error requesting email change:", error);
      return {
        success: false,
        message: "Failed to request email change",
      };
    }
  },

  verifyEmailChange: async (
    userId: string,
    authToken: string,
    otp: string
  ): Promise<ApiResponse<any>> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.tasa.com.ng";
      const response = await fetch(`${baseUrl}/api/users/${userId}/change-email/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ otp }),
      });

      const result = await response.json();
      return {
        success: response.ok,
        status: response.status,
        ...result,
      };
    } catch (error) {
      console.error("Error verifying email change:", error);
      return {
        success: false,
        message: "Failed to verify email change",
      };
    }
  },
};
