"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import LoginModal from "./loginModal";

export default function CtaSection() {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const handleGetStartedClick = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    router.push("/signup");
  };

  return (
    <>
      <section
        id="talent-cta"
        aria-labelledby="talent-cta-heading"
        className="relative z-40 bg-[var(--color-bg-page)] py-12 sm:py-16 lg:py-20 border-t border-[var(--color-border)]/60"
      >
        <div className="container-responsive">
          <motion.div
            className="max-w-2xl mx-auto text-center flex flex-col items-center"
            variants={containerVariants}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Headline, Narrative Copy & Action CTAs */}
            <motion.div
              className="flex flex-col items-center text-center"
              variants={itemVariants}
            >
              <h2
                id="talent-cta-heading"
                className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)] leading-[1.16] mb-4 sm:mb-5"
              >
                <span>Find the talent needed to get your business </span>
                <span className="text-[var(--color-brand-primary)]">
                  growing
                </span>
                .
              </h2>

              <p className="text-sm sm:text-base lg:text-[1.05rem] text-[var(--color-text-secondary)] leading-relaxed mb-6 sm:mb-8 font-normal max-w-xl text-center">
                From individual specialists to agile project teams, connect with
                verified African talent equipped to scale your vision. Post a
                project or hire directly with complete peace of mind.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleGetStartedClick}
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[var(--color-brand-dark)] text-white hover:bg-[#1E293B] font-semibold text-sm transition-all shadow-sm hover:shadow cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-5.5 sm:py-3 rounded-xl border border-[var(--color-border-strong)] text-[var(--color-text-primary)] font-semibold text-sm hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] bg-white transition-all shadow-sm"
                >
                  <span>Explore Talent</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        mode="signup"
      />
    </>
  );
}
