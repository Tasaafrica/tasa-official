import Link from "next/link";
import { Home, ChevronDown } from "lucide-react";

interface PlainHeroProps {
  title: string;
  description: string;
  breadcrumbs: Array<{
    label: string;
    href?: string;
  }>;
  showExpandable?: boolean;
  onExpand?: () => void;
}

export default function PlainHero({
  title,
  description,
  breadcrumbs,
  showExpandable = false,
  onExpand,
}: PlainHeroProps) {
  return (
    <section className="py-8 bg-white">
      <div className="container-responsive pt-16">
        {/* Breadcrumb Navigation */}
        <nav className="hidden md:flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link
            href="/"
            className="hover:text-gray-700 transition-colors duration-200"
          >
            <Home className="h-4 w-4 inline-block" />
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-gray-700 transition-colors duration-200"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>

        {/* Hero Content */}
        <div className="max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-left">
            {title}
          </h1>

          <div className="flex items-start justify-between">
            <p className="text-md text-gray-600 leading-relaxed pr-8 text-left">
              {description}
            </p>

            {showExpandable && (
              <button
                onClick={onExpand}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Expand description"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
