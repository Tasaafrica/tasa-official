"use client";

import { Home } from "lucide-react";
import Link from "next/link";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface CategoryHeroProps {
  title: string;
  categorySlug: string;
  description?: string;
  breadcrumbs: Breadcrumb[];
  onSearch?: (query: string) => void;
}

export default function CategoryHero({
  title,
  categorySlug,
  description,
  breadcrumbs,
  onSearch,
}: CategoryHeroProps) {
  // Create dynamic background image URL
  const backgroundImageUrl = `https://res.cloudinary.com/dl4yveavw/image/upload/v1749822930/${categorySlug}_hero.png`;
  return (
    <>
      {/* Breadcrumb Navigation - Full Width */}
      <div className="w-full bg-[linear-gradient(90deg,#CCFBF1_0%,#CCFBF1_0%,#FFFFFF_100%)] border-b border-slate-200 pt-16">
        <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600 align-items-center">
            <Link
              href="/"
              className="hover:text-gray-700 transition-colors duration-200"
            >
              <Home className="h-4 w-4 inline-block" />
            </Link>
            <span className="text-gray-400 font-medium">&gt;</span>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="text-gray-400 font-medium">&gt;</span>
                )}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="hover:text-teal-600 transition-colors duration-200 font-medium"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-gray-900 font-semibold">
                    {crumb.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Hero Section - Two Color Block */}
      <section
        className="relative overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        <div className="flex h-screen max-h-[400px] min-h-[300px] bg-[linear-gradient(to_bottom,#0F172A_50%,#ffff_50%)]">
          {/* Content */}
          <div className="relative w-full flex items-center justify-center px-6">
            <div className="max-w-3xl w-full">
              {/* Elevated Card */}
              <div
                className="rounded-3xl border border-slate-200 shadow-lg shadow-slate-300/50 p-8 md:p-12 bg-cover bg-center bg-no-repeat relative overflow-hidden"
                style={{
                  backgroundImage: `url('${backgroundImageUrl}')`,
                  backgroundColor: "#ffffff",
                  transform: "rotateX(8deg) rotateZ(0deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Title */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-center">
                    {title}
                  </h1>

                  {/* Description */}
                  {description && (
                    <p className="text-center text-white text-lg mb-8 leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
