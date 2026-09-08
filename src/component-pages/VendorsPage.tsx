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
  ExternalLink,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VendorProject } from "@/lib/vendor";
import { useSession } from "next-auth/react";
import { bookmarkApi } from "@/lib/bookmarks";
import { toast } from "sonner";

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

  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoadingBookmark, setIsLoadingBookmark] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "portfolio" | "reviews">("about");
  const [projects, setProjects] = useState<VendorProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectsError, setProjectsError] = useState("");
  const [selectedProject, setSelectedProject] = useState<VendorProject | null>(null);

  useEffect(() => {
    if (professional._id) {
      const fetchProjects = async () => {
        setLoadingProjects(true);
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;
          const response = await fetch(`${baseUrl}/api/vendor-projects/${professional._id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch projects");
          }
          const result = await response.json();
          // Backend returns { success, data: { projects: [...] } }
          const items = Array.isArray(result)
            ? result
            : result.data?.projects && Array.isArray(result.data.projects)
              ? result.data.projects
              : result.data && Array.isArray(result.data)
                ? result.data
                : [];
          setProjects(items);
        } catch (error: any) {
          setProjectsError(error.message);
        } finally {
          setLoadingProjects(false);
        }
      };
      fetchProjects();
    }
  }, [professional._id]);

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      if (professional._id && session?.authToken) {
        const result = await bookmarkApi.checkStatus(professional._id, session.authToken as string);
        if (result.success) {
          setIsSaved(result.isBookmarked);
        }
      }
    };
    fetchBookmarkStatus();
  }, [professional._id, session]);

  const handleBookmarkToggle = async () => {
    if (!session?.authToken) {
      toast.error("Please sign in to bookmark vendors");
      return;
    }
    if (!professional._id || isLoadingBookmark) {
      if (!professional._id) setIsSaved(!isSaved);
      return;
    }
    
    setIsLoadingBookmark(true);
    const token = session.authToken as string;
    
    if (isSaved) {
      const res = await bookmarkApi.removeBookmark(professional._id, token);
      if (res.success) {
        setIsSaved(false);
        toast.success(res.message || "Removed from bookmarks");
      } else {
        toast.error(res.error || "Failed to remove bookmark");
      }
    } else {
      const res = await bookmarkApi.addBookmark(professional._id, token);
      if (res.success) {
        setIsSaved(true);
        toast.success(res.message || "Added to bookmarks");
      } else {
        toast.error(res.error || "Failed to add bookmark");
      }
    }
    setIsLoadingBookmark(false);
  };

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
                onClick={handleBookmarkToggle}
                disabled={isLoadingBookmark}
                className={`p-3 rounded-2xl border transition-all ${isSaved ? "bg-rose-500 border-rose-500 text-white" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"} ${isLoadingBookmark ? "opacity-70 cursor-wait" : ""}`}
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
                      {loadingProjects ? (
                        <div className="py-10 flex flex-col items-center justify-center text-center">
                          <p className="text-slate-500">Loading projects...</p>
                        </div>
                      ) : projectsError ? (
                        <div className="py-10 flex flex-col items-center justify-center text-center">
                          <p className="text-red-500">{projectsError}</p>
                        </div>
                      ) : projects.length === 0 ? (
                        <div className="py-10 flex flex-col items-center justify-center text-center">
                          <p className="text-slate-500">No projects added yet.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                          {projects.map((project, index) => (
                            <button
                              key={project.id || `project-${index}`}
                              onClick={() => setSelectedProject(project)}
                              className="group text-left flex flex-col bg-white rounded-[24px] overflow-hidden border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1.5 transition-all duration-500 w-full"
                            >
                              <div className="aspect-square w-full relative overflow-hidden bg-slate-50">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={project.thumbnail}
                                  alt={project.title}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 z-20 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                  <div className="bg-white/90 backdrop-blur-md p-2.5 rounded-2xl shadow-lg border border-white/20">
                                    <ExternalLink className="w-4 h-4 text-slate-800" />
                                  </div>
                                </div>
                              </div>
                              <div className="p-6 flex flex-col flex-grow justify-between w-full">
                                <div>
                                  <h4 
                                    className="font-extrabold text-slate-900 text-[15px] leading-snug line-clamp-2"
                                    title={project.title}
                                  >
                                    {project.title}
                                  </h4>
                                  {project.description && (
                                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 font-normal leading-relaxed">
                                      {project.description}
                                    </p>
                                  )}
                                </div>
                                <div className="mt-4 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                  <span className="text-[11px] font-bold text-teal-600 tracking-wider uppercase">View Case Study</span>
                                  <ChevronRight className="w-3.5 h-3.5 text-teal-600 transition-transform duration-300 group-hover:translate-x-1" />
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
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

      {/* ─── Case Study Immersive Modal ─── */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cover Banner */}
              <div className="relative h-60 sm:h-72 w-full bg-slate-950 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent z-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedProject.thumbnail}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover opacity-60 filter blur-[2px]"
                />
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Banner Content */}
                <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400 bg-teal-400/10 px-3 py-1 rounded-full border border-teal-400/25">
                      Case Study
                    </span>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mt-3">
                      {selectedProject.title}
                    </h3>
                  </div>

                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-600/20 flex-shrink-0 cursor-pointer self-start sm:self-auto"
                  >
                    Visit Live Site <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
                {/* Check if case study details exist */}
                {selectedProject.description || selectedProject.problem ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* Left Column (2/3 width) - Case Study details */}
                    <div className="lg:col-span-2 space-y-6 text-left">
                      
                      {/* Overview */}
                      {selectedProject.description && (
                        <div className="space-y-2">
                          <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                            Overview
                          </h4>
                          <p className="text-slate-700 leading-relaxed text-sm font-normal">
                            {selectedProject.description}
                          </p>
                        </div>
                      )}

                      {/* Problem */}
                      {selectedProject.problem && (
                        <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-100/50 space-y-2">
                          <h4 className="text-xs uppercase font-extrabold tracking-wider text-rose-700 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            The Challenge / Problem
                          </h4>
                          <p className="text-slate-700 leading-relaxed text-sm font-normal">
                            {selectedProject.problem}
                          </p>
                        </div>
                      )}

                      {/* Process */}
                      {selectedProject.process && (
                        <div className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100/50 space-y-2">
                          <h4 className="text-xs uppercase font-extrabold tracking-wider text-indigo-700 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            Process & Roadmap
                          </h4>
                          <p className="text-slate-700 leading-relaxed text-sm font-normal">
                            {selectedProject.process}
                          </p>
                        </div>
                      )}

                      {/* Solution */}
                      {selectedProject.solution && (
                        <div className="p-5 rounded-2xl bg-teal-50/40 border border-teal-100/50 space-y-2">
                          <h4 className="text-xs uppercase font-extrabold tracking-wider text-teal-700 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                            The Solution Executed
                          </h4>
                          <p className="text-slate-700 leading-relaxed text-sm font-normal">
                            {selectedProject.solution}
                          </p>
                        </div>
                      )}

                      {/* Results */}
                      {selectedProject.results && (
                        <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/50 space-y-2 shadow-sm">
                          <h4 className="text-xs uppercase font-extrabold tracking-wider text-emerald-700 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                            Tangible Results & Business Impact
                          </h4>
                          <p className="text-slate-700 leading-relaxed text-sm font-normal">
                            {selectedProject.results}
                          </p>
                        </div>
                      )}

                    </div>

                    {/* Right Column (1/3 width) - Creative/Strategic Context */}
                    <div className="space-y-6 lg:border-l lg:border-slate-100 lg:pl-6 text-left">
                      
                      {/* Strategic Context Details */}
                      {(selectedProject.brandPersonality || selectedProject.strategicGoals || selectedProject.creativeRationale) && (
                        <div className="space-y-5">
                          <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-800 border-b border-slate-100 pb-2">
                            Strategic Insights
                          </h4>

                          {/* Brand Personality */}
                          {selectedProject.brandPersonality && (
                            <div>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                Brand Personality
                              </p>
                              <p className="text-slate-700 font-semibold text-xs mt-1">
                                {selectedProject.brandPersonality}
                              </p>
                            </div>
                          )}

                          {/* Strategic Goals */}
                          {selectedProject.strategicGoals && (
                            <div>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                Business Objectives
                              </p>
                              <p className="text-slate-700 font-semibold text-xs mt-1">
                                {selectedProject.strategicGoals}
                              </p>
                            </div>
                          )}

                          {/* Creative Rationale */}
                          {selectedProject.creativeRationale && (
                            <div>
                              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                Design Rationale
                              </p>
                              <p className="text-slate-650 text-xs mt-1 leading-relaxed font-normal">
                                {selectedProject.creativeRationale}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Booking CTA card */}
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-150 space-y-4">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="w-4 h-4 text-teal-600" />
                          <h4 className="font-extrabold text-xs text-slate-800">Need Similar Results?</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                          Hire {name.split(" ")[0]} to solve your unique business challenges and build custom high-converting solutions.
                        </p>
                        <Link href="#contact" onClick={() => setSelectedProject(null)}>
                          <Button className="w-full bg-slate-950 hover:bg-slate-850 text-white rounded-xl py-4 text-xs font-bold shadow-md shadow-slate-900/10 flex items-center justify-center gap-1 mt-2">
                            Book {name.split(" ")[0]} Now
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>

                    </div>
                  </div>
                ) : (
                  /* Fallback clean layout for standard links */
                  <div className="flex flex-col md:flex-row gap-8 items-center text-left">
                    <div className="w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedProject.thumbnail}
                        alt={selectedProject.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-full md:w-1/2 space-y-4">
                      <h4 className="text-lg font-bold text-slate-900">
                        {selectedProject.title}
                      </h4>
                      <p className="text-slate-650 text-sm leading-relaxed font-normal">
                        No additional case study breakdown was provided for this project. Check out the link below to view the project directly on the web.
                      </p>
                      <a
                        href={selectedProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-5 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-600/20 cursor-pointer"
                      >
                        View Project Website <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FooterLinksSection />
    </div>
  );
}
