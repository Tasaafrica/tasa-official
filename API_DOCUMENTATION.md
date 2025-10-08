# TASA API Documentation

## 🌐 Base Configuration

- **Base URL**: `http://localhost:5000` (development) or your production URL
- **Content-Type**: `application/json`
- **CORS**: Enabled for `localhost:3000`, `localhost:4000`, `localhost:5000`, and production domains

---

## 📋 General Endpoints

### Health Check

```http
GET /                    # API status and info
GET /health             # Detailed health check with CORS info
```

**Response:**

```json
{
  "message": "TASA API is running!",
  "environment": "development",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 🔐 Authentication (`/api/auth`)

### User Registration

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "client"
}
```

**Required Fields:**

- `name` (string) - User's full name
- `email` (string) - Valid email address
- `password` (string) - Minimum 6 characters
- `role` (string, optional) - "client", "vendor", or "admin" (defaults to "client")

**Response (Success - 201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64fa4...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "client",
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "error": "Name, email, and password are required"
}
```

### User Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Required Fields:**

- `email` (string) - User's email address
- `password` (string) - User's password

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "64fa4...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "client",
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (Error - 401):**

```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

### Get Current User Profile

```http
GET /api/auth/me
Authorization: Bearer <your-jwt-token>
```

**Headers:**

- `Authorization: Bearer <your-jwt-token>` - JWT token from login/register

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64fa4...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "client",
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

**Response (Error - 401):**

```json
{
  "success": false,
  "error": "No token provided"
}
```

### Logout User

```http
POST /api/auth/logout
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Logout successful. Please remove token from client storage."
}
```

### Refresh JWT Token

```http
POST /api/auth/refresh
Authorization: Bearer <your-jwt-token>
```

**Headers:**

- `Authorization: Bearer <your-jwt-token>` - Current JWT token

**Response (Success - 200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64fa4...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "client",
      "isActive": true
    },
    "token": "new-jwt-token"
  }
}
```

**Response (Error - 401):**

```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

---

## 👥 User Management (`/api/users`)

### Get All Users

```http
GET /api/users
```

**Response:**

```json
[
  {
    "_id": "64fa4...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client",
    "bio": "Business owner...",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### Get User by ID

```http
GET /api/users/:id
```

### Create User (Admin Only)

```http
POST /api/users
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "client"
}
```

**Authentication Required:** Admin role only

**Response (Success - 201):**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "64fa4...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Response (Error - 401):**

```json
{
  "success": false,
  "error": "Authentication required"
}
```

### Update User

```http
PUT /api/users/:id
Content-Type: application/json

