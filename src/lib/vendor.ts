// Helper: convert a base64 data URL to a Blob for FormData file uploads
function dataURLtoBlob(dataURL: string): Blob {
  const [header, base64Data] = dataURL.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const byteString = atob(base64Data);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([uint8Array], { type: mime });
}

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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;
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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;
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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;
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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;
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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;
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

  // ── Vendor Projects (Portfolio) ──────────────────────────────────

  // Get all projects for a vendor
  getProjects: async (
    vendorId: string,
    authToken: string,
  ): Promise<ApiResponse<VendorProject[]>> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;
      const response = await fetch(`${baseUrl}/api/vendor-projects/${vendorId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Backend returns { success, data: { projects: [...] } }
      const items = Array.isArray(result)
        ? result
        : result.data?.projects && Array.isArray(result.data.projects)
          ? result.data.projects
          : result.data && Array.isArray(result.data)
            ? result.data
            : [];

      return {
        success: true,
        data: items,
      };
    } catch (error) {
      console.error("Error fetching vendor projects:", error);
      return {
        success: false,
        data: [],
        message: "Failed to fetch portfolio projects",
      };
    }
  },

  // Create a new project in vendor portfolio
  createProject: async (
    vendorId: string,
    authToken: string,
    data: VendorProjectCreateData,
  ): Promise<ApiResponse<VendorProject>> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("link", data.link);
      if (data.description) formData.append("description", data.description);
      if (data.problem) formData.append("problem", data.problem);
      if (data.process) formData.append("process", data.process);
      if (data.solution) formData.append("solution", data.solution);
      if (data.results) formData.append("results", data.results);
      if (data.brandPersonality) formData.append("brandPersonality", data.brandPersonality);
      if (data.strategicGoals) formData.append("strategicGoals", data.strategicGoals);
      if (data.creativeRationale) formData.append("creativeRationale", data.creativeRationale);

      // Convert base64 data URL to a File/Blob for multipart upload
      if (data.thumbnail) {
        const thumbnailBlob = dataURLtoBlob(data.thumbnail);
        formData.append("thumbnail", thumbnailBlob, "thumbnail.png");
      }

      // Do NOT set Content-Type — the browser sets it automatically
      // with the correct multipart boundary
      const response = await fetch(`${baseUrl}/api/vendor-projects/${vendorId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({}));
        throw new Error(errorResult.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: result.success !== undefined ? result.success : true,
        data: result.data || result,
        ...result,
      };
    } catch (error: any) {
      console.error("Error creating vendor project:", error);
      return {
        success: false,
        message: error.message || "Failed to create project",
      };
    }
  },

  // Update a specific project
  updateProject: async (
    vendorId: string,
    projectId: string,
    authToken: string,
    data: Partial<VendorProjectCreateData>,
  ): Promise<ApiResponse<VendorProject>> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;

      const formData = new FormData();
      if (data.title) formData.append("title", data.title);
      if (data.link) formData.append("link", data.link);
      if (data.thumbnail && data.thumbnail.startsWith("data:")) {
        const thumbnailBlob = dataURLtoBlob(data.thumbnail);
        formData.append("thumbnail", thumbnailBlob, "thumbnail.png");
      }
      if (data.description !== undefined) formData.append("description", data.description);
      if (data.problem !== undefined) formData.append("problem", data.problem);
      if (data.process !== undefined) formData.append("process", data.process);
      if (data.solution !== undefined) formData.append("solution", data.solution);
      if (data.results !== undefined) formData.append("results", data.results);
      if (data.brandPersonality !== undefined) formData.append("brandPersonality", data.brandPersonality);
      if (data.strategicGoals !== undefined) formData.append("strategicGoals", data.strategicGoals);
      if (data.creativeRationale !== undefined) formData.append("creativeRationale", data.creativeRationale);

      const response = await fetch(
        `${baseUrl}/api/vendor-projects/${vendorId}/${projectId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({}));
        throw new Error(errorResult.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: result.success !== undefined ? result.success : true,
        data: result.data || result,
        ...result,
      };
    } catch (error: any) {
      console.error("Error updating vendor project:", error);
      return {
        success: false,
        message: error.message || "Failed to update project",
      };
    }
  },

  // Delete a specific project
  deleteProject: async (
    vendorId: string,
    projectId: string,
    authToken: string,
  ): Promise<ApiResponse<null>> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;
      const response = await fetch(
        `${baseUrl}/api/vendor-projects/${vendorId}/${projectId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({}));
        throw new Error(errorResult.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json().catch(() => ({}));
      return {
        success: true,
        data: null,
        ...result,
      };
    } catch (error: any) {
      console.error("Error deleting vendor project:", error);
      return {
        success: false,
        message: error.message || "Failed to delete project",
      };
    }
  },
};

// Vendor project types
export interface VendorProject {
  id: string;
  _id?: string;
  title: string;
  link: string;
  thumbnail: string;
  description?: string;
  problem?: string;
  process?: string;
  solution?: string;
  results?: string;
  brandPersonality?: string;
  strategicGoals?: string;
  creativeRationale?: string;
  vendorId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VendorProjectCreateData {
  title: string;
  link: string;
  thumbnail: string;
  description?: string;
  problem?: string;
  process?: string;
  solution?: string;
  results?: string;
  brandPersonality?: string;
  strategicGoals?: string;
  creativeRationale?: string;
}
