"use client";

import React from "react";
import { Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Professional {
  _id: string;
  name: string;
  title?: string;
  bio?: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  profileImage?: string;
  skills?: string[];
  priceFrom?: number;
  priceCurrency?: string;
  verified?: boolean;
}

interface ProfessionalCardProps {
  professional: Professional;
  className?: string;
  href?: string;
}

export default function ProfessionalCard({
  professional,
  className = "",
  href = `/vendor/${professional._id}`,
}: ProfessionalCardProps) {
  const {
    _id,
    name,
    title,
    bio,
    location,
    rating = 0,
    reviewCount = 0,
    profileImage,
    skills = [],
    priceFrom = 5,
    priceCurrency = "₦",
    verified = false,
  } = professional;

  // Limit bio to 2 lines
  const truncatedBio = bio
    ? bio.length > 100
      ? bio.slice(0, 100) + "..."
      : bio
    : "No bio available";

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden ${className}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <Link href={href} className="block">
        {/* Profile Image Section */}
        <div className="relative w-full h-48 bg-gradient-to-br from-teal-400 to-teal-600 overflow-hidden">
          {profileImage ? (
            <motion.img
              src={profileImage}
              alt={name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-5xl">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          {verified && (
            <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow-md">
              <svg
                className="w-5 h-5 text-teal-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Name and Title */}
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
            {name}
          </h3>
          {title && (
            <p className="text-sm text-teal-600 font-medium line-clamp-1 mb-2">
              {title}
            </p>
          )}

          {/* Location */}
          {location && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
              <MapPin className="h-3.5 w-3.5" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-semibold text-gray-900">
                {rating.toFixed(1)}
              </span>
            </div>
            {reviewCount > 0 && (
              <span className="text-xs text-gray-500">
                ({reviewCount} reviews)
              </span>
            )}
          </div>

          {/* Bio Snippet */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
            {truncatedBio}
          </p>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 4 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    +{skills.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              <span>from</span>
              <span className="ml-1 text-sm font-bold text-gray-900">
                {priceCurrency}
                {priceFrom.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