{
  "name": "John Smith",
  "bio": "Updated bio",
  "profileImage": "image-url"
}
```

### Delete User (Soft Delete)

```http
DELETE /api/users/:id
```

---

## 🏷️ Categories (`/api/categories`)

### Get All Categories

```http
GET /api/categories
```

### Get Category by Slug

```http
GET /api/categories/slug/:slug
```

### Get Full Hierarchy

```http
GET /api/categories/structured/all
```

**Response:**

```json
[
  {
    "_id": "64fa4...",
    "name": "Tech",
    "slug": "tech",
    "subcategories": [
      {
        "_id": "64fa5...",
        "name": "Web Development",
        "skills": [
          {
            "_id": "64fa6...",
            "name": "React",
            "slug": "react"
          }
        ]
      }
    ]
  }
]
```

### Get Category Structure

```http
GET /api/categories/structured/:categoryId
```

### Get Subcategories for Category

```http
GET /api/categories/:categorySlug/subcategories
```

**Example:**

```http
GET /api/categories/tech/subcategories
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64fa5...",
      "name": "Web Development",
      "slug": "web-development",
      "categoryId": "64fa4...",
      "description": "Web development services",
      "displayOrder": 1,
      "status": "active"
    }
  ],
  "category": {
    "_id": "64fa4...",
    "name": "Tech",
    "slug": "tech"
  }
}
```

### Get Skills for Category

```http
GET /api/categories/:categorySlug/skills
```

**Example:**

```http
GET /api/categories/tech/skills
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64fa6...",
      "name": "React Development",
      "slug": "react-development",
      "categoryId": "64fa4...",
      "subcategoryId": "64fa5...",
      "description": "React.js development services",
      "displayOrder": 1,
      "status": "active"
    }
  ],
  "category": {
    "_id": "64fa4...",
    "name": "Tech",
    "slug": "tech"
  }
}
```

---

## 📂 Subcategories (`/api/subcategories`)

### Get All Subcategories

```http
GET /api/subcategories
```

### Get Subcategory ID by Slug

```http
GET /api/subcategories/id/:slug
```

**Example:**

```http
GET /api/subcategories/id/web-development
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64fa5...",
    "name": "Web Development",
    "slug": "web-development",
    "categoryId": "64fa4...",
    "category": {
      "_id": "64fa4...",
      "name": "Tech",
      "slug": "tech"
    }
  }
}
```

### Get Multiple Subcategory IDs by Slugs

```http
POST /api/subcategories/ids
```

**Request Body:**

```json
{
  "slugs": ["web-development", "mobile-development", "ui-design"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "found": [
      {
        "_id": "64fa5...",
        "name": "Web Development",
        "slug": "web-development",
        "categoryId": "64fa4...",
        "category": {
          "_id": "64fa4...",
          "name": "Tech",
          "slug": "tech"
        }
      }
    ],
    "notFound": ["ui-design"],
    "total": 3,
    "foundCount": 2,
    "notFoundCount": 1
  }
}
```

### Get Subcategory by Slug (Full Details)

```http
GET /api/subcategories/slug/:slug
```

### Get Subcategory with Skills

```http
GET /api/subcategories/structured/:subcategorySlug
```

**Example:**

```http
GET /api/subcategories/structured/web-development
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64fa5...",
    "name": "Web Development",
    "slug": "web-development",
    "category": {
      "_id": "64fa4...",
      "name": "Tech",
      "slug": "tech"
    },
    "skills": [
      {
        "_id": "64fa6...",
        "name": "React Development",
        "slug": "react-development",
        "description": "React.js development services"
      }
    ]
  }
}
```

### Get Skills for Subcategory

```http
GET /api/subcategories/:subcategorySlug/skills
```

**Example:**

```http
GET /api/subcategories/web-development/skills
```

**Response:**

```json
{
  "success": true,
  "data": {
    "allSkills": [
      {
        "_id": "64fa6...",
        "name": "React Development",
        "slug": "react-development",
        "categoryId": "64fa4...",
        "subcategoryId": "64fa5...",
        "description": "React.js development services",
        "displayOrder": 1,
        "status": "active",
        "providers": 45,
        "averageRating": 4.8,
        "popular": true
      }
    ],
    "popularSkills": [
      {
        "_id": "64fa6...",
        "name": "React Development",
        "slug": "react-development",
        "description": "React.js development services",
        "providers": 45,
        "averageRating": 4.8,
        "popular": true
      },
      {
        "_id": "64fa7...",
        "name": "Vue.js Development",
        "slug": "vuejs-development",
        "description": "Vue.js development services",
        "providers": 32,
        "averageRating": 4.7,
        "popular": true
      }
    ],
    "topRatedSkills": [
      {
        "_id": "64fa6...",
        "name": "React Development",
        "slug": "react-development",
        "description": "React.js development services",
        "providers": 45,
        "averageRating": 4.8,
        "totalReviews": 200
      }
    ],
    "mostPopularSkills": [
      {
        "_id": "64fa6...",
        "name": "React Development",
        "slug": "react-development",
        "description": "React.js development services",
        "providers": 45,
        "averageRating": 4.8
      }
    ],
    "stats": {
      "totalSkills": 25,
      "popularSkillsCount": 8,
      "topRatedSkillsCount": 10
    }
  },
  "subcategory": {
    "_id": "64fa5...",
    "name": "Web Development",
    "slug": "web-development",
    "category": {
      "_id": "64fa4...",
      "name": "Tech",
      "slug": "tech"
    }
  }
}
```

---

## 🛠️ Skills (`/api/skills`)

### Get All Skills

```http
GET /api/skills
```

### Get Skill by ID

```http
GET /api/skills/:id
```

### Search Skills

```http
GET /api/skills/search/:query
```

**Example:**

```http
GET /api/skills/search/web%20development
```

### Get Top Skills by Providers

```http
GET /api/skills/top/providers?limit=10
```

### Get Top Skills by Rating

```http
GET /api/skills/top/rating?limit=10
```

### Get Skill ID by Name or Slug

```http
GET /api/skills/id/:identifier
```

**Examples:**

```http
GET /api/skills/id/Web%20Development
GET /api/skills/id/web-development
GET /api/skills/id/react
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64fa4...",
    "name": "Web Development",
    "slug": "web-development"
  }
}
```

### Get Multiple Skill IDs

```http
POST /api/skills/ids
Content-Type: application/json

