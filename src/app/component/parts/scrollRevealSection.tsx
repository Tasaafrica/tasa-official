"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type ScrollRevealSectionProps = {
  children: ReactNode;
  className?: string;
  as?: "section" | "div";
};

export default function ScrollRevealSection({
  children,
  className,
  as = "section",
}: ScrollRevealSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  const MotionComponent = as === "div" ? motion.div : motion.section;

  return (
    <MotionComponent
      className={className}
      initial={prefersReducedMotion ? false : "hidden"}
      whileInView={prefersReducedMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.25 }}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </MotionComponent>
  );
}
