"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Loader2, X } from "lucide-react";

export type MainCategory = "vendor" | "client";

export type VendorSubtype =
  | "students"
  | "creatives"
  | "professionals"
  | "artisan"
  | "businesses";

export type ClientSubtype =
  | "businesses"
  | "individuals"
  | "organisations";

export type OnboardingSubtype = VendorSubtype | ClientSubtype;

export function mapVendorSubtype(val: string): string {
  switch (val) {
    case "students":
    case "student":
      return "student";
    case "creatives":
    case "creative":
      return "creative";
    case "professionals":
    case "professional":
      return "professional";
    case "artisan":
    case "artisans":
      return "artisan";
    case "businesses":
    case "business":
      return "business";
    default:
      return val;
  }
}

export function mapClientSubtype(val: string): string {
  switch (val) {
    case "businesses":
    case "business":
      return "business";
    case "individuals":
    case "individual":
      return "individual";
    case "organisations":
    case "organisation":
    case "organizations":
    case "organization":
      return "organisation";
    default:
      return val;
  }
}

interface OnboardingOption<T extends string> {
  id: T;
  label: string;
  description: string;
}

const VENDOR_OPTIONS: OnboardingOption<VendorSubtype>[] = [
  {
    id: "students",
    label: "Students",
    description: "Students building portfolios, offering skills, and gaining industry experience",
  },
  {
    id: "creatives",
    label: "Creatives",
    description: "Designers, writers, visual artists, videographers, photographers, and animators",
  },
  {
    id: "professionals",
    label: "Professionals",
    description: "Consultants, developers, marketers, strategists, accountants, and specialists",
  },
  {
    id: "artisan",
    label: "Artisan",
    description: "Skilled craftspeople, technicians, builders, makers, and hands-on specialists",
  },
  {
    id: "businesses",
    label: "Businesses",
    description: "Agencies, studios, registered companies, and service firms offering talent",
  },
];

const CLIENT_OPTIONS: OnboardingOption<ClientSubtype>[] = [
  {
    id: "businesses",
    label: "Businesses",
    description: "Companies, startups, and commercial enterprises looking to hire talent",
  },
  {
    id: "individuals",
    label: "Individuals",
    description: "Private clients, entrepreneurs, and individuals commissioning personal or work projects",
  },
  {
    id: "organisations",
    label: "Organisations",
    description: "Non-profit organizations, NGOs, academic institutions, and public entities",
  },
];

interface OnboardingModalProps {
  isOpen: boolean;
  onClose?: () => void;
  canDismiss?: boolean;
}