{
  "identifiers": ["Web Development", "React", "Node.js", "web-development"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "found": [
      {
        "identifier": "Web Development",
        "_id": "64fa4...",
        "name": "Web Development",
        "slug": "web-development"
      },
      {
        "identifier": "React",
        "_id": "64fa5...",
        "name": "React",
        "slug": "react"
      }
    ],
    "notFound": ["Node.js"],
    "total": 4,
    "foundCount": 3,
    "notFoundCount": 1
  }
}
```

### Get Category of a Skill by Slug

```http
GET /api/skills/:skillSlug/category
```

**Example:**

```http
GET /api/skills/react-development/category
```

**Response:**

```json
{
  "success": true,
  "data": {
    "skill": {
      "_id": "64fa6...",
      "name": "React Development",
      "slug": "react-development"
    },
    "category": {
      "_id": "64fa4...",
      "name": "Tech",
      "slug": "tech",
      "description": "Tech related services and skills"
    },
    "subcategory": {
      "_id": "64fa5...",
      "name": "Web Development",
      "slug": "web-development"
    }
  }
}
```

### Get Category of a Skill by ID

```http
GET /api/skills/id/:skillId/category
```

**Example:**

```http
GET /api/skills/id/64fa6.../category
```

**Response:**

```json
{
  "success": true,
  "data": {
    "skill": {
      "_id": "64fa6...",
      "name": "React Development",
      "slug": "react-development"
    },
    "category": {
      "_id": "64fa4...",
      "name": "Tech",
      "slug": "tech",
      "description": "Tech related services and skills"
    },
    "subcategory": {
      "_id": "64fa5...",
      "name": "Web Development",
      "slug": "web-development"
    }
  }
}
```

---

## ⭐ Featured Categories (`/api/featured-categories`)

### Get All Featured Categories

```http
GET /api/featured-categories
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64fa4...",
      "name": "Tech",
      "slug": "tech",
      "description": "Tech related services and skills",
      "skillsCount": 150,
      "topSkills": [
        {
          "_id": "64fa5...",
          "name": "Web Development",
          "slug": "web-development",
          "description": "Full-stack web development",
          "providers": 45,
          "averageRating": 4.8
        }
      ],
      "stats": {
        "totalProviders": 500,
        "averageRating": 4.6,
        "totalReviews": 1200
      },
      "displayOrder": 1
    }
  ],
  "message": "Featured categories retrieved successfully"
}
```

### Get Featured Category by Slug

```http
GET /api/featured-categories/:slug
```

**Example:**

```http
GET /api/featured-categories/tech
```

**Response:**

```json
{
  "success": true,
  "data": {
    "category": {
      "_id": "64fa4...",
      "name": "Tech",
      "slug": "tech",
      "description": "Tech related services and skills"
    },
    "stats": {
      "totalSkills": 150,
      "totalProviders": 500,
      "averageRating": 4.6,
      "totalReviews": 1200,
      "popularSkills": 25
    },
    "topSkills": [
      {
        "_id": "64fa5...",
        "name": "Web Development",
        "slug": "web-development",
        "description": "Full-stack web development",
        "providers": 45,
        "averageRating": 4.8,
        "totalReviews": 200,
        "tags": ["web", "development", "fullstack"],
        "popular": true
      }
    ],
    "skillsBySubcategory": [
      {
        "_id": "64fa6...",
        "subcategoryName": "Web Development",
        "subcategorySlug": "web-development",
        "skillsCount": 25,
        "totalProviders": 200
      }
    ],
    "allSkills": [...]
  },
  "message": "Featured category details retrieved successfully"
}
```

### Get Minimal Featured Categories List

```http
GET /api/featured-categories/minimal/list
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64fa4...",
      "name": "Tech",
      "slug": "tech",
      "description": "Tech related services and skills",
      "displayOrder": 1
    }
  ],
  "message": "Featured categories list retrieved successfully"
}
```

---

## 🏪 Vendors (`/api/vendors`)

### Get All Vendors

```http
GET /api/vendors?page=1&limit=20&location=New York&minRating=4.0&skillId=64fa4...&search=john
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `location` (optional): Filter by location
- `minRating` (optional): Minimum rating filter
- `skillId` (optional): Filter by skill ID
- `search` (optional): Search by name

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "64fa4...",
      "name": "John Smith",
      "skills": [
        {
          "_id": "64fa5...",
          "name": "Web Development",
          "slug": "web-development",
          "description": "Full-stack web development"
        }
      ],
      "rating": 4.8,
      "location": "New York, NY",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Get Vendor by ID

