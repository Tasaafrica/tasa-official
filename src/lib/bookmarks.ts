export const bookmarkApi = {
  getAll: async (token: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${baseUrl}/api/bookmarks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) return { success: false, data: [] };
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      return { success: false, data: [] };
    }
  },
  
  checkStatus: async (vendorId: string, token: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${baseUrl}/api/bookmarks/check/${vendorId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) return { success: false, isBookmarked: false };
      const data = await response.json();
      return { success: true, isBookmarked: data.data?.isBookmarked ?? false };
    } catch (error) {
      console.error("Error checking bookmark status:", error);
      return { success: false, isBookmarked: false };
    }
  },

  addBookmark: async (vendorId: string, token: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${baseUrl}/api/bookmarks/${vendorId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || errorData.message || "Failed to add bookmark",
          errorType: errorData.errorType,
          status: response.status
        };
      }
      const data = await response.json();
      return { success: true, data: data.data, message: data.message };
    } catch (error) {
      console.error("Error adding bookmark:", error);
      return { success: false, error: "Internal error" };
    }
  },

  removeBookmark: async (vendorId: string, token: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(`${baseUrl}/api/bookmarks/${vendorId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.error || errorData.message || "Failed to remove bookmark",
          errorType: errorData.errorType,
          status: response.status
        };
      }
      const data = await response.json();
      return { success: true, data: data.data, message: data.message };
    } catch (error) {
      console.error("Error removing bookmark:", error);
      return { success: false, error: "Internal error" };
    }
  },
};
