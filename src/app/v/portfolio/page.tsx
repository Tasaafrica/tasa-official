"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useVendorHeader } from "../layout";
import { 
  Briefcase, 
  Save, 
  Sparkles, 
  Star, 
  User, 
  Eye, 
  Clock, 
  FileText,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { vendorApi, VendorData } from "@/lib/vendor";
import { toast, Toaster } from "sonner";

export default function PortfolioPage() {
  const { setTitle, setDescription } = useVendorHeader();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  
  // State for About Me text
  const [aboutMe, setAboutMe] = useState("");
  const CHARACTER_LIMIT = 1000;

  useEffect(() => {
    setTitle("Portfolio");
    setDescription("Showcase your skills, edit your professional bio, and attract more clients");
  }, [setTitle, setDescription]);

  // Fetch vendor data on mount
  useEffect(() => {
    const loadVendorProfile = async () => {
      if (!session?.user?.id || !session?.authToken) return;
      
      try {
        setLoading(true);
        const result = await vendorApi.getById(
          session.user.id,
          session.authToken
        );
        
        if (result.success && result.data) {
          setVendorData(result.data);
          setAboutMe(result.data.about_me || "");
        } else {
          toast.error(result.message || "Failed to load profile details");
        }
      } catch (error) {
        console.error("Error loading vendor profile:", error);
        toast.error("An error occurred while loading your profile");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id && session?.authToken) {
      loadVendorProfile();
    }
  }, [session]);

  const handleSaveAboutMe = async () => {
    if (!session?.user?.id || !session?.authToken) {
      toast.error("You must be logged in to save your bio");
      return;
    }

    try {
      setSaving(true);
      const result = await vendorApi.updateById(
        session.user.id,
        session.authToken,
        { about_me: aboutMe },
        "PATCH"
      );

      if (result.success) {
        toast.success("About Me updated successfully!");
        if (result.data) {
          setVendorData(result.data);
        }
      } else {
        toast.error(result.message || "Failed to save bio");
      }
    } catch (error) {
      console.error("Error saving about me:", error);
      toast.error("An error occurred while saving your bio");
    } finally {
      setSaving(false);
    }
  };

  const charPercentage = Math.min((aboutMe.length / CHARACTER_LIMIT) * 100, 100);
  const initials = vendorData?.name
    ? vendorData.name.split(/\s+/).filter(Boolean).map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "V";

  return (
    <div className="relative min-h-[500px] pb-12">
      <Toaster position="top-right" richColors />
      <LoadingOverlay isVisible={loading} />

      {/* Main Grid Layout */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Left Column - Editor Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 lg:p-8 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-slate-900/5 rounded-xl flex items-center justify-center text-slate-800">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">About Me</h2>
                <p className="text-xs text-slate-500">Introduce yourself to potential clients</p>
              </div>
            </div>

            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Craft a compelling description of your skills, background, and approach to client work. 
              This is the first thing clients see when visiting your page.
            </p>

            <div className="relative mb-4">
              <textarea
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value.slice(0, CHARACTER_LIMIT))}
                placeholder="Hi! I am a software engineer with 5+ years of experience specializing in custom web and mobile app development..."
                className="w-full h-64 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-100 focus:border-slate-800 transition-all duration-200 resize-none leading-relaxed"
              />
              
              {/* Circular/Linear Progress Bar & Word Counter */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-3 bg-white/95 px-3 py-1.5 rounded-full border border-slate-100 shadow-sm backdrop-blur-sm">
                <div className="w-4 h-4 rounded-full border-2 border-slate-100 relative overflow-hidden flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      stroke={charPercentage > 90 ? "#ef4444" : charPercentage > 75 ? "#f59e0b" : "#10b981"}
                      strokeWidth="2"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 6}`}
                      strokeDashoffset={`${2 * Math.PI * 6 * (1 - charPercentage / 100)}`}
                      className="transition-all duration-300"
                    />
                  </svg>
                </div>
                <span className={`text-[11px] font-semibold ${charPercentage > 90 ? "text-red-500" : "text-slate-500"}`}>
                  {aboutMe.length} / {CHARACTER_LIMIT}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Last updated: {vendorData?.updatedAt ? new Date(vendorData.updatedAt).toLocaleDateString() : "Just now"}</span>
              </div>

              <button
                onClick={handleSaveAboutMe}
                disabled={saving}
                className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    Save About Me
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Premium Live Client Preview */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col justify-between relative overflow-hidden min-h-[480px]">
            {/* Background lighting effects */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-3 py-1.5 rounded-full">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Client View</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] text-slate-400">Profile Preview</span>
                </div>
              </div>

              {/* Vendor Profile Header Mockup */}
              <div className="flex items-center space-x-4 mb-6">
                {vendorData?.profileImage ? (
                  <img
                    src={vendorData.profileImage}
                    alt={vendorData.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10 shadow-inner"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white border-2 border-white/10 shadow-lg">
                    {initials}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-base text-white">{vendorData?.name || "Professional Vendor"}</h3>
                  <p className="text-xs text-slate-400 font-medium mb-1.5">{vendorData?.category || "Specialist Category"}</p>
                  
                  {/* Rating Stars Mock */}
                  <div className="flex items-center space-x-1 bg-white/5 px-2 py-0.5 rounded w-max">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-amber-400">
                      {vendorData?.rating ? vendorData.rating.toFixed(1) : "5.0"}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      ({vendorData?.rating ? "Excellent" : "Verified"})
                    </span>
                  </div>
                </div>
              </div>

              {/* About Me Section Mockup */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 min-h-[180px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-300 font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Professional Bio</span>
                  </div>
                  
                  {aboutMe.trim() ? (
                    <p className="text-xs text-slate-300 leading-relaxed font-light whitespace-pre-line break-words max-h-[160px] overflow-y-auto custom-scrollbar">
                      {aboutMe}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 italic leading-relaxed font-light">
                      No biography written yet. Use the editor to describe your credentials and skills!
                    </p>
                  )}
                </div>

                <div className="border-0 border-t border-white/5 mt-4 pt-3 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Available for Hire</span>
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">TASA Verified</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center text-[10px] text-slate-500 font-medium z-10 border-0 border-t border-white/5 pt-4">
              This card displays a preview of how your bio will appear to prospective clients search and request flows on Tasa.
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Items Management - Elegant Placeholder Grid */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 lg:p-12 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Briefcase className="w-8 h-8 text-slate-400 animate-pulse" />
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 mb-2">Portfolio Management</h2>
        <p className="text-slate-500 text-sm max-w-sm mb-8">
          We are currently building dynamic project showcase tools to help you link completed works to your TASA services.
        </p>
        
        <div className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">
          Coming Soon
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl opacity-40 grayscale">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 transition-all duration-300 hover:scale-95">
               <div className="w-10 h-10 bg-slate-100 rounded-xl mb-3 flex items-center justify-center">
                 <FileText className="w-5 h-5 text-slate-300" />
               </div>
               <div className="w-2/3 h-2.5 bg-slate-200 rounded-full mb-2"></div>
               <div className="w-1/2 h-2 bg-slate-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
