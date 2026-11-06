"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Building,
  CheckCircle2,
  ChevronRight,
  Compass,
  Cpu,
  Flame,
  Hammer,
  Layers,
  Plus,
  Scale,
  Settings,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import Header from "@/app/component/parts/header";
import WhyChooseTasaArtisan from "@/app/component/parts/whyChooseTasaArtisan";
import CustomContextMenu from "@/components/ui/CustomContextMenu";

const FLOATING_SKILLS = [
  // --- Left Side Skills (Upper to Lower) ---
  {
    name: "UI/UX & Product Design",
    type: "Professional",
    icon: Sparkles,
    badgeBg: "bg-[var(--color-bg-brand-soft)] text-[var(--color-brand-primary)] border-[var(--color-brand-secondary)]/40",
    dotColor: "bg-[var(--color-brand-primary)]",
    position: "top-[6%] left-[2%] xl:left-[5%]",
  },
  {
    name: "Software Architecture",
    type: "Professional",
    icon: Cpu,
    badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
    dotColor: "bg-slate-700",
    position: "top-[20%] left-[10%] xl:left-[15%]",
  },
  {
    name: "Master Woodworking & Joinery",
    type: "Artisan",
    icon: Hammer,
    badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
    dotColor: "bg-[var(--color-brand-accent)]",
    position: "top-[36%] left-[1%] xl:left-[4%]",
  },
  {
    name: "Corporate Law & Compliance",
    type: "Professional",
    icon: Scale,
    badgeBg: "bg-[var(--color-bg-brand-soft)] text-[var(--color-brand-primary)] border-[var(--color-brand-secondary)]/40",
    dotColor: "bg-[var(--color-brand-primary)]",
    position: "top-[52%] left-[9%] xl:left-[14%]",
  },
  {
    name: "Solar & Industrial Electrical",
    type: "Artisan",
    icon: Zap,
    badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
    dotColor: "bg-[var(--color-brand-accent)]",
    position: "top-[68%] left-[2%] xl:left-[5%]",
  },
  {
    name: "Financial Modeling & CFO Advisory",
    type: "Professional",
    icon: BarChart3,
    badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
    dotColor: "bg-slate-700",
    position: "top-[84%] left-[10%] xl:left-[15%]",
  },

  // --- Right Side Skills (Upper to Lower) ---
  {
    name: "Precision Welding & Metalwork",
    type: "Artisan",
    icon: Flame,
    badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
    dotColor: "bg-[var(--color-brand-accent)]",
    position: "top-[8%] right-[2%] xl:right-[5%]",
  },
  {
    name: "Civil & Structural Engineering",
    type: "Professional",
    icon: Building,
    badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
    dotColor: "bg-slate-700",
    position: "top-[24%] right-[10%] xl:right-[15%]",
  },
  {
    name: "Bespoke Furniture Design",
    type: "Artisan",
    icon: Compass,
    badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
    dotColor: "bg-[var(--color-brand-accent)]",
    position: "top-[40%] right-[1%] xl:right-[4%]",
  },
  {
    name: "Cybersecurity & Cloud Infra",
    type: "Professional",
    icon: ShieldCheck,
    badgeBg: "bg-[var(--color-bg-brand-soft)] text-[var(--color-brand-primary)] border-[var(--color-brand-secondary)]/40",
    dotColor: "bg-[var(--color-brand-primary)]",
    position: "top-[56%] right-[9%] xl:right-[14%]",
  },
  {
    name: "Industrial HVAC & MEP Trades",
    type: "Artisan",
    icon: Settings,
    badgeBg: "bg-amber-50 text-amber-800 border-amber-200",
    dotColor: "bg-[var(--color-brand-accent)]",
    position: "top-[72%] right-[2%] xl:right-[5%]",
  },
  {
    name: "Architectural CAD & BIM",
    type: "Professional",
    icon: Layers,
    badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
    dotColor: "bg-slate-700",
    position: "top-[86%] right-[10%] xl:right-[15%]",
  },
];

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Know Who You're Working With.",
    description:
      "Good work deserves good people. Verified identities, professional credentials, client feedback, and portfolios help everyone make informed decisions and build relationships with confidence.",
  },
  {
    icon: Scale,
    title: "Clear Terms. Better Partnerships.",
    description:
      "No guesswork. No uncomfortable surprises. Agree on the work, deadlines, deliverables, and expectations from the start, so everyone knows what's expected and intellectual property is treated with care.",
  },
  {
    icon: CheckCircle2,
    title: "Your Work Moves Forward. Your Payment Is Protected.",
    description:
      "Every milestone starts with agreed terms and secured project funds. As work is delivered and approved, payments are released according to the agreement, giving both clients and vendors greater peace of mind.",
  },
];

