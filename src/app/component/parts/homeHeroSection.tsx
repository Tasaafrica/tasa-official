"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import SearchAutocomplete from "@/app/component/parts/SearchAutocomplete";
import Link from "next/link";

interface HomeHeroSectionProps {
  fontClassName?: string;
}

export default function HomeHeroSection({
  fontClassName,
}: HomeHeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.35,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7 },
    },
  };

  const popularTags = [
    { name: "Plumbing", slug: "plumbing", type: "subcategory" },
    { name: "Logo Design", slug: "logo-design", type: "skill" },
    { name: "Web Development", slug: "web-development", type: "subcategory" },
    { name: "AI Art", slug: "ai-art", type: "skill" },
  ];

  return (
    <section
      className={`${fontClassName ?? ""} pt-20 pb-10 bg-[linear-gradient(90deg,#CCFBF1_0%,#CCFBF1_0%,#FFFFFF_100%)]`}
    >
      <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
        <motion.div
          className="grid items-center gap-10 lg:grid-cols-2"
          variants={containerVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
        >
          <div>
            <motion.p
              className="text-sm font-semibold tracking-wide text-teal-700 mb-3 hidden"
              variants={itemVariants}
            >
              SkillMarket
            </motion.p>
            <motion.h1
              className="text-4xl md:text-5xl font-semibold leading-tight text-gray-900 mb-5"
              variants={itemVariants}
            >
              Find the right skills and services for your business
            </motion.h1>
            <motion.p
              className="text-gray-600 text-base md:text-lg mb-6 max-w-xl"
              variants={itemVariants}
            >
              Connect with talented professionals to get the best services and results.
            </motion.p>
            <motion.div className="max-w-xl" variants={itemVariants}>
              <SearchAutocomplete />
              
              <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500 mt-3 text-red-500 ">
                <span className="font-semibold text-[#334155]">Popular:</span>
                {popularTags.map((tag) => (
                  <Link
                    key={tag.name}
                    href={tag.type === "subcategory" ? `/subcategories/${tag.slug}` : `/skills/${tag.slug}`}
                    className="px-2.5 py-1 text-[#334155] border border-transparent rounded-full transition-all duration-200 hover:border-[#0F766E] hover:text-[#0F766E] hover:bg-teal-50/50"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
          <motion.div className="relative -mt-10 md:mt-0" variants={imageVariants}>
            <div className="relative overflow-hidden rounded-2xl  aspect-[4/3]">
              <div className="absolute inset-0 flex items-center justify-center  text-sm">
                <img
                  src="/hero-image.png"
                  alt="Hero Image"
                  className="w-full object-cover transition-transform duration-300"
                />
              </div>
            </div>
            <div className="relative sm:absolute sm:-left-6 sm:bottom-6 w-fit sm:w-auto mx-auto sm:mx-0 mt-0 sm:mt-0 bg-[#334155] rounded-xl shadow-md px-4 py-3 border border-[#334155]">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white">Trusted &amp; Verified</p>
                  <p className="text-sm font-semibold text-slate-200">
                    2k+ professionals
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
