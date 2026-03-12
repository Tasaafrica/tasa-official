"use client";

import Link from "next/link";
import { motion, useReducedMotion, type MotionProps } from "framer-motion";
import { Button } from "@/app/component/ui/button";

export default function CtaSection() {
  const prefersReducedMotion = useReducedMotion();

  const baseEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const baseTransition = {
    duration: 1.15,
    ease: baseEase,
  };

  const inViewProps = (delay = 0): MotionProps =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          whileInView: {
            opacity: 1,
            y: 0,
            transition: { ...baseTransition, delay },
          },
          viewport: { once: true, amount: 0.25 },
        };

  return (
    <section className="py-16 md:py-24 bg-white text-black">
      <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
        <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_40px_rgba(15,23,42,0.18)] bg-[#334155]">
          <div className="grid md:grid-cols-2 items-stretch">
            <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
              <motion.h2
                {...inViewProps(0.12)}
                className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-6"
              >
                Find the talent needed
                <br />
                to get your business
                <br />
                growing.
              </motion.h2>
              <motion.div
                {...(prefersReducedMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 18, scale: 0.98 },
                      whileInView: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          duration: 0.9,
                          delay: 0.32,
                          ease: baseEase,
                        },
                      },
                      viewport: { once: true, amount: 0.25 },
                    })}
              >
                <Link href="/signup">
                  <Button className="w-fit bg-white text-[#0F766E] hover:bg-slate-100 font-semibold rounded-lg px-6 py-3 shadow-sm">
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            </div>
            <motion.div
              {...(prefersReducedMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 18, scale: 0.985 },
                    whileInView: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: 1.05,
                        delay: 0.2,
                        ease: baseEase,
                      },
                    },
                    viewport: { once: true, amount: 0.2 },
                  })}
              className="relative min-h-[240px] md:min-h-[320px]"
            >
              <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600"
                  alt="Team working together"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#334155]/90 via-[#334155]/40 to-transparent" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
