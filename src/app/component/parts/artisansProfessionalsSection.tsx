"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ArtisansProfessionalsSectionProps {
  className?: string;
}

export default function ArtisansProfessionalsSection({
  className = "",
}: ArtisansProfessionalsSectionProps) {
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
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const visualVariants: Variants = {
    hidden: { opacity: 0, scale: 0.96, y: 14 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      id="artisans-professionals"
      aria-labelledby="artisans-professionals-heading"
      className={`relative overflow-hidden bg-[var(--color-bg-page)] py-8 sm:py-10 lg:py-12 border-b border-[var(--color-border)]/60 ${className}`}
    >
      {/* Subtle atmospheric ambient glow centered behind the figures */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-[var(--color-bg-brand-soft)]/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container-responsive">
        <motion.div
          className="flex flex-col items-center"
          variants={containerVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Centered Section Header at the Top */}
          <motion.div
            className="text-center max-w-2xl mx-auto mb-6 sm:mb-8"
            variants={itemVariants}
          >
            <h2
              id="artisans-professionals-heading"
              className="font-display text-2xl sm:text-3xl lg:text-[2.25rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)] leading-[1.18] mb-2 sm:mb-2.5"
            >
              <span className="text-[var(--color-brand-primary)]">
                Artisans
              </span>
              <span> & </span>
              <span className="text-[var(--color-brand-dark)]">
                Professionals
              </span>
              .
            </h2>

            <p className="text-xs sm:text-sm lg:text-[0.95rem] text-[var(--color-text-secondary)] leading-relaxed font-normal max-w-xl mx-auto">
              Connect with Africa’s certified executives, consultant minds, and
              master craftspeople ready to build, scale, and deliver with
              uncompromised excellence.
            </p>
          </motion.div>

          {/* Female Professional Visual Centerpiece */}
          <motion.div
            className="flex items-center justify-center mb-6 sm:mb-8 select-none"
            variants={visualVariants}
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[500px] flex items-center justify-center">
              {/* Soft atmospheric background aura */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-brand-soft)]/80 via-[var(--color-bg-subtle)]/40 to-transparent rounded-3xl -z-10 blur-2xl scale-95" />

              <Image
                src="/image/female%20professional.png"
                alt="African female corporate executive and professional consultant"
                width={1200}
                height={896}
                className="w-full h-auto object-contain drop-shadow-[0_16px_36px_rgba(51,65,85,0.14)]"
                priority={false}
              />
            </div>
          </motion.div>

          {/* Centered CTA Action Buttons */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-1 sm:mt-2"
            variants={itemVariants}
          >
            <Link
              href="/become-a-vendor"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[var(--color-brand-dark)] text-white hover:text-white hover:bg-[#1E293B] font-semibold text-sm transition-all shadow-sm hover:shadow"
            >
              <span className="text-white">Join as a Talent</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>

            <Link
              href="/professionals"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl border border-[var(--color-border-strong)] text-[var(--color-text-primary)] font-semibold text-sm hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] bg-white transition-all shadow-sm"
            >
              <span>Learn more</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
