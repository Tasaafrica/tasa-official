"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import Header from "@/app/component/parts/header";
import WhyChooseTasaIndustry from "@/app/component/parts/whyChooseTasaIndustry";
import CustomContextMenu from "@/components/ui/CustomContextMenu";

const INDUSTRY_LINKS = [
  { name: "Graphic & Design", slug: "graphics-design" },
  { name: "Programming & Tech", slug: "programming-tech" },
  { name: "Digital Marketing", slug: "digital-marketing" },
  { name: "Video & Animation", slug: "video-animation" },
  { name: "Writing & Translation", slug: "writing-translation" },
  { name: "Business & Consulting", slug: "business-consulting" },
];

export default function IndustriesPage() {
  const prefersReducedMotion = useReducedMotion();

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <CustomContextMenu>
      <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-primary)]">
        <Header variant="white" />

        <main id="main-content">
          {/* HERO SECTION */}
          <section className="relative overflow-hidden pt-12 pb-3 sm:pt-16 sm:pb-4 lg:pt-20 lg:pb-5 border-b border-[var(--color-border)]/70 bg-gradient-to-b from-white via-white to-[var(--color-bg-subtle)]/50">
            {/* Subtle atmospheric ambient glows */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[var(--color-brand-primary)]/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute -top-12 -left-12 w-80 h-80 bg-[var(--color-brand-secondary)]/15 rounded-full blur-2xl pointer-events-none -z-10" />

            <div className="container-responsive relative z-10">
              <motion.div
                variants={containerVariants}
                initial={prefersReducedMotion ? false : "hidden"}
                animate="visible"
                className="flex flex-col"
              >
                {/* 1. Main Hero Text & Main Hero Image */}
                <div className="grid items-start gap-8 lg:gap-12 grid-cols-1 lg:grid-cols-12">
                  {/* Hero Main Text & Trusted By (Mobile: 2nd, Desktop: 1st) */}
                  <motion.div
                    className="lg:col-span-6 order-2 lg:order-1 flex flex-col justify-start text-center lg:text-left"
                    variants={itemVariants}
                  >
                    <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)] leading-[1.14]">
                      We are building Africa&apos;s largest{" "}
                      <span className="text-[var(--color-brand-primary)]">
                        Talent Economy
                      </span>
                    </h1>

                    {/* Trusted by Credible Brands - Arranged under headline as on main home page */}
                    <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 sm:gap-x-6 gap-y-2 text-[var(--color-text-muted)]">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--color-text-muted)] shrink-0">
                        Trusted by
                      </span>
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 sm:gap-x-6 gap-y-2">
                        {/* Google */}
                        <div
                          className="flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity cursor-default"
                          title="Google"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          <span className="font-semibold text-xs tracking-tight">Google</span>
                        </div>

                        {/* Microsoft */}
                        <div
                          className="flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity cursor-default"
                          title="Microsoft"
                        >
                          <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
                            <span className="bg-current rounded-[0.5px]" />
                            <span className="bg-current rounded-[0.5px]" />
                            <span className="bg-current rounded-[0.5px]" />
                            <span className="bg-current rounded-[0.5px]" />
                          </div>
                          <span className="font-semibold text-xs tracking-tight">Microsoft</span>
                        </div>

                        {/* Paystack */}
                        <div
                          className="flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity cursor-default"
                          title="Paystack"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <rect x="2" y="3" width="20" height="3" rx="1.5" />
                            <rect x="2" y="9" width="14" height="3" rx="1.5" />
                            <rect x="2" y="15" width="20" height="3" rx="1.5" />
                            <rect x="2" y="21" width="8" height="3" rx="1.5" />
                          </svg>
                          <span className="font-bold text-xs tracking-tight">paystack</span>
                        </div>

                        {/* Flutterwave */}
                        <div
                          className="flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity cursor-default"
                          title="Flutterwave"
                        >
                          <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                            <path d="M4 16c2-4 6-6 10-4s6 6 6 6" strokeLinecap="round" />
                            <path d="M4 10c2-4 6-6 10-4s6 6 6 6" strokeLinecap="round" />
                          </svg>
                          <span className="font-bold text-xs tracking-tight">flutterwave</span>
                        </div>

                        {/* MTN */}
                        <div
                          className="flex items-center opacity-70 hover:opacity-100 transition-opacity cursor-default"
                          title="MTN"
                        >
                          <div className="border border-current rounded-full px-2 py-0.5 flex items-center justify-center">
                            <span className="font-black text-[10px] tracking-wider">MTN</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Hero Main Image Cluster (Mobile: 1st, Desktop: 2nd) */}
                  <motion.div
                    className="lg:col-span-6 order-1 lg:order-2 flex items-start justify-center relative select-none self-start"
                    variants={itemVariants}
                  >
                    <div className="relative w-full max-w-[560px] lg:max-w-[620px] flex items-start justify-center -mt-1 lg:-mt-2">
                      {/* Subtle soft ambient glow behind the composition */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-brand-primary)]/15 via-[var(--color-brand-secondary)]/20 to-[var(--color-brand-accent)]/10 rounded-full blur-3xl -z-10 scale-95 pointer-events-none" />

                      {/* Poly Skyscrapers (Layered behind, shifted further to the right) */}
                      <div className="absolute -top-14 sm:-top-16 lg:-top-20 inset-x-0 mx-auto w-full flex justify-center translate-x-10 sm:translate-x-14 lg:translate-x-20 z-0 pointer-events-none select-none">
                        <Image
                          src="/image/poly_skyscrappers.png"
                          alt="Modern corporate skyscrapers and architectural development across African cities"
                          width={1672}
                          height={941}
                          priority={false}
                          className="w-[94%] sm:w-[90%] lg:w-[88%] h-auto object-contain drop-shadow-[0_12px_24px_rgba(51,65,85,0.12)] opacity-85 sm:opacity-95"
                        />
                      </div>

                      {/* Foreground Hero Image: African Talents (Aligned directly with the H1 headline) */}
                      <div className="relative z-10 w-full flex justify-center">
                        <Image
                          src="/image/african_talents.png"
                          alt="Africa's diverse professional talents and enterprise workforce"
                          width={1774}
                          height={887}
                          priority
                          className="w-full h-auto max-h-[340px] sm:max-h-[400px] lg:max-h-[440px] object-contain drop-shadow-[0_20px_40px_rgba(51,65,85,0.2)] pointer-events-none select-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Full-width Separator across the hero section (Starting immediately at bottom of hero image on large screen) */}
            <div className="w-full border-t border-[var(--color-border)]/70 mt-6 sm:mt-8 lg:mt-0 mb-2.5 sm:mb-3" />

            {/* Category / Industry Links (As on Main Home Hero) */}
            <div className="container-responsive">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] shrink-0">
                  Explore Industries
                </span>

                <nav
                  className="flex flex-wrap items-center gap-x-5 sm:gap-x-7 gap-y-1.5 text-xs sm:text-sm"
                  aria-label="Industries and categories"
                >
                  {INDUSTRY_LINKS.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      className="font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] transition-colors duration-150"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </section>

          {/* BUILT FOR BUSINESSES SHAPING THE FUTURE SECTION */}
          <section className="py-16 sm:py-20 lg:py-24 bg-white border-b border-[var(--color-border)] relative overflow-hidden">
            {/* Ambient soft glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[25rem] bg-[var(--color-bg-brand-soft)]/40 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="container-responsive">
              {/* Header */}
              <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)] leading-[1.24]">
                  <span className="underline decoration-[var(--color-brand-accent)] decoration-[3.5px] sm:decoration-4 underline-offset-[8px] sm:underline-offset-[10px] decoration-skip-ink-none">
                    Built for businesses
                  </span>{" "}
                  shaping the{" "}
                  <span className="text-[var(--color-brand-primary)]">future</span>
                </h2>

                <p className="text-base sm:text-lg lg:text-xl text-[var(--color-text-secondary)] leading-relaxed mt-4 sm:mt-5 font-normal">
                  A platform built for ambitious businesses, growing companies, and forward-thinking industries. Whether you&apos;re expanding your team with permanent hires or sourcing skilled talent for short-term projects,{" "}
                  <span className="font-semibold text-[var(--color-text-primary)] bg-[var(--color-highlight-soft)] px-1.5 py-0.5 rounded-md box-decoration-clone">
                    Tasa Africa connects you with the people you need to move your business forward.
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* CONNECT WITH OTHER BUSINESSES FOR GROWTH SECTION */}
          <section className="py-16 sm:py-20 lg:py-24 bg-[var(--color-bg-subtle)] border-b border-[var(--color-border)] relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[var(--color-brand-primary)]/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="container-responsive">
              <div className="grid items-center gap-10 lg:gap-14 grid-cols-1 lg:grid-cols-12">
                {/* Left Column: Image with floating badge */}
                <div className="lg:col-span-6 relative">
                  {/* Atmospheric gradient border / glow backdrop */}
                  <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-tr from-[var(--color-brand-primary)]/15 via-[var(--color-brand-secondary)]/20 to-[var(--color-brand-accent)]/10 rounded-3xl blur-xl -z-10 pointer-events-none" />

                  <div className="relative rounded-3xl overflow-hidden">
                    <Image
                      src="/image/corporate-handshake.png"
                      alt="Corporate B2B partnership handshake between business leaders"
                      width={1264}
                      height={848}
                      className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Right Column: Narrative Copy & Partnership Value */}
                <div className="lg:col-span-6 flex flex-col justify-center">
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)] leading-[1.2] mb-4">
                    Connect with other businesses for{" "}
                    <span className="text-[var(--color-brand-primary)]">growth</span>
                  </h2>

                  <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed mb-6 font-normal">
                    As a business or organisation, on <span className="font-semibold text-[var(--color-text-primary)]">Tasa Africa</span> you can partner with other establishments and corporate entities to expand capacity, co-bid on high-value tenders, and unlock collaborative scale.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FOR SMES & LARGE ENTERPRISES SECTION */}
          <section className="py-16 sm:py-20 lg:py-24 bg-white border-b border-[var(--color-border)] relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[var(--color-brand-primary)]/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="container-responsive">
              <div className="grid items-start gap-10 lg:gap-16 grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[var(--color-border)]">
                {/* Left Column: For SMEs */}
                <div className="flex flex-col justify-start pb-8 lg:pb-0 lg:pr-12">
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)] leading-[1.2] mb-4">
                    For <span className="text-[var(--color-brand-primary)]">SMEs</span>
                  </h2>

                  <ul className="space-y-3 text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed font-normal">
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] shrink-0" />
                      <span>Access Skilled Talent</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] shrink-0" />
                      <span>Build Business Partnerships</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] shrink-0" />
                      <span>Discover Investment Opportunities</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] shrink-0" />
                      <span>Showcase Your Business &amp; Find Clients</span>
                    </li>
                  </ul>
                </div>

                {/* Right Column: For Large Enterprise */}
                <div className="flex flex-col justify-start pt-8 lg:pt-0 lg:pl-12">
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)] leading-[1.2] mb-4">
                    For <span className="text-[var(--color-brand-primary)]">Large Enterprise</span>
                  </h2>

                  <ul className="space-y-3 text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed font-normal">
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] shrink-0" />
                      <span>Expand your teams</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] shrink-0" />
                      <span>Access to Skilled Talent</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] shrink-0" />
                      <span>Outsource Projects and Services</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS SECTION */}
          <section className="py-16 sm:py-20 bg-white border-b border-[var(--color-border)]">
            <div className="container-responsive">
              <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
                <span className="px-3 py-1 rounded-full bg-[var(--color-bg-brand-soft)] text-[var(--color-brand-primary)] text-xs font-bold uppercase tracking-wider inline-block mb-3">
                  How It Works
                </span>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-text-primary)] mb-4 tracking-[-0.02em]">
                  From Business Needs to the Right Connections
                </h2>
                <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed max-w-2xl mx-auto font-normal">
                  Whether you&apos;re looking for skilled talent, reliable service providers, business partners or new opportunities, TASA makes it easier to connect with the people and businesses you need.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="p-6 sm:p-7 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-left shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-dark)] text-white font-mono font-bold flex items-center justify-center text-sm mb-4 shadow-2xs">
                    01
                  </div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-primary)] mb-2">
                    Define What You Need
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed font-normal">
                    Tell us what your business is looking for. Whether it&apos;s hiring professionals, sourcing services, finding suppliers, seeking partnerships or exploring investment opportunities, make your requirements clear.
                  </p>
                </div>

                <div className="p-6 sm:p-7 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-left shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-dark)] text-white font-mono font-bold flex items-center justify-center text-sm mb-4 shadow-2xs">
                    02
                  </div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-primary)] mb-2">
                    Discover the Right Connections
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed font-normal">
                    Explore relevant professionals, businesses and opportunities. Review profiles, compare services, assess experience and connect with potential partners who align with your needs.
                  </p>
                </div>

                <div className="p-6 sm:p-7 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-left shadow-2xs">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-dark)] text-white font-mono font-bold flex items-center justify-center text-sm mb-4 shadow-2xs">
                    03
                  </div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-primary)] mb-2">
                    Connect, Collaborate &amp; Grow
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed font-normal">
                    Start conversations, discuss requirements, agree on terms and build valuable business relationships. Turn the right connections into projects, partnerships and opportunities for growth.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* WHY CHOOSE TASA SECTION FOR INDUSTRIES & ENTERPRISES */}
          <WhyChooseTasaIndustry />

          {/* CTA BANNER */}
          <section className="py-14 sm:py-18 bg-white">
            <div className="container-responsive">
              <div className="relative rounded-3xl bg-[#1E293B] text-white p-8 sm:p-12 md:p-16 overflow-hidden shadow-xl border border-slate-700">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-brand-primary)]/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-2xl text-left">
                  <span className="text-xs font-bold text-[var(--color-brand-secondary)] uppercase tracking-wider mb-3 block">
                    Enterprise Ready
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                    Scale your corporate workforce without the overhead.
                  </h2>
                  <div className="flex flex-wrap items-center gap-3.5">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] hover:text-[#1E293B] text-white font-semibold text-sm sm:text-base transition-all shadow-md"
                    >
                      <span>Schedule an Enterprise Call</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      href="/categories"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base transition-all border border-white/20"
                    >
                      <span>Explore Vendor Directory</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <FooterLinksSection />
      </div>
    </CustomContextMenu>
  );
}