```http
GET /api/vendors/:id
```

### Create Vendor

```http
POST /api/vendors
Content-Type: application/json

{
  "name": "John Smith",
  "skills": ["64fa4...", "64fa5..."],
  "rating": 4.5,
  "location": "New York, NY"
}
```

### Update Vendor

```http
PUT /api/vendors/:id
Content-Type: application/json

{
  "name": "John Smith",
  "skills": ["64fa4...", "64fa5..."],
  "rating": 4.8,
  "location": "New York, NY"
}
```

### Delete Vendor

```http
DELETE /api/vendors/:id
```

### Get Vendors by Skill

```http
GET /api/vendors/skill/:skillId?page=1&limit=20
```

### Get Vendors by Location

```http
GET /api/vendors/location/:location?page=1&limit=20
```

**Example:**

```http
GET /api/vendors/location/New%20York%2C%20NY
```

### Get Top Rated Vendors

```http
GET /api/vendors/top/rated?limit=10&minRating=4.0
```

### Search Vendors

```http
GET /api/vendors/search/:query?page=1&limit=20
```

**Example:**

```http
GET /api/vendors/search/john%20smith
```

### Get Vendor Statistics

```http
GET /api/vendors/stats/overview
```

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 150,
    "withSkills": 140,
    "averageRating": 4.2,
    "byLocation": [
      {
        "_id": "New York, NY",
        "count": 25,
        "avgRating": 4.5
      }
    ],
    "popularSkills": [
      {
        "_id": "64fa4...",
        "skillName": "Web Development",
        "count": 45
      }
    ]
  }
}
```

---

## 🔐 Admin Skills (`/api/admin/skills`) - _Requires Admin Authentication_

### Get All Skills (Admin View)

```http
GET /api/admin/skills?page=1&limit=20&status=active&categoryId=64fa4...&search=web
```

### Get Skill by ID (Admin View)

```http
GET /api/admin/skills/:id
```

### Create Skill

```http
POST /api/admin/skills
Content-Type: application/json

