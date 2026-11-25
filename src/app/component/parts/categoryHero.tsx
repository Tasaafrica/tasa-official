"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Home, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Skill {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Breadcrumb {
  label: string;
  href?: string;
}

interface CategoryHeroProps {
  title: string;
  categorySlug: string;
  description?: string;
  breadcrumbs: Breadcrumb[];
  onSearch?: (query: string) => void;
  totalSkills: number;
  skills: Skill[];
}

export default function CategoryHero({
  title,
  categorySlug,
  breadcrumbs,
  totalSkills,
  skills,
}: CategoryHeroProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageSrc, setImageSrc] = useState(`/categoryHero/${categorySlug}.png`);
  const skillsBarRef = useRef<HTMLDivElement>(null);
  const [glowTriggered, setGlowTriggered] = useState(false);

  useEffect(() => {
    setImageSrc(`/categoryHero/${categorySlug}.png`);
  }, [categorySlug]);

  // Trigger one-time orange border glow when user scrolls toward the featured skills area
  useEffect(() => {
    let triggered = false;

    const handleScrollCheck = () => {
      if (triggered || !skillsBarRef.current) return;
      const rect = skillsBarRef.current.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;

      // Element is visible / being scrolled toward in viewport
      const isInView = rect.top <= windowHeight * 0.88 && rect.bottom >= 0;

      if (isInView && (window.scrollY > 10 || rect.top > 80)) {
        triggered = true;
        setGlowTriggered(true);
      }
    };

    window.addEventListener("scroll", handleScrollCheck, { passive: true });

    // IntersectionObserver to capture mobile gesture scrolling and smooth navigation
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !triggered) {
          if (window.scrollY > 10) {
            triggered = true;
            setGlowTriggered(true);
          }
        }
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    if (skillsBarRef.current) {
      observer.observe(skillsBarRef.current);
    }

    // Check immediately in case page is already scrolled
    if (window.scrollY > 10) {
      handleScrollCheck();
    }

    // Graceful fallback for large high-res displays where content is visible without scrolling
    const fallbackTimer = setTimeout(() => {
      if (!triggered && skillsBarRef.current) {
        const rect = skillsBarRef.current.getBoundingClientRect();
        const windowHeight =
          window.innerHeight || document.documentElement.clientHeight;
        if (rect.top <= windowHeight * 0.9 && rect.bottom >= 0) {
          triggered = true;
          setGlowTriggered(true);
        }
      }
    }, 2500);

    return () => {
      window.removeEventListener("scroll", handleScrollCheck);
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <section className="relative w-full bg-gradient-to-b from-white via-white to-[var(--color-bg-subtle)]/40 border-b border-[var(--color-border)] pt-8 pb-8 sm:pt-10 sm:pb-10 lg:pt-12 lg:pb-12 overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[45rem] h-[30rem] bg-[var(--color-bg-brand-soft)]/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="container-responsive relative z-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Breadcrumbs Navigation (Centered) */}
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center justify-center gap-2 text-xs text-[var(--color-text-secondary)] mb-5 flex-wrap"
          >
            <Link
              href="/"
              className="hover:text-[var(--color-brand-primary)] transition-colors inline-flex items-center gap-1.5 font-medium"
            >
              <Home className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
              <span className="sr-only sm:not-sr-only">Home</span>
            </Link>
            <span className="text-[var(--color-border-strong)]">/</span>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-[var(--color-brand-primary)] transition-colors font-medium"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[var(--color-text-primary)] font-semibold truncate max-w-[200px] sm:max-w-none">
                    {crumb.label}
                  </span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className="text-[var(--color-border-strong)]">/</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* 1. Category / Industry Name Headline (Centered) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)] leading-[1.14]">
              {title}
            </h1>
          </motion.div>

          {/* 2. Wide Image Banner (Centered, widescreen cropped to <= 200px) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-5xl mx-auto my-6 sm:my-8 relative"
          >
            {/* Banner Frame - Widescreen cropped (not compressed) to max-h-200px */}
            <div className="relative w-full h-[180px] sm:h-[200px] max-h-[200px] rounded-2xl sm:rounded-3xl overflow-hidden">
              <Image
                src={imageSrc}
                alt={`${title} services banner`}
                fill
                sizes="(max-width: 1280px) 100vw, 1024px"
                className="w-full h-full object-cover object-center select-none"
                priority
                onError={() => {
                  setImageSrc("/categoryHero/graphics-design.png");
                }}
              />
            </div>
          </motion.div>

          {/* 3. Straight Line Across Right Under Hero Image */}
          <div className="w-full border-t border-[var(--color-border)]/80 mt-2 sm:mt-3" />

          {/* 4. Single Straight Line of Featured Skills (Non-scrollable, dropdown immediately after Featured Skills text/icon) */}
          <div
            ref={skillsBarRef}
            className="w-full py-2.5 sm:py-3 flex items-center gap-2.5 sm:gap-4 overflow-hidden"
          >
            {/* Toggle Button: Mobile Icon vs Desktop Text with Dropdown Chevron Immediately After */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Collapse featured skills" : "View all skills in columns"}
              title={isExpanded ? "Collapse featured skills" : "View all skills in columns"}
              className="inline-flex items-center gap-1.5 py-0.5 text-xs sm:text-sm font-semibold shrink-0 cursor-pointer group select-none transition-colors"
            >
              {/* Mobile: Sparkles icon replacing "Featured Skills" text */}
              <span
                className={`inline-flex sm:hidden items-center justify-center w-7 h-7 rounded-lg transition-all duration-300 ${
                  glowTriggered
                    ? "animate-orange-border-glow-once"
                    : "border border-transparent hover:border-[var(--color-brand-accent)]/40 hover:bg-[var(--color-highlight-soft)]/30"
                }`}
                aria-hidden="true"
              >
                <Sparkles className="w-3.5 h-3.5 text-[var(--color-brand-accent)]" />
              </span>

              {/* Desktop: "Featured Skills" text */}
              <span
                className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-primary)] transition-all duration-300 ${
                  glowTriggered
                    ? "animate-orange-border-glow-once"
                    : "border border-transparent hover:border-[var(--color-brand-accent)]/40 hover:bg-[var(--color-highlight-soft)]/30"
                }`}
              >
                Featured Skills
              </span>

              {/* Dropdown Chevron immediately after */}
              <div className="w-5 h-5 rounded-full flex items-center justify-center group-hover:bg-[var(--color-bg-brand-soft)] transition-colors">
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[var(--color-brand-primary)] transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            <span className="text-[var(--color-border-strong)] shrink-0 select-none">|</span>

            {/* Non-scrollable Single Straight Line Nav - Maintains a straight line without scrolling */}
            <nav
              className="flex items-center gap-x-5 sm:gap-x-7 text-xs sm:text-sm font-medium flex-nowrap whitespace-nowrap overflow-hidden"
              aria-label="Featured category skills"
            >
              {skills.map((skill) => (
                <Link
                  key={skill._id}
                  href={`/skills/${skill.slug}`}
                  className="font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  {skill.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* 5. Parallel Straight Line Across Under the Arranged Skills */}
          <div className="w-full border-t border-[var(--color-border)]/80" />

          {/* 6. Expandable Responsive Columns (2-cols on mobile, 3-cols on tablet, 4-cols on desktop) */}
          <AnimatePresence>
            {isExpanded && skills && skills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="w-full overflow-hidden"
              >
                <div className="pt-6 pb-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3 sm:gap-y-3.5 text-left">
                    {skills.map((skill) => (
                      <Link
                        key={skill._id}
                        href={`/skills/${skill.slug}`}
                        className="group flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-[var(--color-bg-brand-soft)]/50 text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] transition-all"
                      >
                        <span className="truncate">{skill.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 ml-1.5 text-[var(--color-brand-primary)]" />
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
