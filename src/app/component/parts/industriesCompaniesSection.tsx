"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface IndustriesCompaniesSectionProps {
  className?: string;
}

export default function IndustriesCompaniesSection({
  className = "",
}: IndustriesCompaniesSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const visualVariants: Variants = {
    hidden: { opacity: 0, x: 24 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      id="industries-companies"
      aria-labelledby="industries-companies-heading"
      className={`relative overflow-hidden bg-[#1E293B] text-white py-8 sm:py-10 lg:py-12 border-y border-slate-700/60 ${className}`}
    >
      {/* Subtle atmospheric ambient glow behind the right side */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-[var(--color-brand-primary)]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container-responsive">
        <motion.div
          className="grid items-end gap-6 lg:gap-8 xl:gap-10 lg:grid-cols-12"
          variants={containerVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Left Column: Headline, Short Description & Learn More Button */}
          <motion.div
            className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center text-left self-center py-2 sm:py-3"
            variants={itemVariants}
          >
            {/* Headline starting from left */}
            <h2
              id="industries-companies-heading"
              className="font-display text-xl sm:text-2xl md:text-3xl lg:text-[2.1rem] xl:text-[2.35rem] font-extrabold tracking-[-0.03em] text-white leading-[1.18] mb-2 sm:mb-2.5"
            >
              <span>For </span>
              <span className="text-[var(--color-brand-secondary)]">
                Industries
              </span>
              <span> & </span>
              <span className="text-white">Companies</span>.
            </h2>

            {/* Short descriptive text */}
            <p className="text-xs sm:text-sm lg:text-[0.95rem] text-slate-300 leading-relaxed font-normal mb-4 sm:mb-5 max-w-xl">
              Scale your operations with access to Africa’s skilled professionals, specialist teams, and reliable service providers.
              Find the right people and business partners, with support for meeting industry standards 
              and clear service agreements.
            </p>

            {/* Call to action: Learn more button */}
            <div>
              <Link
                href="/industries"
                className="group inline-flex items-center gap-2 px-5 py-2.5 sm:px-5.5 sm:py-2.5 rounded-xl bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-secondary)] hover:text-[#1E293B] font-semibold text-xs sm:text-sm transition-all duration-200 shadow-sm hover:shadow-md hover:translate-y-[-1px] active:translate-y-[0px] w-fit"
              >
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:text-[#1E293B] group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </motion.div>

          {/* Extreme Right: Modern Corporate Skyscrapers (PNG) - Bottom-Aligned & Clipped Inside */}
          <motion.div
            className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end items-end w-full self-end -mb-5 sm:-mb-6 lg:-mb-8"
            variants={visualVariants}
          >
            <div className="relative w-full max-w-[460px] lg:max-w-[500px] xl:max-w-[540px] h-[130px] sm:h-[155px] md:h-[175px] lg:h-[195px] xl:h-[210px] overflow-hidden flex items-start justify-end">
              <div className="relative w-full h-[200px] sm:h-[240px] md:h-[270px] lg:h-[300px] xl:h-[320px] shrink-0">
                <Image
                  src="/image/corporate-skyscrapers.png"
                  alt="Modern corporate skyscrapers and high-rise commercial architecture"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain object-top lg:object-right-top drop-shadow-[0_15px_30px_rgba(0,0,0,0.45)] select-none pointer-events-none"
                  priority={false}
                />
              </div>
              {/* Subtle bottom gradient mask ensuring seamless fade at the clipping line */}
              <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-[#1E293B] to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
