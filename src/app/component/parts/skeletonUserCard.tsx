import { User, Star, MapPin, Clock } from "lucide-react";

interface SkeletonUserCardProps {
  className?: string;
}

export default function SkeletonUserCard({
  className = "",
}: SkeletonUserCardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 animate-pulse ${className}`}
    >
      {/* User Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar Skeleton */}
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <User className="h-8 w-8 text-gray-400" />
        </div>

        {/* User Info Skeleton */}
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-gray-300" />
              ))}
            </div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      </div>

      {/* Skills Skeleton */}
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="flex flex-wrap gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-6 bg-gray-200 rounded-full w-20"></div>
          ))}
        </div>
      </div>

      {/* Location and Availability */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        <div className="h-4 bg-gray-200 rounded w-3/5"></div>
      </div>

      {/* Action Button Skeleton */}
      <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
    </div>
  );
}