const PROFESSIONAL_HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create your verified specialist profile.",
    description:
      "Showcase your verified certifications, professional accreditations, or master artisan qualifications alongside documented proof of past work.",
  },
  {
    step: "02",
    title: "Agree on scope and secure project milestones.",
    description:
      "Connect with corporate and private clients, define deliverables and schedules, and confirm funded escrow milestones before commencing work.",
  },
  {
    step: "03",
    title: "Execute precision craft. Get paid promptly.",
    description:
      "Deliver your work according to the agreement, receive milestone sign-off, and withdraw secured earnings directly to your bank account or wallet.",
  },
];

const PROFESSIONAL_FAQS = [
  {
    question: "How does Tasa Africa verify credentials and artisan qualifications?",
    answer:
      "Our compliance team reviews government-issued IDs, professional licenses (such as legal, engineering, architectural, or financial councils), and trade apprenticeship certifications. Once approved, your profile receives an authenticated verification badge that instills instant credibility with clients across Africa and globally.",
  },
  {
    question: "How does milestone escrow protect my payment on complex projects?",
    answer:
      "Before you start on any engagement or project phase, the client deposits the agreed funds into Tasa Africa's secure escrow. Once you submit deliverables according to the agreed milestones and the client approves the work, funds are immediately released into your wallet. You never have to chase invoices or wonder if project funds exist.",
  },
  {
    question: "Can artisan workshops, tech squads, and consultancy firms register as teams?",
    answer:
      "Yes. Tasa Africa supports individual solo specialists, master craftsmen with apprentices, and registered corporate advisory squads. You can manage team credentials, collaborate on enterprise tenders, and split milestone disbursements.",
  },
  {
    question: "How do I withdraw my earnings into my local bank or preferred currency?",
    answer:
      "Once milestone funds are released to your wallet, you can withdraw immediately into your local bank account in your domestic currency (such as NGN, KES, GHS, ZAR), via supported mobile money options, or into foreign currency accounts without arbitrary holding periods.",
  },
  {
    question: "What happens if a client changes the scope or requests additional work?",
    answer:
      "Our milestone framework ensures that all project deliverables, deadlines, and revisions are agreed upon before work begins. Any changes outside the initial scope require mutual agreement and a milestone adjustment, ensuring your time, expertise, and materials are always compensated fairly.",
  },
];

