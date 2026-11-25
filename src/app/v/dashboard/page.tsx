"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  FolderGit2,
  MapPin,
  Plus,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { vendorApi, type VendorProject } from "@/lib/vendor";

export default function VendorDashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [vendorData, setVendorData] = useState<any>(null);
  const [projects, setProjects] = useState<VendorProject[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [stats, setStats] = useState({
    activeOrders: 0,
    totalEarnings: 0,
    clientReviews: 0,
    rating: 0,
  });

  useEffect(() => {
    if (session?.user?.id && session?.authToken) {
      loadDashboardData();
    } else if (!session) {
      setLoading(false);
    }
  }, [session]);

  const loadDashboardData = async () => {
    if (!session?.user?.id || !session?.authToken) return;
    const vendorId = session.user.id;
    const authToken = session.authToken;

    try {
      setLoading(true);
      // Fetch vendor profile, stats, and portfolio projects in parallel
      const [profileRes, statsRes, projectsRes] = await Promise.allSettled([
        vendorApi.getById(vendorId, authToken),
        vendorApi.getStats(vendorId, authToken),
        vendorApi.getProjects(vendorId, authToken),
      ]);

      if (profileRes.status === "fulfilled" && profileRes.value.success && profileRes.value.data) {
        setVendorData(profileRes.value.data);
      }

      if (statsRes.status === "fulfilled" && statsRes.value.success && statsRes.value.data) {
        setStats(statsRes.value.data);
      }

      if (projectsRes.status === "fulfilled" && projectsRes.value.success && projectsRes.value.data) {
        setProjects(Array.isArray(projectsRes.value.data) ? projectsRes.value.data : []);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Copy public profile link to clipboard
  const handleCopyProfileLink = () => {
    const slug = vendorData?.slug || vendorData?._id || session?.user?.id;
    if (!slug) return;
    const profileUrl = `${window.location.origin}/vendors/${slug}`;
    navigator.clipboard.writeText(profileUrl);
    setCopiedLink(true);
    toast.success("Profile link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Skills processing
  const coreSkills = Array.isArray(vendorData?.coreSkills)
    ? vendorData.coreSkills.map((s: any) => (typeof s === "string" ? s : s?.name)).filter(Boolean)
    : [];

  const peripheralSkills = Array.isArray(vendorData?.peripheralSkills)
    ? vendorData.peripheralSkills.map((s: any) => (typeof s === "string" ? s : s?.name)).filter(Boolean)
    : [];

  // Fallback to generic skills array if core/peripheral not split
  const rawSkills = Array.isArray(vendorData?.skills)
    ? vendorData.skills.map((s: any) => (typeof s === "string" ? s : s?.name)).filter(Boolean)
    : [];

  const displayCoreSkills = coreSkills.length > 0 ? coreSkills : rawSkills.slice(0, 5);
  const displayPeripheralSkills =
    peripheralSkills.length > 0
      ? peripheralSkills
      : rawSkills.slice(5, 10);

  const vendorName = vendorData?.name || session?.user?.name || "Professional";
  const vendorSlug = vendorData?.slug || vendorData?._id || session?.user?.id;
  const locationLabel = [vendorData?.city, vendorData?.country || "Africa"].filter(Boolean).join(", ");
  const vendorRating = stats.rating && stats.rating > 0 ? Number(stats.rating).toFixed(1) : "5.0";

  return (
    <div className="relative min-h-[600px] space-y-6 pb-12">
      <Toaster position="top-right" richColors />
      <LoadingOverlay isVisible={loading} />

      {/* 1. Header & Vendor Identity */}
      <div className="space-y-4 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
            {vendorName}
          </h1>

        </div>

        {/* Divider line */}
        <hr className="border-t border-slate-200/80" />

        {/* Location, reviews, etc. */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-600">
          {locationLabel && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[var(--color-brand-primary)] shrink-0" />
              <span>{locationLabel}</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
            <Star className="w-4 h-4 fill-[var(--color-brand-accent)] text-[var(--color-brand-accent)] shrink-0" />
            <span>{vendorRating}</span>
            <span className="text-slate-500 font-normal">
              ({stats.clientReviews} {stats.clientReviews === 1 ? "review" : "reviews"})
            </span>
          </span>
          {vendorData?.category && (
            <span className="inline-flex items-center gap-1 text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span>{vendorData.category}</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Main Workspace */}
      <div className="space-y-6">
        {/* Recent Portfolio Projects Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
                Portfolio Showcases
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Visual proof of your work shown on your public profile
              </p>
            </div>
            <Link
              href="/v/portfolio"
              className="text-xs font-bold text-[var(--color-brand-primary)] hover:underline inline-flex items-center gap-1"
            >
              <span>View All ({projects.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.slice(0, 6).map((project, idx) => (
                <div
                  key={project._id || idx}
                  className="group rounded-xl border border-slate-200 overflow-hidden bg-slate-50/40 hover:bg-white hover:border-[var(--color-brand-secondary)] transition-all flex flex-col"
                >
                  <div className="relative w-full h-40 bg-slate-200 overflow-hidden">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <FolderGit2 className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)] truncate">
                      {project.title}
                    </h4>
                    {project.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                        {project.description}
                      </p>
                    )}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <Link
                        href="/v/portfolio"
                        className="text-[var(--color-brand-primary)] font-semibold hover:underline"
                      >
                        Edit details
                      </Link>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-slate-600 inline-flex items-center gap-0.5"
                        >
                          <span>Live preview</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl bg-slate-50 border border-slate-200/70 space-y-3">
              <FolderGit2 className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven&apos;t added any portfolio projects yet. Adding at least 2 case studies helps clients understand your quality.
              </p>
              <Link
                href="/v/portfolio"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-primary)]/90 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Your First Project</span>
              </Link>
            </div>
          )}
        </div>

        {/* Verified Skills Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
                Verified Skills & Capabilities
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                How clients find you across category search filters
              </p>
            </div>
            <Link
              href="/v/settings"
              className="text-xs font-semibold text-[var(--color-brand-primary)] hover:underline inline-flex items-center gap-1"
            >
              <span>Edit Skills</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {/* Core Skills */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Core Skills (Primary Specializations)
              </span>
              {displayCoreSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {displayCoreSkills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-bg-brand-soft)] text-[var(--color-brand-primary)] border border-[var(--color-brand-secondary)]/30"
                    >
                      <CheckCircle2 className="w-3 h-3 text-[var(--color-brand-primary)]" />
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No core skills tagged yet.</p>
              )}
            </div>

            {/* Peripheral Skills */}
            {displayPeripheralSkills.length > 0 && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Peripheral Skills (Complementary Knowledge)
                </span>
                <div className="flex flex-wrap gap-2">
                  {displayPeripheralSkills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
