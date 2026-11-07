"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface NotFoundHeroProps {
  fontClassName?: string;
}

const INDUSTRY_LINKS = [
  { name: "Graphic & Design", slug: "graphics-design" },
  { name: "Programming & Tech", slug: "programming-tech" },
  { name: "Digital Marketing", slug: "digital-marketing" },
  { name: "Video & Animation", slug: "video-animation" },
  { name: "Writing & Translation", slug: "writing-translation" },
  { name: "Business & Consulting", slug: "business-consulting" },
];

export default function NotFoundHero({ fontClassName }: NotFoundHeroProps) {
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
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      className={`${fontClassName ?? ""} relative overflow-hidden bg-[var(--color-bg-page)] pt-6 sm:pt-8 lg:pt-10 pb-4 sm:pb-5 border-b border-[var(--color-border)]/60`}
    >
      {/* Subtle soft backdrop accents blending into section */}
      <div className="absolute top-0 right-1/4 w-72 lg:w-80 h-72 lg:h-80 bg-[var(--color-bg-brand-soft)]/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-60 lg:w-72 h-60 lg:h-72 bg-[var(--color-bg-soft)]/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Hero Content */}
      <div className="container-responsive">
        <motion.div
          className="grid items-center gap-6 lg:gap-8 lg:grid-cols-12"
          variants={containerVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          animate="visible"
        >
          {/* Left Column: 404 Heading, Subtitle & Action CTAs */}
          <div className="lg:col-span-7">
            {/* Main Headline - Bold 404 */}
            <motion.h1
              className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8rem] font-black tracking-[-0.04em] text-[var(--color-text-primary)] leading-none"
              variants={itemVariants}
            >
              404
            </motion.h1>

            {/* Subtitle with Highlighting Orange Swoosh */}
            <motion.div
              className="mt-2.5 sm:mt-3.5"
              variants={itemVariants}
            >
              <div className="relative inline-block">
                <span className="relative z-10 font-display text-base sm:text-lg md:text-xl lg:text-[1.35rem] font-semibold tracking-tight text-[var(--color-brand-dark)]">
                  Page not found
                </span>
                <div className="absolute top-[8%] sm:top-[10%] -left-[3%] w-[114%] pointer-events-none select-none z-0 rotate-[2.5deg] origin-center">
                  <Image
                    src="/image/orange-swoosh.png"
                    alt=""
                    width={2172}
                    height={724}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>
              </div>
            </motion.div>

            {/* Description Narrative */}
            <motion.p
              className="mt-3.5 sm:mt-4 text-sm sm:text-base md:text-lg text-[var(--color-text-secondary)] max-w-xl leading-relaxed"
              variants={itemVariants}
            >
              The link you followed may be broken or the page has been moved. Don&apos;t worry — Africa&apos;s largest talent economy is right where you left it.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-4"
              variants={itemVariants}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] hover:text-[#1E293B] text-white font-semibold text-sm sm:text-base transition-all duration-200 shadow-sm hover:shadow"
              >
                <span>Back to Home</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Trusted by Credible Brands - Horizontally arranged under CTAs */}
            <motion.div
              className="mt-6 sm:mt-8 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2.5"
              variants={itemVariants}
            >
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)] shrink-0">
                Trusted by
              </span>
              <div className="flex flex-wrap items-center gap-x-5 sm:gap-x-6 gap-y-2 text-[var(--color-text-muted)]">
                {/* Google */}
                <div
                  className="flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity cursor-default"
                  title="Google"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="font-semibold text-xs tracking-tight">Google</span>
                </div>

                {/* Microsoft */}
                <div
                  className="flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity cursor-default"
                  title="Microsoft"
                >
                  <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
                    <span className="bg-current rounded-[0.5px]" />
                    <span className="bg-current rounded-[0.5px]" />
                    <span className="bg-current rounded-[0.5px]" />
                    <span className="bg-current rounded-[0.5px]" />
                  </div>
                  <span className="font-semibold text-xs tracking-tight">Microsoft</span>
                </div>

                {/* Paystack */}
                <div
                  className="flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity cursor-default"
                  title="Paystack"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <rect x="2" y="3" width="20" height="3" rx="1.5" />
                    <rect x="2" y="9" width="14" height="3" rx="1.5" />
                    <rect x="2" y="15" width="20" height="3" rx="1.5" />
                    <rect x="2" y="21" width="8" height="3" rx="1.5" />
                  </svg>
                  <span className="font-bold text-xs tracking-tight">paystack</span>
                </div>

                {/* Flutterwave */}
                <div
                  className="flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity cursor-default"
                  title="Flutterwave"
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path d="M4 16c2-4 6-6 10-4s6 6 6 6" strokeLinecap="round" />
                    <path d="M4 10c2-4 6-6 10-4s6 6 6 6" strokeLinecap="round" />
                  </svg>
                  <span className="font-bold text-xs tracking-tight">flutterwave</span>
                </div>

                {/* MTN */}
                <div
                  className="flex items-center opacity-70 hover:opacity-100 transition-opacity cursor-default"
                  title="MTN"
                >
                  <div className="border border-current rounded-full px-2 py-0.5 flex items-center justify-center">
                    <span className="font-black text-[10px] tracking-wider">MTN</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Sketch Map of Africa with Profile Cards matching main hero */}
          <motion.div
            className="lg:col-span-5 relative flex items-center justify-center mt-2 lg:mt-0"
            variants={imageVariants}
          >
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[350px] aspect-square flex items-center justify-center">
              {/* Africa Sketch Map - Unboxed, radial-gradient edge blend directly into the hero canvas */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_82%)]">
                <Image
                  src="/africa-sketch.svg"
                  alt="Artistic sketch map of Africa"
                  width={420}
                  height={420}
                  className="w-full h-full object-contain opacity-25"
                  priority
                />
              </div>

              {/* Location Pulse Pin 1 (West Africa / Nigeria region) */}
              <div className="absolute top-[36%] left-[22%] pointer-events-none flex items-center justify-center">
                <span className="absolute w-4 h-4 rounded-full bg-[var(--color-brand-primary)]/25 animate-ping" />
                <span className="relative w-2 h-2 rounded-full bg-[var(--color-brand-primary)] ring-2 ring-white shadow-xs" />
              </div>

              {/* Location Pulse Pin 2 (East Africa region) */}
              <div className="absolute top-[54%] right-[28%] pointer-events-none flex items-center justify-center">
                <span className="absolute w-4 h-4 rounded-full bg-[var(--color-brand-accent)]/30 animate-ping" />
                <span className="relative w-2 h-2 rounded-full bg-[var(--color-brand-accent)] ring-2 ring-white shadow-xs" />
              </div>

              {/* Profile Card 1: Top-Left / Amara */}
              <motion.div
                initial={{ opacity: 0, y: 15, x: -10 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute top-1 sm:top-2 left-0 sm:-left-2 z-20 w-[190px] sm:w-[210px] bg-white/95 backdrop-blur-md rounded-xl p-2 sm:p-2.5 border border-[var(--color-border)] shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <div className="relative shrink-0">
                    <Image
                      src="/image/Ultra-realistic_headshot_of_202603182020.png"
                      alt="Amara O. - Product Designer"
                      width={38}
                      height={38}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-[var(--color-border-brand)]/40 shadow-xs"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[var(--color-success)] ring-1.5 ring-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-[var(--color-text-primary)] truncate">
                        Amara O.
                      </h4>
                      <span className="text-[9px] font-semibold text-[var(--color-brand-primary)] bg-[var(--color-bg-brand-soft)] px-1 py-0.2 rounded">
                        Top Rated
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--color-text-secondary)] truncate font-medium">
                      Product Designer
                    </p>
                    <div className="flex items-center gap-1 text-[9px] text-[var(--color-text-muted)] mt-0.5">
                      <span>Lagos</span>
                      <span>•</span>
                      <span className="text-[var(--color-warning)] font-semibold flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-[var(--color-warning)]" />
                        5.0
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Profile Card 2: Bottom-Right / Kwame */}
              <motion.div
                initial={{ opacity: 0, y: 15, x: 10 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="absolute bottom-1 sm:bottom-2 right-0 sm:-right-2 z-20 w-[190px] sm:w-[210px] bg-white/95 backdrop-blur-md rounded-xl p-2 sm:p-2.5 border border-[var(--color-border)] shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <div className="relative shrink-0">
                    <Image
                      src="/image/Ultra-realistic_professional_headshot_202603182021.png"
                      alt="Kwame M. - Full-Stack Engineer"
                      width={38}
                      height={38}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-[var(--color-border-brand)]/40 shadow-xs"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[var(--color-success)] ring-1.5 ring-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-[var(--color-text-primary)] truncate">
                        Kwame M.
                      </h4>
                      <span className="text-[9px] font-semibold text-[var(--color-warning)] bg-[var(--color-highlight-soft)] px-1 py-0.2 rounded">
                        Verified
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--color-text-secondary)] truncate font-medium">
                      Full-Stack Engineer
                    </p>
                    <div className="flex items-center gap-1 text-[9px] text-[var(--color-text-muted)] mt-0.5">
                      <span>Accra</span>
                      <span>•</span>
                      <span className="text-[var(--color-warning)] font-semibold flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-[var(--color-warning)]" />
                        4.9
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Full-width Separator across the hero section */}
      <div className="w-full border-t border-[var(--color-border)]/70 mt-5 sm:mt-6 lg:mt-7 mb-2.5 sm:mb-3" />

      {/* Category / Industry Links */}
      <div className="container-responsive">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] shrink-0">
            Explore Industries
          </span>

          <nav
            className="flex flex-wrap items-center gap-x-5 sm:gap-x-7 gap-y-1.5 text-xs sm:text-sm"
            aria-label="Industries and categories"
          >
            {INDUSTRY_LINKS.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] transition-colors duration-150"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
