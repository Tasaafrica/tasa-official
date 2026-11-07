"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowRight, ChevronRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import Header from "@/app/component/parts/header";
import WhyChooseTasaCreative from "@/app/component/parts/whyChooseTasaCreative";
import CustomContextMenu from "@/components/ui/CustomContextMenu";

const CREATIVE_CATEGORIES = [
  { id: "branding", label: "Branding" },
  { id: "web-design", label: "Web Design" },
  { id: "illustrations", label: "Illustrations" },
  { id: "motion", label: "Motion" },
  { id: "photography", label: "Photography" },
  { id: "product-design", label: "Product Design" },
];

interface ShowcaseItem {
  id: string;
  name: string;
  role: string;
  category: string;
  image: string;
}

const CREATIVE_SHOWCASE: ShowcaseItem[] = [
  // 1. Branding (Exact match with reference image)
  {
    id: "b-1",
    name: "Aura Studio",
    role: "Brand Identity",
    category: "branding",
    image: "/image/creatives/packaging-boxes.jpg",
  },
  {
    id: "b-2",
    name: "Jessica",
    role: "Brand Identity",
    category: "branding",
    image: "/image/creatives/brand-bottle-red.jpg",
  },
  {
    id: "b-3",
    name: "Mike",
    role: "Brand Identity",
    category: "branding",
    image: "/image/creatives/brand-pin-orange.jpg",
  },
  {
    id: "b-4",
    name: "Aaron",
    role: "Brand Identity",
    category: "branding",
    image: "/image/creatives/brand-laptop-blue.jpg",
  },
  {
    id: "b-5",
    name: "J.D.",
    role: "Brand Identity",
    category: "branding",
    image: "/image/creatives/brand-posters-wall.jpg",
  },
];

const VALUE_PROPOSITIONS = [
  {
    number: "01",
    title: "Keep more of what you earn.",
    description:
      "You set your prices, agree on your terms, and keep more of your hard-earned money.",
  },
  {
    number: "02",
    title: "Work without the worry.",
    description:
      "Your client funds the project upfront. You work towards agreed milestones, knowing your payment is secured.",
  },
  {
    number: "03",
    title: "Find clients beyond your circle.",
    description:
      "Get discovered by brands, businesses, and people looking for exactly what you do, across Africa and beyond.",
  },
  {
    number: "04",
    title: "Turn one client into many.",
    description:
      "Work directly with your clients, build trust, and turn great projects into lasting relationships.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Show the world what you do.",
    description:
      "Create your profile, showcase your best work, and let clients discover what makes you different.",
  },
  {
    step: "02",
    title: "Find your people. Agree on the details.",
    description:
      "Connect with clients, discuss the project, agree on the price and milestones, and get the funding secured before you begin.",
  },
  {
    step: "03",
    title: "Do your thing. Get paid.",
    description:
      "Deliver your best work, get client approval, and receive your payment according to the agreed milestones.",
  },
];

const CREATIVE_FAQS = [
  {
    question: "How does TASA ensure I get paid for my creative work?",
    answer:
      "TASA uses an automated milestone escrow system. Before you start work on any project or milestone, the client deposits the agreed payment into escrow. When you submit your deliverables and the client approves the milestone, the funds are instantly released into your vendor wallet.",
  },
  {
    question:
      "Can I showcase work hosted on external platforms like Behance, Figma, or Vimeo?",
    answer:
      "Yes! Your TASA profile is built to showcase your actual work wherever it lives. You can embed and link live portfolios from Behance, Dribbble, Figma, Vimeo, YouTube, Spotify, and GitHub, along with verified proof of past projects.",
  },
  {
    question:
      "How do I withdraw my earnings into my local bank or mobile money?",
    answer:
      "Once milestone funds are released to your wallet, you can withdraw directly in your local African currency (such as NGN, KES, GHS, ZAR) via direct bank transfer or supported mobile money services, or receive international settlements.",
  },
  {
    question: "Who owns the intellectual property (IP) of the work I create?",
    answer:
      "You retain full copyright and ownership of all draft files and deliverables until the client approves the milestone and full escrow payment is released. Once payment is finalized, ownership transfers seamlessly according to your agreed brief.",
  },
  {
    question: "Is there a fee to create a creative vendor profile on TASA?",
    answer:
      "Creating your creative profile, setting up your portfolio, and receiving client inquiries is completely free. TASA is built to empower African talent, not burden creators with upfront listing fees.",
  },
];

