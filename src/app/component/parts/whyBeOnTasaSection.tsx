"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AUDIENCE_CATEGORIES = [
  {
    title: "Business & Enterprise Leaders",
    href: "/industries",
  },
  {
    title: "Creatives",
    href: "/creatives",
  },
  {
    title: "Artisans & Professionals",
    href: "/professionals",
  },
  {
    title: "Student Talents",
    href: "/students",
  },
];

export default function WhyBeOnTasaSection() {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section
      aria-label="Why you should be on Tasa Africa"
      className="relative z-30 overflow-visible bg-transparent pt-14 sm:pt-18 lg:pt-24 pb-8 sm:pb-12 lg:pb-16"
    >
      <div className="container-responsive">
        {/* Frame Card matching StudentCTA styling */}
        <div className="relative rounded-2xl lg:rounded-3xl bg-[#1E293B] border border-slate-700/60 shadow-2xl overflow-visible">
          {/* Decorative ambient brand glows */}
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-[var(--color-brand-primary)]/15 rounded-full blur-3xl pointer-events-none -z-0" />
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-[var(--color-brand-secondary)]/10 rounded-full blur-2xl pointer-events-none -z-0" />

          {/* ============================================================== */}
          {/* DESKTOP LAYOUT (lg+)                                           */}
          {/* Left Text: strictly bounded with NO overlap on the image       */}
          {/* Center Woman: breakout head above upper border, bottom-0       */}
          {/* Right Links: overlay on the woman with transparent glass blur */}
          {/* ============================================================== */}
          <div className="hidden lg:flex items-center justify-between min-h-[480px] xl:min-h-[520px] relative p-8 lg:p-12 xl:p-14">
            {/* Left Column: Heading, Narrative & Action CTAs - strictly bounded to prevent overlap */}
            <motion.div
              className="w-[36%] max-w-[360px] xl:max-w-[400px] z-30 relative flex flex-col justify-center text-left shrink-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
              {/* Bolder, High-Impact Headline */}
              <motion.h2
                variants={fadeInUp}
                className="font-display text-3xl sm:text-4xl lg:text-[2.85rem] xl:text-[3.35rem] font-black text-white leading-[1.08] tracking-[-0.035em] mb-4"
              >
                Why you should be on{" "}
                <span className="text-[var(--color-brand-secondary)] block mt-1.5 font-black">
                  Tasa Africa
                </span>
              </motion.h2>
            </motion.div>

            {/* Right Column: FIND OUT WHY Audience Links - Overlaid on Right of Image with Transparent Glass */}
            <motion.div
              className="w-[38%] max-w-[340px] xl:max-w-[370px] z-40 relative flex flex-col justify-center shrink-0 pointer-events-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="mb-3.5">
                <span className="text-xs uppercase tracking-widest font-extrabold text-[var(--color-brand-secondary)] block ml-28">
                  FIND OUT WHY
                </span>
              </motion.div>

              <div className="space-y-2.5">
                {AUDIENCE_CATEGORIES.map((category) => (
                  <motion.div key={category.title} variants={fadeInUp}>
                    <Link
                      href={category.href}
                      className="group flex items-center justify-between px-4 py-3.5 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/15 shadow-sm"
                    >
                      <span className="font-semibold text-sm xl:text-[0.95rem] text-white">
                        {category.title}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-white/10 text-slate-200 group-hover:bg-[var(--color-brand-primary)] group-hover:text-white transition-all duration-200 flex items-center justify-center shrink-0 ml-3 shadow-xs">
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ============================================================== */}
          {/* DESKTOP CENTERPIECE: Anchored at center-right of content       */}
          {/* Sits at z-20 so Left Text (z-30) does NOT overlap it          */}
          {/* and Right Links (z-40) overlay cleanly on top of it           */}
          {/* ============================================================== */}
          <div className="hidden lg:flex absolute left-[56%] xl:left-[55%] -translate-x-1/2 bottom-0 z-20 pointer-events-none select-none items-end justify-center leading-none">
            {/* Lower-left atmospheric shadow pool */}
            <div className="absolute bottom-2 -left-10 w-60 h-32 bg-black/65 rounded-full blur-3xl -z-10 pointer-events-none" />

            <Image
              src="/image/woman-pointing-forward.png"
              alt="African professional woman pointing forward"
              width={1254}
              height={1254}
              priority={false}
              className="h-[520px] xl:h-[570px] w-auto max-w-none object-contain object-bottom block align-bottom drop-shadow-[-28px_32px_40px_rgba(0,0,0,0.7)]"
            />
          </div>

          {/* ============================================================== */}
          {/* MOBILE & TABLET LAYOUT (< lg)                                  */}
          {/* ============================================================== */}
          <div className="lg:hidden flex flex-col p-6 sm:p-8 text-left relative z-20">
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white leading-[1.12] mb-5 tracking-tight">
              Why you should be on{" "}
              <span className="text-[var(--color-brand-secondary)] block mt-1 font-black">
                Tasa Africa
              </span>
            </h2>

            {/* Mobile FIND OUT WHY Section */}
            <div className="mb-6">
              <span className="text-[11px] sm:text-xs uppercase tracking-widest font-extrabold text-[var(--color-brand-secondary)] block mb-3">
                FIND OUT WHY
              </span>
              <div className="space-y-2.5">
                {AUDIENCE_CATEGORIES.map((category) => (
                  <Link
                    key={category.title}
                    href={category.href}
                    className="group flex items-center justify-between px-4 py-3.5 rounded-xl bg-white/[0.08] backdrop-blur-md border border-white/15 shadow-sm"
                  >
                    <span className="font-semibold text-xs sm:text-sm text-white">
                      {category.title}
                    </span>
                    <div className="w-6 h-6 rounded-md bg-white/10 text-slate-200 group-hover:bg-[var(--color-brand-primary)] group-hover:text-white transition-all duration-200 flex items-center justify-center shrink-0 ml-2 shadow-xs">
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Woman Centerpiece touching bottom border with left lower shadow */}
            <div className="relative w-full flex items-end justify-center leading-none select-none pointer-events-none -mb-6 sm:-mb-8">
              <div className="absolute bottom-0 left-1/4 w-36 h-20 bg-black/60 rounded-full blur-2xl -z-10" />
              <Image
                src="/image/woman-pointing-forward.png"
                alt="African professional woman pointing forward"
                width={1254}
                height={1254}
                priority={false}
                className="w-full max-w-[280px] sm:max-w-[340px] h-auto object-contain object-bottom block align-bottom drop-shadow-[-20px_25px_35px_rgba(0,0,0,0.65)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
