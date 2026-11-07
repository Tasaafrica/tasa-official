"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code,
  DollarSign,
  GraduationCap,
  Laptop,
  Palette,
  PenTool,
  ShieldCheck,
  TrendingUp,
  Video,
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

const STUDENT_SKILL_TRACKS = [
  {
    icon: Palette,
    title: "Graphics & Social Media Design",
    description:
      "Design flyers, social media carousels, logos, and promotional graphics for local businesses, campus groups, and creators.",
    tags: ["Canva", "Photoshop", "Illustrator", "Figma"],
    link: "/categories/graphics-design",
  },
  {
    icon: Code,
    title: "Web Development & Tech",
    description:
      "Build landing pages, WordPress websites, fix frontend bugs, and write scripts for startups and small businesses.",
    tags: ["HTML/CSS", "React", "WordPress", "Python"],
    link: "/categories/programming-tech",
  },
  {
    icon: PenTool,
    title: "Writing & Content Creation",
    description:
      "Write SEO blog posts, copywriting for brands, proofread student dissertations, and draft engaging newsletters.",
    tags: ["Copywriting", "Proofreading", "SEO Articles", "Ghostwriting"],
    link: "/categories/writing-translation",
  },
  {
    icon: Video,
    title: "Video Editing & Short-form Content",
    description:
      "Edit viral TikToks, Instagram Reels, YouTube shorts, and campus event recap reels using CapCut, Premiere, or DaVinci.",
    tags: ["CapCut", "Reels/TikTok", "Premiere Pro", "Subtitles"],
    link: "/categories/video-animation",
  },
  {
    icon: Laptop,
    title: "Virtual Assistance & Data Entry",
    description:
      "Manage client emails, organize spreadsheets, conduct web research, and handle customer service support on weekends.",
    tags: ["Google Sheets", "Email Management", "Data Cleaning", "Research"],
    link: "/categories/business-consulting",
  },
  {
    icon: BookOpen,
    title: "Tutoring & Academic Guidance",
    description:
      "Teach high school subjects, tutor junior peers, conduct language lessons, and assist with coding bootcamps.",
    tags: ["Math & Sciences", "Languages", "Exam Prep", "Mentorship"],
    link: "/categories/lifestyle-wellness",
  },
];

const STUDENT_BENEFITS = [
  {
    icon: Clock,
    title: "100% Flexible Timetable",
    description:
      "You set your available hours and delivery deadlines. Pause your gigs during exams and ramp up during holidays.",
  },
  {
    icon: DollarSign,
    title: "Real Income Straight to You",
    description:
      "Earn extra pocket money, pay your tuition fees, and buy your study gadgets without relying entirely on allowances.",
  },
  {
    icon: TrendingUp,
    title: "Graduate with a Proven Portfolio",
    description:
      "Beat the 'experience required' trap. Graduate with verified client reviews, real project links, and proven credibility.",
  },
  {
    icon: ShieldCheck,
    title: "Guaranteed Milestone Escrow",
    description:
      "Zero client scamming. Clients fund projects into escrow before you begin work, ensuring you always get paid upon delivery.",
  },
];

const STUDENT_FAQS = [
  {
    q: "Can I freelance on TASA while taking a full-time university course?",
    a: "Absolutely! Many of our most successful student creators work 5-10 hours a week on weekends or evenings. You set your own turnaround times and project limits, so your coursework always comes first.",
  },
  {
    q: "Do I need years of experience to become a student vendor?",
    a: "No prior commercial experience is required. If you have a skill — whether you know Canva, write clean articles, edit TikToks, or build websites — you can upload samples and begin taking starter projects.",
  },
  {
    q: "How do I receive payments for completed gigs?",
    a: "Once a client reviews and approves your work milestone, funds are released directly to your verified payout method, including direct local bank accounts and supported mobile money wallets across Africa.",
  },
  {
    q: "Is there any sign-up or monthly fee for students?",
    a: "No. TASA is completely free to join. Creating your vendor profile, listing your gigs, and setting your rates costs nothing.",
  },
];

