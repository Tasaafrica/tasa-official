"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CreativeSectionProps {
  className?: string;
}

const CREATIVE_HIGHLIGHTS = [
  {
    number: "01",
    title: "World-Class Talent",
  },
  {
    number: "02",
    title: "Creativity Without Limits"
  },
  {
    number: "03",
    title: "Limitless Imagination ",
  },
];

export default function CreativeSection({ className = "" }: CreativeSectionProps) {
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

  const dancerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 16 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      className={`relative overflow-hidden bg-[var(--color-bg-page)] py-12 sm:py-16 lg:py-20 border-b border-[var(--color-border)]/60 ${className}`}
    >
      {/* Subtle atmospheric ambient glow centered behind the creative focal point */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-[var(--color-bg-brand-soft)]/25 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container-responsive">
        <motion.div
          className="grid items-center gap-8 lg:gap-8 xl:gap-12 lg:grid-cols-12"
          variants={containerVariants}
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Left Column: Headline, Narrative Copy & Action CTA */}
          <motion.div
            className="lg:col-span-3 flex flex-col justify-center"
            variants={itemVariants}
          >
            {/* Headline */}
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)] leading-[1.16] mb-4 sm:mb-5">
              <span>For the </span>
              <span className="text-[var(--color-brand-primary)]">Creatives</span>.
            </h2>

            {/* Narrative description */}
            <p className="text-sm sm:text-base lg:text-[1.05rem] text-[var(--color-text-secondary)] leading-relaxed mb-6 sm:mb-8 font-normal">
              THE TALENT. THE CREATIVITY. THE CULTURE. THE ENERGY.
              Discover Africa’s creative force — from movement artists and visual storytellers to designers, performers and bold new voices. Original ideas, exceptional talent and powerful expression. Rooted in Africa, reaching the world.
            </p>

            {/* Action button */}
            <div className="flex items-center">
              <Link
                href="/become-a-vendor"
                className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-5.5 sm:py-3 rounded-xl border border-[var(--color-border-strong)] text-[var(--color-text-primary)] font-semibold text-sm hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] bg-white transition-all shadow-sm"
              >
                <span>Join as a Creative</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Center Column: Acrobatic Stunt Dancer (Larger Visual Centerpiece) */}
          <motion.div
            className="lg:col-span-5 flex items-center justify-center my-4 lg:my-0"
            variants={dancerVariants}
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[500px] xl:max-w-[540px] aspect-square flex items-center justify-center select-none pointer-events-none">
              <Image
                src="/image/creative-dancer.png"
                alt="African creative dancer performing an upside-down acrobatic stunt"
                width={640}
                height={640}
                className="w-full h-full object-contain"
                priority={false}
              />
            </div>
          </motion.div>

          {/* Right Column: 3 Talent / Skill Highlights & Learn More Button */}
          <motion.div
            className="lg:col-span-4 flex flex-col justify-center space-y-5 sm:space-y-6"
            variants={itemVariants}
          >
            {CREATIVE_HIGHLIGHTS.map((item) => {
              return (
                <div
                  key={item.title}
                  className="group relative pl-4 border-l-2 border-[var(--color-border)] hover:border-[var(--color-brand-primary)] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-[var(--color-brand-primary)] tracking-wider font-mono">
                      {item.number}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-primary)] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>
              );
            })}

            {/* Learn more button at the end of skills highlights */}
            <div className="pt-2 sm:pt-3">
              <Link
                href="/creatives"
                className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[var(--color-brand-dark)] text-white hover:text-white hover:bg-[#1E293B] font-semibold text-sm transition-all shadow-sm hover:shadow"
              >
                <span className="text-white">Learn more</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