{
  "name": "React Development",
  "slug": "react-development",
  "description": "Modern React development",
  "categoryId": "64fa4...",
  "subcategoryId": "64fa5...",
  "tags": ["react", "javascript", "frontend"],
  "displayOrder": 1,
  "popular": true
}
```

### Update Skill

```http
PUT /api/admin/skills/:id
Content-Type: application/json

{
  "name": "React Development",
  "status": "active",
  "popular": true
}
```

### Delete Skill

```http
DELETE /api/admin/skills/:id?permanent=true
```

### Bulk Operations

```http
POST /api/admin/skills/bulk
Content-Type: application/json

{
  "operation": "activate",
  "skillIds": ["64fa4...", "64fa5..."],
  "data": {}
}
```

**Supported Operations:**

- `activate`: Activate skills
- `deactivate`: Deactivate skills
- `delete`: Delete skills
- `update`: Update skills (requires `data` field)

### Get Skill Statistics

```http
GET /api/admin/skills/stats/overview
```

---

## 🌱 Database Seeding (`/api/seed`)

### Run Full Database Seeding

```http
POST /api/seed/database
```

---

## 📊 Response Formats

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## 🧪 Test Credentials

### Available Test Users

**Admin User:**

- Email: `jackson.joshua@gmail.com`
- Password: `password123`
- Role: admin

**Client User:**

- Email: `donna.miller@yahoo.com`
- Password: `password123`
- Role: client

**Vendor User:**

- Email: `perez.james@yahoo.com`
- Password: `password123`
- Role: vendor

### Environment Variables

Add these to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

---

## 🔧 Frontend Integration Examples

### Authentication Examples

#### User Registration

```javascript
const registerUser = async (userData) => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const result = await response.json();

  if (result.success) {
    // Store token and user data
    localStorage.setItem("token", result.data.token);
    localStorage.setItem("user", JSON.stringify(result.data.user));
    return result.data;
  } else {
    throw new Error(result.error);
  }
};

// Usage
const userData = {
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  role: "client",
};

try {
  const result = await registerUser(userData);
  console.log("User registered:", result.user);
  console.log("Token:", result.token);
} catch (error) {
  console.error("Registration failed:", error.message);
}
```

#### User Login

```javascript
const loginUser = async (email, password) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (result.success) {
    // Store token and user data
    localStorage.setItem("token", result.data.token);
    localStorage.setItem("user", JSON.stringify(result.data.user));
    return result.data;
  } else {
    throw new Error(result.error);
  }
};

// Usage
try {
  const result = await loginUser("john@example.com", "password123");
  console.log("Login successful:", result.user);
  console.log("Token:", result.token);
} catch (error) {
  console.error("Login failed:", error.message);
}
```

#### Get Current User Profile

```javascript
const getCurrentUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (result.success) {
    return result.data.user;
  } else {
    throw new Error(result.error);
  }
};

// Usage
try {
  const user = await getCurrentUser();
  console.log("Current user:", user);
} catch (error) {
  console.error("Failed to get user:", error.message);
}
```

#### Make Authenticated Requests

```javascript
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return null;
  }

  return response;
};

// Usage
try {
  const response = await makeAuthenticatedRequest("/api/vendors");
  const result = await response.json();
  console.log("Vendors:", result.data);
} catch (error) {
  console.error("Request failed:", error.message);
}
```

#### Logout User

```javascript
const logoutUser = async () => {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
  } catch (error) {
    console.error("Logout request failed:", error);
  } finally {
    // Always clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
};

