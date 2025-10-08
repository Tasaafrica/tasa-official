"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Skill {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  providers?: number;
}

interface PopularSkillsScrollProps {
  skills: Skill[];
  subcategoryName: string;
}

export default function PopularSkillsScroll({
  skills,
  subcategoryName,
}: PopularSkillsScrollProps) {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
        <div className="text-left mb-12">
          <h4 className="text-3xl font-bold text-gray-900 mb-4">
            Popular in {subcategoryName}
          </h4>
        </div>

        <div className="relative">
          <div
            id="popular-skills-scroll"
            className="flex gap-4 overflow-x-auto scrollbar-hide"
            style={{
              height: "120px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {skills.map((skill: Skill) => (
              <Link
                key={skill._id}
                href={`/skills/${skill._id}`}
                className="group flex-shrink-0"
              >
                <div className="bg-white rounded-xl shadow-md border border-gray-200 px-3 py-0 hover:shadow-lg hover:border-teal-300 transition-all duration-200 group-hover:-translate-y-1 h-12 w-auto flex items-center justify-center">
                  <h3 className="text-sm font-semibold text-gray-900 text-center group-hover:text-teal-600 transition-colors flex items-center justify-center">
                    {skill.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Scroll indicators for large devices */}
          <button
            className="hidden lg:block absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => {
              const scrollContainer = document.getElementById(
                "popular-skills-scroll"
              );
              if (scrollContainer) {
                scrollContainer.scrollBy({ left: -300, behavior: "smooth" });
              }
            }}
          >
            <ArrowLeft className="h-5 w-5 text-teal-600" />
          </button>

          <button
            className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => {
              const scrollContainer = document.getElementById(
                "popular-skills-scroll"
              );
              if (scrollContainer) {
                scrollContainer.scrollBy({ left: 300, behavior: "smooth" });
              }
            }}
          >
            <ArrowRight className="h-5 w-5 text-teal-600" />
          </button>
        </div>
      </div>
    </section>
  );
}
