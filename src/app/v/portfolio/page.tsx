"use client";

import Cropper from "cropperjs";
import {
  AlertCircle,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Pencil,
  Plus,
  Save,
  Sparkles,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { vendorApi } from "@/lib/vendor";
import type { VendorProject } from "@/lib/vendor";
import "cropperjs/dist/cropper.css";

export default function PortfolioPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<VendorProject[]>([]);

  // Form state
  const [title, setProjectTitle] = useState("");
  const [link, setProjectLink] = useState("");
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

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

  // Tooltip state
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Cropper states
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropperModalOpen, setCropperModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageElementRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);

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
    <div className="relative min-h-[500px] pb-12 space-y-8">
      <Toaster position="top-right" richColors />
      <LoadingOverlay isVisible={loading} />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Portfolio</h1>
        <p className="mt-1 text-sm text-slate-500">
          Lets build your portfolio, manage and showcase your projects.
        </p>
      </div>

      <hr className="border-t border-slate-200/80" />

      {!loading && (
        <div className="space-y-10">
          {/* Add/Edit Project Section */}
          <div
            id="project-form-container"
            className="scroll-mt-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-800">
                  {editingProjectId ? "Edit Portfolio Project" : "Add New Project"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingProjectId
                    ? "Update your project details and thumbnail"
                    : "Showcase your work and case studies to potential clients"}
                </p>
              </div>
              {editingProjectId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form
              onSubmit={handleSubmitProject}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Form Inputs (Left side) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div>
                    <label
                      htmlFor="project-title"
                      className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                    >
                      Project Title
                    </label>
                    <input
                      id="project-title"
                      type="text"
                      value={title}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="e.g. Modern E-Commerce Platform"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Link */}
                  <div>
                    <label
                      htmlFor="project-link"
                      className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                    >
                      Project Link / URL
                    </label>
                    <input
                      id="project-link"
                      type="text"
                      value={link}
                      onChange={(e) => setProjectLink(e.target.value)}
                      placeholder="e.g. https://myproject.com or github.com/user/project"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Case Study Section (Unboxed) */}
                <div className="pt-4 border-t border-slate-100 space-y-5">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Case Study Details
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Optional breakdown to explain your approach and results
                    </p>
                  </div>

                  {/* Description Overview */}
                  <div>
                    <label
                      htmlFor="project-desc"
                      className="block text-xs font-medium text-slate-700 mb-1.5"
                    >
                      Brief Project Overview
                    </label>
                    <textarea
                      id="project-desc"
                      rows={3}
                      value={description}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="e.g. Built a custom dashboard mapping client transactions in real-time, helping streamline monthly finance reports."
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all resize-y min-h-[80px]"
                    />
                  </div>

                  {/* Problem & Process Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="project-problem"
                        className="block text-xs font-medium text-slate-700 mb-1.5"
                      >
                        The Problem / Challenge
                      </label>
                      <textarea
                        id="project-problem"
                        rows={3}
                        value={problem}
                        onChange={(e) => setProjectProblem(e.target.value)}
                        placeholder="What problem was the client facing?"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all resize-y min-h-[90px]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="project-process"
                        className="block text-xs font-medium text-slate-700 mb-1.5"
                      >
                        Your Process &amp; Rationale
                      </label>
                      <textarea
                        id="project-process"
                        rows={3}
                        value={process}
                        onChange={(e) => setProjectProcess(e.target.value)}
                        placeholder="Explain your approach, planning, and methodology."
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all resize-y min-h-[90px]"
                      />
                    </div>
                  </div>

                  {/* Solution & Results Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="project-solution"
                        className="block text-xs font-medium text-slate-700 mb-1.5"
                      >
                        The Executed Solution
                      </label>
                      <textarea
                        id="project-solution"
                        rows={3}
                        value={solution}
                        onChange={(e) => setProjectSolution(e.target.value)}
                        placeholder="Describe the final features, deliverables, and outcome."
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all resize-y min-h-[90px]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="project-results"
                        className="block text-xs font-medium text-slate-700 mb-1.5"
                      >
                        Results &amp; Impact
                      </label>
                      <textarea
                        id="project-results"
                        rows={3}
                        value={results}
                        onChange={(e) => setProjectResults(e.target.value)}
                        placeholder="e.g. 24% load speed improvements, positive client feedback."
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all resize-y min-h-[90px]"
                      />
                    </div>
                  </div>

                  {/* Creative Strategy fields */}
                  <div className="pt-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="project-brand"
                          className="block text-xs font-medium text-slate-700 mb-1.5"
                        >
                          Brand Personality
                        </label>
                        <input
                          id="project-brand"
                          type="text"
                          value={brandPersonality}
                          onChange={(e) => setProjectBrandPersonality(e.target.value)}
                          placeholder="e.g. Modern, minimal, clean"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="project-goals"
                          className="block text-xs font-medium text-slate-700 mb-1.5"
                        >
                          Strategic Business Goals
                        </label>
                        <input
                          id="project-goals"
                          type="text"
                          value={strategicGoals}
                          onChange={(e) => setProjectStrategicGoals(e.target.value)}
                          placeholder="e.g. Increase conversion rate by 15%"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="project-rationale"
                        className="block text-xs font-medium text-slate-700 mb-1.5"
                      >
                        Creative Design Rationale
                      </label>
                      <textarea
                        id="project-rationale"
                        rows={2}
                        value={creativeRationale}
                        onChange={(e) => setProjectCreativeRationale(e.target.value)}
                        placeholder="Explain key design and architectural decisions."
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all resize-y min-h-[70px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white"
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
                        {editingProjectId ? "Saving..." : "Adding..."}
                      </>
                    ) : (
                      editingProjectId ? "Save Changes" : "Add Project"
                    )}
                  </button>

                  {editingProjectId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-all cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Thumbnail (Right side) */}
              <div className="lg:col-span-4 space-y-3">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Project Thumbnail
                </label>

                {croppedImage ? (
                  <div className="relative w-full max-w-[240px] aspect-square rounded-2xl overflow-hidden border border-slate-200 group">
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
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors cursor-pointer"
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
                      className="w-full max-w-[240px] aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:border-slate-400 hover:bg-slate-50/50 transition-all font-normal"
                    >
                      <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-xs text-slate-700 font-semibold">
                        Upload Thumbnail
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1 block">
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
            </form>
          </div>

          <hr className="border-t border-slate-200/80" />

          {/* Cropper Modal */}
          {cropperModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
              <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 text-sm">
                    Adjust Thumbnail Crop
                  </h3>
                  <span className="px-2.5 py-0.5 bg-slate-100 text-[11px] text-slate-600 rounded-full font-medium">
                    200 × 200px
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
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Max 200KB</span>
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={handleCancelCrop}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCrop}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium cursor-pointer"
                    >
                      Crop &amp; Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Projects List */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              Portfolio Projects{" "}
              <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full font-medium text-slate-500">
                {projects.length}
              </span>
            </h3>

            {projects.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-slate-200 rounded-2xl">
                <h4 className="font-medium text-slate-700 text-sm mb-1">
                  No projects added yet
                </h4>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Add projects above to showcase your work on your public profile.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {projects.map((project, index) => (
                  <div
                    key={project.id || `project-${index}`}
                    className="bg-white rounded-xl border border-slate-200/80 overflow-hidden group flex flex-col h-full relative"
                  >
                    {/* Thumbnail Frame */}
                    <div className="aspect-square w-full bg-slate-50 relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Action Overlay */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          type="button"
                          onClick={() => startEditProject(project)}
                          className="p-1.5 bg-white/95 hover:bg-slate-800 hover:text-white text-slate-700 rounded-lg transition-all shadow-sm flex items-center justify-center cursor-pointer"
                          aria-label="Edit project"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-1.5 bg-white/95 hover:bg-red-600 hover:text-white text-slate-700 rounded-lg transition-all shadow-sm flex items-center justify-center cursor-pointer"
                          aria-label="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex flex-col flex-grow justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-slate-800 text-sm line-clamp-1">
                          {project.title}
                        </h4>
                        {project.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {project.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-100 mt-3 flex justify-between items-center">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-medium text-[var(--color-brand-primary)] hover:underline"
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
