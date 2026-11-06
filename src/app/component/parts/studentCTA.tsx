"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function StudentCTA() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <section className="relative z-30 overflow-hidden bg-transparent py-8 sm:py-10 lg:py-12">
      <div className="container-responsive">
        <div className="relative rounded-2xl lg:rounded-3xl bg-[#1E293B] border border-slate-700/60 overflow-hidden shadow-2xl">
          {/* Decorative ambient brand glows */}
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-[var(--color-brand-primary)]/15 rounded-full blur-3xl pointer-events-none -z-0" />
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-[var(--color-brand-secondary)]/10 rounded-full blur-2xl pointer-events-none -z-0" />

          <div className="grid items-end gap-6 lg:gap-8 lg:grid-cols-12 min-h-[340px] sm:min-h-[370px] lg:min-h-[380px]">
            {/* Text Content */}
            <motion.div
              className="lg:col-span-7 p-6 sm:p-8 md:p-10 lg:p-12 z-10 text-left self-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >

              {/* Main Heading */}
              <motion.h2
                variants={fadeInUp}
                className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-extrabold text-white leading-tight mb-2.5"
              >
                Are you a{" "}
                <span className="text-[var(--color-brand-secondary)]">
                  student?
                </span>{" "}
                Got a skill?
              </motion.h2>

              {/* Subtext description */}
              <motion.p
                variants={fadeInUp}
                className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-6 max-w-lg"
              >
                Whether you're self-taught or building your career, turn your creative, technical or
                academic skills into real opportunities. Showcase what you can do, connect with potential clients
                across Africa and take the next step in your professional journey.
              </motion.p>

              {/* CTA Button */}
              <motion.div variants={fadeInUp}>
                <Link
                  href="/students"
                  className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-secondary)] hover:text-[#1E293B] font-semibold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg hover:translate-y-[-1px] active:translate-y-[0px]"
                >
                  <span>Join the community</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Image Content */}
            <div className="lg:col-span-5 relative w-full flex items-end justify-center lg:justify-end self-end translate-y-3 sm:translate-y-4 lg:translate-y-6">
              <motion.div
                className="relative w-full max-w-[230px] sm:max-w-[270px] md:max-w-[290px] lg:max-w-[300px] xl:max-w-[320px] h-[240px] sm:h-[280px] md:h-[310px] lg:h-[340px] xl:h-[370px] flex items-end justify-center lg:justify-end"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src="/image/nigerian-student.png"
                  alt="Talented African student smiling with books and backpack"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority={false}
                  className="object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)] select-none pointer-events-none"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