export default function CreativesPage() {
  const prefersReducedMotion = useReducedMotion();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.35,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <CustomContextMenu>
      <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text-primary)]">
        <Header variant="white" />

        <main id="main-content">
          {/* HERO SECTION */}
          <section className="relative overflow-hidden pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24 border-b border-[var(--color-border)]/70 bg-gradient-to-b from-white via-white to-[var(--color-bg-subtle)]/50">
            {/* Ambient Background Accents */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] bg-[var(--color-bg-brand-soft)]/45 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-8 right-4 w-72 h-72 bg-[var(--color-brand-secondary)]/15 rounded-full blur-2xl pointer-events-none -z-10" />

            <div className="container-responsive">
              <motion.div
                className="flex flex-col items-center text-center max-w-4xl mx-auto"
                variants={containerVariants}
                initial={prefersReducedMotion ? false : "hidden"}
                animate="visible"
              >
                {/* 1. Hero Heading (Centered) */}
                <motion.div
                  className="max-w-3xl mx-auto text-center mb-8 sm:mb-10"
                  variants={itemVariants}
                >
                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)] leading-[1.14]">
                    Your Craft. <br /> Your Terms. <br />{" "}
                    <span className="text-[var(--color-brand-primary)]">
                      Africa&apos;s Premier Creative Network.
                    </span>
                  </h1>
                </motion.div>

                {/* 2. Hero Visual (Centered after heading) */}
                <motion.div
                  className="w-full flex items-center justify-center relative mb-8 sm:mb-12"
                  variants={itemVariants}
                >
                  <div className="relative w-full max-w-4xl lg:max-w-5xl">
                    {/* Decorative Backdrop Glow */}
                    <div className="absolute -inset-3 sm:-inset-4 rounded-3xl bg-gradient-to-tr from-[var(--color-brand-secondary)]/25 via-[var(--color-bg-brand-soft)] to-[var(--color-brand-accent)]/20 blur-xl pointer-events-none -z-10" />

                    {/* Framed Image Container */}
                    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--color-border)] bg-slate-950 shadow-2xl shadow-slate-900/10 aspect-[2048/768]">
                      <Image
                        src="/image/Defy%20Conventional%20Boundaries_%20Creative%20Culture%20Collage.png"
                        alt="Defy conventional boundaries - African creative culture collage featuring photographers, digital designers, musicians, and performers"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1080px"
                        className="object-cover object-center"
                        priority
                      />
                    </div>
                  </div>
                </motion.div>

                {/* 3. Description Text & Actions (Centered after image) */}
                <motion.div
                  className="max-w-2xl mx-auto flex flex-col items-center text-center"
                  variants={itemVariants}
                >
                  <p className="text-base sm:text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed mb-8 font-normal">
                    Become a global talent. Connect with global brands,
                    agencies, and founders looking for authentic African
                    creative excellence.
                  </p>

                  {/* Primary & Secondary Action CTAs */}
                  <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mb-8">
                    <Link
                      href="/become-a-vendor"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-button-secondary-hover)] text-white font-semibold text-sm sm:text-base transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                    >
                      <span>Join as a Creative</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </Link>

                    <a
                      href="#disciplines"
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-[var(--color-border-strong)] text-[var(--color-text-primary)] font-semibold text-sm sm:text-base hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] bg-white transition-all shadow-sm"
                    >
                      <span>Explore Industry</span>
                    </a>
                  </div>

                  {/* Trust Highlights Strip */}
                  <div className="grid grid-cols-3 gap-6 sm:gap-10 pt-8 border-t border-[var(--color-border)] w-full max-w-md mx-auto text-center">
                    <div>
                      <p className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)]">
                        100%
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-0.5">
                        Escrow Protection
                      </p>
                    </div>
                    <div>
                      <p className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--color-brand-primary)]">
                        5,000+
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-0.5">
                        Active Creatives
                      </p>
                    </div>
                    <div>
                      <p className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--color-brand-accent)]">
                        20+
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] font-medium mt-0.5">
                        African Nations
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* VALUE PROPOSITIONS: WHY CREATIVES CHOOSE TASA */}
          <section className="py-16 sm:py-20 bg-white">
            <div className="container-responsive">
              <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-text-primary)] leading-tight">
                  Your talent deserves better!
                </h2>
                <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mt-3.5 leading-relaxed">
                  You have the skills. You have the ideas. Now, you need the
                  right people to see your work, pay you fairly, and help your
                  career grow.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {VALUE_PROPOSITIONS.map((prop) => {
                  return (
                    <div
                      key={prop.title}
                      className="p-6 rounded-2xl bg-[var(--color-brand-dark)] text-white flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-full bg-white text-[var(--color-brand-dark)] flex items-center justify-center font-bold text-sm mb-5 shadow-xs">
                          {prop.number}
                        </div>
                        <h3 className="font-bold text-base text-white mb-2 leading-snug">
                          {prop.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {prop.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* HOW IT WORKS FOR CREATIVES */}
          <section className="py-16 sm:py-24 bg-[var(--color-bg-subtle)] border-y border-[var(--color-border)]">
            <div className="container-responsive">
              <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                {/* Left Column: Large bold heading, description, and direct CTA */}
                <div className="lg:col-span-5 lg:sticky lg:top-28">
                  <span className="px-3 py-1 rounded-full bg-[var(--color-bg-brand-soft)] text-[var(--color-brand-primary)] text-xs font-bold uppercase tracking-wider inline-block mb-4">
                    How TASA Works
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] leading-[1.12] tracking-[-0.02em] mb-5">
                    From your first hello to your next big win.
                  </h2>
                  <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed mb-8 font-normal">
                    Getting work shouldn&apos;t be hard. TASA makes it easier to
                    show what you do, find the right clients, and get paid for
                    doing what you love.
                  </p>

                  <Link
                    href="/become-a-vendor"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-button-secondary-hover)] text-white font-semibold text-sm sm:text-base transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                  >
                    <span>Start Your Creator Profile</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Link>
                </div>

                {/* Right Column: Connected Vertical Timeline */}
                <div className="lg:col-span-7 pt-2 lg:pt-0">
                  <div className="relative pl-12 sm:pl-16 space-y-8 sm:space-y-10">
                    {/* Continuous Vertical Timeline Line */}
                    <div className="absolute left-[19px] sm:left-[23px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[var(--color-brand-primary)] via-[var(--color-brand-secondary)] to-[var(--color-border-strong)]" />

                    {HOW_IT_WORKS.map((item) => (
                      <div key={item.step} className="relative group">
                        {/* Timeline Node Marker */}
                        <div className="absolute -left-12 sm:-left-16 top-1.5 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--color-brand-primary)] text-white font-mono font-extrabold text-xs sm:text-sm flex items-center justify-center shadow-md ring-4 ring-white z-10 transition-transform group-hover:scale-105">
                          {item.step}
                        </div>

                        {/* Step Content Card */}
                        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 sm:p-7 shadow-xs hover:border-[var(--color-brand-secondary)] hover:shadow-md transition-all">
                          <span className="inline-block font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[var(--color-bg-brand-soft)] text-[var(--color-brand-primary)] mb-3">
                            STEP {item.step}
                          </span>
                          <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-2.5">
                            {item.title}
                          </h3>
                          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CREATIVE SHOWCASE / DISCIPLINES SECTION */}
          <section
            id="disciplines"
            className="py-16 sm:py-24 bg-white border-b border-[var(--color-border)]"
          >
            <div className="container-responsive">
              <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
                <span className="text-xs font-bold text-[var(--color-brand-primary)] uppercase tracking-wider mb-2 block">
                  Creative Disciplines
                </span>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-text-primary)]">
                  Know Your Industry
                </h2>
                <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mt-3">
                  Whatever you create, there&apos;s a place for it.
                </p>
              </div>

              {/* Illustrative Category Pills */}
              <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap mb-10 sm:mb-12">
                {CREATIVE_CATEGORIES.map((cat, index) => {
                  const isActive = index === 0;
                  return (
                    <span
                      key={cat.id}
                      className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold select-none cursor-default ${
                        isActive
                          ? "bg-[var(--color-brand-primary)] text-white shadow-sm"
                          : "bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                      }`}
                    >
                      {cat.label}
                    </span>
                  );
                })}
              </div>

              {/* Showcase Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5">
                {CREATIVE_SHOWCASE.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl overflow-hidden bg-white border border-[var(--color-border)] shadow-xs flex flex-col"
                  >
                    {/* Showcase Image Area */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--color-bg-subtle)]">
                      <Image
                        src={item.image}
                        alt={`${item.name} - ${item.role}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover object-center"
                      />
                    </div>

                    {/* Card Info Footer */}
                    <div className="p-3.5 sm:p-4 bg-white flex flex-col justify-center border-t border-[var(--color-border)]/60">
                      <p className="text-[var(--color-text-primary)] text-sm sm:text-base font-bold leading-tight">
                        {item.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-medium">
                        {item.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Navigation Link */}
              <div className="mt-12 sm:mt-16 text-center">
                <Link
                  href="/categories/graphics-design"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[var(--color-border-strong)] text-[var(--color-text-primary)] hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] bg-white font-semibold text-sm transition-all shadow-sm active:scale-[0.98]"
                >
                  <span>Explore Creative Industry</span>
                  <ChevronRight className="w-4 h-4 text-[var(--color-text-secondary)]" />
                </Link>
              </div>
            </div>
          </section>

          {/* WHY CHOOSE TASA AFRICA SECTION */}
          <WhyChooseTasaCreative />

          {/* CREATIVE FAQS */}
          <section className="py-16 sm:py-24 bg-[var(--color-bg-subtle)] border-t border-[var(--color-border)]">
            <div className="container-responsive">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                {/* Left Column: Bold FAQ Heading */}
                <div className="lg:col-span-5 lg:sticky lg:top-28">
                  <span className="text-xs font-bold text-[var(--color-brand-primary)] uppercase tracking-wider mb-2 block">
                    Common Questions
                  </span>
                  <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-text-primary)] tracking-tight">
                    FAQ
                  </h2>
                  <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mt-3 sm:mt-4 leading-relaxed max-w-sm">
                    Clear answers about payouts, rights, client collaboration,
                    and security on TASA.
                  </p>
                </div>

                {/* Right Column: Collapsible Questions */}
                <div className="lg:col-span-7 space-y-3.5">
                  {CREATIVE_FAQS.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                      <div
                        key={faq.question}
                        className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden transition-all shadow-xs"
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(index)}
                          aria-expanded={isOpen}
                          className="w-full px-5 py-4.5 sm:px-6 sm:py-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] transition-colors group cursor-pointer"
                        >
                          <span className="pr-2">{faq.question}</span>
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all duration-200 ${
                              isOpen
                                ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]"
                                : "border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] group-hover:border-[var(--color-brand-primary)] group-hover:text-[var(--color-brand-primary)]"
                            }`}
                          >
                            <Plus
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isOpen ? "rotate-45" : ""
                              }`}
                            />
                          </span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border)]/50 pt-3.5">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* CALL TO ACTION BANNER */}
          <section className="py-14 sm:py-18 bg-white">
            <div className="container-responsive">
              <div className="relative rounded-3xl bg-[var(--color-brand-dark)] text-white p-8 sm:p-12 md:p-16 overflow-hidden shadow-xl">
                {/* Decorative glows */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-brand-primary)]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-[var(--color-brand-secondary)]/15 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 max-w-2xl text-left">
                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                    Ready to take your creative career global?
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
                   Show off your best work, get discovered by clients, and turn your creative skills into real opportunities across Africa and beyond. Your talent deserves to be seen.
                  </p>

                  <div className="flex flex-wrap items-center gap-3.5">
                    <Link
                      href="/become-a-vendor"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] hover:text-[var(--color-brand-dark)] text-white font-semibold text-sm sm:text-base transition-all shadow-md active:scale-[0.98]"
                    >
                      <span>Join as a Creative</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      href="/categories"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base transition-all border border-white/20"
                    >
                      <span>Explore Industry</span>
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
