"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Zap, Target, Layers, ArrowRight, Loader2, Frown } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/app/component/parts/header";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/skills/search/${encodeURIComponent(query)}`);
        
        if (!response.ok) throw new Error("Search failed");
        
        const data = await response.json();
        setResults(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Search page error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleNavigate = (item: any) => {
    router.push(`/skills/${item.slug || item._id}`);
  };

  return (
    <div className="container mx-auto px-6 py-12 min-h-[60vh]">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {query ? `Search Results for "${query}"` : "Search Services"}
        </h1>
        <p className="text-slate-500 font-medium">
          {loading ? "Searching..." : `Found ${results.length} results`}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-4" />
          <p className="text-slate-400">Loading results...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleNavigate(item)}
              className="group bg-white border border-slate-200 p-5 rounded-xl hover:border-teal-500 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-teal-50">
                  <Zap className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 truncate group-hover:text-teal-700">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 capitalize">
                    {item.category?.name} • {item.subcategory?.name}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-2xl">
          <Frown className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">No results found</h2>
          <p className="text-slate-500 mt-2">Try a different search term.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="bg-white min-h-screen">
        <Header />
        <main className="pt-24 pb-20">
          <Suspense fallback={null}>
            <SearchResultsContent />
          </Suspense>
        </main>
        <FooterLinksSection />
      </div>
  );
}
