import React from "react";
import { Button } from "@/app/component/ui/button";
import { Star, MapPin, Briefcase, Mail } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  experience?: string;
  hourlyRate?: string;
  rating?: number;
  skills?: string[];
  businessName?: string;
  businessType?: string;
  availability?: string;
  portfolio?: string;
  profileImage?: string;
}

interface UserCardProps {
  user: User;
  className?: string;
}

export default function UserCard({ user, className = "" }: UserCardProps) {
  const {
    _id,
    name,
    email,
    bio,
    location,
    experience,
    hourlyRate,
    rating,
    skills,
    businessName,
    businessType,
    availability,
    portfolio,
    profileImage,
  } = user;

  return (
    <div
      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden ${className}`}
    >
      {/* Profile Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start gap-4">
          {/* Profile Image */}
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {profileImage ? (
              <img
                src={profileImage}
                alt={name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {name}
            </h3>
            {businessName && (
              <p className="text-sm text-teal-600 font-medium truncate">
                {businessName}
              </p>
            )}
            {businessType && (
              <p className="text-xs text-gray-500 capitalize">{businessType}</p>
            )}

            {/* Rating */}
            {rating && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 font-medium">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {bio && (
        <div className="px-6 pb-4">
          <p className="text-sm text-gray-600 line-clamp-3">{bio}</p>
        </div>
      )}

      {/* Details */}
      <div className="px-6 pb-4 space-y-2">
        {location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="truncate">{location}</span>
          </div>
        )}

        {experience && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase className="h-4 w-4 text-gray-400" />
            <span>{experience}</span>
          </div>
        )}

        {hourlyRate && (
          <div className="text-sm">
            <span className="text-gray-600">Rate: </span>
            <span className="font-semibold text-teal-600">
              ${hourlyRate}/hour
            </span>
          </div>
        )}

        {availability && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Availability: </span>
            <span>{availability}</span>
          </div>
        )}
      </div>

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-full font-medium"
              >
                {typeof skill === "string"
                  ? skill
                  : (skill as any)?.name || skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-6 pb-6 pt-2">
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
          >
            View Profile
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-teal-300 text-teal-600 hover:bg-teal-50"
          >
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
