"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle2, AlertCircle, ArrowRight, Sparkles, Settings } from "lucide-react";
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
  const [data, setData] = useState<AccountCompletionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

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
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse mb-8">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-3 bg-gray-200 rounded w-full mb-2" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    );
  }

  if (!data || data.isComplete) {
    if (data?.isComplete) {
      return (
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6 border border-teal-100 shadow-sm mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-teal-500 rounded-xl text-white shadow-md shadow-teal-100">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-teal-900 text-lg">Profile 100% Complete!</h3>
              <p className="text-teal-700 text-sm mt-0.5">
                Great job! Your profile is fully optimized to attract clients and showcase your skills.
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  const settingsLink = data.role === "vendor" ? "/v/settings" : "/c/settings";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 mb-8 overflow-hidden relative">
      {/* Header section with status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <h3 className="text-base font-bold text-gray-900">Complete Your Profile</h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Complete your details to increase trust and visibility in the marketplace.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-2xl font-black text-teal-600">{data.completionPercentage}%</span>
            <span className="text-xs text-gray-400 block -mt-1">
              {data.completedCount}/{data.totalFields} fields
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-3 mb-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${data.completionPercentage}%` }}
        />
      </div>

      {/* List of outstanding fields */}
      <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
        {data.missingFields.map((field) => (
          <div
            key={field.key}
            className="flex items-start justify-between p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 border border-slate-100/50 transition-colors group"
          >
            <div className="flex items-start space-x-3">
              <div className="p-1 mt-0.5 rounded-lg bg-amber-50 text-amber-500">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-gray-900">{field.label}</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-gray-200/60 text-gray-500">
                    {field.section}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                  {field.description || `Add your ${field.label.toLowerCase()}`}
                </p>
              </div>
            </div>

            <Link
              href={settingsLink}
              className="flex items-center space-x-1 text-xs text-teal-600 hover:text-teal-700 font-bold transition-all px-2.5 py-1.5 rounded-lg hover:bg-teal-50"
            >
              <span>Add</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        ))}
      </div>

      {/* Footer Settings Link */}
      <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between text-xs">
        <span className="text-gray-400">Your visibility score is currently limited</span>
        <Link
          href={settingsLink}
          className="flex items-center space-x-1.5 font-bold text-gray-700 hover:text-teal-600 transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Go to Settings</span>
        </Link>
      </div>
    </div>
  );
}
