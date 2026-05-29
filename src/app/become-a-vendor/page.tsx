"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { useSession } from "next-auth/react";
import { toast, Toaster } from "sonner";
import Header from "@/app/component/parts/header";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import { Button } from "@/app/component/ui/button";
import {
  Briefcase,
  Star,
  ArrowRight,
  BadgeCheck,
  Clock3,
  Rocket,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import ErrorBoundary from "@/app/component/parts/ErrorBoundary";

// This is a client component that should not be statically generated
export const dynamic = "force-dynamic";

type SkillType = "core" | "peripheral" | "";

interface FormData {
  // Skills & Services
  skills: string[];
  skillTypes: Record<string, SkillType>;
  skillIds: Record<string, string>; // skill name -> skill ID mapping

  // Terms & Conditions
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

interface CategoryItem {
  _id?: string;
  id?: string;
  name?: string;
  slug?: string;
}

interface SkillItem {
  _id?: string;
  id?: string;
  name?: string;
  slug?: string;
}

const businessTypes = [
  "Freelancer",
  "Agency",
  "Consultant",
  "Small Business",
  "Startup",
  "Other",
];

const experienceLevels = [
  "Less than 1 year",
  "1-2 years",
  "3-5 years",
  "6-10 years",
  "10+ years",
];

const vendorHighlights = [
  {
    icon: <TrendingUp className="h-6 w-6 text-amber-400" />,
    title: "High-Intent Leads",
    description: "Meet serious clients already searching for trusted vendors.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-teal-300" />,
    title: "Protected Payments",
    description:
      "Secure milestones and transparent transactions built for confidence.",
  },
  {
    icon: <Rocket className="h-6 w-6 text-cyan-300" />,
    title: "Faster Growth",
    description:
      "Showcase your profile, win reviews, and scale your business faster.",
  },
  {
    icon: <BadgeCheck className="h-6 w-6 text-emerald-300" />,
    title: "Trust Advantage",
    description:
      "Stand out with a polished vendor profile clients can rely on.",
  },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const MAX_SKILLS = 7;
const MAX_CORE_SKILLS = 2;
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const buildApiUrl = (path: string) => {
  if (!path.startsWith("/"))
    return API_BASE_URL ? `${API_BASE_URL}/${path}` : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
};

function VendorSignupContent() {
  const [formData, setFormData] = useState<FormData>({
    skills: [],
    skillTypes: {},
    skillIds: {},
    agreeToTerms: false,
    agreeToMarketing: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("");
  const [selectedSkillsCategorySlug, setSelectedSkillsCategorySlug] =
    useState("");
  const [availableSkills, setAvailableSkills] = useState<SkillItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [categoriesError, setCategoriesError] = useState("");
  const [skillsError, setSkillsError] = useState("");
  const [customSkillInput, setCustomSkillInput] = useState("");
  const { data: session } = useSession();

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean | string[] | Record<string, SkillType>,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCategoryChange = (nextCategorySlug: string) => {
    const isSwitchingCategoryWithSelectedSkills =
      formData.skills.length > 0 &&
      selectedSkillsCategorySlug &&
      selectedSkillsCategorySlug !== nextCategorySlug;

    if (!nextCategorySlug || isSwitchingCategoryWithSelectedSkills) {
      setFormData((prev) => ({
        ...prev,
        skills: [],
        skillTypes: {},
        skillIds: {},
      }));
      setSelectedSkillsCategorySlug("");
    }

    setSelectedCategorySlug(nextCategorySlug);

    if (errors.category || errors.skills || errors.skillTypes) {
      setErrors((prev) => ({
        ...prev,
        category: "",
        skills: "",
        skillTypes: "",
      }));
    }
  };

  const normalizeSkillName = (name: string) =>
    name
      .trim()
      .replace(/\s+/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const handleSkillToggle = (skill: string) => {
    if (!selectedCategorySlug) return;

    const isSelected = formData.skills.includes(skill);

    if (!isSelected && formData.skills.length >= MAX_SKILLS) {
      setErrors((prev) => ({
        ...prev,
        skills: `You can select up to ${MAX_SKILLS} skills only.`,
      }));
      return;
    }

    setFormData((prev) => {
      if (prev.skills.includes(skill)) {
        const updatedSkillTypes = { ...prev.skillTypes };
        delete updatedSkillTypes[skill];
        const updatedSkillIds = { ...prev.skillIds };
        delete updatedSkillIds[skill];

        return {
          ...prev,
          skills: prev.skills.filter((s) => s !== skill),
          skillTypes: updatedSkillTypes,
          skillIds: updatedSkillIds,
        };
      }

      // Find the skill ID from availableSkills
      const skillItem = availableSkills.find(
        (s) => s.name === skill || s.slug === skill,
      );
      const skillId = skillItem?._id || skillItem?.id || "";

      return {
        ...prev,
        skills: [...prev.skills, skill],
        skillTypes: {
          ...prev.skillTypes,
          [skill]: prev.skillTypes[skill] || "",
        },
        skillIds: {
          ...prev.skillIds,
          [skill]: skillId,
        },
      };
    });

    if (isSelected && formData.skills.length === 1) {
      setSelectedSkillsCategorySlug("");
    }

    if (!isSelected && !selectedSkillsCategorySlug) {
      setSelectedSkillsCategorySlug(selectedCategorySlug);
    }

    if (errors.skills || errors.skillTypes) {
      setErrors((prev) => ({
        ...prev,
        skills: "",
        skillTypes: "",
      }));
    }
  };

  const handleAddCustomSkill = () => {
    if (!selectedCategorySlug) {
      setErrors((prev) => ({
        ...prev,
        category: "Please select a category before adding custom skills",
      }));
      return;
    }

    const normalizedSkill = normalizeSkillName(customSkillInput);
    if (!normalizedSkill) return;

    const alreadySelected = formData.skills.some(
      (skill) => skill.toLowerCase() === normalizedSkill.toLowerCase(),
    );

    if (alreadySelected) {
      setCustomSkillInput("");
      return;
    }

    // Check if skill already exists in availableSkills
    const skillExistsInList = availableSkills.some(
      (skill) =>
        skill.name?.toLowerCase() === normalizedSkill.toLowerCase() ||
        skill.slug?.toLowerCase() === normalizedSkill.toLowerCase(),
    );

    if (skillExistsInList) {
      setErrors((prev) => ({
        ...prev,
        skills: `"${normalizedSkill}" already exists in the available skills list. Please select it from the list instead.`,
      }));
      setCustomSkillInput("");
      return;
    }

    if (formData.skills.length >= MAX_SKILLS) {
      setErrors((prev) => ({
        ...prev,
        skills: `You can select up to ${MAX_SKILLS} skills only.`,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, normalizedSkill],
      skillTypes: {
        ...prev.skillTypes,
        [normalizedSkill]: prev.skillTypes[normalizedSkill] || "",
      },
      skillIds: {
        ...prev.skillIds,
        [normalizedSkill]: "", // Custom skills don't have IDs
      },
    }));
    setCustomSkillInput("");

    if (!selectedSkillsCategorySlug) {
      setSelectedSkillsCategorySlug(selectedCategorySlug);
    }

    if (errors.skills || errors.skillTypes || errors.category) {
      setErrors((prev) => ({
        ...prev,
        skills: "",
        skillTypes: "",
        category: "",
      }));
    }
  };

  const handleSkillTypeChange = (skill: string, skillType: SkillType) => {
    setFormData((prev) => {
      // Prevent custom skills (without skillIds) from being set as core
      if (skillType === "core" && prev.skillIds[skill] === "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          skillTypes: "Custom skills cannot be set as core skills.",
        }));
        return prev;
      }

      if (skillType === "core") {
        const currentCoreCount = Object.entries(prev.skillTypes).filter(
          ([key, value]) => key !== skill && value === "core",
        ).length;

        if (currentCoreCount >= MAX_CORE_SKILLS) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            skillTypes: `You can select up to ${MAX_CORE_SKILLS} core skills only.`,
          }));
          return prev;
        }
      }

      return {
        ...prev,
        skillTypes: {
          ...prev.skillTypes,
          [skill]: skillType,
        },
      };
    });

    if (errors.skillTypes) {
      setErrors((prev) => ({ ...prev, skillTypes: "" }));
    }
  };

  const normalizeCategories = (payload: any): CategoryItem[] => {
    let rawCategories: any[] = [];

    if (Array.isArray(payload)) {
      rawCategories = payload;
    } else if (Array.isArray(payload?.data)) {
      rawCategories = payload.data;
    } else if (Array.isArray(payload?.data?.categories)) {
      rawCategories = payload.data.categories;
    } else if (Array.isArray(payload?.categories)) {
      rawCategories = payload.categories;
    }

    return rawCategories
      .map((item) => ({
        _id: item?._id || item?.id,
        id: item?.id || item?._id,
        name: item?.name,
        slug: item?.slug,
      }))
      .filter((item) => item.name && item.slug);
  };

  const normalizeSkills = (payload: any): SkillItem[] => {
    let rawSkills: any[] = [];

    if (Array.isArray(payload)) {
      rawSkills = payload;
    } else if (Array.isArray(payload?.data)) {
      rawSkills = payload.data;
    } else if (Array.isArray(payload?.data?.allSkills)) {
      rawSkills = payload.data.allSkills;
    } else if (Array.isArray(payload?.allSkills)) {
      rawSkills = payload.allSkills;
    } else if (Array.isArray(payload?.data?.skills)) {
      rawSkills = payload.data.skills;
    } else if (Array.isArray(payload?.skills)) {
      rawSkills = payload.skills;
    }

    return rawSkills
      .map((item) => ({
        _id: item?._id || item?.id,
        id: item?.id || item?._id,
        name: item?.name,
        slug: item?.slug,
      }))
      .filter((item) => item.name);
  };

  useEffect(() => {
    let active = true;

    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setCategoriesError("");

      try {
        const response = await fetch(buildApiUrl("/api/categories"), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const payload = await response.json();
        const normalizedCategories = normalizeCategories(payload);

        if (!active) return;
        setCategories(normalizedCategories);

        if (normalizedCategories.length > 0) {
          setSelectedCategorySlug(
            (prev) => prev || normalizedCategories[0].slug || "",
          );
        }
      } catch (error) {
        if (!active) return;
        setCategories([]);
        setCategoriesError("Unable to load categories right now.");
      } finally {
        if (active) {
          setIsLoadingCategories(false);
        }
      }
    };

    fetchCategories();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedCategorySlug) {
      setAvailableSkills([]);
      return;
    }

    let active = true;

    const fetchSkillsForCategory = async () => {
      setIsLoadingSkills(true);
      setSkillsError("");

      try {
        const response = await fetch(
          buildApiUrl(`/api/categories/${selectedCategorySlug}/skills`),
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch skills");
        }

        const payload = await response.json();
        const normalizedSkills = normalizeSkills(payload);

        if (!active) return;
        setAvailableSkills(normalizedSkills);
      } catch (error) {
        if (!active) return;
        setAvailableSkills([]);
        setSkillsError("Unable to load skills for this category.");
      } finally {
        if (active) {
          setIsLoadingSkills(false);
        }
      }
    };

    fetchSkillsForCategory();

    return () => {
      active = false;
    };
  }, [selectedCategorySlug]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!selectedCategorySlug) newErrors.category = "Please select a category";
    if (formData.skills.length === 0)
      newErrors.skills = "Please select at least one skill";
    if (formData.skills.length > MAX_SKILLS)
      newErrors.skills = `You can select up to ${MAX_SKILLS} skills only.`;
    if (formData.skills.some((skill) => !formData.skillTypes[skill])) {
      newErrors.skillTypes =
        "Please set each selected skill as core or peripheral";
    }
    const coreSkillsCount = Object.entries(formData.skillTypes).filter(
      ([skill, type]) => formData.skills.includes(skill) && type === "core",
    ).length;
    if (coreSkillsCount > MAX_CORE_SKILLS) {
      newErrors.skillTypes = `You can select up to ${MAX_CORE_SKILLS} core skills only.`;
    }
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userId = session?.user?.id;
    if (!userId) {
      setErrors((prev) => ({
        ...prev,
        _form: "You must be logged in to register as a vendor.",
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      // Separate custom skills (no skillId) from API skills (has skillId)
      const customSkills = formData.skills.filter(
        (skill) => formData.skillIds[skill] === "",
      );

      // Send custom skills to SkillReview endpoint if any exist
      if (customSkills.length > 0) {
        const skillReviewPayload = {
          userID: userId,
          category: selectedCategory?.name || "",
          skills: customSkills,
        };

        const skillReviewResponse = await fetch(
          buildApiUrl("/api/vendors/SkillReview"),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.authToken}`,
            },
            body: JSON.stringify(skillReviewPayload),
          },
        );

        if (!skillReviewResponse.ok) {
          const errorData = await skillReviewResponse.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              errorData.error ||
              "Failed to submit custom skills for review",
          );
        }
      }

      // Build the main vendor registration payload (only skills with valid IDs)
      const coreSkillIds: string[] = formData.skills
        .filter((skill) => formData.skillTypes[skill] === "core")
        .map((skill) => formData.skillIds[skill])
        .filter((id) => id !== "");

      const peripheralSkills = formData.skills
        .filter(
          (skill) =>
            formData.skillTypes[skill] === "peripheral" &&
            formData.skillIds[skill] !== "",
        )
        .map((skill) => formData.skillIds[skill]);

      const payload = {
        multi_category: false,
        category: selectedCategory?.name || "",
        coreSkillIds,
        peripheralSkills,
      };

      console.log(
        "Vendor registration payload:",
        JSON.stringify(payload, null, 2),
      );
      console.log("UserId:", userId);
      console.log("AuthToken:", session.authToken ? "Present" : "Missing");

      const response = await fetch(buildApiUrl(`/api/vendors/${userId}`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || errorData.error || "Registration failed",
        );
      }

      const result = await response.json();

      // Redirect to success page or dashboard
      if (result.success) {
        toast.success("Registration successful! Redirecting to dashboard...");
        window.location.href =
          process.env.NODE_ENV === "production"
            ? "https://dash.tasa.com.ng"
            : "http://localhost:5173";
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      toast.error(errorMessage);
      setErrors((prev) => ({ ...prev, _form: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const textInputClass =
    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-4";
  const compactSelectClass =
    "w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-4";
  const defaultInputState =
    "border-slate-200 focus:border-teal-500 focus:ring-teal-100";
  const errorInputState =
    "border-rose-400 focus:border-rose-500 focus:ring-rose-100";
  const selectedCategory = categories.find(
    (category) => category.slug === selectedCategorySlug,
  );

  return (
    <div className="bg-slate-50 text-slate-900">
      <Toaster />
      <Header variant="white" />

      <section className="relative overflow-hidden bg-slate-950 pt-28 pb-20 text-white">
        <div className="pointer-events-none absolute -left-36 -top-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-16 h-[26rem] w-[26rem] rounded-full bg-teal-400/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-300/20 blur-3xl" />

        <div className="container-responsive relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-teal-100">
                <Sparkles className="h-4 w-4" />
                Join Our Vendorship Program
              </p>

              <h1 className="vendor-hero-h1 max-w-2xl text-4xl leading-tight sm:text-5xl">
                Become <br /> a Vendor <br /> on TASA
              </h1>
              <ul
                className={`${poppins.className} mt-6 max-w-2xl list-disc space-y-1 pl-6 text-base text-slate-200 marker:text-teal-300 sm:text-lg}`}
              >
                <li>Turn your expertise into profit.</li>
                <li>Connect with high-intent clients</li>
                <li>
                  Build your personal brand and grow your revenue with a profile
                  designed to sell your value.
                </li>
              </ul>
            </div>

            <div className="relative mx-auto w-full max-w-[620px]">
              <Image
                src="/vendor-page-hero-vector.png"
                alt="Vendor page hero visual showing conversion-focused onboarding"
                width={600}
                height={466}
                priority
                className="h-auto w-full drop-shadow-[0_28px_80px_rgba(0,0,0,0.45)]"
              />
            </div>
          </div>
        </div>
      </section>

      <div className={poppins.className}>
        <section className="mt-10 pb-14 sm:mx-10 lg:mx-20">
          <div className=" p-6 md:p-10">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4  border-0 border-b-1 border-slate-200 pb-8">
              <div>
                <p className="mb-6 text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
                  Why become a vendor
                </p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {vendorHighlights.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="mb-3 inline-flex rounded-xl bg-slate-900 p-2.5">
                        {item.icon}
                      </div>
                      <h3 className="text-base font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 md:p-8">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-900">
                    Create Your Vendor Account
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Fill this once and launch a profile that sells your services
                    with confidence.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {errors._form && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                      <p className="text-sm text-rose-600">{errors._form}</p>
                    </div>
                  )}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 md:p-6">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <h4 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                        <Star className="h-5 w-5 text-teal-600" />
                        Skills & Services
                      </h4>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        Selected: {formData.skills.length}/{MAX_SKILLS}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="mb-3 block text-sm font-medium text-slate-700">
                          Select Category *
                        </label>
                        <select
                          value={selectedCategorySlug}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className={`${textInputClass} ${
                            categoriesError || errors.category
                              ? errorInputState
                              : defaultInputState
                          }`}
                          disabled={
                            isLoadingCategories || categories.length === 0
                          }
                        >
                          {isLoadingCategories ? (
                            <option value="">Loading categories...</option>
                          ) : (
                            <>
                              <option value="">Choose a category</option>
                              {categories.map((category) => (
                                <option
                                  key={
                                    category._id || category.id || category.slug
                                  }
                                  value={category.slug}
                                >
                                  {category.name}
                                </option>
                              ))}
                            </>
                          )}
                        </select>
                        {categoriesError && (
                          <p className="mt-2 text-sm text-rose-600">
                            {categoriesError}
                          </p>
                        )}
                        {errors.category && (
                          <p className="mt-2 text-sm text-rose-600">
                            {errors.category}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-3 block text-sm font-medium text-slate-700">
                          Select Your Skills * (Choose at least one)
                        </label>
                        {isLoadingSkills ? (
                          <p className="text-sm text-slate-500">
                            Loading skills...
                          </p>
                        ) : skillsError ? (
                          <p className="text-sm text-rose-600">{skillsError}</p>
                        ) : !selectedCategorySlug ? (
                          <p className="text-sm text-slate-500">
                            Select a category to view available skills.
                          </p>
                        ) : availableSkills.length === 0 ? (
                          <p className="text-sm text-slate-500">
                            No skills are available for this category yet.
                          </p>
                        ) : (
                          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                            {availableSkills.map((skill) => {
                              const skillName = skill.name || "";
                              const isSelected =
                                formData.skills.includes(skillName);

                              return (
                                <button
                                  key={
                                    skill._id ||
                                    skill.id ||
                                    skill.slug ||
                                    skillName
                                  }
                                  type="button"
                                  onClick={() => handleSkillToggle(skillName)}
                                  className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                                    isSelected
                                      ? "border-teal-500 bg-teal-100 text-teal-800 shadow-sm"
                                      : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50"
                                  }`}
                                >
                                  {skillName}
                                </button>
                              );
                            })}
                          </div>
                        )}
                        {errors.skills && (
                          <p className="mt-2 text-sm text-rose-600">
                            {errors.skills}
                          </p>
                        )}
                      </div>

                      <div>
                        <label>
                          <h4 className="mb-5 text-lg font-semibold text-slate-900">
                            Can&apos;t find your skill?
                          </h4>
                        </label>

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <input
                            type="text"
                            value={customSkillInput}
                            onChange={(e) =>
                              setCustomSkillInput(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddCustomSkill();
                              }
                            }}
                            placeholder="Add it here"
                            className={`${textInputClass} ${
                              errors.skills
                                ? errorInputState
                                : defaultInputState
                            }`}
                            disabled={formData.skills.length >= MAX_SKILLS}
                          />
                          <Button
                            type="button"
                            onClick={handleAddCustomSkill}
                            disabled={
                              !customSkillInput.trim() ||
                              formData.skills.length >= MAX_SKILLS
                            }
                            className="h-11 min-w-[110px] rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed"
                          >
                            Add Skill
                          </Button>
                        </div>
                        <span className="mt-2 block text-sm text-slate-500">
                          Skills added here must be related to{" "}
                          {selectedCategory?.name || "the selected category"},
                          it would be reviewed and added to your profile
                        </span>
                      </div>

                      {formData.skills.length > 0 && (
                        <div>
                          <label className="mb-3 block text-sm font-medium text-slate-700">
                            Set Skill Type * (Core or Peripheral)
                          </label>
                          <div className="space-y-3">
                            {formData.skills.map((skill) => (
                              <div
                                key={`selected-skill-${skill}`}
                                className="grid grid-cols-1 gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-[minmax(0,1fr)_180px_auto] sm:items-center"
                              >
                                <p className="text-sm font-medium text-slate-800">
                                  {skill}
                                </p>
                                <select
                                  value={formData.skillTypes[skill] || ""}
                                  onChange={(e) =>
                                    handleSkillTypeChange(
                                      skill,
                                      e.target.value as SkillType,
                                    )
                                  }
                                  className={`${compactSelectClass} ${
                                    errors.skillTypes &&
                                    !formData.skillTypes[skill]
                                      ? errorInputState
                                      : defaultInputState
                                  }`}
                                >
                                  <option value="">Select type</option>
                                  <option
                                    value="core"
                                    disabled={
                                      (formData.skillIds[skill] === "" ||
                                        Object.values(
                                          formData.skillTypes,
                                        ).filter((type) => type === "core")
                                          .length >= MAX_CORE_SKILLS) &&
                                      formData.skillTypes[skill] !== "core"
                                    }
                                  >
                                    Core
                                  </option>
                                  <option value="peripheral">Peripheral</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() => handleSkillToggle(skill)}
                                  className="justify-self-start text-xs font-semibold text-rose-600 transition hover:text-rose-700 sm:justify-self-end"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                          {errors.skillTypes && (
                            <p className="mt-2 text-sm text-rose-600">
                              {errors.skillTypes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 md:p-6">
                    <h4 className="mb-5 text-lg font-semibold text-slate-900">
                      Terms & Conditions
                    </h4>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={(e) =>
                            handleInputChange("agreeToTerms", e.target.checked)
                          }
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                        <label
                          htmlFor="agreeToTerms"
                          className="text-sm text-slate-700"
                        >
                          I agree to the{" "}
                          <Link
                            href="/terms"
                            className="font-medium text-teal-700 underline transition hover:text-teal-800"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/privacy"
                            className="font-medium text-teal-700 underline transition hover:text-teal-800"
                          >
                            Privacy Policy
                          </Link>{" "}
                          *
                        </label>
                      </div>
                      {errors.agreeToTerms && (
                        <p className="text-sm text-rose-600">
                          {errors.agreeToTerms}
                        </p>
                      )}

                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="agreeToMarketing"
                          checked={formData.agreeToMarketing}
                          onChange={(e) =>
                            handleInputChange(
                              "agreeToMarketing",
                              e.target.checked,
                            )
                          }
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                        <label
                          htmlFor="agreeToMarketing"
                          className="text-sm text-slate-700"
                        >
                          I would like to receive updates and growth tips from
                          TASA.
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
                          Ready to launch?
                        </p>
                        <h4 className="mt-1 text-xl font-bold">
                          Publish your vendor profile today.
                        </h4>
                        <p className="mt-1 text-sm text-slate-300">
                          Complete your application and start getting offers.
                        </p>
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting || !formData.agreeToTerms}
                        className="h-12 rounded-xl bg-white px-6 text-sm font-semibold text-slate-900 hover:bg-slate-100 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-slate-900" />
                            Creating Account...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Resgister
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>

              <aside className="space-y-6 xl:sticky xl:top-24">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
                  <h4 className="mb-4 text-lg font-bold text-slate-900">
                    What happens next
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                      <Clock3 className="mt-0.5 h-8 w-8 text-teal-600" />
                      <p className="text-sm text-slate-700">
                        Quick review by the vendor onboarding team.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                      <Briefcase className="mt-0.5 h-8 w-8 text-teal-600" />
                      <p className="text-sm text-slate-700">
                        Profile activation and visibility to active clients.
                      </p>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                      <Rocket className="mt-0.5 h-8 w-8 text-teal-600" />
                      <p className="text-sm text-slate-700">
                        Start getting offers & jobs and grow your reputation.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-100 via-white to-teal-100 p-6 shadow-lg shadow-amber-100">
                  <h4 className="text-lg font-bold text-slate-900">
                    Need help before submitting?
                  </h4>
                  <p className="mt-2 text-sm text-slate-700">
                    Our team can help you position your profile to convert
                    better from day one.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-800"
                  >
                    Contact Vendor Support
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <div className="bg-white">
          <FooterLinksSection />
        </div>
      </div>
    </div>
  );
}

// Wrap the component with ErrorBoundary
export default function VendorSignupPage() {
  return (
    <ErrorBoundary>
      <VendorSignupContent />
    </ErrorBoundary>
  );
}