export default function StudentsPage() {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { openSignup } = useAuthModal();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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
          <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 border-b border-[var(--color-border)]/70">
            {/* Background Ambient Glows */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-[var(--color-bg-brand-soft)]/40 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="container-responsive">
              <motion.div
                className="grid items-center gap-10 lg:gap-14 lg:grid-cols-12"
                variants={containerVariants}
                initial={prefersReducedMotion ? false : "hidden"}
                animate="visible"
              >
                {/* Hero Left Column */}
                <motion.div
                  className="lg:col-span-7 flex flex-col justify-center text-left"
                  variants={itemVariants}
                >
                  <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full bg-[var(--color-bg-brand-soft)] border border-[var(--color-brand-secondary)]/40 w-fit">
                    <GraduationCap className="w-4 h-4 text-[var(--color-brand-primary)]" />
                    <span className="text-xs font-bold text-[var(--color-brand-primary)] tracking-wide uppercase">
                      Campus Talent & Student Creators
                    </span>
                  </div>

                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)] leading-[1.14] mb-5">
                    Are you a{" "}
                    <span className="text-[var(--color-brand-primary)]">
                      Student
                    </span>
                    ? Got a skill?
                    <br />
                    <span>Turn your talent into real income.</span>
                  </h1>

                  <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed mb-8 max-w-xl font-normal">
                    Don’t wait until graduation. Join thousands of African
                    students earning flexibly, building verified portfolios, and
                    collaborating with real businesses across the continent.
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
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
                  <div className="flex flex-wrap items-center gap-6 pt-8 mt-8 border-t border-[var(--color-border)]">
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

                {/* Hero Right Column: Student Image */}
                <motion.div
                  className="lg:col-span-5 flex items-center justify-center relative"
                  variants={itemVariants}
                >
                  <div className="relative w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[460px] h-[340px] sm:h-[400px] lg:h-[460px] flex items-end justify-center">
                    <Image
                      src="/image/nigerian-student.png"
                      alt="African student smiling with books and backpack on TASA"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(51,65,85,0.18)] select-none pointer-events-none"
                      priority
                    />

                    {/* Floating verified badge */}
                    <div className="absolute top-6 right-2 sm:right-4 z-20 bg-white/95 backdrop-blur-md border border-[var(--color-border)] p-3 rounded-2xl shadow-lg flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-[var(--color-text-primary)]">
                          Verified Student Talent
                        </p>
                        <p className="text-[10px] text-[var(--color-text-secondary)]">
                          Active campus earner
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* STUDENT BENEFITS SECTION */}
          <section className="py-16 sm:py-20 bg-[var(--color-bg-subtle)] border-b border-[var(--color-border)]">
            <div className="container-responsive">
              <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                <p className="text-xs font-bold text-[var(--color-brand-primary)] uppercase tracking-wider mb-2">
                  Why Start Now?
                </p>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-text-primary)]">
                  The Best Way to Earn & Learn
                </h2>
                <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mt-3">
                  TASA gives you the tools, security, and client network to
                  build a professional reputation before you even get your
                  diploma.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {STUDENT_BENEFITS.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={benefit.title}
                      className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-sm hover:shadow-md hover:border-[var(--color-brand-primary)] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-brand-soft)] text-[var(--color-brand-primary)] flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-text-primary)] mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* POPULAR STUDENT SKILL TRACKS */}
          <section
            id="student-tracks"
            className="py-16 sm:py-20 bg-white border-b border-[var(--color-border)]"
          >
            <div className="container-responsive">
              <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                <p className="text-xs font-bold text-[var(--color-brand-primary)] uppercase tracking-wider mb-2">
                  Skills In Demand
                </p>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-text-primary)]">
                  What Skills Can You Offer?
                </h2>
                <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mt-3">
                  Clients across Africa are actively hiring students for these
                  high-demand services.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {STUDENT_SKILL_TRACKS.map((track) => {
                  const Icon = track.icon;
                  return (
                    <div
                      key={track.title}
                      className="bg-[var(--color-bg-subtle)] rounded-2xl border border-[var(--color-border)] p-6 shadow-xs hover:shadow-md hover:bg-white hover:border-[var(--color-brand-primary)] transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-white border border-[var(--color-border)] text-[var(--color-brand-primary)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-bg-brand-soft)] transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>

                        <h3 className="font-display text-base sm:text-lg font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-brand-primary)] transition-colors">
                          {track.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                          {track.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {track.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md bg-white text-[11px] font-medium text-[var(--color-text-secondary)] border border-[var(--color-border)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link
                        href={track.link}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-brand-primary)] hover:text-[var(--color-button-secondary-hover)]"
                      >
                        <span>See sample gigs</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* STUDENT HOW IT WORKS TIMELINE */}
          <section className="py-16 sm:py-20 bg-[var(--color-bg-subtle)] border-b border-[var(--color-border)]">
            <div className="container-responsive">
              <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
                <span className="px-3 py-1 rounded-full bg-[var(--color-bg-brand-soft)] text-[var(--color-brand-primary)] text-xs font-bold uppercase tracking-wider inline-block mb-3">
                  Step-by-Step
                </span>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-text-primary)] mb-4">
                  How to Start Earning on TASA
                </h2>
                <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
                  Go from student with a hobby to paid professional in 4 easy
                  steps.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 rounded-2xl bg-white border border-[var(--color-border)] text-left shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-brand-dark)] text-white font-bold flex items-center justify-center text-xs mb-4">
                    1
                  </div>
                  <h3 className="font-bold text-base text-[var(--color-text-primary)] mb-2">
                    Sign Up as a Vendor
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Create your free profile. Mention your school, your skills,
                    and upload 2-3 samples of your best past work.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-[var(--color-border)] text-left shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-brand-primary)] text-white font-bold flex items-center justify-center text-xs mb-4">
                    2
                  </div>
                  <h3 className="font-bold text-base text-[var(--color-text-primary)] mb-2">
                    Publish Your First Gig
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Set up your service listing. Pick a clear deliverable, a
                    reasonable delivery time, and beginner-friendly pricing.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-[var(--color-border)] text-left shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-brand-secondary)] text-white font-bold flex items-center justify-center text-xs mb-4">
                    3
                  </div>
                  <h3 className="font-bold text-base text-[var(--color-text-primary)] mb-2">
                    Deliver with Care
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Communicate politely with your client, deliver on time, and
                    ask for a 5-star review to boost your ranking.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-[var(--color-border)] text-left shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs mb-4">
                    4
                  </div>
                  <h3 className="font-bold text-base text-[var(--color-text-primary)] mb-2">
                    Withdraw Earnings
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Funds are released from escrow upon client approval directly
                    to your local bank or mobile wallet.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* STUDENT FAQS */}
          <section className="py-16 sm:py-20 bg-white">
            <div className="container-responsive">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12 sm:mb-16">
                  <p className="text-xs font-bold text-[var(--color-brand-primary)] uppercase tracking-wider mb-2">
                    Got Questions?
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--color-text-primary)]">
                    Frequently Asked by Students
                  </h2>
                </div>

                <div className="space-y-4">
                  {STUDENT_FAQS.map((faq, idx) => (
                    <div
                      key={faq.q}
                      className="bg-[var(--color-bg-subtle)] rounded-2xl border border-[var(--color-border)] overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenFaqIndex(openFaqIndex === idx ? null : idx)
                        }
                        className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                            openFaqIndex === idx
                              ? "rotate-180 text-[var(--color-brand-primary)]"
                              : ""
                          }`}
                        />
                      </button>

                      {openFaqIndex === idx && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border)]">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
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
                  <span className="text-xs font-bold text-[var(--color-brand-secondary)] uppercase tracking-wider mb-3 block">
                    Campus Creators Unite
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
                    Your degree + real work experience = Unstoppable.
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
                    Start setting up your student profile right now. Join the
                    vibrant community of students building financial
                    independence across Africa.
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
                      <span>Explore Active Projects</span>
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
