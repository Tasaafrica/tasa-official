"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { staggerContainer, fadeSlideScale } from "@/lib/animationVariants";

type ScrollRevealGridProps = {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  itemVariant?: "default" | "scale" | "rotate";
  columns?: number;
};

/**
 * ScrollRevealGrid - Grid layout with staggered animations
 * Perfect for: Grid layouts with multiple items (service cards, testimonials)
 * Features: Wave-like stagger effect across grid items
 */
export default function ScrollRevealGrid({
  children,
  className,
  staggerDelay = 0.08,
  itemVariant = "default",
  columns = 3,
}: ScrollRevealGridProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : "hidden"}
      whileInView={prefersReducedMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.15 }}
      variants={staggerContainer(staggerDelay, 0.1)}
    >
      {children}
    </motion.div>
  );
}

/**
 * ScrollRevealGridItem - Individual grid item wrapper
 * Provides consistent animation for grid children
 */
export function ScrollRevealGridItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={fadeSlideScale}
      initial={prefersReducedMotion ? false : "hidden"}
    >
      {children}
    </motion.div>
  );
}
