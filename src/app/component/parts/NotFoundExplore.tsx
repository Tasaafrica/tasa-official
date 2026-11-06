"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";

const SearchAutocomplete = dynamic(
  () => import("@/app/component/parts/SearchAutocomplete"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-2xl mx-auto h-[54px] sm:h-[58px] bg-[var(--color-bg-page)] border-2 border-[var(--color-border)] rounded-2xl p-1 shadow-xs flex items-center px-4">
        <div className="w-5 h-5 rounded-full bg-[var(--color-border)] mr-3 shrink-0" />
        <span className="text-base text-[var(--color-text-muted)]">Search TASA...</span>
      </div>
    ),
  }
);

export default function NotFoundExplore() {
  return (
    <div className="bg-[var(--color-bg-page)] text-[var(--color-text-primary)]" suppressHydrationWarning>
      {/* 1. REPORT A PROBLEM BANNER (IMMEDIATELY AFTER HERO) */}
      <section className="py-5 sm:py-6 bg-[var(--color-bg-subtle)] border-b border-[var(--color-border)]">
        <div className="container-responsive">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center sm:text-left text-xs sm:text-sm text-[var(--color-text-secondary)]">
            <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[var(--color-border)] shadow-xs">
              <AlertCircle className="w-4 h-4 text-[var(--color-brand-accent)] shrink-0" />
              <span>Think this is a mistake?</span>
              <Link
                href="/contact"
                className="font-semibold text-[var(--color-brand-primary)] hover:underline inline-flex items-center gap-1"
              >
                <span>Let us know</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <span className="hidden sm:inline text-[var(--color-text-muted)]">&bull;</span>
            <span className="text-[11px] sm:text-xs text-[var(--color-text-muted)]">
              Report a broken link or missing page to our support team
            </span>
          </div>
        </div>
      </section>

      {/* 2. SEARCH BOX SECTION */}
      <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-bg-brand-soft)]/50 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="container-responsive">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-[-0.025em] text-[var(--color-text-primary)] mb-3">
              Looking for something specific?
            </h2>
            <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto">
              Search for talent, services, businesses or opportunities on TASA Africa.
            </p>

            <div className="max-w-2xl mx-auto">
              <SearchAutocomplete placeholder="Search TASA..." />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
              <span className="font-semibold text-[var(--color-text-primary)] mr-1">Popular searches:</span>
              {["UI/UX Design", "Web Development", "Brand Identity", "FinTech", "Mobile Apps"].map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="px-2.5 py-1 rounded-full bg-[var(--color-bg-subtle)] hover:bg-[var(--color-bg-brand-soft)] hover:text-[var(--color-brand-primary)] transition-colors duration-150 border border-[var(--color-border)] text-xs font-medium"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
