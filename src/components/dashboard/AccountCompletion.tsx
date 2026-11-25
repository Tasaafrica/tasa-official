"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

interface MissingField {
  key: string;
  label: string;
  section: string;
  description: string;
}

interface AccountCompletionData {
  completionPercentage: number;
  completedCount: number;
  totalFields: number;
  isComplete: boolean;
  role: string;
  missingFields: MissingField[];
}

export default function AccountCompletion() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [data, setData] = useState<AccountCompletionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const isOnProfile = pathname?.includes("/profile");
  const isOnSettings = pathname?.includes("/settings");
  const isOnPage = isOnProfile || isOnSettings;

  const scrollToSection = (fieldKey: string) => {
    const key = fieldKey.toLowerCase();
    if (key.includes("skill") || key.includes("category")) {
      const skillsSection = document.getElementById("skills-selection-section");
      if (skillsSection) {
        skillsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    const profileSection = document.getElementById("profile-info-section");
    if (profileSection) {
      profileSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (session?.authToken) {
      fetchCompletionStatus();
    }
  }, [session]);

  const fetchCompletionStatus = async () => {
    try {
      const response = await fetch("/api/auth/account-completion");
      const resData = await response.json();
      if (resData.success && resData.data) {
        setData(resData.data);
      }
    } catch (error) {
      console.error("Error fetching account completion status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-3 animate-pulse mb-4">
        <div className="h-3 bg-slate-100 rounded w-1/3 mb-2" />
        <div className="h-1.5 bg-slate-100 rounded w-full" />
      </div>
    );
  }

  if (!data || data.isComplete) {
    if (data?.isComplete) {
      return (
        <div className="bg-white rounded-xl border border-slate-200/80 px-4 py-3 mb-4 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <span className="text-xs font-semibold text-slate-700">Profile 100% complete</span>
          <span className="text-xs text-slate-400 ml-auto">Your profile is fully optimized</span>
        </div>
      );
    }
    return null;
  }

  const profileLink = data.role === "vendor" ? "/v/profile" : "/c/profile";
  const settingsLink = data.role === "vendor" ? "/v/settings" : "/c/settings";

  const getFieldLink = (field: MissingField) => {
    const key = field.key.toLowerCase();
    if (key.includes("skill") || key.includes("category")) return settingsLink;
    return profileLink;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs mb-4 overflow-hidden">
      {/* Top bar */}
      <div className="px-4 py-3 flex items-center gap-3">
        {/* Pulsing dot */}
        <span className="flex h-2 w-2 relative shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand-accent)] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-brand-accent)]" />
        </span>

        {/* Label */}
        <span className="text-xs font-semibold text-slate-700 shrink-0">
          Complete your profile
        </span>

        {/* Progress bar */}
        <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden min-w-0">
          <div
            className="bg-[var(--color-brand-primary)] h-full rounded-full transition-all duration-700"
            style={{ width: `${data.completionPercentage}%` }}
          />
        </div>

        {/* Percentage */}
        <span className="text-xs font-bold text-[var(--color-brand-primary)] shrink-0">
          {data.completionPercentage}%
        </span>

        {/* CTA */}
        {!isOnPage && (
          <Link
            href={profileLink}
            className="shrink-0 text-[11px] font-semibold text-white bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-dark)] px-2.5 py-1 rounded-lg transition-colors inline-flex items-center gap-1"
          >
            <span>Update</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}

        {/* Toggle expand */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded fields list */}
      {expanded && (
        <div className="border-t border-slate-100 px-4 py-3 space-y-1.5">
          {data.missingFields.map((field) => (
            <div
              key={field.key}
              className="flex items-center justify-between gap-3 py-1.5"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <span className="text-xs text-slate-700 font-medium truncate">{field.label}</span>
                <span className="text-[10px] text-slate-400 shrink-0">{field.section}</span>
              </div>

              {isOnPage ? (
                <button
                  type="button"
                  onClick={() => scrollToSection(field.key)}
                  className="text-[11px] font-semibold text-[var(--color-brand-primary)] hover:underline shrink-0"
                >
                  Complete
                </button>
              ) : (
                <Link
                  href={getFieldLink(field)}
                  className="text-[11px] font-semibold text-[var(--color-brand-primary)] hover:underline shrink-0"
                >
                  Add
                </Link>
              )}
            </div>
          ))}
          <p className="text-[10px] text-slate-400 pt-1">
            {data.completedCount} of {data.totalFields} fields completed
          </p>
        </div>
      )}
    </div>
  );
}
