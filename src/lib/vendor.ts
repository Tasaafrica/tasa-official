export interface VendorData {
  sessionInvalidBefore: any;
  _id: string;
  name: string;
  email: string;
  role: string;
  profileImage: string;
  mobile: string;
  whatsapp: string;
  country: string;
  state: string;
  city: string;
  location: string;
  category: string;
  skills: Array<{
    _id: string;
    name: string;
    slug: string;
    description: string;
    id: string;
  }>;
  coreSkills: Array<{
    _id: string;
    name: string;
    slug: string;
    description: string;
    id: string;
  }>;
  peripheralSkills: Array<{
    _id: string;
    name: string;
    slug: string;
    description: string;
    id: string;
  }>;
  rating: number;
  isActive: boolean;
  isEmailVerified: boolean;
  adminRole: string;
  adminPermissions: any[];
  createdAt?: string;
  updatedAt?: string;
  __v: number;
  emailVerifiedAt?: string;
  googleId?: string;
  socialProvider?: string;
  multi_category: boolean;
  tokenVersion: number;
  bio?: string;
  about_me?: string;
  slug?: string;
}

export interface VendorUpdateData {
  name?: string;
  profileImage?: string;
  bio?: string;
  about_me?: string;
  mobile?: string;
  whatsapp?: string;
  country?: string;
  state?: string;
  city?: string;
  category?: string;
  coreSkills?: Array<{ name: string }>;
  coreSkillIds?: string[];
  peripheralSkills?: Array<{ name: string }> | string[];
  skills?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  status?: number;
  error?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Skill {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export const vendorApi = {
  // Get vendor by ID
  getById: async (
    vendorId: string,
    authToken: string,
  ): Promise<ApiResponse<VendorData>> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/api/vendors/${vendorId}`, {
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
      return result;
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      return {
        success: false,
        message: "Failed to fetch vendor data",
      };
    }
  },

  // Update vendor by ID
  updateById: async (
    vendorId: string,
    authToken: string,
    data: VendorUpdateData,
    method: "PATCH" | "PUT" = "PATCH",
  ): Promise<ApiResponse<VendorData>> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.tasa.com.ng";
      const response = await fetch(`${baseUrl}/api/vendors/${vendorId}`, {
        method: method,
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
      // Normalize response to ensure success: true if request was ok and backend didn't say otherwise
      return {
        success: result.success !== undefined ? result.success : true,
        data: result.data || result,
        ...result,
      };
    } catch (error) {
      console.error("Error updating vendor data:", error);
      return {
        success: false,
        message: "Failed to update vendor data",
      };
    }
  },

  // Update user basic profile by ID (uses /api/users)
  updateBasicById: async (
    userId: string,
    authToken: string,
    data: any,
  ): Promise<ApiResponse<any>> => {
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
      // Normalize response to ensure success: true if request was ok and backend didn't say otherwise
      return {
        success: result.success !== undefined ? result.success : true,
        data: result.data || result,
        ...result,
      };
    } catch (error) {
      console.error("Error updating user profile:", error);
      return {
        success: false,
        message: "Failed to update profile info",
      };
    }
  },

  // Get vendor stats (for dashboard)
  getStats: async (
    vendorId: string,
    authToken: string,
  ): Promise<
    ApiResponse<{
      activeOrders: number;
      totalEarnings: number;
      clientReviews: number;
      rating: number;
    }>
  > => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/api/vendors/${vendorId}/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        // If stats endpoint doesn't exist, return default stats
        return {
          success: true,
          data: {
            activeOrders: 0,
            totalEarnings: 0,
            clientReviews: 0,
            rating: 0,
          },
        };
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching vendor stats:", error);
      // Return default stats on error
      return {
        success: true,
        data: {
          activeOrders: 0,
          totalEarnings: 0,
          clientReviews: 0,
          rating: 0,
        },
      };
    }
  },

  // Get all categories
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/api/categories`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const items = Array.isArray(data)
        ? data
        : data.data && Array.isArray(data.data)
          ? data.data
          : [];

      return {
        success: true,
        data: items,
      };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return {
        success: false,
        data: [],
        message: "Failed to fetch categories",
      };
    }
  },

  // Get skills by category
  getSkillsByCategory: async (
    categorySlug: string,
  ): Promise<ApiResponse<Skill[]>> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${baseUrl}/api/categories/${categorySlug}/skills`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const items = Array.isArray(data)
        ? data
        : data.data && Array.isArray(data.data)
          ? data.data
          : [];

      return {
        success: true,
        data: items,
      };
    } catch (error) {
      console.error("Error fetching skills:", error);
      return {
        success: false,
        data: [],
        message: "Failed to fetch skills",
      };
    }
  },
  // Request email change
  requestEmailChange: async (
    userId: string,
    authToken: string,
    oldEmail: string,
    newEmail: string,
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

  // Verify email change OTP
  verifyEmailChange: async (
    userId: string,
    authToken: string,
    otp: string,
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

  // Get vendors by skill slug
  getVendorsBySkill: async (
    skillSlug: string,
    authToken?: string,
    page?: number,
    limit?: number,
  ): Promise<ApiResponse<any>> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.tasa.com.ng";
      const queryParams = new URLSearchParams();
      if (page !== undefined) queryParams.append("page", page.toString());
      if (limit !== undefined) queryParams.append("limit", limit.toString());
      
      const queryString = queryParams.toString();
      const url = `${baseUrl}/api/vendors/skill/${skillSlug}${queryString ? `?${queryString}` : ""}`;
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }
      
      const response = await fetch(url, {
        method: "GET",
        headers,
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
      console.error("Error fetching vendors by skill:", error);
      return {
        success: false,
        message: "Failed to fetch vendors for this skill",
      };
    }
  },
};

