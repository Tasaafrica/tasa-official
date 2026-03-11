"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import {
  fadeSlideScale,
  rotateFade,
  smoothPop,
  staggerContainer,
} from "@/lib/animationVariants";

type ScrollRevealCardProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "rotate" | "pop";
  delay?: number;
  duration?: number;
};

/**
 * ScrollRevealCard - Enhanced card/item animation
 * Perfect for: Service cards, product cards, feature items
 * Features: Scale on scroll + stagger effect
 */
export default function ScrollRevealCard({
  children,
  className,
  variant = "default",
  delay = 0,
  duration = 0.65,
}: ScrollRevealCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const variantMap = {
    default: fadeSlideScale,
    rotate: rotateFade,
    pop: smoothPop,
  };

  const selectedVariant = variantMap[variant];

  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : "hidden"}
      whileInView={prefersReducedMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.25 }}
      variants={{
        hidden: selectedVariant.hidden,
        visible: {
          ...selectedVariant.visible,
          transition: {
            duration,
            ease: [0.22, 1, 0.36, 1],
            delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
