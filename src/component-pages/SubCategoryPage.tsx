"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import { Button } from "@/app/component/ui/button";
import { Briefcase } from "lucide-react";
import Header from "@/app/component/parts/header";
import PlainHero from "@/app/component/parts/plainHero";
import ShowBizPro from "@/app/component/parts/showBizPro/showBizPro1";
import ProfessionalCard from "@/app/component/parts/professionalCard";

interface Skill {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  providers?: number;
  popular?: boolean;
  rating?: number;
  reviewCount?: number;
  category?: string;
  icon?: string;
}

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId?: string;
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
}

interface SkillsData {
  popularSkills: Skill[];
  allSkills: Skill[];
}

interface SubcategoryPageProps {
  subcategory: Subcategory;
  skills: SkillsData;
}
// Dummy professional data
const dummyProfessionals = [
  {
    _id: "pro1",
    name: "Kwame Osei",
    title: "Senior Web Developer",
    bio: "Experienced in React, Node.js, and full-stack development with 8+ years of experience.",
    location: "Accra, Ghana",
    rating: 4.9,
    reviewCount: 47,
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    skills: ["React", "Node.js", "Next.js", "TypeScript", "MongoDB"],
    priceFrom: 15000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "pro2",
    name: "Amara Okafor",
    title: "UI/UX Developer",
    bio: "Creative developer specializing in user-centered design and responsive web applications.",
    location: "Abuja, Nigeria",
    rating: 4.8,
    reviewCount: 34,
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    skills: [
      "React",
      "CSS/Tailwind",
      "Vue.js",
      "JavaScript",
      "Figma Integration",
    ],
    priceFrom: 12000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "pro3",
    name: "Zuri Mutua",
    title: "Mobile & Web Developer",
    bio: "Expert in React Native and web development with a portfolio of successful applications.",
    location: "Nairobi, Kenya",
    rating: 4.7,
    reviewCount: 29,
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    skills: ["React Native", "React", "JavaScript", "Express.js", "Firebase"],
    priceFrom: 13000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "pro4",
    name: "Thabo Mkhize",
    title: "Full Stack Developer",
    bio: "Specialist in cloud infrastructure and modern web development practices.",
    location: "Johannesburg, South Africa",
    rating: 4.6,
    reviewCount: 25,
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    skills: ["Node.js", "PostgreSQL", "Docker", "Next.js", "GraphQL"],
    priceFrom: 16000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "pro5",
    name: "Ama Benneh",
    title: "Frontend Developer",
    bio: "Proven track record in building responsive and accessible web interfaces.",
    location: "Lagos, Nigeria",
    rating: 4.8,
    reviewCount: 38,
    profileImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop",
    skills: [
      "React",
      "HTML/CSS",
      "JavaScript",
      "Responsive Design",
      "Web APIs",
    ],
    priceFrom: 10000,
    priceCurrency: "₦",
    verified: false,
  },
  {
    _id: "pro6",
    name: "Kofi Asante",
    title: "Backend Developer",
    bio: "Expert in scalable backend systems and database optimization for web applications.",
    location: "Dar es Salaam, Tanzania",
    rating: 4.9,
    reviewCount: 41,
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    skills: ["Python", "Django", "Flask", "REST APIs", "PostgreSQL"],
    priceFrom: 18000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "pro7",
    name: "Naledi Khumalo",
    title: "Web Developer",
    bio: "Expert in modern web technologies and creating high-performance web solutions.",
    location: "Cape Town, South Africa",
    rating: 4.7,
    reviewCount: 32,
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    skills: ["Vue.js", "JavaScript", "Webpack", "Vuex", "REST APIs"],
    priceFrom: 8000,
    priceCurrency: "₦",
    verified: false,
  },
  {
    _id: "pro8",
    name: "Juma Karanja",
    title: "Backend Developer",
    bio: "Specialist in Python, microservices architecture, and scalable web backends.",
    location: "Kampala, Uganda",
    rating: 4.6,
    reviewCount: 27,
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    skills: ["Python", "Django", "Microservices", "Docker", "MongoDB"],
    priceFrom: 14000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "pro9",
    name: "Fatima Hassan",
    title: "Full Stack Developer",
    bio: "Professional with expertise in building complete web solutions from frontend to backend.",
    location: "Dakar, Senegal",
    rating: 4.8,
    reviewCount: 35,
    profileImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop",
    skills: ["React", "Node.js", "Express.js", "MySQL", "JavaScript"],
    priceFrom: 11000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "pro10",
    name: "Sipho Ndlela",
    title: "Frontend Developer",
    bio: "Dedicated specialist in creating robust web applications with modern frameworks.",
    location: "Gaborone, Botswana",
    rating: 4.5,
    reviewCount: 22,
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    skills: ["React", "TypeScript", "Testing", "CSS/Tailwind", "Jest"],
    priceFrom: 9000,
    priceCurrency: "₦",
    verified: false,
  },
  {
    _id: "pro11",
    name: "Abeba Tewolde",
    title: "Web Developer",
    bio: "Creative developer with expertise in both frontend and backend web technologies.",
    location: "Addis Ababa, Ethiopia",
    rating: 4.7,
    reviewCount: 29,
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    skills: ["Angular", "TypeScript", "RxJS", "Node.js", "Express.js"],
    priceFrom: 5000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "pro12",
    name: "Obi Nwosu",
    title: "DevOps & Web Developer",
    bio: "Expert in web infrastructure, deployment, and maintaining high-performance systems.",
    location: "Port Harcourt, Nigeria",
    rating: 4.6,
    reviewCount: 26,
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    skills: ["Docker", "Kubernetes", "Node.js", "CI/CD", "Linux"],
    priceFrom: 13000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "pro13",
    name: "Hadiya Kimani",
    title: "Web Designer & Developer",
    bio: "Talented developer creating stunning and functional web interfaces.",
    location: "Kigali, Rwanda",
    rating: 4.8,
    reviewCount: 37,
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    skills: ["React", "Design Systems", "CSS", "JavaScript", "Storybook"],
    priceFrom: 7000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "pro14",
    name: "Idriss Diallo",
    title: "Full Stack Expert",
    bio: "Professional with deep expertise in complete web application development.",
    location: "Kinshasa, DRC",
    rating: 4.9,
    reviewCount: 44,
    profileImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop",
    skills: ["React", "Node.js", "MongoDB", "GraphQL", "AWS"],
    priceFrom: 20000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "pro15",
    name: "Zainab Traore",
    title: "Frontend Developer",
    bio: "Creative professional specializing in interactive and dynamic web experiences.",
    location: "Bamako, Mali",
    rating: 4.7,
    reviewCount: 31,
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    skills: ["React", "Redux", "SASS", "Webpack", "Performance Optimization"],
    priceFrom: 6000,
    priceCurrency: "₦",
    verified: false,
  },
];
export default function SubcategoryPage({
  subcategory,
  skills,
}: SubcategoryPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "popular">("all");

  const profileNUmbers = 600;
  // Determine which skills to display based on filter
  const displayedSkills =
    filterType === "popular" ? skills.popularSkills : skills.allSkills;

  // Filter skills based on search query
  const filteredSkills = useMemo(() => {
    if (!searchQuery.trim()) return displayedSkills;

    const query = searchQuery.toLowerCase();
    return displayedSkills.filter((skill) =>
      skill.name.toLowerCase().includes(query),
    );
  }, [displayedSkills, searchQuery]);
  return (
    <div>
      {/* Header */}
      <Header variant="transparent" invert={true} />

      {/* Hero Section */}
      <PlainHero
        title={subcategory.name}
        breadcrumbs={[
          { label: "Categories", href: "/categories" },
          {
            label: subcategory.category?.name || "Category",
            href: subcategory.category
              ? `/categories/${subcategory.category.slug}`
              : "/categories",
          },
          { label: subcategory.name },
        ]}
        showSearch={false}
      />

      {/* Show Biz Pro Section */}
      <ShowBizPro
        heading="Got a Project?"
        text={`We have over ${profileNUmbers} skilled professionals ready to help you with your projects. Whether you need a quick task or a long-term partnership, our experts are here to deliver exceptional results.`}
        categoryName={subcategory.name}
        categoryColor="#0F766E"
        profiles={[
          {
            _id: "1",
            name: "Sarah Johnson",
            profileImage:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
          },
          { _id: "2", name: "Michael Chen" },
          {
            _id: "3",
            name: "Emma Davis",
            profileImage:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
          },
          { _id: "4", name: "Alex Rodriguez" },
          { _id: "5", name: "Lisa Anderson" },
        ]}
        totalProfiles={profileNUmbers}
        cta={{ label: "Browse Professionals", href: "#professionals-section" }}
      />

      {/* All Skills Section */}
      <section id="skills-section" className="py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {filterType === "popular"
                ? `Popular in ${subcategory.name}`
                : "All Skills"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              {filterType === "popular"
                ? `Discover the most sought-after ${subcategory.name} skills.`
                : `Discover all available skills in ${subcategory.name.toLowerCase()}.`}
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8 bg-gray-50 p-6 rounded-lg border max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="flex-1 w-full">
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Filter Buttons */}
              {skills.popularSkills.length > 0 && (
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setFilterType("popular")}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                      filterType === "popular"
                        ? "bg-teal-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-slate-300 hover:border-teal-400 hover:text-teal-600"
                    }`}
                  >
                    Popular
                  </button>
                  <button
                    onClick={() => setFilterType("all")}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                      filterType === "all"
                        ? "bg-teal-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-slate-300 hover:border-teal-400 hover:text-teal-600"
                    }`}
                  >
                    All
                  </button>
                </div>
              )}
            </div>
          </div>

          {filteredSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredSkills.map((skill: Skill) => {
                return (
                  <Link
                    key={skill._id}
                    href={`/skills/${skill.slug}`}
                    className="py-2 px-3 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-200 border border-transparent hover:border-teal-200"
                  >
                    {skill.name}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery.trim()
                  ? "No skills match your search"
                  : "No Skills Available"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery.trim()
                  ? "Try a different search term."
                  : "Check back later for new services."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Need Something Specific?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our professionals are ready to
            help with custom solutions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                Contact Us
              </Button>
            </Link>
            {subcategory.category && (
              <Link href={`/categories/${subcategory.category.slug}`}>
                <Button
                  size="lg"
                  className="bg-[var(--indigo)] hover:bg-[var(--indigo)]/70 "
                >
                  Browse Category
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Professionals Section */}
      <section id="professionals-section" className="py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {subcategory.name} Professionals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with top professionals and talents ready to deliver
              quality work
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {dummyProfessionals.map((professional) => (
              <ProfessionalCard
                key={professional._id}
                professional={professional}
              />
            ))}
          </div>
        </div>
        <div className="py-16 text-black text-center">
          <p>
            Want to see more professionals?{" "}
            <Link
              href="#skills-section"
              className="text-teal-600 font-semibold hover:text-teal-700 underline transition-colors"
            >
              Pick a skill
            </Link>{" "}
            and explore the best talents in that area.
          </p>
        </div>
      </section>

      <FooterLinksSection />
    </div>
  );
}
