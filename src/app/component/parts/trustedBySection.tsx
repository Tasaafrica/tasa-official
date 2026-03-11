"use client";

import { motion, useReducedMotion, type MotionProps } from "framer-motion";

const BRANDS = ["Northstar", "BluePeak", "NovaWorks", "CloudMint"];

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
    <section className="py-8 bg-white border-b border-slate-200 md:mx-20 lg:mx-32">
      <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
        <div className="flex flex-col items-center gap-4">
          <motion.div {...inViewProps(0.12)}>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Trusted by:
            </p>
          </motion.div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {BRANDS.map((brand, index) => (
              <motion.div
                key={brand}
                {...(prefersReducedMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 16 },
                      whileInView: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.95,
                          delay: 0.2 + index * 0.09,
                          ease: baseEase,
                        },
                      },
                      viewport: { once: true, amount: 0.3 },
                    })}
                className="px-5 py-2 rounded-full border border-slate-200 bg-slate-50 text-slate-500 text-sm font-semibold tracking-wide"
              >
                {brand}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
