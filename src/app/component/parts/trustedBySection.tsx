"use client";

import { motion, useReducedMotion, type MotionProps } from "framer-motion";

const BRANDS = ["High Factory", "Upgraders Community"];

export default function TrustedBySection() {
  const prefersReducedMotion = useReducedMotion();

  const baseEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const baseTransition = {
    duration: 1.1,
    ease: baseEase,
  };

  const inViewProps = (delay = 0): MotionProps =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: {
            opacity: 1,
            y: 0,
            transition: { ...baseTransition, delay },
          },
          viewport: { once: true, amount: 0.3 },
        };

  return (
    <section className="py-8 bg-white border-b border-slate-200">
      <div className="container-responsive">
        <div className="flex flex-col items-center gap-4">
          <motion.div {...inViewProps(0.12)}>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Trusted by:
            </p>
          </motion.div>
          <div className="relative w-full max-w-5xl mx-auto overflow-hidden mt-2 py-2">
            {/* Fade overlays for smooth entry/exit */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            
            <div className="flex w-max animate-scroll-x group">
              {/* First Set */}
              <div className="flex items-center gap-6 pr-6">
                {[...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map((brand, index) => (
                  <div
                    key={`set1-${index}`}
                    className="px-6 py-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-500 text-sm md:text-base font-semibold tracking-wide whitespace-nowrap hover:bg-slate-100 transition-colors shadow-sm cursor-default"
                  >
                    {brand}
                  </div>
                ))}
              </div>
              {/* Second Set (identical duplicate for seamless infinite looping) */}
              <div className="flex items-center gap-6 pr-6">
                {[...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map((brand, index) => (
                  <div
                    key={`set2-${index}`}
                    className="px-6 py-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-500 text-sm md:text-base font-semibold tracking-wide whitespace-nowrap hover:bg-slate-100 transition-colors shadow-sm cursor-default"
                  >
                    {brand}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
