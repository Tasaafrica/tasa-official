"use client";

import Link from "next/link";
import { getIcon } from "@/lib/icon";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface Skill {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  skills?: Skill[];
  icon?: string;
}

interface SubcategoryGroupCardProps {
  subcategory: Subcategory;
  index?: number;
}

export default function SubcategoryGroupCard({
  subcategory,
  index = 0,
}: SubcategoryGroupCardProps) {
  const SubcategoryIcon = getIcon(subcategory.icon || "HelpCircle");
  const displayedSkills = (subcategory.skills || []).slice(0, 10);
  const hiddenSkillsCount =
    (subcategory.skills?.length || 0) - displayedSkills.length;

  // Construct background image URL
  const backgroundImageUrl = subcategory.slug
    ? `https://res.cloudinary.com/dl4yveavw/image/upload/${subcategory.slug.replace(/[&]/g, "")}.jpg`
    : null;

  // Debug logging
  if (typeof window === "undefined") {
    console.log(
      `[Card: ${subcategory.name}] Subcategory slug:`,
      subcategory.slug,
    );
    console.log(
      `[Card: ${subcategory.name}] Skills count:`,
      subcategory.skills?.length || 0,
    );
    if (subcategory.slug) {
      console.log(
        `[Card: ${subcategory.name}] Background URL:`,
        backgroundImageUrl,
      );
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="h-full bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Header and Title - Link to Subcategory */}
        <Link
          href={`/subcategories/${encodeURIComponent(
            subcategory.slug ||
              subcategory.name.toLowerCase().replace(/\s+/g, "-"),
          )}`}
          className="block group"
        >
          {/* Header with background image or gradient fallback */}
          <div
            className="p-8 relative overflow-hidden bg-gradient-to-r from-teal-500 to-emerald-600 bg-cover bg-center min-h-40 flex flex-col justify-between"
            style={
              backgroundImageUrl
                ? {
                    backgroundImage: `url('${backgroundImageUrl}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : {}
            }
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 pointer-events-none"></div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-white/80 bg-[#0F172A]/50 px-3 py-1 rounded-full float-right">
                  {subcategory.skills?.length || 0} +
                </span>
              </div>
            </div>
          </div>

          {/* Title Section */}
          <div className="px-6 pt-6 pb-4">
            <h3 className="text-xl font-bold text-gray-900 transition-colors">
              {subcategory.name}
            </h3>
          </div>
        </Link>

        {/* Skills Grid */}
        <div className="px-6 pb-6">
          {displayedSkills && displayedSkills.length > 0 ? (
            <>
              <div className="mb-4">
                <div className="space-y-2">
                  {displayedSkills.map((skill) => {
                    const SkillIcon = getIcon(skill.icon || "HelpCircle");
                    return (
                      <Link
                        key={skill._id}
                        href={`/skills/${skill.slug}`}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-teal-50 transition-colors duration-300 group/skill"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0">
                          <SkillIcon className="w-4 h-4 text-black" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover/skill:text-teal-600 transition-colors flex-1 truncate">
                          {skill.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {hiddenSkillsCount > 0 && (
                <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs font-semibold text-amber-700">
                    +{hiddenSkillsCount} more
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">No skills available yet</p>
              <p className="text-xs text-gray-400 mt-1">
                (Skills: {subcategory.skills?.length || 0})
              </p>
            </div>
          )}

          {/* CTA */}
          <Link
            href={`/subcategories/${encodeURIComponent(
              subcategory.slug ||
                subcategory.name.toLowerCase().replace(/\s+/g, "-"),
            )}`}
            className="flex items-center justify-between pt-4 px-6 pb-6 border-t border-slate-200 hover:border-teal-300 transition-colors duration-300"
          >
            <span className="text-xs font-semibold text-teal-600 hover:text-teal-700">
              Explore
            </span>
            <ArrowRight className="w-4 h-4 text-teal-600 hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
