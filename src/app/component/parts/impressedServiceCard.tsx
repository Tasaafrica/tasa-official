"use client";
import { Star, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

interface ImpressedServiceCardProps {
  imageAlt: string;
  imageUrl?: string;
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
  sellerName,
  sellerLevel,
  title,
  rating,
  reviews,
  startingPrice,
  currency = "$",
}: ImpressedServiceCardProps) {
  return (
    <motion.div
      className="group bg-white rounded-2xl border border-slate-100 shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
      whileHover={{
        y: -8,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="relative overflow-hidden rounded-t-2xl bg-slate-100 aspect-[4/3]">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <motion.img
            src={imageUrl}
            alt={imageAlt}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">
            Image Placeholder
          </div>
        )}
        <motion.button
          type="button"
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 shadow-sm border border-slate-200 text-slate-500"
          whileHover={{ scale: 1.15, color: "#0F766E" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          aria-label="Save service"
        >
          <span className="text-base">☆</span>
        </motion.button>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-full bg-slate-200" />
          <div className="leading-tight">
            <div className="flex items-center gap-1 text-sm font-semibold text-slate-800">
              {sellerName}
              <BadgeCheck className="h-4 w-4 text-[#0F766E]" />
            </div>
            <div className="text-[11px] uppercase tracking-wide text-slate-500">
              {sellerLevel}
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-800 font-medium mb-3 line-clamp-2">
          {title}
        </p>

        <div className="flex items-center gap-1 text-xs text-slate-600 mb-4">
          <Star className="h-3.5 w-3.5 text-amber-500" />
          <span className="font-semibold text-slate-700">
            {rating.toFixed(1)}
          </span>
          <span>({reviews})</span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="uppercase tracking-wide">Starting at</span>
          <span className="text-sm font-semibold text-slate-900">
            {currency}{startingPrice}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
