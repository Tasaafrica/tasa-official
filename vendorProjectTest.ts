// ============================================================
// VENDOR PROJECTS API - Frontend Request Examples
// ============================================================

const API_BASE = "http://localhost:5000"; // or your production URL

// Helper to get auth headers
function getAuthHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

// ----------------------------------------------------------
// 1. GET all projects for a vendor (no auth required)
// ----------------------------------------------------------
async function getVendorProjects(vendorId: string) {
  // ⚠️ Make sure vendorId is a valid 24-char hex ObjectId!
  if (!vendorId || vendorId === "undefined") {
    console.error("vendorId is not set!");
    return;
  }

  const response = await fetch(
    `${API_BASE}/api/vendor-projects/${vendorId}`
  );
  const data = await response.json();

  if (!data.success) {
    console.error("Error:", data.errorType, data.error);
    return;
  }

  console.log("Projects:", data.data.projects);
  return data.data;
}

// ----------------------------------------------------------
// 2. POST - Add a new project (auth required, multipart/form-data)
// ----------------------------------------------------------
async function addVendorProject(
  vendorId: string,
  token: string,
  title: string,
  link: string,
  thumbnailFile: File
) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("link", link);
  formData.append("thumbnail", thumbnailFile);

  // ⚠️ Do NOT set Content-Type header — the browser sets it
  //    automatically with the correct multipart boundary
  const response = await fetch(
    `${API_BASE}/api/vendor-projects/${vendorId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // NO "Content-Type" here!
      },
      body: formData,
    }
  );

  const data = await response.json();
  console.log("Add project result:", data);
  return data;
}

// ----------------------------------------------------------
// 3. PUT - Update an existing project (auth required, multipart/form-data)
// ----------------------------------------------------------
async function updateVendorProject(
  vendorId: string,
  projectId: string,
  token: string,
  updates: { title?: string; link?: string; thumbnailFile?: File }
) {
  const formData = new FormData();
  if (updates.title) formData.append("title", updates.title);
  if (updates.link) formData.append("link", updates.link);
  if (updates.thumbnailFile)
    formData.append("thumbnail", updates.thumbnailFile);

  const response = await fetch(
    `${API_BASE}/api/vendor-projects/${vendorId}/${projectId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await response.json();
  console.log("Update project result:", data);
  return data;
}

// ----------------------------------------------------------
// 4. DELETE - Remove a project (auth required)
// ----------------------------------------------------------
async function deleteVendorProject(
  vendorId: string,
  projectId: string,
  token: string
) {
  const response = await fetch(
    `${API_BASE}/api/vendor-projects/${vendorId}/${projectId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(token),
    }
  );

  const data = await response.json();
  console.log("Delete project result:", data);
  return data;
}

// ============================================================
// USAGE EXAMPLE (e.g., inside a React component)
// ============================================================
//
// const vendorId = user._id; // Must be a valid ObjectId string
// const token = localStorage.getItem("accessToken");
//
// // Fetch projects
// const projects = await getVendorProjects(vendorId);
//
// // Add a project (from a file input)
// const fileInput = document.querySelector<HTMLInputElement>("#thumbnail");
// const file = fileInput?.files?.[0];
// if (file) {
//   await addVendorProject(vendorId, token, "My Project", "https://example.com", file);
// }
