"use client";

import { useState } from "react";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

const WHY_TASA_ITEMS = [
  {
    title: "Diverse Skill Pool",
    summary:
      "Access a wide range of skills and services from talented individuals and businesses across various industries.",
    detail:
      "Discover specialists across design, development, marketing, and more—ready to take your project from idea to execution.",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1200",
    icon: Sparkles,
  },
  {
    title: "Trusted Professionals",
    summary:
      "Connect with verified and reviewed experts you can rely on to get the job done right.",
    detail:
      "Work with top-rated professionals backed by profiles, reviews, and transparent portfolios you can trust.",
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1200",
    icon: ShieldCheck,
  },
  {
    title: "Easy & Efficient",
    summary:
      "Our user-friendly platform makes finding or offering skills straightforward and hassle-free.",
    detail:
      "Post, connect, and deliver faster with streamlined workflows designed to keep projects moving.",
    imageUrl:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1200",
    icon: Zap,
  },
];

export default function WhyChooseTasa() {
  const [activeIndex, setActiveIndex] = useState(1);
  const active = WHY_TASA_ITEMS[activeIndex];

  return (
    <section className="py-16 bg-white text-black">
      <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          <div className="w-full lg:w-[360px] flex flex-col gap-4">
            {WHY_TASA_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === activeIndex;
              const isPrimary = index === 0;

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`text-left rounded-2xl border px-5 py-4 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/30 ${
                    isActive
                      ? "border-[#0F766E] bg-teal-50 shadow-[0_10px_24px_rgba(15,118,110,0.18)]"
                      : "border-slate-200 bg-white hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(15,23,42,0.12)]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        isActive ? "bg-[#0F766E]" : "bg-slate-100"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isActive ? "text-white" : "text-slate-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="w-full lg:flex-1 flex lg:justify-start">
            <div className="w-full max-w-[680px] rounded-3xl border border-slate-200 bg-slate-50 shadow-[0_18px_40px_rgba(15,23,42,0.12)] overflow-hidden">
              <div className="relative aspect-[15/9] bg-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.imageUrl}
                  alt={active.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="px-6 py-6">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                  Why Choose TASA
                </p>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {active.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {active.detail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
