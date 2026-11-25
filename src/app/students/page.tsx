"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  DollarSign,
  PenTool,
  Plus,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import Header from "@/app/component/parts/header";
import { useAuthModal } from "@/components/providers/AuthModalProvider";
import CustomContextMenu from "@/components/ui/CustomContextMenu";
import { useAuth } from "@/hooks/useAuth";

const STUDENT_STEPS = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Join TASA and set up your profile. Tell us a little about yourself, what you're learning and the skills you're developing.",
  },
  {
    number: "02",
    title: "Showcase What You Can Do",
    description:
      "Add your skills, projects, experience and portfolio. Whether you've worked with a client or completed a personal project, let people see what you're capable of.",
  },
  {
    number: "03",
    title: "Discover Opportunities",
    description:
      "Explore projects, connect with potential clients and find opportunities that match your abilities. Start conversations and put your skills to work.",
  },
  {
    number: "04",
    title: "Build Your Experience",
    description:
      "Take on opportunities, deliver great work, earn from your skills and build a professional reputation that can open doors to even bigger possibilities.",
  },
];

const STUDENT_PILLARS = [
  {
    number: "01",
    title: "Learn",
    icon: BookOpen,
    description:
      "Keep growing your knowledge, discover new skills and develop your potential.",
  },
  {
    number: "02",
    title: "Create",
    icon: PenTool,
    description:
      "Turn your ideas and creativity into meaningful projects that showcase what you can do.",
  },
  {
    number: "03",
    title: "Earn",
    icon: DollarSign,
    description:
      "Put your skills to work, take on opportunities and earn from your abilities.",
  },
  {
    number: "04",
    title: "Grow",
    icon: TrendingUp,
    description:
      "Gain real-world experience, build valuable connections and develop a reputation that takes you further.",
  },
];

const STUDENT_FAQS = [
  {
    question: "Do I have to be a university or college student to join TASA?",
    answer:
      "Not at all. Whether you're in secondary school, university, a graduate, learning a skill or developing your talents independently, TASA gives you a place to showcase what you can do and discover opportunities.",
  },
  {
    question: "What if I don't have any work experience?",
    answer:
      "You don't need years of professional experience to get started. Showcase personal projects, school assignments, practice work or anything that demonstrates your abilities. Everyone starts somewhere.",
  },
  {
    question: "What kind of skills can I offer on TASA?",
    answer:
      "You can showcase creative, digital, technical, academic and entrepreneurial skills. This includes graphic design, writing, programming, video editing, photography, tutoring, digital marketing and many more.",
  },
  {
    question: "Can I actually make money on TASA?",
    answer:
      "Yes, TASA is designed to help you connect with potential clients and discover paid opportunities where you can put your skills to work. Your earnings will depend on the opportunities you secure and the value of the work you deliver.",
  },
  {
    question: "How do I find clients or projects?",
    answer:
      "Create a profile that highlights your skills, experience and work samples. You can then explore available opportunities and connect with people or businesses looking for the services you offer.",
  },
  {
    question: "Can I work with clients outside my country?",
    answer:
      "TASA is built to connect talent and opportunities across Africa and beyond. You can showcase your abilities to a wider audience and explore opportunities beyond your immediate location.",
  },
  {
    question: "Can I join TASA while still studying?",
    answer:
      "Absolutely! You can continue your studies while exploring opportunities that fit your schedule and abilities. Start small, gain experience and grow at your own pace.",
  },
  {
    question: "How do I get started?",
    answer:
      "Simply create your TASA account, complete your profile, showcase your skills and start exploring opportunities. You don't have to wait until graduation to begin building your professional journey.",
  },
];

