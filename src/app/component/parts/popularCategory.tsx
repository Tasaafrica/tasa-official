"use client";

import Link from "next/link";
import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import {
  Brush,
  Code2,
  Megaphone,
  Video,
  PenLine,
  Briefcase,
} from "lucide-react";

interface PopularCategoryProps {
  layout?: "horizontal" | "vertical";
}

interface CategoryItem {
  name: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconText: string;
}

const POPULAR_CATEGORIES: CategoryItem[] = [
  {
    name: "Graphic &\nDesign",
    slug: "graphics-design",
    icon: Brush,
    iconBg: "bg-purple-50",
    iconText: "text-purple-600",
  },
  {
    name: "Programming",
    slug: "programming",
    icon: Code2,
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
  },
  {
    name: "Digital\nMarketing",
    slug: "digital-marketing",
    icon: Megaphone,
    iconBg: "bg-green-50",
    iconText: "text-green-600",
  },
  {
    name: "Video &\nAnimation",
    slug: "video-animation",
    icon: Video,
    iconBg: "bg-red-50",
    iconText: "text-red-600",
  },
  {
    name: "Writing &\nTranslation",
    slug: "writing-translation",
    icon: PenLine,
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
  },
  {
    name: "Business",
    slug: "business",
    icon: Briefcase,
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
  },
];

export default function PopularCategory({
  layout = "horizontal",
}: PopularCategoryProps) {
  const isVertical = layout === "vertical";
  const prefersReducedMotion = useReducedMotion();

  const baseEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const baseTransition = {
    duration: 1.05,
    ease: baseEase,
  };

  const inViewProps = (delay = 0): MotionProps =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: {
            opacity: 1,
            y: 0,
            transition: { ...baseTransition, delay },
          },
          viewport: { once: true, amount: 0.25 },
        };

  return (
    <section className="w-full py-8 bg-transparent">
      <div className="mx-auto px-2 lg:px-8">
        {!isVertical && (
          <motion.h2
            {...inViewProps(0.08)}
            className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 text-center"
          >
            Popular on TASA...
          </motion.h2>
        )}
        <div
          className={
            isVertical
              ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
              : "flex flex-row flex-wrap justify-center gap-4"
          }
        >
          {POPULAR_CATEGORIES.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.slug}
                {...(prefersReducedMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 20, scale: 0.98 },
                      whileInView: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          duration: 0.95,
                          delay: 0.12 + index * 0.07,
                          ease: baseEase,
                        },
                      },
                      viewport: { once: true, amount: 0.3 },
                    })}
              >
                <Link
                  href={`/subcategories/${category.slug}`}
                  className={`
                    flex flex-col items-center justify-center 
                    ${
                      isVertical
                        ? "w-full bg-white rounded-xl border border-slate-100 px-3 py-4"
                        : "w-[130px] bg-white rounded-xl border border-slate-100 px-3 py-4"
                    }
                    cursor-pointer transition-all duration-300 ease-out
                    shadow-[0_6px_18px_rgba(15,23,42,0.08)]
                    hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(15,23,42,0.14)]
                  `}
                >
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full mb-3 mx-auto ${category.iconBg}`}
                  >
                    <Icon className={`h-6 w-6 ${category.iconText}`} />
                  </div>
                  <span className="text-xs font-medium text-slate-700 text-center whitespace-pre-line">
                    {category.name}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
