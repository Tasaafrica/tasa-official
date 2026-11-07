"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import tasaForArtisans from "@/data/Y Tasaafrica/tasaForArtisans.json";

export default function WhyChooseTasaArtisan() {
  // Independent open state for left and right columns to prevent cross-column jumping
  const [openLeftIndex, setOpenLeftIndex] = useState<number | null>(0);
  const [openRightIndex, setOpenRightIndex] = useState<number | null>(null);

  // Filter out skipped items and split into two groups
  const activeItems = tasaForArtisans.items.filter((item) => !item.skip);
  const midpoint = Math.ceil(activeItems.length / 2);
  const leftItems = activeItems.slice(0, midpoint);
  const rightItems = activeItems.slice(midpoint);

  const toggleLeftReason = (index: number) => {
    setOpenLeftIndex((prev) => (prev === index ? null : index));
  };

  const toggleRightReason = (index: number) => {
    setOpenRightIndex((prev) => (prev === index ? null : index));
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
      aria-label="Why You Should be on Tasa for Artisans & Professionals"
      className="py-16 sm:py-24 bg-white border-b border-[var(--color-border)] relative overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[var(--color-bg-brand-soft)]/60 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[var(--color-brand-secondary)]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container-responsive">
        {/* Section Header (Centered without badge pill) */}
        <div className="max-w-3xl mx-auto mb-10 sm:mb-14 text-center">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-extrabold text-[var(--color-text-primary)] leading-[1.16] tracking-[-0.02em]">
            Why You Should be on{" "}
            <span className="text-[var(--color-brand-primary)]">Tasa</span>
          </h2>

          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mt-3 sm:mt-4 leading-relaxed max-w-2xl mx-auto font-normal">
            {tasaForArtisans.description}
          </p>
        </div>

        {/* 2-Column Split on Large Screens, Centered (No Center Image) */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 lg:gap-6 items-start">
          {/* Left Group (Items 01 - 05) */}
          <div className="space-y-2.5 sm:space-y-3 self-start">
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

          {/* Right Group (Items 06 - 10) */}
          <div className="space-y-2.5 sm:space-y-3 self-start">
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

        {/* Bottom Actions */}
        <div className="pt-10 sm:pt-14 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href={tasaForArtisans.primaryCTA.href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-brand-dark)] hover:bg-[#1E293B] text-white font-semibold text-sm sm:text-base transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            <span>{tasaForArtisans.primaryCTA.label}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>
    </section>
  );
}
