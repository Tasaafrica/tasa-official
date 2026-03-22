"use client";
import { Star, BadgeCheck, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface ImpressedServiceCardProps {
  imageAlt: string;
  imageUrl?: string;
  sellerAvatar?: string;
  sellerName: string;
  sellerLevel: string;
  title: string;
  rating: number;
  reviews: number;
  startingPrice: number;
  currency?: string;
}

export default function ImpressedServiceCard({
  imageAlt,
  imageUrl,
  sellerAvatar,
  sellerName,
  sellerLevel,
  title,
  rating,
  reviews,
  startingPrice,
  currency = "$",
}: ImpressedServiceCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <motion.div
      className="group bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_12px_32px_rgba(15,118,110,0.12)] transition-shadow duration-500"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[1.33/1] bg-slate-100">
        {imageUrl ? (
          <motion.img
            src={imageUrl}
            alt={imageAlt}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 font-medium">
            Preview Unavailable
          </div>
        )}
        
        {/* Save Button */}
        <motion.button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsSaved(!isSaved);
          }}
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center z-10 border border-slate-100"
          initial={{ color: "#64748b" }} // slate-500
          animate={{ 
            color: isSaved ? "#f43f5e" : "#64748b",
            scale: 1
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <Heart 
            className={`h-5 w-5 transition-colors duration-300 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} 
          />
        </motion.button>

        {/* Level Badge Overlay (Optional) */}
        <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {sellerLevel}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Seller Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
            {sellerAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={sellerAvatar} 
                alt={sellerName} 
                className="h-full w-full object-cover transition-opacity duration-300"
              />
            ) : (
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {sellerName.substring(0, 2)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-slate-900 truncate hover:text-teal-700 transition-colors cursor-pointer">
                {sellerName}
              </span>
              <BadgeCheck 
                className={`h-3.5 w-3.5 flex-shrink-0 ${
                  sellerLevel === "Top Rated" ? 'text-yellow-500' : 'text-teal-600'
                }`} 
              />
            </div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-tight">
              {sellerLevel}
            </p>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm text-slate-800 font-semibold leading-relaxed mb-4 line-clamp-2 min-h-[40px] group-hover:text-teal-950 transition-colors">
          {title}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-1 text-sm mb-5 pt-4 border-t border-slate-100">
          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          <span className="font-bold text-slate-900">{rating.toFixed(1)}</span>
          <span className="text-slate-400 font-medium">({reviews.toLocaleString()})</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Starting at</span>
          <div className="flex items-baseline gap-0.5">
            <span className="text-sm font-bold text-slate-900">{currency}</span>
            <span className="text-lg font-extrabold text-slate-900 tracking-tight">{startingPrice}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