export default function OnboardingModal({
  isOpen,
  onClose,
  canDismiss = true,
}: OnboardingModalProps) {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [category, setCategory] = useState<MainCategory | null>(null);
  const [subtype, setSubtype] = useState<OnboardingSubtype | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSelectCategory = (selected: MainCategory) => {
    setCategory(selected);
    setSubtype(null);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSubtype(null);
  };

  const handleSubmit = async () => {
    if (!category || !subtype || !session?.user?.id) return;

    try {
      setIsSubmitting(true);
      const userId = session.user.id;
      const authToken =
        (session as any).authToken ||
        (typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null);

      const clientType =
        category === "client" ? mapClientSubtype(subtype) : null;
      const vendorType =
        category === "vendor" ? mapVendorSubtype(subtype) : null;

      const payload = {
        role: category,
        client_type: clientType,
        vendor_type: vendorType,
      };

      // 1. Submit to /api/auth/onboarding/user-type
      const res = await fetch("/api/auth/onboarding/user-type", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.success === false) {
        throw new Error(
          data?.error || data?.message || "Failed to save account type",
        );
      }

      // 2. Cache in localStorage so user isn't prompted again
      localStorage.setItem(`tasa_onboarding_completed_${userId}`, "true");
      localStorage.setItem("tasa_user_type", subtype);
      localStorage.setItem("tasa_user_category", category);
      if (clientType) localStorage.setItem("tasa_client_type", clientType);
      if (vendorType) localStorage.setItem("tasa_vendor_type", vendorType);

      // 3. Update in-memory session if update is supported
      if (typeof update === "function") {
        try {
          await update({
            role: category,
            client_type: clientType,
            vendor_type: vendorType,
          });
        } catch (updateErr) {
          console.warn("Session in-memory update warning:", updateErr);
        }
      }

      toast.success("Account setup complete!");

      if (onClose) {
        onClose();
      }

      // 4. Navigate to appropriate dashboard or refresh
      if (category === "vendor") {
        router.push("/v/dashboard");
      } else {
        router.push("/c/dashboard");
      }
    } catch (error: any) {
      console.error("Onboarding submission error:", error);
      toast.error(error?.message || "Failed to save selection. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const subOptions = category === "vendor" ? VENDOR_OPTIONS : CLIENT_OPTIONS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-xs">
      <div
        className="w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          {step === 2 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <span className="text-[11px] ml-10 font-semibold uppercase tracking-wider text-slate-400">
              Step 1 of 2
            </span>
          )}

          {step === 2 && (
            <span className="text-[11px] ml-10 font-semibold uppercase tracking-wider text-slate-400">
              Step 2 of 2
            </span>
          )}

          {canDismiss && onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-auto cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="px-6 sm:px-8 py-4 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: Main Category Selection */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <h2
                  id="onboarding-title"
                  className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight"
                >
                  How do you want to use Tasa?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Select how you plan to use the platform so we can customize your dashboard and experience.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* Option 1: Talent / Vendors */}
                <button
                  type="button"
                  onClick={() => handleSelectCategory("vendor")}
                  className={`p-5 rounded-2xl border text-left cursor-pointer flex flex-col justify-between h-full bg-white ${
                    category === "vendor"
                      ? "border-slate-800 ring-1 ring-slate-800 bg-slate-50/30"
                      : "border-slate-200"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base font-bold text-slate-800">
                        Talent / Vendors
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          category === "vendor"
                            ? "border-slate-800 bg-slate-800 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {category === "vendor" && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      I want to offer services, showcase creative work, and get hired by clients across Africa.
                      (Students, Creatives, Artisans & more)
                    </p>
                  </div>
                </button>

                {/* Option 2: Clients */}
                <button
                  type="button"
                  onClick={() => handleSelectCategory("client")}
                  className={`p-5 rounded-2xl border text-left cursor-pointer flex flex-col justify-between h-full bg-white ${
                    category === "client"
                      ? "border-slate-800 ring-1 ring-slate-800 bg-slate-50/30"
                      : "border-slate-200"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base font-bold text-slate-800">
                        Clients
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          category === "client"
                            ? "border-slate-800 bg-slate-800 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {category === "client" && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      I want to hire skilled African talent, manage projects, and work with professionals.
                      (Businesses, Individuals & Organisations)
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Sub-category Selection */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <h2
                  id="onboarding-title"
                  className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight"
                >
                  {category === "vendor"
                    ? "How do you want to offer your services?"
                    : "How will you be hiring on Tasa?"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {category === "vendor"
                    ? "Choose the category that best represents you as talent or vendor."
                    : "Choose the category that best represents you or your organization."}
                </p>
              </div>

              <div className="space-y-2.5">
                {subOptions.map((opt) => {
                  const isSelected = subtype === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSubtype(opt.id)}
                      className={`w-full p-4 rounded-xl border text-left cursor-pointer flex items-center justify-between gap-3 bg-white ${
                        isSelected
                          ? "border-slate-800 ring-1 ring-slate-800 bg-slate-50/30"
                          : "border-slate-200"
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-bold text-slate-800">
                          {opt.label}
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2">
                          {opt.description}
                        </p>
                      </div>

                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border-slate-800 bg-slate-800 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          {step === 2 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step === 2 && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!subtype || isSubmitting}
              className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs ${
                subtype && !isSubmitting
                  ? "bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/90 text-white active:scale-[0.98]"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Complete Setup</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
