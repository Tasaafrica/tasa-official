"use client";

import Cropper from "cropperjs";
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Plus,
  Trash2,
  UploadCloud,
  Pencil,
  HelpCircle,
  Lightbulb,
  BookOpen,
  Sparkles,
  Save,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { vendorApi } from "@/lib/vendor";
import type { VendorProject } from "@/lib/vendor";
import { useVendorHeader } from "../context";
import "cropperjs/dist/cropper.css";

export default function PortfolioPage() {
  const { setTitle, setDescription } = useVendorHeader();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<VendorProject[]>([]);

  // Form state
  const [title, setProjectTitle] = useState("");
  const [link, setProjectLink] = useState("");
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  // Active tooltip state for mobile touch support
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Case Study optional fields
  const [description, setProjectDescription] = useState("");
  const [problem, setProjectProblem] = useState("");
  const [process, setProjectProcess] = useState("");
  const [solution, setProjectSolution] = useState("");
  const [results, setProjectResults] = useState("");
  const [brandPersonality, setProjectBrandPersonality] = useState("");
  const [strategicGoals, setProjectStrategicGoals] = useState("");
  const [creativeRationale, setProjectCreativeRationale] = useState("");

  // Editing state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Cropper states
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropperModalOpen, setCropperModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageElementRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);

  useEffect(() => {
    setTitle("Portfolio Showcase");
    setDescription(
      "Manage and showcase your projects, add portfolio links, and crop thumbnails to highlight your best work.",
    );
  }, [setTitle, setDescription]);

  // Load projects from API on mount and when session changes
  const loadProjects = async () => {
    if (!session?.user?.id || !session?.authToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const result = await vendorApi.getProjects(
        session.user.id,
        session.authToken,
      );

      if (result.success && result.data) {
        setProjects(result.data);
      } else {
        toast.error(result.message || "Failed to load your portfolio projects");
      }
    } catch (error) {
      console.error("Error loading portfolio projects:", error);
      toast.error("Failed to load your portfolio projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [session]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Basic validation on original file
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setCropperModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Instantiate Cropper when modal opens and image is loaded
  useEffect(() => {
    if (cropperModalOpen && imageToCrop && imageElementRef.current) {
      // Clean up previous instance just in case
      if (cropperRef.current) {
        cropperRef.current.destroy();
      }

      cropperRef.current = new Cropper(imageElementRef.current, {
        aspectRatio: 1, // Square crop 1:1
        viewMode: 1,
        autoCropArea: 0.9,
        background: false,
        responsive: true,
        checkOrientation: false,
      });
    }

    return () => {
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
      }
    };
  }, [cropperModalOpen, imageToCrop]);

  // Handle cropping action
  const handleCrop = () => {
    if (!cropperRef.current) return;

    // Output target size exactly 200px x 200px
    const canvas = cropperRef.current.getCroppedCanvas({
      width: 200,
      height: 200,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });

    if (canvas) {
      // Compress with 85% JPEG quality to ensure size is below 200KB limit
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Check size limit: 200KB = 204,800 bytes
            const maxSizeBytes = 200 * 1024;
            if (blob.size > maxSizeBytes) {
              toast.error(
                `Cropped image is ${(blob.size / 1024).toFixed(
                  1,
                )}KB, which exceeds the 200KB limit. Try cropping a simpler region or lowering detail.`,
              );
              return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
              setCroppedImage(reader.result as string);
              setCropperModalOpen(false);
              setImageToCrop(null);
              toast.success("Image cropped successfully!");
            };
            reader.readAsDataURL(blob);
          }
        },
        "image/jpeg",
        0.85,
      );
    }
  };

  // Cancel cropping
  const handleCancelCrop = () => {
    setCropperModalOpen(false);
    setImageToCrop(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Reset form helper
  const resetForm = () => {
    setProjectTitle("");
    setProjectLink("");
    setCroppedImage(null);
    setProjectDescription("");
    setProjectProblem("");
    setProjectProcess("");
    setProjectSolution("");
    setProjectResults("");
    setProjectBrandPersonality("");
    setProjectStrategicGoals("");
    setProjectCreativeRationale("");
    setEditingProjectId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Set up edit state
  const startEditProject = (project: VendorProject) => {
    setEditingProjectId(project.id);
    setProjectTitle(project.title);
    setProjectLink(project.link);
    setCroppedImage(project.thumbnail); // Hold existing url as baseline thumbnail
    setProjectDescription(project.description || "");
    setProjectProblem(project.problem || "");
    setProjectProcess(project.process || "");
    setProjectSolution(project.solution || "");
    setProjectResults(project.results || "");
    setProjectBrandPersonality(project.brandPersonality || "");
    setProjectStrategicGoals(project.strategicGoals || "");
    setProjectCreativeRationale(project.creativeRationale || "");

    // Scroll smoothly to form container
    const formElement = document.getElementById("project-form-container");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Submit project (Add or Edit)
  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a project title");
      return;
    }

    if (!link.trim()) {
      toast.error("Please enter a project link URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(link.startsWith("http") ? link : `https://${link}`);
    } catch (_) {
      toast.error("Please enter a valid link URL");
      return;
    }

    if (!croppedImage) {
      toast.error("Please upload and crop a project thumbnail");
      return;
    }

    if (!session?.user?.id || !session?.authToken) {
      toast.error("You must be logged in to manage projects");
      return;
    }

    setSubmitting(true);

    try {
      const projectPayload = {
        title: title.trim(),
        link: link.trim().startsWith("http")
          ? link.trim()
          : `https://${link.trim()}`,
        thumbnail: croppedImage,
        description: description.trim(),
        problem: problem.trim(),
        process: process.trim(),
        solution: solution.trim(),
        results: results.trim(),
        brandPersonality: brandPersonality.trim(),
        strategicGoals: strategicGoals.trim(),
        creativeRationale: creativeRationale.trim(),
      };

      if (editingProjectId) {
        // Update project mode
        const result = await vendorApi.updateProject(
          session.user.id,
          editingProjectId,
          session.authToken,
          projectPayload,
        );

        if (result.success) {
          toast.success("Project updated in your portfolio!");
          resetForm();
          await loadProjects();
        } else {
          toast.error(result.message || "Failed to update project");
        }
      } else {
        // Create project mode
        const result = await vendorApi.createProject(
          session.user.id,
          session.authToken,
          projectPayload,
        );

        if (result.success) {
          toast.success("Project added to your portfolio!");
          resetForm();
          await loadProjects();
        } else {
          toast.error(result.message || "Failed to add project");
        }
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete project via API
  const handleDeleteProject = async (projectId: string) => {
    if (!session?.user?.id || !session?.authToken) {
      toast.error("You must be logged in to delete projects");
      return;
    }

    if (!confirm("Are you sure you want to remove this project?")) {
      return;
    }

    try {
      const result = await vendorApi.deleteProject(
        session.user.id,
        projectId,
        session.authToken,
      );

      if (result.success) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        toast.success("Project removed from your portfolio");
        if (editingProjectId === projectId) {
          resetForm();
        }
      } else {
        toast.error(result.message || "Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project. Please try again.");
    }
  };

  return (
    <div className="relative min-h-[500px] pb-12">
      <Toaster position="top-right" richColors />
      <LoadingOverlay isVisible={loading} />

      {!loading && (
        <div className="space-y-12">
          {/* Add/Edit Project Section */}
          <div
            id="project-form-container"
            className="bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 scroll-mt-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center border border-teal-100">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingProjectId ? "Edit Portfolio Project" : "Add New Project"}
                </h2>
                <p className="text-xs text-slate-500">
                  {editingProjectId
                    ? "Update your narrative case study details and thumbnails"
                    : "Showcase your custom developments, designs, or services as a client-converting case study"}
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmitProject}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Form Inputs (Left side) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div>
                    <div className="flex items-center space-x-1.5 mb-2">
                      <label
                        htmlFor="project-title"
                        className="block text-xs font-bold text-slate-500 uppercase tracking-wider"
                      >
                        Project Title
                      </label>
                      <InfoTooltip
                        id="title"
                        text='Keep it descriptive and client-focused (e.g. "Modern Real Estate Mobile App" instead of "Project 1").'
                        activeTooltip={activeTooltip}
                        setActiveTooltip={setActiveTooltip}
                      />
                    </div>
                    <input
                      id="project-title"
                      type="text"
                      value={title}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="e.g. Modern E-Commerce Platform"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-800 transition-all duration-200"
                    />
                  </div>

                  {/* Link */}
                  <div>
                    <div className="flex items-center space-x-1.5 mb-2">
                      <label
                        htmlFor="project-link"
                        className="block text-xs font-bold text-slate-500 uppercase tracking-wider"
                      >
                        Project Link / URL
                      </label>
                      <InfoTooltip
                        id="link"
                        text="Link to the live application, web server, GitHub code repository, or case study document."
                        activeTooltip={activeTooltip}
                        setActiveTooltip={setActiveTooltip}
                      />
                    </div>
                    <input
                      id="project-link"
                      type="text"
                      value={link}
                      onChange={(e) => setProjectLink(e.target.value)}
                      placeholder="e.g. https://myproject.com or github.com/user/project"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-800 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Case Study Section Wrapper */}
                <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                      <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                        Case Study Breakdown (Recommended)
                      </h4>
                    </div>
                    <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                      Attracts 3x More Clients
                    </span>
                  </div>

                  {/* Description Overview */}
                  <div>
                    <div className="flex items-center space-x-1.5 mb-2">
                      <label
                        htmlFor="project-desc"
                        className="block text-xs font-bold text-slate-650"
                      >
                        Brief Project Overview
                      </label>
                      <InfoTooltip
                        id="description"
                        text="Provide a 2-3 sentence introductory hook summarizing the project scope, client, and deliverables."
                        activeTooltip={activeTooltip}
                        setActiveTooltip={setActiveTooltip}
                      />
                    </div>
                    <textarea
                      id="project-desc"
                      rows={3}
                      value={description}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="e.g. Built a custom dashboard mapping client transactions in real-time, helping streamline monthly finance reports."
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-800 transition-all duration-200 resize-y min-h-[96px]"
                    />
                  </div>

                  {/* Problem & Process Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Problem */}
                    <div>
                      <div className="flex items-center space-x-1.5 mb-2">
                        <label
                          htmlFor="project-problem"
                          className="block text-xs font-bold text-slate-650"
                        >
                          The Problem / Challenge
                        </label>
                        <InfoTooltip
                          id="problem"
                          text="Explain the client's initial pain point. What business hurdles or manual bottlenecks were holding them back?"
                          activeTooltip={activeTooltip}
                          setActiveTooltip={setActiveTooltip}
                        />
                      </div>
                      <textarea
                        id="project-problem"
                        rows={4}
                        value={problem}
                        onChange={(e) => setProjectProblem(e.target.value)}
                        placeholder="What problem were they facing? What was at stake?"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-800 transition-all duration-200 resize-y min-h-[110px]"
                      />
                    </div>

                    {/* Process */}
                    <div>
                      <div className="flex items-center space-x-1.5 mb-2">
                        <label
                          htmlFor="project-process"
                          className="block text-xs font-bold text-slate-650"
                        >
                          Your Process & Rationale
                        </label>
                        <InfoTooltip
                          id="process"
                          text="Describe your roadmap, research, user flows, testing, and creative steps. Show your strategic consulting skills!"
                          activeTooltip={activeTooltip}
                          setActiveTooltip={setActiveTooltip}
                        />
                      </div>
                      <textarea
                        id="project-process"
                        rows={4}
                        value={process}
                        onChange={(e) => setProjectProcess(e.target.value)}
                        placeholder="Explain your approach, planning phase, user testing, and workflow strategy."
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-800 transition-all duration-200 resize-y min-h-[110px]"
                      />
                    </div>
                  </div>

                  {/* Solution & Results Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Solution */}
                    <div>
                      <div className="flex items-center space-x-1.5 mb-2">
                        <label
                          htmlFor="project-solution"
                          className="block text-xs font-bold text-slate-650"
                        >
                          The Executed Solution
                        </label>
                        <InfoTooltip
                          id="solution"
                          text="What visual assets, codebase, web integrations, or workflow processes did you deploy to address their challenge?"
                          activeTooltip={activeTooltip}
                          setActiveTooltip={setActiveTooltip}
                        />
                      </div>
                      <textarea
                        id="project-solution"
                        rows={4}
                        value={solution}
                        onChange={(e) => setProjectSolution(e.target.value)}
                        placeholder="Describe the final features, deliverables, and user benefits."
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-800 transition-all duration-200 resize-y min-h-[110px]"
                      />
                    </div>

                    {/* Results */}
                    <div>
                      <div className="flex items-center space-x-1.5 mb-2">
                        <label
                          htmlFor="project-results"
                          className="block text-xs font-bold text-slate-650"
                        >
                          Tangible Results & Impact
                        </label>
                        <InfoTooltip
                          id="results"
                          text="Highlight data, feedback, or metrics showing project success (e.g. 'Boosted signups by 45%' or 'Saved client 10 hrs/week')."
                          activeTooltip={activeTooltip}
                          setActiveTooltip={setActiveTooltip}
                        />
                      </div>
                      <textarea
                        id="project-results"
                        rows={4}
                        value={results}
                        onChange={(e) => setProjectResults(e.target.value)}
                        placeholder="e.g. 24% load speed improvements, positive team feedback, and direct increase in user conversions."
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-800 transition-all duration-200 resize-y min-h-[110px]"
                      />
                    </div>
                  </div>

                  {/* Creative strategy fields */}
                  <div className="border-t border-slate-200/60 pt-4 space-y-4">
                    <h5 className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
                      Creative & Strategic Context
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Brand Personality */}
                      <div>
                        <div className="flex items-center space-x-1.5 mb-2">
                          <label
                            htmlFor="project-brand"
                            className="block text-xs font-bold text-slate-650"
                          >
                            Brand Personality
                          </label>
                        </div>
                        <input
                          id="project-brand"
                          type="text"
                          value={brandPersonality}
                          onChange={(e) => setProjectBrandPersonality(e.target.value)}
                          placeholder="e.g. Sleek, authoritative, high-energy"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-800 transition-all duration-200"
                        />
                      </div>

                      {/* Strategic Goals */}
                      <div>
                        <div className="flex items-center space-x-1.5 mb-2">
                          <label
                            htmlFor="project-goals"
                            className="block text-xs font-bold text-slate-650"
                          >
                            Strategic Business Goals
                          </label>
                        </div>
                        <input
                          id="project-goals"
                          type="text"
                          value={strategicGoals}
                          onChange={(e) => setProjectStrategicGoals(e.target.value)}
                          placeholder="e.g. Increase corporate conversions by 15%"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-800 transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Creative Rationale */}
                    <div>
                      <div className="flex items-center space-x-1.5 mb-2">
                        <label
                          htmlFor="project-rationale"
                          className="block text-xs font-bold text-slate-650"
                        >
                          Creative Design Rationale
                        </label>
                      </div>
                      <textarea
                        id="project-rationale"
                        rows={3}
                        value={creativeRationale}
                        onChange={(e) => setProjectCreativeRationale(e.target.value)}
                        placeholder="Explain why you chose specific color systems, typography layouts, or interface components."
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-800 transition-all duration-200 resize-y min-h-[96px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center px-6 py-3.5 bg-slate-950 hover:bg-slate-850 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-slate-900/10 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    {submitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        {editingProjectId ? "Saving Changes..." : "Adding Project..."}
                      </>
                    ) : (
                      <>
                        {editingProjectId ? (
                          <>
                            <Save className="w-4 h-4 mr-2" /> Save Changes
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" /> Add Project to Portfolio
                          </>
                        )}
                      </>
                    )}
                  </button>

                  {editingProjectId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex items-center justify-center px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all active:scale-95"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Thumbnail Frame & Tip Card (Right side) */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Project Thumbnail
                  </span>

                  {croppedImage ? (
                    <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-slate-200 shadow-sm group mx-auto lg:mx-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={croppedImage}
                        alt="Project cropped thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                        <button
                          type="button"
                          onClick={() => {
                            setCroppedImage(null);
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                          aria-label="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:border-slate-400 hover:bg-slate-50/50 transition-all font-normal animate-fade-in"
                      >
                        <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-xs text-slate-850 font-bold">
                          Upload Thumbnail
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Square, max 200KB limit
                        </span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </>
                  )}
                </div>

                {/* Conversion Tips Card */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center space-x-2 text-slate-800">
                    <BookOpen className="w-5 h-5 text-teal-600" />
                    <h3 className="font-bold text-xs uppercase tracking-wider">
                      Masterclass Setup Tips
                    </h3>
                  </div>

                  <div className="space-y-3.5 text-xs leading-relaxed text-slate-600 font-normal">
                    <div className="flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0 font-bold text-[10px] mt-0.5">
                        1
                      </div>
                      <p>
                        <strong>Define the Target Audience:</strong> Tailor project descriptions using the exact keywords, outcomes, and business challenges your ideal client values.
                      </p>
                    </div>

                    <div className="flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0 font-bold text-[10px] mt-0.5">
                        2
                      </div>
                      <p>
                        <strong>Ditch Gallery Syndrome:</strong> Frame every item with strategic insights. Clickable thumbnail grids convert far less than narrative case studies showing clear outcomes.
                      </p>
                    </div>

                    <div className="flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0 font-bold text-[10px] mt-0.5">
                        3
                      </div>
                      <p>
                        <strong>Problem ➡️ Process ➡️ Solution:</strong> Tell a story. Describe what was holding the client back, your deliberate execution process, and the concrete metrics or results.
                      </p>
                    </div>

                    <div className="flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0 font-bold text-[10px] mt-0.5">
                        4
                      </div>
                      <p>
                        <strong>Consultant Positioning:</strong> Stand out from raw technical coding or design execution. Focus on strategic business objectives and the rationale behind decisions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Cropper Modal */}
          {cropperModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
              <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">
                    Adjust Thumbnail Crop
                  </h3>
                  <span className="px-2.5 py-0.5 bg-teal-50 text-[10px] text-teal-700 rounded-full font-bold border border-teal-100 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Recommended 200px x
                    200px
                  </span>
                </div>

                {/* Image Cropper Area */}
                <div className="p-6 bg-slate-50 flex-grow overflow-hidden flex items-center justify-center min-h-[300px]">
                  {imageToCrop && (
                    <div className="max-w-full max-h-[40vh] overflow-hidden rounded-xl border border-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        ref={imageElementRef}
                        src={imageToCrop}
                        alt="Target crop container"
                        className="max-w-full block"
                      />
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5 text-slate-450">
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Thumbnail file size must not exceed 200KB.</span>
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={handleCancelCrop}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCrop}
                      className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-white rounded-xl font-bold cursor-pointer"
                    >
                      Crop & Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Projects List */}
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Portfolio Projects <span className="text-xs px-2.5 py-1 bg-slate-100 rounded-full font-bold text-slate-500">{projects.length}</span>
            </h3>

            {projects.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-slate-300" />
                </div>
                <h4 className="font-bold text-slate-900 mb-1 text-sm">
                  No projects added yet
                </h4>
                <p className="text-slate-500 text-xs max-w-sm mb-6">
                  Add links and thumbnails using the form above to populate your
                  profile project gallery.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {projects.map((project, index) => (
                  <div
                    key={project.id || `project-${index}`}
                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full relative"
                  >
                    {/* Thumbnail Frame */}
                    <div className="aspect-square w-full bg-slate-50 relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Top Action Overlay buttons */}
                      <div className="absolute top-3 right-3 flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          type="button"
                          onClick={() => startEditProject(project)}
                          className="p-2 bg-white/95 hover:bg-slate-950 hover:text-white text-slate-700 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center"
                          aria-label="Edit project"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 bg-white/95 hover:bg-red-600 hover:text-white text-slate-700 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center"
                          aria-label="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex flex-col flex-grow justify-between">
                      <div className="space-y-1.5">
                        <h4 className="font-extrabold text-slate-900 text-sm line-clamp-2">
                          {project.title}
                        </h4>
                        {project.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {project.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-50 mt-3 flex justify-between items-center">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-[11px] font-bold text-teal-700 hover:text-teal-850"
                        >
                          View Project <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface InfoTooltipProps {
  id: string;
  text: string;
  activeTooltip: string | null;
  setActiveTooltip: (id: string | null) => void;
}

function InfoTooltip({ id, text, activeTooltip, setActiveTooltip }: InfoTooltipProps) {
  const isOpen = activeTooltip === id;

  return (
    <div className="relative inline-block ml-1.5 align-middle">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setActiveTooltip(isOpen ? null : id);
        }}
        onBlur={() => {
          setTimeout(() => setActiveTooltip(null), 150);
        }}
        className="text-slate-400 hover:text-slate-600 focus:text-slate-650 focus:outline-none transition-colors cursor-pointer"
        aria-label="Show help information"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      <div
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-950 text-white text-[11px] p-2.5 rounded-xl transition-all duration-200 shadow-xl z-50 leading-relaxed font-normal text-center pointer-events-none ${
          isOpen
            ? "opacity-100 translate-y-0 visible scale-100"
            : "opacity-0 translate-y-1 invisible scale-95"
        }`}
      >
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950" />
      </div>
    </div>
  );
}
