import Link from "next/link";
import { Users, Briefcase, Home } from "lucide-react";

interface HeroProps {
  title: string;
  description: string;
  breadcrumbs: Array<{
    label: string;
    href?: string;
  }>;
  variant?: "teal" | "blue" | "purple";
  showStats?: boolean;
  backgroundImage?: string;
 }

export default function Hero({
  title,
  description,
  breadcrumbs,
  variant = "teal",
  showStats = true,
  backgroundImage,
}: HeroProps) {
  const gradientClasses = {
    teal: "bg-gradient-to-r from-teal-700 via-teal-900 to-teal-800",
    blue: "from-blue-600 to-blue-800",
    purple: "from-purple-600 to-purple-800",
  };

  return (
    <section
      className={`py-16 text-white relative overflow-hidden ${
        backgroundImage
          ? "bg-cover bg-center bg-no-repeat"
          : `bg-gradient-to-r ${gradientClasses[variant]}`
      }`}
      style={
        backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}
      }
    >
      {/* Background Image Overlay */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      )}

      {/* Content Container */}
      <div className="relative z-10">
        {/* Breadcrumb */}
        <div className="bg-transparent py-2">
          <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
            <nav className="flex items-center space-x-2 text-sm text-gray-300">
              <Link
                href="/"
                className="hover:text-teal-100 transition-colors duration-200"
              >
                <Home className="mr-2 h-5 w-5 inline-block" />{" "}
                <span className="mx-1">/</span>
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-teal-100 transition-colors duration-200"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-teal-100 font-medium">
                      {crumb.label}
                    </span>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
            <p className="text-xl text-gray-100 mb-8">{description}</p>

            {showStats && (
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  <span>Expert Professionals</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  <span>Quality Services</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
