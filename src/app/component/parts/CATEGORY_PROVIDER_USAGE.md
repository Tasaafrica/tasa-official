# CategoryDataProvider Usage Guide

## 🎯 **Overview**

The `CategoryDataProvider` is a comprehensive caching solution that fetches all categories and subcategories on page load and provides them throughout the application with intelligent caching strategies.

## 🚀 **Features**

- **Smart Caching**: Data persists across page refreshes
- **Custom Cache Duration**: Configurable cache lifetime
- **Background Refresh**: Automatic updates while user browses
- **Cache Management**: Manual refresh and cache clearing
- **Cache Status**: Real-time cache information
- **Performance**: Instant data access after first load

## 📦 **Installation**

### **Basic Usage (Default: 1 hour cache)**

```typescript
// In App.tsx
import CategoryDataProvider from "./component/parts/categoryDataProvider";

function App() {
  return (
    <CategoryDataProvider>
      <Routes>{/* Your routes */}</Routes>
    </CategoryDataProvider>
  );
}
```

### **Custom Cache Duration**

```typescript
// Cache for 30 minutes
<CategoryDataProvider cacheDuration={30 * 60 * 1000}>
  <Routes>...</Routes>
</CategoryDataProvider>

// Cache for 2 hours
<CategoryDataProvider cacheDuration={2 * 60 * 60 * 1000}>
  <Routes>...</Routes>
</CategoryDataProvider>

// Cache for 4 hours
<CategoryDataProvider cacheDuration={4 * 60 * 60 * 1000}>
  <Routes>...</Routes>
</CategoryDataProvider>

// Cache for 1 day
<CategoryDataProvider cacheDuration={24 * 60 * 60 * 1000}>
  <Routes>...</Routes>
</CategoryDataProvider>
```

### **Disable Background Refresh**

```typescript
<CategoryDataProvider
  cacheDuration={60 * 60 * 1000}
  enableBackgroundRefresh={false}
>
  <Routes>...</Routes>
</CategoryDataProvider>
```

## 🔧 **Usage in Components**

### **Basic Data Access**

```typescript
import { useCategoryData } from "../component/parts/categoryDataProvider";

export default function MyComponent() {
  const { categories, subcategories, loading, error } = useCategoryData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Categories: {categories.length}</h2>
      <h2>Subcategories: {subcategories.length}</h2>
    </div>
  );
}
```

### **Utility Functions**

```typescript
const { getCategoryBySlug, getSubcategoryBySlug, getSubcategoriesByCategory } =
  useCategoryData();

// Get category by slug
const techCategory = getCategoryBySlug("tech");

// Get subcategory by slug
const programmingSub = getSubcategoryBySlug("programming-development");

// Get all subcategories for a category
const techSubcategories = getSubcategoriesByCategory(techCategory._id);
```

### **Cache Management**

```typescript
const { refreshData, clearCache, cacheStatus } = useCategoryData();

// Manual refresh
const handleRefresh = async () => {
  await refreshData();
};

// Clear cache (force fresh fetch)
const handleClearCache = () => {
  clearCache();
};

// Check cache status
if (cacheStatus.isFromCache) {
  console.log("Data loaded from cache!");
}
```

## 📊 **Cache Status Information**

### **cacheStatus Object**

```typescript
interface CacheStatus {
  isFromCache: boolean; // Whether data came from cache
  lastUpdated: Date | null; // When data was last refreshed
  nextRefresh: Date | null; // When next auto-refresh will happen
}
```

### **Display Cache Information**

```typescript
const { cacheStatus } = useCategoryData();

return (
  <div>
    <p>Source: {cacheStatus.isFromCache ? "Cache" : "API"}</p>
    <p>Last Updated: {cacheStatus.lastUpdated?.toLocaleString()}</p>
    <p>Next Refresh: {cacheStatus.nextRefresh?.toLocaleString()}</p>
  </div>
);
```

## ⚡ **Performance Benefits**

### **1. Instant Page Loads**

- **First Visit**: API call (2-3 seconds)
- **Subsequent Refreshes**: Instant from cache
- **Navigation**: Immediate data access

### **2. Smart Refresh Strategy**

- **Background Updates**: While user browses
- **User Activity Detection**: Only when active
- **Tab Visibility**: Refreshes when returning to tab

### **3. Network Optimization**

- **Reduced API Calls**: Minimizes server requests
- **Offline Support**: Works without internet
- **Bandwidth Savings**: No repeated downloads

## 🎨 **Real-World Examples**

### **Category Page with Cache Status**

```typescript
export default function CategoryPage() {
  const { categories, getCategoryBySlug, cacheStatus } = useCategoryData();

  const { categorySlug } = useParams();
  const category = getCategoryBySlug(categorySlug);

  return (
    <div>
      {/* Show cache status */}
      {cacheStatus.isFromCache && (
        <div className="text-sm text-blue-600">📦 Data loaded from cache</div>
      )}

      {/* Category content */}
      <h1>{category?.name}</h1>
      <p>{category?.description}</p>
    </div>
  );
}
```

### **Navigation with Cached Data**

```typescript
export default function Navigation() {
  const { categories } = useCategoryData();

  return (
    <nav>
      {categories.map((category) => (
        <Link key={category._id} to={`/categories/${category.slug}`}>
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
```

### **Cache Management UI**

```typescript
export default function CacheControls() {
  const { refreshData, clearCache, cacheStatus } = useCategoryData();

  return (
    <div className="cache-controls">
      <button onClick={refreshData}>🔄 Refresh Data</button>

      <button onClick={clearCache}>🗑️ Clear Cache</button>

      <div className="cache-info">
        <span>Status: {cacheStatus.isFromCache ? "Cached" : "Fresh"}</span>
        <span>Updated: {cacheStatus.lastUpdated?.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
```

## 🔄 **Cache Lifecycle**

### **1. Initial Load**

```
Page Load → Check Cache → Cache Valid? → Load from Cache
                                    ↓
                              Cache Invalid/Empty
                                    ↓
                              Fetch from API → Save to Cache
```

### **2. Background Refresh**

```
Every 5 minutes → Check if cache is stale → Refresh if needed
User returns to tab → Check cache validity → Refresh if stale
```

### **3. Manual Control**

```
User clicks refresh → Force API call → Update cache
User clears cache → Remove all cached data → Force fresh fetch
```

## 🎯 **Best Practices**

### **1. Cache Duration Selection**

- **Frequently Updated Data**: 30 minutes - 1 hour
- **Stable Data**: 2-4 hours
- **Rarely Changed Data**: 1 day or more

### **2. Background Refresh**

- **Enable**: For real-time applications
- **Disable**: For static content or when you want full control

### **3. Error Handling**

```typescript
const { error, refreshData } = useCategoryData();

if (error) {
  return (
    <div>
      <p>Error: {error}</p>
      <button onClick={refreshData}>Try Again</button>
    </div>
  );
}
```

## 🚨 **Troubleshooting**

### **Cache Not Working**

1. Check if `CategoryDataProvider` wraps your app
2. Verify localStorage is available
3. Check browser console for errors

### **Data Not Updating**

1. Clear cache manually
2. Check cache duration setting
3. Verify background refresh is enabled

### **Performance Issues**

1. Reduce cache duration
2. Disable background refresh
3. Check for memory leaks in components

## 📱 **Browser Support**

- **Modern Browsers**: Full support
- **Mobile**: Excellent performance
- **Offline**: Graceful degradation
- **Storage**: Uses localStorage (5-10MB limit)

---

**The CategoryDataProvider gives you the best of both worlds: instant performance and always-fresh data! 🎉**