export default function StudentsPage() {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { openSignup } = useAuthModal();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleCTAClick = () => {
    if (isAuthenticated) {
      router.push("/become-a-vendor");
    } else {
      openSignup();
    }
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
          <section className="relative overflow-hidden pt-8 pb-14 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20 border-b border-[var(--color-border)]/70">
            {/* Background Ambient Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[45rem] h-[30rem] bg-[var(--color-bg-brand-soft)]/50 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="container-responsive">
              <motion.div
                className="flex flex-col items-center text-center max-w-5xl mx-auto"
                variants={containerVariants}
                initial={prefersReducedMotion ? false : "hidden"}
                animate="visible"
              >
                {/* 1. Main Hero Headline (Centered) */}
                <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)] leading-[1.14]">
                    Your Talent Can{" "}
                    <span className="text-[var(--color-brand-primary)]">
                      Take You Further
                    </span>
                    .
                  </h1>
                </motion.div>

                {/* 2. Widescreen Hero Image (african-students.png) (Centered) */}
                <motion.div
                  className="w-full my-8 sm:my-10 relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-[var(--color-border)] bg-slate-100"
                  variants={itemVariants}
                >
                  <Image
                    src="/image/african-students.png"
                    alt="African students collaborating on campus"
                    width={2048}
                    height={768}
                    priority
                    className="w-full h-auto object-cover select-none"
                  />
                </motion.div>

                {/* 3. Description Narrative, CTAs & Highlights (Centered) */}
                <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
                  <p className="text-base sm:text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed font-normal">
                    Turn what you know, what you create and what you can do into
                    real opportunities. Showcase your skills, connect with
                    clients and start building your professional journey while
                    you learn.
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                    <button
                      type="button"
                      onClick={handleCTAClick}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-button-secondary-hover)] font-semibold text-sm sm:text-base transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <span>Join the Student Community</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>

                    <Link
                      href="#student-tracks"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[var(--color-border-strong)] text-[var(--color-text-primary)] font-semibold text-sm sm:text-base hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] bg-white transition-all shadow-sm"
                    >
                      <span>Explore In-Demand Skills</span>
                    </Link>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-8 mt-8 border-t border-[var(--color-border)]">
                    <div>
                      <p className="font-display text-2xl font-extrabold text-[var(--color-brand-primary)]">
                        Zero Fees
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] font-medium">
                        100% Free to Join
                      </p>
                    </div>
                    <div className="h-8 w-px bg-[var(--color-border)]" />
                    <div>
                      <p className="font-display text-2xl font-extrabold text-[var(--color-text-primary)]">
                        Part-Time
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] font-medium">
                        Work Around Classes
                      </p>
                    </div>
                    <div className="h-8 w-px bg-[var(--color-border)]" />
                    <div>
                      <p className="font-display text-2xl font-extrabold text-[var(--color-brand-accent)]">
                        Protected
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] font-medium">
                        Escrow Payouts
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* LEARN. CREATE. EARN. GROW. SECTION */}
          <section className="py-16 sm:py-20 lg:py-24 bg-[var(--color-bg-subtle)] border-b border-[var(--color-border)] relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[38rem] bg-[var(--color-bg-brand-soft)]/50 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="container-responsive">
              {/* Section Header */}
              <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[var(--color-text-primary)] tracking-tight leading-[1.15]">
                  Learn. Create.{" "}
                  <span className="text-[var(--color-brand-primary)]">
                    Earn. Grow.
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mt-3 sm:mt-4 leading-relaxed font-normal">
                  Turn what you study into real-world independence. Gain
                  practical experience, deliver great work, get paid on time,
                  and build a lasting professional network before graduation.
                </p>
              </div>

              {/* 3-Column Visual Arena */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center max-w-6xl mx-auto">
                {/* Left Column: Learn & Create */}
                <div className="lg:col-span-4 space-y-4 sm:space-y-5 order-2 lg:order-1">
                  {STUDENT_PILLARS.slice(0, 2).map((pillar) => {
                    const Icon = pillar.icon;
                    return (
                      <div
                        key={pillar.title}
                        className="relative bg-white rounded-2xl border border-[var(--color-border)] p-5 sm:p-6 pl-6 sm:pl-7 shadow-xs text-left overflow-hidden"
                      >
                        {/* Straight left accent bar of brand-orange-accent-color (excluding curved corners) */}
                        <div
                          aria-hidden="true"
                          className="absolute left-0 top-3.5 bottom-3.5 w-1 sm:w-1.5 bg-[var(--color-brand-accent)] rounded-r-full"
                        />

                        <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] border border-[var(--color-border)] flex items-center justify-center mb-3.5">
                          <Icon className="w-5 h-5 text-[var(--color-text-primary)]" />
                        </div>

                        <h3 className="font-display text-lg font-bold text-[var(--color-text-primary)] mb-1.5">
                          {pillar.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed font-normal">
                          {pillar.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Center Column: African-female-student.png */}
                <div className="lg:col-span-4 flex items-end justify-center order-1 lg:order-2 my-4 lg:my-0 select-none">
                  <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px] flex items-end justify-center">
                    {/* Soft background radial aura */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-tr from-[var(--color-brand-primary)]/15 via-[var(--color-brand-secondary)]/20 to-[var(--color-brand-accent)]/15 blur-2xl pointer-events-none -z-10" />

                    <Image
                      src="/image/African-female-student.png"
                      alt="African female student learning, creating, earning, and growing on TASA"
                      width={1536}
                      height={2752}
                      className="w-full h-auto max-h-[380px] sm:max-h-[440px] lg:max-h-[480px] object-contain object-bottom drop-shadow-[0_20px_35px_rgba(51,65,85,0.18)] select-none pointer-events-none align-bottom"
                      priority
                    />
                  </div>
                </div>

                {/* Right Column: Earn & Grow */}
                <div className="lg:col-span-4 space-y-4 sm:space-y-5 order-3 lg:order-3">
                  {STUDENT_PILLARS.slice(2, 4).map((pillar) => {
                    const Icon = pillar.icon;
                    return (
                      <div
                        key={pillar.title}
                        className="relative bg-white rounded-2xl border border-[var(--color-border)] p-5 sm:p-6 pl-6 sm:pl-7 shadow-xs text-left overflow-hidden"
                      >
                        {/* Straight left accent bar of brand-orange-accent-color (excluding curved corners) */}
                        <div
                          aria-hidden="true"
                          className="absolute left-0 top-3.5 bottom-3.5 w-1 sm:w-1.5 bg-[var(--color-brand-accent)] rounded-r-full"
                        />

                        <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] border border-[var(--color-border)] flex items-center justify-center mb-3.5">
                          <Icon className="w-5 h-5 text-[var(--color-text-primary)]" />
                        </div>

                        <h3 className="font-display text-lg font-bold text-[var(--color-text-primary)] mb-1.5">
                          {pillar.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed font-normal">
                          {pillar.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* POPULAR STUDENT SKILL TRACKS */}
          <section
            id="student-tracks"
            className="py-16 sm:py-20 bg-white border-b border-[var(--color-border)] relative overflow-hidden"
          >
            {/* Ambient background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[36rem] h-64 sm:h-[22rem] bg-gradient-to-tr from-[var(--color-brand-primary)]/15 via-[var(--color-brand-secondary)]/20 to-[var(--color-brand-accent)]/15 blur-3xl pointer-events-none -z-10" />

            <div className="container-responsive">
              <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
                <p className="hiddenu text-xs font-bold text-[var(--color-brand-primary)] uppercase tracking-wider mb-2">
                  Skills In Demand
                </p>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-text-primary)]">
                  What Skills Can You Offer?
                </h2>
                <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mt-3">
                  Creative, digital, entreprenueral, Tech or vocational?
                </p>
              </div>

              {/* Teen on Books Illustration */}
              <div className="relative w-full overflow-hidden bg-transparent p-4 sm:p-8 flex items-center justify-center shadow-xs">
                  <Image
                    src="/image/teen-on-books.png"
                    alt="Balanced on Books, Brimming with Skills"
                    width={1536}
                    height={1024}
                    className="w-full max-w-2xl h-auto object-contain drop-shadow-[0_20px_35px_rgba(51,65,85,0.14)] select-none pointer-events-none"
                    priority
                  />
                </div>
              
            </div>
          </section>

          {/* STUDENT HOW IT WORKS SECTION (MATCHING CREATIVES VALUE PROPOSITION CARDS) */}
          <section
            id="how-it-works"
            className="py-16 sm:py-24 bg-white border-b border-[var(--color-border)]"
          >
            <div className="container-responsive">
              <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-text-primary)] leading-tight">
                  How to Get Started on{" "}
                  <span className="text-[var(--color-brand-primary)]">
                    TASA
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mt-3.5 leading-relaxed">
                  Your journey from learning a skill to finding real
                  opportunities starts with a few simple steps.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {STUDENT_STEPS.map((step) => {
                  return (
                    <div
                      key={step.title}
                      className="p-6 sm:p-7 rounded-2xl bg-[var(--color-brand-dark)] text-white flex flex-col justify-between hover:-translate-y-1 transition-all shadow-sm hover:shadow-md group"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-full bg-white text-[var(--color-brand-dark)] flex items-center justify-center font-bold text-sm mb-5 shadow-xs group-hover:scale-105 transition-transform">
                          {step.number}
                        </div>
                        <h3 className="font-bold text-base sm:text-lg text-white mb-2 leading-snug">
                          {step.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Closing CTA */}
              <div className="mt-12 sm:mt-16 text-center max-w-xl mx-auto">
                <p className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] mb-5">
                  Ready to take your first step? Join TASA and put your talent to
                  work.
                </p>
                <button
                  type="button"
                  onClick={handleCTAClick}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-button-secondary-hover)] text-white font-semibold text-sm sm:text-base transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98]"
                >
                  <span>Join TASA Today</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </section>

          {/* TASA FOR MINORS SECTION */}
          <section
            id="tasa-for-minors"
            className="py-16 sm:py-24 bg-white border-b border-[var(--color-border)] relative z-10"
          >
            {/* Ambient background glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-bg-brand-soft)]/50 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Left pop-out illustration: Joyful teen holding TASA sign extending high above heading on mobile */}
            <div className="absolute -left-1 sm:left-6 lg:left-12 xl:left-20 bottom-0 w-[220px] sm:w-[250px] md:w-[280px] lg:w-[310px] xl:w-[340px] pointer-events-none select-none z-10 mobile-popout-mask transition-all">
              <Image
                src="/image/joyful-teen-holding-tasa-sign.png"
                alt="Joyful teenager holding a TASA sign"
                width={512}
                height={768}
                className="w-full h-auto object-contain object-bottom drop-shadow-[0_20px_35px_rgba(51,65,85,0.18)]"
                priority
              />
            </div>

            <div className="container-responsive relative z-20">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
                  TASA for{" "}
                  <span className="text-[var(--color-brand-primary)]">
                    Minors
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mt-3 sm:mt-4 leading-relaxed max-w-2xl mx-auto font-normal">
                  You don’t have to wait until you’re 18 to start building real
                  skills and earning. TASA provides a safe, parent-supported
                  environment where talented young creators can showcase their
                  abilities, learn professional ethics, and get paid with
                  complete security.
                </p>
              </div>
            </div>
          </section>

          {/* STUDENT FAQS */}
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
                    Clear answers about schedules, payouts, client expectations,
                    and getting started as a student on TASA.
                  </p>
                </div>

                {/* Right Column: Collapsible Questions */}
                <div className="lg:col-span-7 space-y-3.5">
                  {STUDENT_FAQS.map((faq, index) => {
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

                        <div
                          className={`grid transition-all duration-300 ease-in-out ${
                            isOpen
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border)]/50 pt-3.5">
                              {faq.answer}
                            </div>
                          </div>
                        </div>
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
                    Your Future Starts Before Graduation.
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
                    Don&apos;t wait until you graduate to make your mark. Build
                    your student profile, showcase your skills, connect with
                    real opportunities and start earning while building
                    experience. Join a growing community of young African
                    talents shaping their future with TASA.
                  </p>

                  <div className="flex flex-wrap items-center gap-3.5">
                    <button
                      type="button"
                      onClick={handleCTAClick}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] hover:text-[var(--color-brand-dark)] text-white font-semibold text-sm sm:text-base transition-all shadow-md cursor-pointer"
                    >
                      <span>Join the Student Community</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

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
