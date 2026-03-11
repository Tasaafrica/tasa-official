"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Search, CheckCircle } from "lucide-react";
import { Button } from "@/app/component/ui/button";

interface HomeHeroSectionProps {
  fontClassName?: string;
}

export default function NotFoundHero({ fontClassName }: HomeHeroSectionProps) {
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
              Work with talented people at the most affordable price to get the
              best services and results.
            </motion.p>
            <motion.div className="max-w-xl" variants={itemVariants}>
              <div className="group flex flex-col sm:flex-row items-stretch gap-3 mb-4 bg-white border px-3 py-2 shadow-sm transition-all duration-200 focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-[#0F766E]/20 hover:shadow-md">
                <div className="flex items-center gap-3 flex-1 px-2">
                  <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#0F766E] transition-colors duration-200" />
                  <input
                    type="text"
                    placeholder="What service are you looking for?"
                    className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                    aria-label="Search services"
                  />
                </div>
                <Button className="h-10 sm:h-11 rounded-50 bg-[#0F766E] hover:bg-[#0D5F59] text-white px-6 shadow-sm transition-all duration-200 hover:shadow-md">
                  Search
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span className="font-semibold text-[#334155]">Popular:</span>
                {["Website Design", "Logo Design", "WordPress", "AI Art"].map(
                  (tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="px-2.5 py-1  text-[#334155]-600 transition-all duration-200 hover:border-[#0F766E] hover:text-[#0F766E] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/30"
                    >
                      {tag}
                    </button>
                  ),
                )}
              </div>
            </motion.div>
          </div>
          <motion.div className="relative" variants={imageVariants}>
            <div className="relative overflow-hidden rounded-2xl  aspect-[4/3]">
              <div className="absolute inset-0 flex items-center justify-center  text-sm">
                <img
                  src="/404-temp.png"
                  alt="Hero Image"
                  className="w-full object-cover transition-transform duration-300"
                />
              </div>
              <motion.div
                className="absolute inset-0 flex items-center justify-center rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="px-8 py-6 rounded-2xl backdrop-blur-md bg-white/20 border border-white/30 shadow-xl">
                  <h2 className="text-5xl md:text-6xl font-bold text-white text-center drop-shadow-lg">
                    Page NOT found
                  </h2>
                </div>
              </motion.div>
            </div>
            <div className="absolute -left-6 bottom-6 bg-[#334155] rounded-xl shadow-md px-4 py-3 border border-[#334155]">
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
