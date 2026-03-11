import type { Variants } from "framer-motion";

export type { Variants };

/**
 * Professional animation variants for modern UI/UX
 * Supports accessibility with prefers-reduced-motion
 */

// Easing curves for smooth, natural motion
export const easingCurves = {
  smooth: [0.22, 1, 0.36, 1], // Custom smooth ease-out
  smoothIn: [0.4, 0, 0.2, 1], // Ease-out cubic
  snappy: [0.34, 1.56, 0.64, 1], // Bounce-like
  elegant: [0.16, 1, 0.3, 1], // Elegant ease-out
  bounce: [0.68, -0.55, 0.27, 1.55], // Bouncy entrance
} as const;

/**
 * Fade & Slide - Classic subtle entrance
 * Perfect for: General sections, headings, paragraphs
 */
export const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easingCurves.smooth },
  },
};

/**
 * Fade & Slide with Scale - More dynamic entrance
 * Perfect for: Cards, images, call-to-action elements
 */
export const fadeSlideScale: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: easingCurves.smooth },
  },
};

/**
 * Rotate & Fade - Creative entrance with rotation
 * Perfect for: Icons, badges, accent elements
 */
export const rotateFade: Variants = {
  hidden: { opacity: 0, rotate: -8, scale: 0.93 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.65, ease: easingCurves.smooth },
  },
};

/**
 * Blur & Fade - Sophisticated entrance with blur effect
 * Perfect for: Background elements, images, hero content
 */
export const blurFade: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)", y: 20 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.7, ease: easingCurves.smooth },
  },
};

/**
 * Side Slide - Entrance from left/right
 * Perfect for: Content blocks, alternating layouts
 */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: easingCurves.smooth },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: easingCurves.smooth },
  },
};

/**
 * Bounce Scale - Energetic entrance
 * Perfect for: Feature highlights, important call-to-actions
 */
export const bounceScale: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: easingCurves.bounce },
  },
};

/**
 * Clip Path - Modern reveal effect
 * Perfect for: Images, hero sections, dramatic reveals
 */
export const clipPathReveal: Variants = {
  hidden: {
    opacity: 0,
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
  },
  visible: {
    opacity: 1,
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    transition: { duration: 0.8, ease: easingCurves.smooth },
  },
};

/**
 * Parallax Scroll - Depth effect
 * Perfect for: Background elements, layered components
 */
export const parallaxScroll = (distance: number): Variants => ({
  visible: {
    y: distance,
  },
});

/**
 * Stagger Container - Orchestrates child animations
 * Use with child variants for coordinated entrance
 */
export const staggerContainer = (
  staggerChildren: number = 0.1,
  delayChildren: number = 0,
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

/**
 * Stagger Grid - Optimized for grid layouts
 * Creates wave-like animation across grid
 */
export const staggerGridContainer = (cols: number = 3): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
});

/**
 * Smooth Pop - Entrance with scale pop
 * Perfect for: Notifications, modals, important elements
 */
export const smoothPop: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.88,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: easingCurves.snappy },
  },
};

/**
 * Fade & Lift - Subtle upward entrance
 * Perfect for: Text content, paragraphs, subtle reveals
 */
export const fadeLifted: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easingCurves.smooth },
  },
};

/**
 * Shine Effect - Light sweep across element
 * Perfect for: Loading states, attention grabbers
 */
export const shineEffect: Variants = {
  hidden: {
    backgroundPosition: "200% 0",
  },
  visible: {
    backgroundPosition: "-200% 0",
    transition: { duration: 0.8, ease: "linear" },
  },
};

/**
 * Hover Effects
 */
export const hoverLift = {
  whileHover: {
    y: -6,
    transition: { duration: 0.3, ease: easingCurves.smooth },
  },
};

export const hoverScale = {
  whileHover: {
    scale: 1.05,
    transition: { duration: 0.3, ease: easingCurves.smooth },
  },
};

export const hoverGlow = {
  whileHover: {
    boxShadow: "0 20px 40px rgba(15, 118, 110, 0.2)",
    transition: { duration: 0.3, ease: easingCurves.smooth },
  },
};

/**
 * Stagger animation with different patterns
 */
export const createStaggerVariants = (
  itemVariant: Variants,
  staggerDelay: number = 0.08,
): { container: Variants; item: Variants } => ({
  container: staggerContainer(staggerDelay),
  item: itemVariant,
});

/**
 * Combine animations
 */
export const combineVariants = (
  primary: Variants,
  secondary: Variants,
): Variants => ({
  hidden: { ...primary.hidden, ...secondary.hidden },
  visible: {
    ...primary.visible,
    ...secondary.visible,
    transition: {
      ...(primary.visible as any).transition,
    },
  },
});
