"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Sliders,
  Star,
  UserPlus,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import Header from "@/app/component/parts/header";

// Navigation tabs
type Role = "client" | "vendor";

interface FAQItem {
  question: string;
  answer: string;
}

export default function HowTasaWorks() {
  const [activeRole, setActiveRole] = useState<Role>("client");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const clientSteps = [
    {
      id: "search",
      num: "01",
      title: "Find Top African Talent",
      description:
        "Search services, browse curated categories, and filter by skills, reviews, and rates to find the perfect vendor for your project.",
      illustration: (
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 shadow-inner">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm mb-3">
            <Search className="h-4 w-4 text-teal-600 flex-shrink-0" />
            <span className="text-xs text-slate-800 font-medium">
              Software Developer, Lagos
            </span>
            <span className="ml-auto px-2 py-0.5 bg-teal-50 text-[10px] text-teal-700 font-semibold rounded-full border border-teal-100 flex items-center gap-1">
              <Sliders className="w-2.5 h-2.5" /> Filter
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-700 text-xs">
                KO
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-900">Kofi O.</p>
                <div className="flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  <span className="text-[10px] text-slate-500 font-medium">
                    4.9 (42 reviews)
                  </span>
                </div>
              </div>
              <span className="ml-auto text-xs font-bold text-slate-900">
                ₦15,000/hr
              </span>
            </div>
            <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm opacity-60">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                AM
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-900">Amina M.</p>
                <div className="flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  <span className="text-[10px] text-slate-500 font-medium">
                    5.0 (18 reviews)
                  </span>
                </div>
              </div>
              <span className="ml-auto text-xs font-bold text-slate-900">
                ₦20,000/hr
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "profiles",
      num: "02",
      title: "Review Portfolios & Info",
      description:
        "Click on vendor profiles to inspect previous work, live portfolio links, bios, verified skills, and client ratings.",
      illustration: (
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 shadow-inner flex flex-col justify-between h-[156px]">
          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm space-y-2 flex-grow">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Portfolios & Links
            </p>
            <div className="flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg text-[9px] text-teal-700 font-bold border border-slate-150">
                <ExternalLink className="w-3 h-3" /> figma.com/design-system
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg text-[9px] text-teal-700 font-bold border border-slate-150">
                <ExternalLink className="w-3 h-3" /> github.com/kofi-dev
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      num: "03",
      title: "Contact Directly",
      description:
        "Reach out to the vendor directly using their preferred contact channels (email, WhatsApp, phone, or website) listed on their profile.",
      illustration: (
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 shadow-inner">
          <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2 text-[10px] text-slate-700">
              <Mail className="w-3.5 h-3.5 text-teal-700" />
              <span>kofi.o@tasa.africa</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-700">
              <Phone className="w-3.5 h-3.5 text-teal-700" />
              <span>+234 803 123 4567</span>
            </div>
            <span className="block text-center py-1.5 bg-teal-700 text-white rounded-lg text-[9px] font-bold">
              Reach Out Directly
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "collaborate",
      num: "04",
      title: "Collaborate & Complete",
      description:
        "Agree on scope, budgets, and project phases externally. Collaborate directly on your own terms to successfully complete the project.",
      illustration: (
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 shadow-inner">
          <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] font-bold text-slate-900">
                Handoff completed
              </span>
            </div>
            <div className="space-y-1.5 text-[9px] text-slate-650 leading-relaxed">
              <p className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                Scope finalized
              </p>
              <p className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                Work delivered directly
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const vendorSteps = [
    {
      id: "profile",
      num: "01",
      title: "Publish Service & Bio",
      description:
        "Create a standout profile detailing your skills, portfolio, and define structured service listings with custom pricing.",
      illustration: (
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 shadow-inner">
          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs">
                TK
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-900">Tunde K.</p>
                <p className="text-[9px] text-teal-600 font-medium">
                  UI/UX Designer
                </p>
              </div>
              <span className="ml-auto px-2 py-0.5 bg-emerald-50 text-[9px] text-emerald-700 font-bold rounded-full">
                Active
              </span>
            </div>
            <div className="space-y-1.5 mt-3 pt-2.5 border-t border-slate-100">
              <p className="text-[10px] text-slate-500 font-medium">
                Profile Strength
              </p>
              <div className="flex items-center gap-2">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-600 h-full w-[95%]" />
                </div>
                <span className="text-[9px] font-bold text-slate-800">95%</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "discovered",
      num: "02",
      title: "Get Discovered",
      description:
        "Appear in client searches, get listed in curated skill categories, and display your portfolios and contact links to potential hires.",
      illustration: (
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 shadow-inner">
          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-center space-y-2">
            <p className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">
              Search Performance
            </p>
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-[9px] text-slate-650 font-bold">
              <span>Search Impressions</span>
              <span className="text-teal-700">+148</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-[9px] text-slate-650 font-bold">
              <span>Profile Visits</span>
              <span className="text-teal-700">32</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "inquiries",
      num: "03",
      title: "Receive Direct Inquiries",
      description:
        "Receive direct WhatsApp messages, emails, or telephone calls from clients interested in your talent and posted services.",
      illustration: (
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 shadow-inner">
          <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm text-center">
            <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-2 border border-teal-100">
              <MessageSquare className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-bold text-slate-900">
              Direct Message Received
            </p>
            <p className="text-[9px] text-slate-500 mt-1">
              "Hey, let's discuss a React app build..."
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "reputation",
      num: "04",
      title: "Deliver & Build Reviews",
      description:
        "Deliver work directly to clients, build your review profile on TASA to gain more credibility, and attract more organic leads.",
      illustration: (
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 shadow-inner">
          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-center space-y-2">
            <p className="text-[10px] text-slate-500 font-medium">
              Vendor Reputation
            </p>
            <div className="flex items-center justify-center gap-0.5">
              {[1, 2, 3, 4, 5].map((starNum) => (
                <Star
                  key={starNum}
                  className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="text-[9px] text-slate-650 font-bold bg-emerald-50 text-emerald-800 py-1.5 rounded-lg border border-emerald-100">
              4.9 Stars (5 Reviews)
            </p>
          </div>
        </div>
      ),
    },
  ];

  const activeSteps = activeRole === "client" ? clientSteps : vendorSteps;

  const faqs: FAQItem[] = [
    {
      question: "How do clients and vendors work together?",
      answer:
        "TASA is a connection platform. Clients search for services or browse vendor profiles. Once they find a vendor they would like to work with, they can contact them directly using the contact details (such as email, WhatsApp, or phone number) listed on their profile page.",
    },
    {
      question: "Are there any service fees or commissions?",
      answer:
        "No. TASA is currently completely free to use. There are no client hiring fees, contract fees, or vendor commissions. Clients pay vendors directly according to their agreed-upon external terms and payment schedules.",
    },
    {
      question: "How do I start selling services as a vendor?",
      answer:
        "To become a vendor, click the 'Become a Vendor' button on the homepage, fill out your profile details (including skills, bio, portfolio links, and preferred contact info), and list your services. Once verified, your profile will appear in search results.",
    },
    {
      question: "How are payments and project disputes managed?",
      answer:
        "Since TASA is a connection platform, all contracts, milestone tracking, payments, and agreements are managed directly between the client and the vendor externally. We recommend defining clear milestones and payment schedules prior to starting any project.",
    },
  ];

  return (
    <div className="min-h-screen bg-white vendor-font-body text-slate-800">
      <Header variant="white" />

      {/* Hero Header */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50 border-b border-slate-100">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-teal-50/50 rounded-bl-[200px] -z-10" />

        {/* Subtle Background Art */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 0.08, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute top-12 lg:right-32 right-12 w-[550px] h-[550px] pointer-events-none z-0"
        >
          <Image
            src="/africa-sketch.svg"
            alt="African continent sketch map"
            width={550}
            height={550}
            className="w-full h-full object-contain"
          />
        </motion.div>

        <div className="container-responsive relative z-10 text-center lg:text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full uppercase tracking-wider border border-teal-100/50">
              <Zap className="w-3.5 h-3.5 fill-teal-100" /> Platform Walkthrough
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
              How TASA <span className="text-teal-600">Works</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl">
              TASA connects professional independent talent across Africa with
              projects. We make sourcing, collaboration, and milestone
              management easy and secure.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                type="button"
                onClick={() => {
                  setActiveRole("client");
                  document
                    .getElementById("workflow-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center px-8 py-4 bg-teal-700 hover:bg-teal-800 text-white rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-teal-700/15"
              >
                Hire Talent Guide
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveRole("vendor");
                  document
                    .getElementById("workflow-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-slate-100 text-slate-800 rounded-2xl font-bold transition-all border border-slate-200 active:scale-95"
              >
                Become Vendor Guide
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workflow Section */}
      <section
        id="workflow-section"
        className="py-20 lg:py-28 scroll-mt-10 bg-white"
      >
        <div className="container-responsive">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Ecosystem Roles
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Select your path on TASA
            </h2>
            <p className="text-slate-600 leading-relaxed mb-10">
              Choose to hire Africa's top independent professionals, or setup
              your services and build a borderless career.
            </p>

            {/* Tab Switcher */}
            <div className="relative inline-flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50">
              <button
                type="button"
                onClick={() => setActiveRole("client")}
                className={`relative z-10 px-8 py-3 rounded-xl text-sm font-bold transition-colors ${
                  activeRole === "client"
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-850"
                }`}
              >
                {activeRole === "client" && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-teal-700 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                I want to Hire (Client)
              </button>

              <button
                type="button"
                onClick={() => setActiveRole("vendor")}
                className={`relative z-10 px-8 py-3 rounded-xl text-sm font-bold transition-colors ${
                  activeRole === "vendor"
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-850"
                }`}
              >
                {activeRole === "vendor" && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-teal-700 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                I want to Work (Vendor)
              </button>
            </div>
          </div>

          {/* Steps Timeline Grid */}
          <div className="relative">
            {/* SVG Connector Path for Large Screens */}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 -translate-y-1/2 hidden lg:block z-0 pointer-events-none">
              <svg
                className="w-full h-10 overflow-visible"
                fill="none"
                aria-hidden="true"
              >
                <title>Timeline Connector Path</title>
                <path
                  d="M 20,5 Q 120,35 220,5 T 420,5 T 620,5 T 820,5 T 1020,5"
                  stroke="#E2E8F0"
                  strokeWidth="3"
                  strokeDasharray="8 8"
                />
              </svg>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
              <AnimatePresence mode="wait">
                {activeSteps.map((step, idx) => (
                  <motion.div
                    key={`${activeRole}-${step.id}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex flex-col bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-xl hover:border-teal-500/10 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-3xl font-extrabold text-teal-700/20 group-hover:text-teal-700/40 transition-colors">
                        {step.num}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-700 transition-all">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="mb-6 flex-grow">{step.illustration}</div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Infographic Diagram Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="container-responsive">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Connection Flow
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Simple Connection Lifecycle
              </h2>
              <p className="text-slate-650 leading-relaxed mb-8">
                TASA makes finding and building connections straightforward.
                Clients browse listings and verified profiles, select the talent
                that fits their needs, and contact them directly to begin
                collaborating.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Discover & Review
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Explore listed services, check portfolio links, read
                      review summaries, and select preferred vendors.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Direct Contact
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Reach out directly via details like WhatsApp, email, or
                      telephone provided on the vendor's profile.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Direct Collaboration
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Agree on project delivery, schedule payments externally,
                      and work directly on your own terms.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lifecycle Flow Visual Card */}
            <div className="w-full lg:w-1/2">
              <div className="bg-white rounded-[2.5rem] border border-slate-200/50 p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-[30px]" />
                <h3 className="font-bold text-slate-950 mb-6 text-center text-lg">
                  Talent Connection Flow
                </h3>

                <div className="space-y-6 relative">
                  {/* Vertical dotted timeline line */}
                  <div className="absolute left-[27px] top-6 bottom-6 w-0.5 border-l-2 border-dashed border-slate-200 z-0 pointer-events-none" />

                  {/* Loop Step 1 */}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center border border-teal-100 flex-shrink-0">
                      <Search className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">
                        Step 1
                      </p>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Find Services
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Clients discover talent listings
                      </p>
                    </div>
                    <span className="ml-auto text-[10px] bg-teal-50 text-teal-700 border border-teal-100 font-bold px-2 py-0.5 rounded-full">
                      Search
                    </span>
                  </div>

                  {/* Loop Step 2 */}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center border border-slate-100 flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Step 2
                      </p>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Direct Outreach
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Connect directly via listed details
                      </p>
                    </div>
                    <span className="ml-auto text-[10px] bg-slate-50 text-slate-650 border border-slate-200 font-bold px-2 py-0.5 rounded-full">
                      Contact
                    </span>
                  </div>

                  {/* Loop Step 3 */}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center border border-emerald-100 flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                        Step 3
                      </p>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Direct Agreement
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Collaborate and complete project
                      </p>
                    </div>
                    <span className="ml-auto text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2 py-0.5 rounded-full">
                      Hire
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars Section */}
      <section className="hidden py-20 lg:py-28 bg-white">
        <div className="container-responsive">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Guiding Principles
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Why TASA is built differently
            </h2>
            <p className="text-slate-600 mt-4 leading-relaxed">
              We focus on removing platform middlemen, encouraging direct
              collaboration and verified professional standards.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:bg-teal-50/20 hover:border-teal-500/10 transition-all group">
              <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center border border-teal-100 mb-6 group-hover:bg-teal-700 group-hover:text-white transition-colors">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">
                Direct Connections
              </h3>
              <p className="text-xs text-slate-550 leading-relaxed">
                Connect directly with verified vendors across Africa without
                middleman friction, service markups.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:bg-teal-50/20 hover:border-teal-500/10 transition-all group">
              <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center border border-teal-100 mb-6 group-hover:bg-teal-700 group-hover:text-white transition-colors">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">
                Verified Portfolios
              </h3>
              <p className="text-xs text-slate-550 leading-relaxed">
                Browse curated portfolios, GitHub repositories, Figma projects,
                and client feedback right on vendor profile cards.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:bg-teal-50/20 hover:border-teal-500/10 transition-all group">
              <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center border border-teal-100 mb-6 group-hover:bg-teal-700 group-hover:text-white transition-colors">
                <UserPlus className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">
                Vetted Professionalism
              </h3>
              <p className="text-xs text-slate-550 leading-relaxed">
                Our onboarding team filters profiles to make sure TASA hosts
                skilled and reliable independent talent capable of delivering
                top quality work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="container-responsive">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Frequently Asked
              </p>
              <h2 className="text-3xl font-bold text-slate-900">
                Got Questions? We have Answers.
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={faq.question}
                  className="bg-white rounded-2xl border border-slate-200/50 overflow-hidden transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 text-left font-bold text-slate-900 hover:text-teal-700 transition-colors text-sm"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-350 ${
                        openFaqIndex === index
                          ? "transform rotate-180 text-teal-700"
                          : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {openFaqIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pt-1 text-slate-650 text-xs leading-relaxed border-t border-slate-50">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-white">
        <div className="container-responsive">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-16 bg-[#1e293b] rounded-[3rem] text-white relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="max-w-2xl text-center lg:text-left">
                <h3 className="text-3xl md:text-4xl font-bold mb-4 font-climate-crisis leading-normal">
                  Ready to experience TASA?
                </h3>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                  Join our growing network of businesses and creators today.
                  Sign up for a free client account or list your services as a
                  professional.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <a
                  href="/become-a-vendor"
                  className="inline-flex items-center justify-center px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl font-bold transition-all text-xs active:scale-95 shadow-lg shadow-teal-500/20 text-center"
                >
                  Become a Vendor
                </a>
                <a
                  href="/skills"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all text-xs active:scale-95 backdrop-blur-sm border border-white/10 text-center"
                >
                  Explore Talent
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterLinksSection />
    </div>
  );
}
