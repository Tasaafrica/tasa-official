"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import {
  fadeSlideUp,
  fadeLifted,
  blurFade,
  staggerContainer,
} from "@/lib/animationVariants";

type ScrollRevealTextProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "lifted" | "blur";
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "div";
  duration?: number;
  delay?: number;
};

/**
 * ScrollRevealText - Text content animation
 * Perfect for: Headings, paragraphs, text blocks
 * Features: Smooth fade + slide entrance
 */
export default function ScrollRevealText({
  children,
  className,
  variant = "default",
  as = "div",
  duration = 0.6,
  delay = 0,
}: ScrollRevealTextProps) {
  const prefersReducedMotion = useReducedMotion();

  const variantMap = {
    default: fadeSlideUp,
    lifted: fadeLifted,
    blur: blurFade,
  };

  const selectedVariant = variantMap[variant];
  const MotionElement = motion[as as keyof typeof motion] as any;

  return (
    <MotionElement
      className={className}
      initial={prefersReducedMotion ? false : "hidden"}
      whileInView={prefersReducedMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.5 }}
      variants={{
        hidden: selectedVariant.hidden,
        visible: {
          ...selectedVariant.visible,
          transition: {
            duration,
            delay,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
    >
      {children}
    </MotionElement>
  );
}