export default function ProfessionalsPage() {
  const prefersReducedMotion = useReducedMotion();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

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
          <section className="relative overflow-hidden pt-8 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-16 border-b border-[var(--color-border)]/70">
            {/* Background Ambient Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[56rem] h-[56rem] bg-[var(--color-bg-brand-soft)]/50 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
              <motion.div
                className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-0"
                variants={containerVariants}
                initial={prefersReducedMotion ? false : "hidden"}
                animate="visible"
              >
                {/* Hero Left: Male Professional (Desktop) */}
                <motion.div
                  className="hidden lg:flex w-full lg:w-[26%] xl:w-[25%] justify-end items-start relative select-none pointer-events-none lg:pt-2 xl:pt-3"
                  variants={itemVariants}
                >
                  <div className="relative w-full max-w-[380px] xl:max-w-[440px] 2xl:max-w-[480px] lg:-mr-2 xl:-mr-4">
                    {/* Soft background aura */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-brand-soft)]/80 via-[var(--color-bg-subtle)]/40 to-transparent rounded-3xl -z-10 blur-3xl scale-95" />

                    <Image
                      src="/image/male%20professional.png"
                      alt="Male African professional working on laptop"
                      width={1774}
                      height={887}
                      className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(51,65,85,0.16)]"
                      priority
                    />
                  </div>
                </motion.div>

                {/* Hero Center: Text, Mobile Visual, Subtitle & CTAs */}
                <motion.div
                  className="w-full lg:w-[48%] xl:w-[50%] flex flex-col items-center text-center px-4 sm:px-6 z-10"
                  variants={itemVariants}
                >
                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[2.35rem] xl:text-[2.85rem] 2xl:text-[3.25rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)] leading-[1.12] mb-3 sm:mb-4 lg:mb-5">
                    <span>
                      Your Skill.
                      <br />
                      Your Expertise.
                    </span>
                    <br />
                    <span className="text-[var(--color-brand-primary)]">
                      Your next big opportunity.
                    </span>
                  </h1>

                  {/* Mobile-only: Male Professional placed boldly after hero text before subtitles */}
                  <div className="lg:hidden w-full max-w-[340px] sm:max-w-[420px] mx-auto my-4 sm:my-6 select-none">
                    <Image
                      src="/image/male%20professional.png"
                      alt="Male African professional working on laptop"
                      width={1774}
                      height={887}
                      className="w-full h-auto object-contain drop-shadow-[0_16px_30px_rgba(51,65,85,0.14)]"
                      priority
                    />
                  </div>

                  <p className="text-sm sm:text-base lg:text-[1.05rem] xl:text-[1.125rem] text-[var(--color-text-secondary)] leading-relaxed mb-6 sm:mb-8 lg:mb-9 max-w-xl lg:max-w-2xl font-normal">
                    Your talent deserves the right stage. Connect with people and
                    businesses looking for skilled hands, sharp minds, and
                    exceptional work. Showcase what you do best and discover
                    opportunities to grow across Africa and beyond.
                  </p>

                  {/* Actions (Horizontal on large screens) */}
                  <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 lg:gap-5 mb-8 lg:mb-10">
                    <Link
                      href="/become-a-vendor"
                      className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl bg-[var(--color-brand-dark)] text-white hover:bg-[#1E293B] font-semibold text-sm sm:text-base transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
                    >
                      <span>Join as a Professional</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </Link>

                    <Link
                      href="/categories"
                      className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl border border-[var(--color-border-strong)] text-[var(--color-text-primary)] font-semibold text-sm sm:text-base hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] bg-white transition-all shadow-xs hover:-translate-y-0.5 whitespace-nowrap"
                    >
                      <span>Explore the Industry</span>
                    </Link>
                  </div>

                  {/* Metric Chips (Horizontal on large screens) */}
                  <div className="flex flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-10 xl:gap-12 pt-6 border-t border-[var(--color-border)] w-full max-w-lg lg:max-w-xl">
                    <div className="text-center">
                      <p className="font-display text-2xl lg:text-3xl font-extrabold text-[var(--color-text-primary)]">
                        98.6%
                      </p>
                      <p className="text-xs lg:text-sm text-[var(--color-text-secondary)] font-medium">
                        Verification Rate
                      </p>
                    </div>
                    <div className="h-8 lg:h-10 w-px bg-[var(--color-border)] shrink-0" />
                    <div className="text-center">
                      <p className="font-display text-2xl lg:text-3xl font-extrabold text-[var(--color-brand-primary)]">
                        8,200+
                      </p>
                      <p className="text-xs lg:text-sm text-[var(--color-text-secondary)] font-medium">
                        Verified Experts
                      </p>
                    </div>
                    <div className="h-8 lg:h-10 w-px bg-[var(--color-border)] shrink-0" />
                    <div className="text-center">
                      <p className="font-display text-2xl lg:text-3xl font-extrabold text-[var(--color-brand-accent)]">
                        100%
                      </p>
                      <p className="text-xs lg:text-sm text-[var(--color-text-secondary)] font-medium">
                        Escrow Protected
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Hero Right: Female Professional (Desktop - Lifted & Compacted) */}
                <motion.div
                  className="hidden lg:flex w-full lg:w-[26%] xl:w-[25%] justify-start items-start relative select-none pointer-events-none lg:-mt-4 xl:-mt-8 2xl:-mt-10"
                  variants={itemVariants}
                >
                  <div className="relative w-full max-w-[300px] xl:max-w-[360px] 2xl:max-w-[400px] lg:-ml-2 xl:-ml-4">
                    {/* Soft background aura */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-brand-soft)]/80 via-[var(--color-bg-subtle)]/40 to-transparent rounded-3xl -z-10 blur-3xl scale-95" />

                    <Image
                      src="/image/female%20professional.png"
                      alt="Female African corporate consultant and executive leader"
                      width={1200}
                      height={896}
                      className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(51,65,85,0.16)]"
                      priority
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* TWO PILLARS OVERVIEW / CAPABILITIES */}
          <section className="py-16 sm:py-20 lg:py-24 bg-[var(--color-bg-subtle)] border-b border-[var(--color-border)] overflow-hidden">
            <div className="container-responsive">
              <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-text-primary)]">
                  No matter your expertise, there&apos;s room for you
                </h2>
                <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mt-3">
                  Whether you are a licensed corporate advisor, a modern technologist, or a master artisan executing precision craft — showcase your capabilities and connect with clients looking for your work.
                </p>
              </div>

              {/* Main Visual Arena: Male Professional with Stylus surrounded by floating skills */}
              <div className="relative w-full rounded-3xl bg-gradient-to-b from-white via-white/80 to-[var(--color-bg-brand-soft)]/20 border border-[var(--color-border)] pt-6 px-4 pb-0 sm:pt-8 sm:px-8 sm:pb-0 lg:pt-12 lg:px-12 lg:pb-0 shadow-xs overflow-hidden">
                {/* Ambient radial glows behind character */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 md:w-96 lg:w-[500px] h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-full bg-gradient-to-tr from-[var(--color-brand-primary)]/15 via-[var(--color-brand-secondary)]/20 to-[var(--color-brand-accent)]/15 blur-3xl pointer-events-none" />

                {/* Concentric subtle architectural rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[320px] md:w-[460px] lg:w-[560px] h-[240px] sm:h-[320px] md:h-[460px] lg:h-[560px] rounded-full border border-[var(--color-brand-primary)]/15 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] sm:w-[240px] md:w-[360px] lg:w-[440px] h-[180px] sm:h-[240px] md:h-[360px] lg:h-[440px] rounded-full border border-dashed border-[var(--color-brand-secondary)]/20 pointer-events-none" />

                {/* Central Canvas Container */}
                <div className="relative min-h-[300px] sm:min-h-[380px] md:min-h-[520px] lg:min-h-[660px] w-full flex items-end justify-center select-none">
                  {/* Central Figure Image touching bottom border */}
                  <div className="relative z-10 flex items-end justify-center leading-none">
                    <Image
                      src="/image/professional male with Stylus.png"
                      alt="Professional male with Stylus"
                      width={520}
                      height={680}
                      className="object-contain max-h-[300px] sm:max-h-[380px] md:max-h-[520px] lg:max-h-[660px] w-auto drop-shadow-2xl select-none pointer-events-none block align-bottom"
                      priority
                    />
                  </div>

                  {/* Desktop & Tablet Floating Skill Pills (md+) */}
                  <div className="hidden md:block absolute inset-0 z-20 pointer-events-none">
                    {FLOATING_SKILLS.map((skill) => {
                      const Icon = skill.icon;
                      return (
                        <div
                          key={skill.name}
                          className={`absolute ${skill.position} pointer-events-auto transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl cursor-default group`}
                        >
                          <div className="flex items-center gap-2.5 px-3.5 py-2 lg:px-4 lg:py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md group-hover:border-[var(--color-brand-primary)]/60 transition-colors">
                            <div
                              className={`w-7 h-7 lg:w-8 lg:h-8 rounded-xl flex items-center justify-center border ${skill.badgeBg} group-hover:scale-110 transition-transform`}
                            >
                              <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                            </div>
                            <span className="text-xs lg:text-sm font-bold text-slate-800 tracking-tight whitespace-nowrap group-hover:text-[var(--color-brand-primary)] transition-colors">
                              {skill.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mobile Skills Showcase (< md) */}
              <div className="md:hidden mt-6">
                {/* Mobile Skills Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {FLOATING_SKILLS.map((skill) => {
                    const Icon = skill.icon;
                    return (
                      <div
                        key={skill.name}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs"
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${skill.badgeBg}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight leading-snug">
                          {skill.name}
                        </span>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          </section>

          {/* INSTITUTIONAL TRUST & VERIFICATION */}
          <section className="py-16 sm:py-20 lg:py-24 bg-white overflow-hidden">
            <div className="container-responsive">
              <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
              
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-text-primary)] mb-4">
                  Good Work Starts with Trust.
                </h2>
                <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
                  Great partnerships happen when everyone feels confident. You
                  should be able to focus on your craft, trust the person you&apos;re
                  working with, and know that the agreement means something.
                  That&apos;s why Tasa Africa puts clarity, accountability, and
                  payment protection at the heart of every engagement.
                </p>
              </div>

              <div className="pt-2 sm:pt-4 lg:pt-6 pb-6 sm:pb-8 lg:pb-10">
                <div className="grid gap-6 sm:gap-7 md:grid-cols-3 lg:gap-8 items-stretch">
                  {TRUST_PILLARS.map((pillar, index) => {
                    const Icon = pillar.icon;
                    const arcClasses =
                      index === 0
                        ? "md:-rotate-2 lg:-rotate-3 md:translate-y-4 lg:translate-y-6 md:origin-top-right"
                        : index === 1
                        ? "md:rotate-0 md:-translate-y-3 lg:-translate-y-5 md:z-10"
                        : "md:rotate-2 lg:rotate-3 md:translate-y-4 lg:translate-y-6 md:origin-top-left";

                    return (
                      <div
                        key={pillar.title}
                        className={`relative p-7 sm:p-8 rounded-2xl bg-[var(--color-brand-dark)] border border-slate-600/40 shadow-xl overflow-hidden flex flex-col text-left transition-all duration-300 hover:shadow-2xl hover:border-slate-500/70 group ${arcClasses}`}
                      >
                        {/* Subtle decorative glow */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--color-brand-primary)]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[var(--color-brand-primary)]/20 transition-all" />

                        {/* Icon */}
                        <div className="w-12 h-12 rounded-xl bg-slate-700/60 border border-slate-600/70 text-[var(--color-brand-secondary)] flex items-center justify-center mb-5 shadow-inner">
                          <Icon className="w-6 h-6" />
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-lg sm:text-xl text-white mb-3 leading-snug">
                          {pillar.title}
                        </h3>

                        {/* Description in lighter brand color */}
                        <p className="text-sm sm:text-base text-[var(--color-brand-secondary)] leading-relaxed font-normal flex-1">
                          {pillar.description}
                        </p>

                        {/* Incomplete border bottom of accent color */}
                        <div
                          className="absolute bottom-0 left-7 sm:left-8 w-28 sm:w-36 h-1 bg-[var(--color-brand-accent)] rounded-t-full"
                          aria-hidden="true"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Concluding Trust Statement */}
              <div className="mt-12 sm:mt-14 text-center">
                <div className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-[var(--color-bg-brand-soft)] border border-[var(--color-brand-secondary)]/35 max-w-2xl mx-auto shadow-2xs">
                  <p className="text-sm sm:text-base font-semibold text-[var(--color-text-primary)]">
                    On <span className="text-[var(--color-brand-primary)] font-bold">Tasa Africa</span>, trust isn&apos;t just a promise. It&apos;s part of how the work gets done.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS SECTION */}
          <section className="py-16 sm:py-24 bg-[var(--color-bg-subtle)] border-b border-[var(--color-border)]">
            <div className="container-responsive">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                {/* Left Column: Headline & CTA (Sticky on Desktop) */}
                <div className="lg:col-span-5 lg:sticky lg:top-28 text-left">
                  <span className="text-xs font-bold text-[var(--color-brand-primary)] uppercase tracking-wider mb-2 block">
                    Straightforward Process
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--color-text-primary)] tracking-tight leading-[1.15] mb-4">
                    From first hello to project sign-off.
                  </h2>
                  <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed mb-8 max-w-sm">
                    Connecting with clients, locking in milestones, and delivering exceptional work on Tasa Africa is structured for clarity and confidence.
                  </p>

                  <Link
                    href="/become-a-vendor"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-brand-dark)] hover:bg-[#1E293B] text-white font-semibold text-sm sm:text-base transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    <span>Join as a Talent</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Link>
                </div>

                {/* Right Column: Connected Vertical Timeline */}
                <div className="lg:col-span-7 pt-2 lg:pt-0">
                  <div className="relative pl-12 sm:pl-16 space-y-8 sm:space-y-10">
                    {/* Continuous Vertical Timeline Line */}
                    <div className="absolute left-[19px] sm:left-[23px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[var(--color-brand-primary)] via-[var(--color-brand-secondary)] to-[var(--color-border-strong)]" />

                    {PROFESSIONAL_HOW_IT_WORKS.map((item) => (
                      <div key={item.step} className="relative group">
                        {/* Timeline Node Marker */}
                        <div className="absolute -left-12 sm:-left-16 top-1.5 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--color-brand-dark)] text-white font-mono font-extrabold text-xs sm:text-sm flex items-center justify-center shadow-md ring-4 ring-white z-10 transition-transform group-hover:scale-105 group-hover:bg-[var(--color-brand-primary)]">
                          {item.step}
                        </div>

                        {/* Step Content Card */}
                        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 sm:p-7 shadow-xs hover:border-[var(--color-brand-primary)]/50 hover:shadow-md transition-all">
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

          {/* GLOBAL OPPORTUNITIES SECTION */}
          <section className="pt-8 sm:pt-10 lg:pt-12 pb-0 bg-white border-b border-[var(--color-border)] overflow-hidden relative">
            {/* Background Ambient Glow centered behind the composition */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] sm:w-[46rem] lg:w-[54rem] h-[24rem] sm:h-[30rem] lg:h-[34rem] bg-gradient-to-tr from-[var(--color-brand-accent)]/15 via-[var(--color-bg-brand-soft)]/50 to-[var(--color-brand-primary)]/10 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Mobile View: Kept intact as approved (< lg) */}
            <div className="lg:hidden w-full max-w-5xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col items-center justify-center relative">
                <div className="relative z-10 pt-4 sm:pt-6 text-center w-full shrink-0 pointer-events-auto">
                  <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] leading-[1.08] tracking-[-0.03em] drop-shadow-sm">
                    <span>Your Expertise</span>
                    <br />
                    <span>can take you</span>{" "}
                    <span className="text-[var(--color-brand-primary)]">Global</span>
                  </h2>
                </div>

                <div className="relative z-20 -mt-8 sm:-mt-12 w-full flex items-end justify-center leading-none select-none pointer-events-none">
                  <Image
                    src="/image/rocket-launch.png"
                    alt="Rocket launch symbolizing your expertise going global"
                    width={1264}
                    height={848}
                    className="w-full max-w-[380px] sm:max-w-[460px] md:max-w-[520px] h-auto object-contain block align-bottom drop-shadow-[0_20px_45px_rgba(255,166,43,0.18)]"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Large Screen View (lg+): Rocket at perfect horizontal center touching bottom border, Headline raised up overlapping image */}
            <div className="hidden lg:block relative w-full max-w-6xl mx-auto px-6 lg:px-8 min-h-[520px] xl:min-h-[580px] select-none">
              {/* Centered Rocket Visual touching the bottom border */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[720px] xl:max-w-[800px] flex items-end justify-center leading-none z-10 pointer-events-none select-none">
                <Image
                  src="/image/rocket-launch.png"
                  alt="Rocket launch symbolizing your expertise going global"
                  width={1264}
                  height={848}
                  className="w-full h-auto object-contain block align-bottom drop-shadow-[0_25px_50px_rgba(255,166,43,0.18)]"
                  priority
                />
              </div>

              {/* Headline overlapping on the image, positioned with headroom and Global on new line */}
              <div className="absolute top-8 lg:top-16 xl:top-24 left-6 lg:left-32 xl:left-32 z-20 max-w-lg xl:max-w-xl text-left pointer-events-auto">
                <h2 className="font-display text-4xl lg:text-[3.15rem] xl:text-[3.75rem] font-extrabold text-[var(--color-text-primary)] leading-[1.08] tracking-[-0.03em] drop-shadow-sm">
                  <span>Your Expertise</span>
                  <br />
                  <span>can take you</span>
                  <br />
                  <span className="text-[var(--color-brand-primary)]">Global</span>
                </h2>
              </div>
            </div>
          </section>

          {/* WHY CHOOSE TASA SECTION FOR ARTISANS & PROFESSIONALS */}
          <WhyChooseTasaArtisan />

          {/* FAQ SECTION */}
          <section className="py-16 sm:py-24 bg-[var(--color-bg-subtle)] border-b border-[var(--color-border)]">
            <div className="container-responsive">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                {/* Left Column: Bold FAQ Heading (Sticky on Desktop) */}
                <div className="lg:col-span-5 lg:sticky lg:top-28 text-left">
                  <span className="text-xs font-bold text-[var(--color-brand-primary)] uppercase tracking-wider mb-2 block">
                    Common Questions
                  </span>
                  <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-text-primary)] tracking-tight">
                    FAQ
                  </h2>
                  <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mt-3 sm:mt-4 leading-relaxed max-w-sm">
                    Clear answers about verification, escrow protection, enterprise contracts, and payouts on Tasa Africa.
                  </p>
                </div>

                {/* Right Column: Collapsible Questions Accordion */}
                <div className="lg:col-span-7 space-y-3.5">
                  {PROFESSIONAL_FAQS.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                      <div
                        key={faq.question}
                        className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden transition-all shadow-2xs"
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

          {/* CTA BANNER */}
          <section className="py-14 sm:py-18 bg-white">
            <div className="container-responsive">
              <div className="relative rounded-3xl bg-[var(--color-brand-dark)] text-white p-8 sm:p-12 md:p-16 overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-brand-primary)]/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-2xl text-left">
                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                    Ready to put your Expertise to work?
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
                    Join a curated network of vetted professionals and access high-value projects,
                    enterprise contracts, and reliable payments through Tasa Africa’s secure platform.
                  </p>

                  <div className="flex flex-wrap items-center gap-3.5">
                    <Link
                      href="/become-a-vendor"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] hover:text-[var(--color-brand-dark)] text-white font-semibold text-sm sm:text-base transition-all shadow-md"
                    >
                      <span>Join as a Talent</span>
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
