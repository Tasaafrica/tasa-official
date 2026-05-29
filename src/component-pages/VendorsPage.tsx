"use client";

import Header from "@/app/component/parts/header";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import { Button } from "@/app/component/ui/button";
import {
  Star,
  MapPin,
  BadgeCheck,
  Heart,
  Share2,
  MessageCircle,
  Briefcase,
  Award,
  Clock,
  ChevronRight,
  Zap,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Professional {
  _id: string;
  name: string;
  category?: string;
  bio?: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  profileImage?: string;
  skills?: any[];
  priceFrom?: number;
  priceCurrency?: string;
  isEmailVerified?: boolean;
  email?: string;
  mobile?: string;
  whatsapp?: string;
  country?: string;
  state?: string;
  city?: string;
  isActive?: boolean;
  slug?: string;
}

interface VendorsPageProps {
  professional: Professional;
}

// Reviews are fetched from API (Not implemented yet)

function StarRow({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const s = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`${s} ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"}`}
        />
      ))}
    </div>
  );
}

export default function VendorsPage({ professional }: VendorsPageProps) {
  const {
    name = "Vendor",
    category = "Professional Services",
    bio = "No bio available.",
    state,
    country,
    rating = 0,
    reviewCount = 0,
    profileImage = "/placeholder-avatar.jpg",
    skills = [],
    priceFrom = 0,
    priceCurrency = "₦",
    isEmailVerified = false,
  } = professional;

  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "portfolio" | "reviews">("about");

  const displayLocation = state && country ? `${state}, ${country}` : state || country || "Location not specified";

  const stats = [
    { icon: <Star className="w-4 h-4 text-amber-500" />, label: "Rating", value: rating.toFixed(1) },
    { icon: <ThumbsUp className="w-4 h-4 text-teal-600" />, label: "Reviews", value: `${reviewCount}` },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header />

      {/* ─── Hero Profile Banner ─── */}
      <section className="relative bg-slate-950 overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-8 md:px-10 lg:px-16 pt-28 pb-16">
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-8">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-[3px] bg-gradient-to-tr from-teal-500 to-emerald-300 shadow-2xl">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={profileImage} alt={name} className="w-full h-full object-cover" />
                </div>
              </div>
              {isEmailVerified && (
                <div className="absolute bottom-0 right-2 bg-teal-500 rounded-xl p-1.5 shadow-lg border-2 border-slate-950">
                  <BadgeCheck className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* Name & Meta */}
            <div className="flex-1 min-w-0 flex flex-col items-center md:items-start">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-3">
                {isEmailVerified && (
                  <span className="hidden text-[11px] font-bold uppercase tracking-widest text-teal-400 bg-teal-400/10 border border-teal-400/20 px-3 py-1 rounded-full">
                    Verified Expert
                  </span>
                )}
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-800 border border-slate-700 px-3 py-1 rounded-full">
                  {category}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 leading-tight">
                {name}
              </h1>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-5">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-400 text-sm">{displayLocation}</span>
                <span className="text-slate-700">·</span>
                <StarRow rating={rating} size="sm" />
                <span className="text-amber-400 font-bold text-sm">{rating.toFixed(1)}</span>
                <span className="text-slate-500 text-sm">({reviewCount} reviews)</span>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold text-slate-300 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl"
                  >
                    {typeof skill === "object" && skill !== null ? skill.name : skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center md:justify-start w-full md:w-auto gap-3 mt-4 md:mt-2">
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsSaved(!isSaved)}
                className={`p-3 rounded-2xl border transition-all ${isSaved ? "bg-rose-500 border-rose-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"}`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? "fill-white" : ""}`} />
              </motion.button>
              <button className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-500 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            {stats.map((s) => (
              <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-sm">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                  {s.icon}
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest">{s.label}</p>
                  <p className="text-lg font-extrabold text-white leading-tight">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Main Content + Sticky Sidebar ─── */}
      <section className="py-12 pb-32 lg:pb-12">
        <div className="container mx-auto px-4 sm:px-8 md:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* ── LEFT: Content Tabs ── */}
            <div className="flex-1 min-w-0">

              {/* Tab Navigation */}
              <div className="flex gap-1 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm mb-8 w-full md:w-fit overflow-x-auto hide-scrollbar">
                {(["about", "portfolio", "reviews"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                      activeTab === tab
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* ── ABOUT TAB ── */}
                {activeTab === "about" && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                    className="w-full space-y-8"
                  >
                    {/* Bio */}
                    <div className="w-full bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
                      <h2 className="text-xl font-bold text-slate-900 mb-4">About Me</h2>
                      <p className="text-slate-600 leading-relaxed text-[15px]">{bio}</p>
                    </div>

                    {/* Highlights - Removed dummy data */}

                    {/* Skills */}
                    <div className="w-full bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
                      <h2 className="text-xl font-bold text-slate-900 mb-5">Skills & Expertise</h2>
                      <div className="flex flex-wrap gap-2.5">
                        {skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-4 py-2 bg-teal-50 text-teal-700 border border-teal-100 rounded-xl text-sm font-semibold"
                          >
                            {typeof skill === "object" && skill !== null ? skill.name : skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── PORTFOLIO TAB ── */}
                {activeTab === "portfolio" && (
                  <motion.div
                    key="portfolio"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                    className="w-full space-y-8"
                  >
                    <div className="w-full bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
                      <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Work</h2>
                      <div className="py-10 flex flex-col items-center justify-center text-center">
                        <p className="text-slate-500">Portfolio coming soon.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── REVIEWS TAB ── */}
                {activeTab === "reviews" && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                    className="w-full space-y-8"
                  >
                    {/* Overall Rating */}
                    <div className="w-full bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-center gap-8 text-center sm:text-left">
                      <div className="text-center">
                        <p className="text-7xl font-extrabold text-slate-900">{rating.toFixed(1)}</p>
                        <StarRow rating={rating} size="lg" />
                        <p className="text-sm text-slate-500 mt-1">{reviewCount} reviews</p>
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const pct = star === 5 ? 72 : star === 4 ? 20 : star === 3 ? 6 : 2;
                          return (
                            <div key={star} className="flex items-center gap-3">
                              <span className="text-xs font-bold text-slate-500 w-4">{star}</span>
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs text-slate-400 w-8">{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Individual Reviews */}
                    <div className="w-full bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm py-10 flex flex-col items-center justify-center text-center">
                      <p className="text-slate-500">No reviews yet.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── RIGHT: Sticky Hire Card ── */}
            <aside className="w-full lg:w-[340px] lg:sticky lg:top-24 z-20">
              <div className="hidden lg:block bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">

                {/* CTAs */}
                <div className="p-6 space-y-3">
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Link href="#contact">
                      <Button className="w-full bg-teal-600 hover:bg-teal-500 text-white rounded-2xl py-6 text-base font-bold shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2">
                        Book {name.split(" ")[0]}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </motion.div>
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl py-6 text-base font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Send Message
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="px-6 pb-6 hidden">
                  <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                    <BadgeCheck className="w-8 h-8 text-teal-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">TASA Guarantee</p>
                      <p className="text-[11px] text-slate-500 leading-snug">Your payment is protected until you approve the work.</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </section>

      {/* ─── Mobile Fixed Bottom CTA ─── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-50 flex gap-3 pb-safe">
        <Link href="#contact" className="flex-1">
          <Button className="w-full bg-teal-600 hover:bg-teal-500 text-white rounded-2xl py-6 text-sm font-bold shadow-lg shadow-teal-600/20 flex items-center justify-center gap-1.5">
            Book {name.split(" ")[0]}
          </Button>
        </Link>
        <Button
          variant="outline"
          className="flex-1 rounded-2xl py-6 text-sm font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
        >
          <MessageCircle className="w-4 h-4" />
          Message
        </Button>
      </div>

      <FooterLinksSection />
    </div>
  );
}