// Usage
logoutUser();
```

### Fetch All Vendors

```javascript
const response = await fetch("/api/vendors");
const result = await response.json();
console.log(result.data); // Array of vendors
```

### Search Vendors

```javascript
const searchQuery = encodeURIComponent("web developer");
const response = await fetch(`/api/vendors/search/${searchQuery}`);
const result = await response.json();
```

### Create Vendor

```javascript
const response = await fetch("/api/vendors", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "John Smith",
    skills: ["64fa4...", "64fa5..."],
    rating: 4.5,
    location: "New York, NY",
  }),
});
const result = await response.json();
```

### Get Vendors by Skill

```javascript
const skillId = "64fa4...";
const response = await fetch(`/api/vendors/skill/${skillId}`);
const result = await response.json();
```

### Get Vendor Statistics

```javascript
const response = await fetch("/api/vendors/stats/overview");
const stats = await response.json();
console.log(`Total vendors: ${stats.data.total}`);
console.log(`Average rating: ${stats.data.averageRating}`);
```

### Filter Vendors

```javascript
const params = new URLSearchParams({
  location: "New York",
  minRating: "4.0",
  limit: "10",
});
const response = await fetch(`/api/vendors?${params}`);
const result = await response.json();
```

### Get Skill ID

```javascript
// Get single skill ID by name or slug
const skillName = encodeURIComponent("Web Development");
const response = await fetch(`/api/skills/id/${skillName}`);
const result = await response.json();
console.log(result.data._id); // "64fa4..."

// Get multiple skill IDs
const response = await fetch("/api/skills/ids", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    identifiers: ["Web Development", "React", "Node.js"],
  }),
});
const result = await response.json();
console.log(result.data.found); // Array of found skills with IDs
console.log(result.data.notFound); // Array of not found skills
```

### Get Category of a Skill

```javascript
// Get category by skill slug
const response = await fetch("/api/skills/react-development/category");
const result = await response.json();
console.log(result.data.category); // Category details
console.log(result.data.subcategory); // Subcategory details

// Get category by skill ID
const response = await fetch("/api/skills/id/64fa6.../category");
const result = await response.json();
console.log(result.data.category); // Category details
console.log(result.data.subcategory); // Subcategory details
```

### Get Featured Categories

```javascript
// Get all featured categories with stats
const response = await fetch("/api/featured-categories");
const result = await response.json();
console.log(result.data); // Array of featured categories with stats

// Get specific featured category details
const response = await fetch("/api/featured-categories/tech");
const result = await response.json();
console.log(result.data.category); // Category details
console.log(result.data.topSkills); // Top 5 skills
console.log(result.data.stats); // Category statistics

// Get minimal featured categories list (for dropdowns)
const response = await fetch("/api/featured-categories/minimal/list");
const result = await response.json();
console.log(result.data); // Simple list of featured categories
```

---

## 🚀 Available Scripts

### Database Seeding

```bash
npm run seed:vendors        # Seed only vendors
npm run seed:users-vendors  # Seed users + vendors
npm run seed:all           # Default to vendor seeding
```

### Development

```bash
npm run dev                # Start development server
npm run build              # Build for production
npm start                  # Start production server
```

---

## 📝 Notes

1. **Authentication**:
   - Use `/api/auth/register` and `/api/auth/login` for user authentication
   - All protected endpoints require `Authorization: Bearer <token>` header
   - Admin endpoints require admin role authentication
   - JWT tokens expire after 7 days (configurable)
2. **Password Security**: All passwords are hashed with bcrypt (12 salt rounds)
3. **Validation**: All endpoints include proper validation and error handling
4. **Pagination**: Most list endpoints support pagination
5. **Search**: Text search is case-insensitive and supports partial matches
6. **Relationships**: Vendor skills are populated with full skill details
7. **Statistics**: Comprehensive stats endpoints for analytics
8. **Error Handling**: Consistent error response format across all endpoints
9. **Role-Based Access**: Different user roles (admin, vendor, client) have different permissions

---

## 🔗 Related Files

- **Models**: `src/models/Vendors.ts`, `src/models/Users.ts`, `src/models/Skills.ts`
- **Routes**: `src/routes/Vendors.ts`, `src/routes/Users.ts`, `src/routes/Skills.ts`
- **Server**: `server.ts`
- **Seeding**: `src/scripts/seedVendors.ts`

---

_Last updated: September 2025_
