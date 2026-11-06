"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import tasaForCreatives from "@/data/Y Tasaafrica/tasaForCreatives.json";

export default function WhyChooseTasaCreative() {
  const prefersReducedMotion = useReducedMotion();
  // Independent open state for left and right columns to prevent cross-column jumping
  const [openLeftIndex, setOpenLeftIndex] = useState<number | null>(0);
  const [openRightIndex, setOpenRightIndex] = useState<number | null>(null);

  // Filter out skipped items and split into left and right columns
  const activeItems = tasaForCreatives.items.filter((item) => !item.skip);
  const midpoint = Math.ceil(activeItems.length / 2);
  const leftItems = activeItems.slice(0, midpoint);
  const rightItems = activeItems.slice(midpoint);

  const toggleLeftReason = (index: number) => {
    setOpenLeftIndex((prev) => (prev === index ? null : index));
  };

  const toggleRightReason = (index: number) => {
    setOpenRightIndex((prev) => (prev === index ? null : index));
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const renderCollapsibleCard = (
    item: { heading: string; description: string },
    index: number,
    isOpen: boolean,
    onToggle: () => void,
    displayNumber: number
  ) => {
    const formattedNumber = String(displayNumber).padStart(2, "0");

    return (
      <div
        key={item.heading}
        className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden transition-all shadow-xs hover:border-[var(--color-brand-primary)]"
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="w-full px-4 py-3 sm:px-4.5 sm:py-3.5 text-left flex items-center justify-between gap-3 text-xs sm:text-[13px] font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0 pr-1.5">
            {/* Number badge */}
            <span
              className={`w-6 h-6 rounded-md font-mono font-bold text-[11px] flex items-center justify-center shrink-0 border transition-all duration-200 ${
                isOpen
                  ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]"
                  : "border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] group-hover:border-[var(--color-brand-primary)] group-hover:text-[var(--color-brand-primary)]"
              }`}
            >
              {formattedNumber}
            </span>

            {/* Heading */}
            <span className="font-display font-bold text-xs sm:text-[13px] text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-primary)] transition-colors leading-snug">
              {item.heading}
            </span>
          </div>

          {/* Plus toggle indicator */}
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all duration-200 ${
              isOpen
                ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]"
                : "border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] group-hover:border-[var(--color-brand-primary)] group-hover:text-[var(--color-brand-primary)]"
            }`}
          >
            <Plus
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isOpen ? "rotate-45" : ""
              }`}
            />
          </span>
        </button>

        {/* Collapsible Content */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3.5 sm:px-4.5 sm:pb-4 text-xs sm:text-[13px] text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border)]/50 pt-2.5 font-normal">
                <p>{item.description}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section
      aria-label="Why You Should be on Tasa"
      className="py-16 sm:py-24 bg-white border-b border-[var(--color-border)] relative overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[var(--color-bg-brand-soft)]/60 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[var(--color-brand-secondary)]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container-responsive">
        {/* Section Header (Centered without badge pill) */}
        <div className="max-w-3xl mx-auto mb-10 sm:mb-14 lg:mb-16 text-center">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-extrabold text-[var(--color-text-primary)] leading-[1.16] tracking-[-0.02em]">
            Why You Should be on{" "}
            <span className="text-[var(--color-brand-primary)]">Tasa</span>
          </h2>

          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mt-3 sm:mt-4 leading-relaxed max-w-2xl mx-auto font-normal">
            {tasaForCreatives.description}
          </p>
        </div>

        {/* 3-Column Split: Anchored with items-start and self-start to eliminate vertical jumping */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 xl:gap-8 items-start lg:min-h-[500px]">
          {/* Left Column (Items 01 - 05) */}
          <div className="lg:col-span-4 space-y-2.5 sm:space-y-3 order-1 lg:order-1 self-start">
            {leftItems.map((item, idx) =>
              renderCollapsibleCard(
                item,
                idx,
                openLeftIndex === idx,
                () => toggleLeftReason(idx),
                idx + 1
              )
            )}
          </div>

          {/* Center Column: dancer-in-motion.png (Anchored to top, never jumps when collapsibles toggle) */}
          <div className="lg:col-span-4 flex justify-center items-start my-6 lg:my-0 order-2 lg:order-2 self-start">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px] xl:max-w-[360px] flex items-center justify-center">
              {/* Decorative radial aura */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-brand-primary)]/20 via-[var(--color-brand-secondary)]/25 to-[var(--color-brand-accent)]/15 rounded-full blur-3xl -z-10 scale-95 pointer-events-none" />

              {/* Concentric subtle rings */}
              <div className="absolute w-[240px] sm:w-[280px] lg:w-[320px] h-[240px] sm:h-[280px] lg:h-[320px] rounded-full border border-[var(--color-brand-primary)]/15 -z-10 pointer-events-none" />
              <div className="absolute w-[180px] sm:w-[220px] lg:w-[260px] h-[180px] sm:h-[220px] lg:h-[260px] rounded-full border border-dashed border-[var(--color-brand-secondary)]/25 -z-10 pointer-events-none" />

              {/* Dancer Graphic */}
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full flex items-center justify-center select-none"
              >
                <Image
                  src={tasaForCreatives.image}
                  alt={tasaForCreatives.imageAlt}
                  width={1024}
                  height={1536}
                  priority={false}
                  className="w-full h-auto max-h-[380px] sm:max-h-[440px] lg:max-h-[500px] xl:max-h-[540px] object-contain drop-shadow-[0_20px_40px_rgba(51,65,85,0.22)] pointer-events-none"
                />
              </motion.div>
            </div>
          </div>

          {/* Right Column (Items 06 - 10, completely independent of left column) */}
          <div className="lg:col-span-4 space-y-2.5 sm:space-y-3 order-3 lg:order-3 self-start">
            {rightItems.map((item, idx) =>
              renderCollapsibleCard(
                item,
                idx,
                openRightIndex === idx,
                () => toggleRightReason(idx),
                midpoint + idx + 1
              )
            )}
          </div>
        </div>

        {/* Bottom Actions (Stable position) */}
        <div className="pt-10 sm:pt-14 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href={tasaForCreatives.primaryCTA.href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-button-secondary-hover)] text-white font-semibold text-sm sm:text-base transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            <span>{tasaForCreatives.primaryCTA.label}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>
    </section>
  );
}
