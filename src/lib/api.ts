export const categoryApi = {
  getAll: async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/api/categories`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!response.ok) return { success: false, data: [] };
      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.data && Array.isArray(data.data) ? data.data : []);
      return { success: true, data: items };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return { success: false, data: [] };
    }
  },
  getById: async (id: string) => {
    // Placeholder implementation
    return {
      success: true,
      data: null,
    };
  },
};

export const subcategoryApi = {
  getAll: async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/api/subcategories`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!response.ok) return { success: false, data: [] };
      const data = await response.json();
      const items = Array.isArray(data) ? data : (data.data && Array.isArray(data.data) ? data.data : []);
      return { success: true, data: items };
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      return { success: false, data: [] };
    }
  },
  getById: async (id: string) => {
    // Placeholder implementation
    return {
      success: true,
      data: null,
    };
  },
};
export const skillApi = {
  search: async (query: string) => {
    if (!query.trim()) return [];
    
    try {
       const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/api/skills/search/${query}`, {
        method: "GET",
       headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        console.error("Search API response not ok:", response.status, response.statusText);
        return [];
      }

      // Check if response is JSON to avoid "Unexpected token <" error (HTML error pages)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Received non-JSON response:", text.substring(0, 100));
        return [];
      }

      const data = await response.json();
      
      // Handle the data structure: usually data.success and data.data
      const items = Array.isArray(data)
        ? data
        : (data.data && Array.isArray(data.data) ? data.data : []);
        
      return items;
    } catch (error) {
      console.error("Error searching skills:", error);
      return [];
    }
  }
};
