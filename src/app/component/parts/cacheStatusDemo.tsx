import React from "react";
import { useCategoryData } from "@/app/component/parts/categoryDataProvider";
import { Button } from "@/app/component/ui/button";
import { RefreshCw, Trash2, Clock, Database } from "lucide-react";

export default function CacheStatusDemo() {
  const {
    categories,
    subcategories,
    loading,
    error,
    refreshData,
    clearCache,
    cacheStatus,
  } = useCategoryData();

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return date.toLocaleString();
  };

  const formatTimeUntil = (date: Date | null) => {
    if (!date) return "Unknown";
    const now = new Date();
    const diff = date.getTime() - now.getTime();

    if (diff <= 0) return "Now";

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-blue-800 flex items-center">
          <Database className="mr-2 h-5 w-5" />
          Cache Status & Management
        </h3>
        <div className="flex gap-2">
          <Button
            onClick={refreshData}
            disabled={loading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Refreshing..." : "Refresh Now"}
          </Button>
          <Button
            onClick={clearCache}
            variant="outline"
            size="sm"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Cache
          </Button>
        </div>
      </div>

      {/* Cache Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-blue-200">
          <div className="flex items-center mb-2">
            <Clock className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Cache Status
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {cacheStatus.isFromCache ? "Cached" : "Fresh"}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {cacheStatus.isFromCache
              ? "Loaded from storage"
              : "Just fetched from API"}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-blue-200">
          <div className="flex items-center mb-2">
            <Database className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Last Updated
            </span>
          </div>
          <div className="text-sm font-medium text-gray-900">
            {formatDate(cacheStatus.lastUpdated)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {cacheStatus.lastUpdated
              ? "Data was last refreshed"
              : "No data yet"}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-blue-200">
          <div className="flex items-center mb-2">
            <RefreshCw className="h-4 w-4 text-orange-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Next Refresh
            </span>
          </div>
          <div className="text-sm font-medium text-gray-900">
            {formatTimeUntil(cacheStatus.nextRefresh)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {cacheStatus.nextRefresh ? "Auto-refresh in" : "Not scheduled"}
          </div>
        </div>
      </div>

      {/* Data Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-800 mb-2">Categories</h4>
          <div className="text-2xl font-bold text-green-600">
            {categories.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Available categories in cache
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-purple-200">
          <h4 className="font-medium text-purple-800 mb-2">Subcategories</h4>
          <div className="text-2xl font-bold text-purple-600">
            {subcategories.length}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Available subcategories in cache
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-red-800 mb-2">Error</h4>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Cache Benefits */}
      <div className="bg-white p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-3">Cache Benefits</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700 mb-1">
              🚀 Instant Loading
            </div>
            <div className="text-gray-600">
              Data loads immediately from cache on page refresh
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700 mb-1">
              📱 Offline Support
            </div>
            <div className="text-gray-600">
              Works even when network is slow or unavailable
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700 mb-1">
              ⚡ Reduced API Calls
            </div>
            <div className="text-gray-600">
              Minimizes server requests and improves performance
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700 mb-1">
              🔄 Auto-Refresh
            </div>
            <div className="text-gray-600">
              Background updates keep data current
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
