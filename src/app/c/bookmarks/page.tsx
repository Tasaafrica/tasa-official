"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { bookmarkApi } from "@/lib/bookmarks";
import { useClientHeader } from "../context";
import VendorCard from "@/app/component/parts/vendorCard";
import Link from "next/link";
import { HeartCrack, RotateCw } from "lucide-react";

export default function BookmarksPage() {
  const { data: session } = useSession();
  const { setTitle, setDescription } = useClientHeader();
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    setTitle("Bookmarks");
    setDescription("Manage your saved vendors and favorite professionals");
  }, [setTitle, setDescription]);

  useEffect(() => {
    if (session?.user?.id && session?.authToken) {
      fetchBookmarks();
    } else if (session === null) {
      setLoading(false);
    }
  }, [session]);

  const fetchBookmarks = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const result = await bookmarkApi.getAll(session!.authToken as string);
      const rawData = result.data;
      
      if (result.success) {
        if (Array.isArray(rawData)) {
          setBookmarks(rawData);
        } else if (rawData?.data && Array.isArray(rawData.data)) {
          setBookmarks(rawData.data);
        } else if (rawData?.data?.vendors && Array.isArray(rawData.data.vendors)) {
          setBookmarks(rawData.data.vendors);
        } else if (rawData?.vendors && Array.isArray(rawData.vendors)) {
          setBookmarks(rawData.vendors);
        } else {
          setBookmarks([]);
        }
      } else {
        setBookmarks([]);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[400px]">
      <LoadingOverlay isVisible={loading} />

      <div className="flex justify-end mb-6">
        <button
          onClick={() => fetchBookmarks(false)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 active:scale-95"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {!loading && bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <HeartCrack className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No bookmarks yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            You haven't saved any vendors to your bookmarks. Browse our talent pool and click the heart icon to save your favorites.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-[#334155] rounded-xl hover:bg-gray-800 transition-colors"
          >
            Browse Talent
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarks.map((item) => {
            const vendor = item.vendor || item.vendorId || item; // Use item.vendor if populated, fallback to item
            return (
              <div key={vendor._id || vendor.id || item._id} className="h-full">
                <Link href={`/vendors/${vendor.slug || vendor._id || vendor.id}`} className="block h-full">
                  <VendorCard
                    onBookmarkToggle={(isSaved) => {
                      if (!isSaved) {
                        // Filter out locally for instant feedback
                        setBookmarks((prev) => prev.filter((b) => {
                          const v = b.vendor || b.vendorId || b;
                          return (v._id || v.id) !== (vendor._id || vendor.id);
                        }));
                        // Silently refresh in the background to ensure it is in sync
                        fetchBookmarks(true);
                      }
                    }}
                    vendorId={vendor._id || vendor.id}
                    imageAlt={vendor.name || "Vendor"}
                    imageUrl={vendor.profileImage}
                    vendorAvatar={vendor.profileImage}
                    vendorName={vendor.name || "Unknown Vendor"}
                    vendorLevel={vendor.level || (vendor.isEmailVerified ? "Top Rated" : "Level 2")}
                    title={vendor.title || vendor.category?.name || "Professional"}
                    rating={vendor.rating || 0}
                    reviews={vendor.reviews || vendor.reviewCount || 0}
                    startingPrice={vendor.startingPrice || vendor.priceFrom || 0}
                    currency={vendor.priceCurrency || "₦"}
                  />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
