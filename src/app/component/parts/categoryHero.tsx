import React, { useState, useRef, useEffect } from "react";
import { Home, Search, ArrowRight, MousePointer2, Zap, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Skill {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Breadcrumb {
  label: string;
  href?: string;
}

interface CategoryHeroProps {
  title: string;
  categorySlug: string;
  description?: string;
  breadcrumbs: Breadcrumb[];
  onSearch?: (query: string) => void;
  totalSkills: number;
  skills: Skill[];
}

export default function CategoryHero({
  title,
  categorySlug,
  description,
  breadcrumbs,
  onSearch,
  totalSkills,
  skills,
}: CategoryHeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredSkills = searchQuery.trim() 
    ? skills.filter(skill => 
        skill.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full bg-slate-950 pt-16">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_60%_20%,rgba(20,184,166,0.15)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-[radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.1)_0%,transparent_50%)] pointer-events-none" />

      {/* Grid Lines Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
        }}
      />

      <div className="container-responsive relative z-10 py-5 md:py-5">
        {/* Breadcrumbs - Light version for dark bg */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 ">
          <Link href="/" className="hover:text-slate-300 transition-colors">
            <Home className="h-3.5 w-3.5" />
          </Link>
          <span className="opacity-40">/</span>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-slate-300 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-300 font-medium">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && <span className="opacity-40">/</span>}
            </React.Fragment>
          ))}
        </nav>

        <div className="grid lg:grid-cols-2 gap-16 items-center py-10">
          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400 text-[10px] font-bold uppercase tracking-wider mt-6">
              <Sparkles className="w-3 h-3" />
              <span>{totalSkills}+ skills & services available</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight break-words">
              {title}
            </h1>

            <p className="text-xl text-slate-400 leading-relaxed max-w-xl mb-10">
              {description || `Discover top-rated professionals in ${title}. From quick tasks to complex projects, find exactly what you need on TASA.`}
            </p>

            {/* Glassmorphism Search Bar */}
            <div className="max-w-md relative group mb-6" ref={dropdownRef}>
              <form onSubmit={handleSearch} className="relative z-20">
                <div className="absolute inset-0 bg-teal-500/20 blur-2xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative flex items-center p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                  <Search className="ml-4 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                        if (onSearch) onSearch(e.target.value);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder={`Search in ${title}...`}
                    className="w-full !text-white bg-transparent border-none focus:ring-0 focus:outline-none placeholder-slate-500 px-4 py-3"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-white text-slate-950 font-bold rounded-xl hover:bg-teal-400 transition-all active:scale-95 flex-shrink-0"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {isDropdownOpen && filteredSkills.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20 backdrop-blur-xl"
                  >
                    <div className="p-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 py-2">Suggested Skills</p>
                      {filteredSkills.map((skill) => (
                        <Link
                          key={skill._id}
                          href={`/skills/${skill.slug}`}
                          className="flex items-center justify-between px-4 py-3 hover:bg-white/5 rounded-xl transition-colors group/item"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span className="text-slate-300 group-hover/item:text-white transition-colors">{skill.name}</span>
                          <ArrowRight className="w-4 h-4 text-slate-600 opacity-0 group-hover/item:opacity-100 group-hover/item:text-teal-500 transition-all transform -translate-x-2 group-hover/item:translate-x-0" />
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-slate-500 text-sm mt-3">
                Use search to quickly find relevant skills and top vendors.
              </div>
            </div>
          </motion.div>

          {/* Right Column: Dynamic Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="hidden lg:block relative group h-full"
          >
            <div className="relative z-10 p-4 overflow-hidden">
               <img 
                  src={`/categoryhero/${categorySlug}.png`} 
                  alt={`${title} services`}
                  className="w-full h-full object-cover rounded-[3rem] transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/categoryhero/graphics-design.png'; // Fallback to a known available image
                  }}
               />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
