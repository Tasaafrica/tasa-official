"use client";
import Header from "@/app/component/parts/header";
import PopularCategory from "@/app/component/parts/popularCategory";
import SearchModal from "@/app/component/parts/searchModal";
import Link from "next/link";
import { Button } from "@/app/component/ui/button";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import EmailVerificationWrapper from "@/components/layout/EmailVerificationWrapper";
//import type { Category, Subcategory, Skill } from "@/apiTypes";
import { useState } from "react";
import {
  Search,
  Briefcase,
  Zap,
  Users,
  CheckCircle,
  MessageSquare,
  Lightbulb,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  // Search modal state
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <EmailVerificationWrapper>
      <div>
        {/*header*/}
        <Header />
        {/*hero section*/}
        <section className="pt-2 pb-5 md:pt-16 md:h-[calc(100vh-50px)] hero-bg-lg bg-teal-900">
          <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16 text-center md:mt-50 mt-20">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                You Dream It, We Build It
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10">
                The Skill & Service Hub connecting you with skilled
                professionals and exciting opportunities. Find the expertise you
                need, or share your talents with the world.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => setIsSearchModalOpen(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-gray-700 hover:from-teal-700 hover:to-gray-800 text-white shadow-lg"
                >
                  <Search className="mr-2 h-5 w-5" /> Find a Service
                </Button>
                <Link href="/offer-skill">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20"
                  >
                    <Briefcase className="mr-2 h-5 w-5" /> Offer Your Skills
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          {/* Featured Subcategories */}
          <div className="hidden md:block">
            <PopularCategory />
          </div>
        </section>
        {/**category for mobile*/}
        <section className="block md:hidden">
          <PopularCategory layout="vertical" />
        </section>

        {/* Why Choose TASA? Section */}
        <section className="py-16 bg-white text-black">
          <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
            <h2 className="text-3xl font-bold text-center mb-4 text-black">
              Why Choose TASA?
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              We provide a seamless platform for discovering talent and
              opportunities, built on trust and efficiency.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mb-6 mx-auto shadow-sm">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-black">
                  Diverse Skill Pool
                </h3>
                <p className="text-gray-600 text-center">
                  Access a wide range of skills and services from talented
                  individuals and businesses across various industries.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-gray-700 rounded-full mb-6 mx-auto shadow-sm">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-black">
                  Trusted Professionals
                </h3>
                <p className="text-gray-600 text-center">
                  Connect with verified and reviewed experts you can rely on to
                  get the job done right.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-600 to-gray-700 rounded-full mb-6 mx-auto shadow-sm">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-black">
                  Easy & Efficient
                </h3>
                <p className="text-gray-600 text-center">
                  Our user-friendly platform makes finding or offering skills
                  straightforward and hassle-free.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
            <h2 className="text-3xl font-bold text-center mb-4 text-black">
              How It Works
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Getting started with TASA is simple. Follow these easy steps to
              connect and collaborate.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center rounded-xl bg-white shadow-sm border border-gray-200">
              <div className="flex flex-col items-center p-6">
                <div className="relative mb-4">
                  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full text-3xl font-bold shadow-sm">
                    1
                  </div>
                </div>
                <Search className="h-10 w-10 text-teal-600 mb-3" />
                <h3 className="text-xl font-semibold mb-2 text-black">
                  Search or Post
                </h3>
                <p className="text-gray-600">
                  Find the skills you need or list the services you offer with
                  detailed descriptions.
                </p>
              </div>
              <div className="flex flex-col items-center p-6">
                <div className="relative mb-4">
                  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-gray-700 text-white rounded-full text-3xl font-bold shadow-sm">
                    2
                  </div>
                </div>
                <MessageSquare className="h-10 w-10 text-blue-600 mb-3" />
                <h3 className="text-xl font-semibold mb-2 text-black">
                  Connect & Discuss
                </h3>
                <p className="text-gray-600">
                  Communicate directly with professionals or clients to discuss
                  project details and terms.
                </p>
              </div>
              <div className="flex flex-col items-center p-6">
                <div className="relative mb-4">
                  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-600 to-gray-700 text-white rounded-full text-3xl font-bold shadow-sm">
                    3
                  </div>
                </div>
                <Lightbulb className="h-10 w-10 text-teal-600 mb-3" />
                <h3 className="text-xl font-semibold mb-2 text-black">
                  Achieve Your Goals
                </h3>
                <p className="text-gray-600">
                  Collaborate to complete projects, learn new skills, or grow
                  your service business.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Join Our Community Section */}
        <section className="py-16 md:py-24 bg-white text-black">
          <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
              Ready to Get Started?
            </h2>
            <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-600">
              Join the TASA community today. Whether you're looking to hire
              talent or offer your expertise, your next opportunity is just a
              click away.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-gray-700 text-white hover:from-teal-700 hover:to-gray-800 shadow-lg"
                >
                  Sign Up Now <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Learn More About TASA
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <FooterLinksSection />

        {/* Search Modal */}
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
        />
      </div>
    </EmailVerificationWrapper>
  );
}
