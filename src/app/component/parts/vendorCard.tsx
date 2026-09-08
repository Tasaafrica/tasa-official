"use client";
import { Star, BadgeCheck, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { bookmarkApi } from "@/lib/bookmarks";
import { toast } from "sonner";

interface VendorCardProps {
  vendorId?: string;
  imageAlt: string;
  imageUrl?: string;
  vendorAvatar?: string;
  vendorName: string;
  vendorLevel: string;
  title: string;
  rating: number;
  reviews: number;
  startingPrice: number;
  currency?: string;
  onBookmarkToggle?: (isSaved: boolean) => void;
}

const truncateWords = (text: string, maxWords: number) => {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "…";
};

export default function VendorCard({
  vendorId,
  imageAlt,
  imageUrl,
  vendorAvatar,
  vendorName,
  vendorLevel,
  title,
  rating,
  reviews,
  startingPrice,
  currency = "$",
  onBookmarkToggle,
}: VendorCardProps) {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      if (vendorId && session?.authToken) {
        const result = await bookmarkApi.checkStatus(vendorId, session.authToken as string);
        if (result.success) {
          setIsSaved(result.isBookmarked);
        }
      }
    };
    fetchBookmarkStatus();
  }, [vendorId, session]);

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session?.authToken) {
      toast.error("Please sign in to bookmark vendors");
      return;
    }
    if (!vendorId || isLoading) {
      if (!vendorId) setIsSaved(!isSaved); // Fallback for mock data
      return;
    }
    
    setIsLoading(true);
    const token = session.authToken as string;
    
    if (isSaved) {
      const res = await bookmarkApi.removeBookmark(vendorId, token);
      if (res.success) {
        setIsSaved(false);
        toast.success(res.message || "Removed from bookmarks");
        if (onBookmarkToggle) onBookmarkToggle(false);
      } else {
        toast.error(res.error || "Failed to remove bookmark");
      }
    } else {
      const res = await bookmarkApi.addBookmark(vendorId, token);
      if (res.success) {
        setIsSaved(true);
        toast.success(res.message || "Added to bookmarks");
        if (onBookmarkToggle) onBookmarkToggle(true);
      } else {
        toast.error(res.error || "Failed to add bookmark");
      }
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      className="group bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 h-full flex flex-col p-4"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
    >
      {/* Circle Image Container */}
      <div className="relative mx-auto mb-5">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-[3px] bg-gradient-to-tr from-teal-500 to-emerald-300 shadow-sm">
            <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-slate-100 relative">
                {imageUrl ? (
                <motion.img
                    src={imageUrl}
                    alt={imageAlt}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                />
                ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-400 font-medium">
                    No Avatar
                </div>
                )}
            </div>
        </div>

        {/* Save Button - Positioned top-right of circle */}
        <button
          type="button"
          onClick={handleBookmarkToggle}
          disabled={isLoading}
          className={`absolute -top-1 -right-1 h-8 w-8 rounded-full bg-white shadow-lg flex items-center justify-center z-10 border border-slate-50 transition-transform ${isLoading ? "opacity-70 cursor-wait" : "active:scale-90"}`}
        >
          <Heart
            className={`h-4 w-4 transition-colors duration-300 ${isSaved ? "fill-rose-500 text-rose-500" : "text-slate-300"}`}
          />
        </button>

        {/* Status indicator (Verified) */}
        {vendorLevel === "Top Rated" && (
            <div className="absolute -bottom-1 right-2 bg-white p-1 rounded-full shadow-md border border-slate-50">
                <BadgeCheck className="w-5 h-5 text-teal-600" />
            </div>
        )}
      </div>

      {/* Content - Centered */}
      <div className="flex flex-col flex-1 text-center">
        {/* Vendor Name & Level */}
        <div className="mb-2 px-1">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate mb-0.5">
                {vendorName}
            </h4>
            <div className="flex items-center justify-center gap-1.5 uppercase tracking-widest text-[9px] sm:text-[10px] font-bold text-slate-400">
                <span>{vendorLevel}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-0.5 text-slate-900">
                    <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500" />
                    <span>{rating.toFixed(1)}</span>
                </div>
            </div>
        </div>

        {/* Title */}
        <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed mb-4 px-2 flex-1">
          {truncateWords(title, 20)}
        </p>
      </div>
    </motion.div>
  );
}
