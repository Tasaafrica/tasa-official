import Link from "next/link";
import { Button } from "@/app/component/ui/button";

interface Profile {
  _id: string;
  name: string;
  profileImage?: string;
}

interface CTAConfig {
  label: string;
  href: string;
}

interface ShowBizProProps {
  heading: string;
  text: string;
  categoryName: string;
  categoryColor: string;
  profiles: Profile[];
  totalProfiles: number;
  cta?: CTAConfig;
}

export default function ShowBizPro({
  heading,
  text,
  categoryName,
  categoryColor,
  profiles,
  totalProfiles,
  cta,
}: ShowBizProProps) {
  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="py-8 bg-white border-y border-gray-200">
      <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
            {heading}
          </h3>
          <p className="text-lg text-gray-600 mb-12 leading-relaxed">{text}</p>

          {/* Profiles Section */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {/* Profile Circles */}
            <div className="flex items-center -space-x-3">
              {profiles.slice(0, 5).map((profile) => {
                return (
                  <Link key={profile._id} href={`/vendor/${profile._id}`}>
                    <div
                      className="relative w-12 h-12 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-semibold text-sm overflow-hidden cursor-pointer transition-opacity"
                      style={{ backgroundColor: categoryColor }}
                    >
                      {profile.profileImage ? (
                        <img
                          src={profile.profileImage}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{getInitials(profile.name)}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* More Count */}
            {totalProfiles > 5 && (
              <div className="ml-2">
                <span className="text-sm font-semibold text-gray-700">
                  +{totalProfiles - 5} more
                </span>
              </div>
            )}
          </div>

          {/* Subtext */}
          <p className="text-sm text-gray-600 mb-8">
            Top verified professionals in {categoryName}
          </p>

          {cta && (
            <Link href={cta.href}>
              <Button
                className="text-white"
                style={{ backgroundColor: categoryColor }}
              >
                {cta.label}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
