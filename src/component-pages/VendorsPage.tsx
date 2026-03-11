"use client";

import Header from "@/app/component/parts/header";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import PlainHero from "@/app/component/parts/plainHero";
import Separator from "@/app/component/ui/separator";
import { Button } from "@/app/component/ui/button";
import { Star, MapPin, CheckCircle, Code, Award, Users } from "lucide-react";
import Link from "next/link";

interface Professional {
  _id: string;
  name: string;
  title: string;
  bio: string;
  location: string;
  rating: number;
  reviewCount: number;
  profileImage: string;
  skills: string[];
  priceFrom: number;
  priceCurrency: string;
  verified: boolean;
}

interface VendorsPageProps {
  professional: Professional;
}

export default function VendorsPage({ professional }: VendorsPageProps) {
  const {
    _id,
    name,
    title,
    bio,
    location,
    rating,
    reviewCount,
    profileImage,
    skills,
    priceFrom,
    priceCurrency,
    verified,
  } = professional;

  return (
    <div>
      <Header variant="transparent" invert={true} />

      <PlainHero
        title={name}
        description={title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Professionals" },
          { label: name },
        ]}
      />

      <Separator />

      {/* Vendor Profile Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <img
                  src={profileImage}
                  alt={name}
                  className="w-64 h-64 rounded-xl object-cover shadow-lg border-4 border-teal-100"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {name}
                    </h1>
                    <p className="text-xl text-teal-600 font-semibold mb-4">
                      {title}
                    </p>
                  </div>
                  {verified && (
                    <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-full">
                      <CheckCircle className="w-5 h-5 text-teal-600" />
                      <span className="text-sm font-semibold text-teal-600">
                        Verified
                      </span>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <MapPin className="w-5 h-5 text-teal-600" />
                  <span className="text-lg">{location}</span>
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : i < rating
                                  ? "fill-yellow-400 text-yellow-400 opacity-50"
                                  : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        {rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      Based on {reviewCount} review
                      {reviewCount !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="bg-teal-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Hire Price</p>
                      <p className="text-2xl font-bold text-teal-600">
                        From {priceCurrency}
                        {priceFrom.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">
                        Expertise Areas
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {skills.length}+
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-4">
                  <Link href="#contact" className="flex-1">
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 text-lg py-6">
                      Hire Now
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="flex-1 border-teal-600 text-teal-600 hover:bg-teal-50 text-lg py-6"
                  >
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">About</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">{bio}</p>

            {/* Key Highlights */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex gap-4">
                <Award className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Experienced Professional
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Years of proven expertise in their field
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Users className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Client Focused
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {reviewCount}+ satisfied clients trust their work
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Code className="w-6 h-6 text-teal-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Quality Driven
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Rated {rating.toFixed(1)} out of 5 stars
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full font-medium text-sm hover:bg-teal-200 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-16 bg-gradient-to-r from-teal-50 to-blue-50"
      >
        <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Work Together?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Get in touch with {name} to discuss your project and get a
                personalized quote.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-teal-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Starting Rate
                  </h3>
                  <p className="text-3xl font-bold text-teal-600">
                    {priceCurrency}
                    {priceFrom.toLocaleString()}
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    Contact for custom project pricing
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Availability
                  </h3>
                  <p className="text-lg font-semibold text-blue-600">
                    Available Now
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    Ready to start your project immediately
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-lg py-6">
                  Send Project Brief
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-teal-600 text-teal-600 hover:bg-teal-50 text-lg py-6"
                >
                  Schedule a Call
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterLinksSection />
    </div>
  );
}
