"use client";

import React, { useState } from "react";
import Header from "@/app/component/parts/header";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import { motion } from "framer-motion";
import {
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Globe
} from "lucide-react";

export default function TermsOfServiceClient() {
  const [activeSection, setActiveSection] = useState("introduction");

  const shortcutLinks = [
    { id: "introduction", label: "Introduction" },
    { id: "definitions", label: "Definitions" },
    { id: "user-accounts", label: "User Accounts & Security" },
    { id: "marketplace-rules", label: "Marketplace Guidelines" },
    { id: "prohibited", label: "Prohibited Activities" },
    { id: "disputes", label: "Dispute Resolution" },
    { id: "terms-contact", label: "Contact Us" },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-white font-poppins text-black">
      <Header variant="white" />

      {/* Hero Section */}
      <section className="relative pt-28 pb-10 bg-white text-black overflow-hidden">
        <div className="container-responsive relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-4xl"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold text-black leading-tight mb-3 tracking-tight font-poppins">
              Terms of Service
              <br />
              <span className="px-3 py-1 bg-[#0f766e] text-white text-xs font-semibold rounded-full border border-[#0f766e] inline-block mt-2">
                v2.1 • Updated Sept 8, 2026
              </span>
            </h1>

            {/* Quick Shortcut Navigation Header */}
            <div className="pt-4 border-t border-slate-200 mt-4">
              <div className="text-xs font-bold text-black uppercase tracking-wider mb-3 flex items-center justify-between">
                <span className="text-black">Quick Navigation Shortcuts</span>
              </div>

              <ol className="text-sm md:text-base font-medium text-black space-y-1.5">
                {shortcutLinks.map((link, index) => (
                  <li key={index + 1} className="underline my-1.5 text-black">
                    <a
                      key={link.id}
                      href={`#${link.id}`}
                      onClick={() => setActiveSection(link.id)}
                      className="text-black hover:text-[#0f766e] transition-colors"
                    >
                      <span>{index + 1}{". "}{link.label}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Body */}
      <section className="py-10 lg:py-14 text-black">
        <div className="container-responsive">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Sticky Sidebar (Desktop) */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-5">
                <div>
                  <h3 className="text-xs font-bold text-black uppercase tracking-wider mb-3 px-2">
                    Table of Contents
                  </h3>
                  <nav className="space-y-1">
                    {[
                      { id: "introduction", label: "1. Introduction" },
                      { id: "definitions", label: "2. Definitions" },
                      { id: "user-accounts", label: "3. User Accounts & Security" },
                      { id: "marketplace-rules", label: "4. Marketplace Guidelines" },
                      { id: "prohibited", label: "5. Prohibited Activities" },
                      { id: "disputes", label: "6. Dispute Resolution" },
                      { id: "terms-contact", label: "7. Contact Us" },
                    ].map((item) => {
                      const isActive = activeSection === item.id;
                      return (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          onClick={() => setActiveSection(item.id)}
                          className={`block px-3 py-1.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
                            isActive
                              ? "bg-[#0f766e]/10 text-[#0f766e] font-bold border-l-4 border-[#0f766e]"
                              : "text-black hover:text-[#0f766e] hover:bg-slate-50"
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                        </a>
                      );
                    })}
                  </nav>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs">
                  <div className="font-bold text-black mb-1">
                    Legal & Support Team
                  </div>
                  <p className="text-black text-xs mb-2 leading-relaxed">
                    Have questions about our terms of service, marketplace rules, or policies?
                  </p>
                  <a
                    href="mailto:support@tasaafrica.com"
                    className="inline-flex items-center text-[#0f766e] hover:underline font-semibold text-xs gap-1"
                  >
                    Contact Support
                  </a>
                </div>
              </div>
            </aside>

            {/* Main Policy Content Column (Clean List Format) */}
            <div className="flex-1 max-w-4xl divide-y divide-slate-200/80 text-black">

              {/* 1. Introduction */}
              <section id="introduction" className="scroll-mt-28 py-6 first:pt-0">
                <div className="mb-3">
                  <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-poppins">1. Introduction</h2>
                  <p className="text-xs font-medium text-black">General terms governing your use of TASA Africa</p>
                </div>

                <div className="space-y-3.5 text-sm md:text-base text-black leading-relaxed">
                  <p>
                    Welcome to <strong>TASA Africa</strong>. These Terms of Service (&quot;Terms&quot;) govern your access
                    to and use of the TASA Africa platform, including our website, mobile
                    applications, APIs, and escrow payment services (collectively, the &quot;Platform&quot;).
                  </p>
                  <p>
                    By accessing or using the Platform, you agree to be bound by these
                    Terms and our Privacy Policy. If you are using the Platform on
                    behalf of an organization, you agree to these Terms for that
                    organization and represent that you have the authority to bind that
                    organization to these Terms.
                  </p>
                  <p className="text-xs text-black italic border-t border-slate-200 pt-2.5">
                    Please read these Terms carefully. If you do not agree to these
                    Terms, you may not use our services.
                  </p>
                </div>
              </section>

              {/* 2. Definitions */}
              <section id="definitions" className="scroll-mt-28 py-6">
                <div className="mb-3">
                  <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-poppins">2. Definitions</h2>
                  <p className="text-xs font-medium text-black">Key terminology used in this agreement</p>
                </div>

                <div className="space-y-3.5 text-sm md:text-base text-black leading-relaxed">
                  <p>
                    <strong>&quot;Platform&quot;</strong> refers to the TASA Africa ecosystem, including
                    all web interfaces, mobile applications, and escrow facilities.
                  </p>
                  <p>
                    <strong>&quot;User&quot;</strong> refers to any individual or entity that
                    registers an account or accesses the Platform.
                  </p>
                  <p>
                    <strong>&quot;Vendor&quot;</strong> refers to skilled professionals or agencies offering and executing services through the Platform.
                  </p>
                  <p>
                    <strong>&quot;Client&quot;</strong> refers to individuals or businesses purchasing services or contracting talent through the Platform.
                  </p>
                  <p>
                    <strong>&quot;Service Listing&quot;</strong> refers to a detailed scope of work or gig offered by a Vendor on the Platform.
                  </p>
                </div>
              </section>

              {/* 3. User Accounts & Security */}
              <section id="user-accounts" className="scroll-mt-28 py-6">
                <div className="mb-3">
                  <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-poppins">3. User Accounts & Security</h2>
                  <p className="text-xs font-medium text-black">Account registration, security duties, and credentials</p>
                </div>

                <div className="space-y-3.5 text-sm md:text-base text-black leading-relaxed">
                  <p>
                    To access most features of the Platform, you must register for an
                    account. You agree to provide accurate, current, and complete
                    information during registration and to update such information promptly.
                  </p>
                  <p>
                    You are responsible for maintaining the confidentiality of your
                    account credentials and are fully responsible for all activities
                    that occur under your account. You agree to immediately notify TASA Africa
                    of any unauthorized account access.
                  </p>

                  <div className="bg-slate-50 border-l-4 border-[#0f766e] p-3.5 rounded-r-xl text-sm md:text-base text-black leading-relaxed mt-3">
                    <p className="font-bold text-black flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4.5 h-4.5 text-[#0f766e] shrink-0" /> Account Safety Tip:
                    </p>
                    <p className="text-xs md:text-sm text-black">
                      Always use a strong, unique password and enable two-factor authentication to protect your personal and financial credentials.
                    </p>
                  </div>
                </div>
              </section>

              {/* 4. Marketplace Guidelines */}
              <section id="marketplace-rules" className="scroll-mt-28 py-6">
                <div className="mb-3">
                  <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-poppins">4. Marketplace Guidelines</h2>
                  <p className="text-xs font-medium text-black">Rules governing client and vendor engagement</p>
                </div>

                <div className="space-y-3.5 text-sm md:text-base text-black leading-relaxed">
                  <p>
                    TASA Africa acts as a digital bridge connecting Vendors and Clients across Africa and internationally. Except where explicitly stated, TASA Africa is not a party to the independent contract between Users.
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm md:text-base text-black">
                    <li>
                      <strong>Professionalism:</strong> All users must maintain respectful, ethical, and professional conduct at all times.
                    </li>
                    <li>
                      <strong>Quality Assurance:</strong> Vendors are required to deliver completed milestones that match or exceed their service listing descriptions.
                    </li>
                    <li>
                      <strong>Escrow Payments:</strong> Payments are held securely in escrow and released upon client milestone sign-off.
                    </li>
                  </ul>
                </div>
              </section>

              {/* 5. Prohibited Activities */}
              <section id="prohibited" className="scroll-mt-28 py-6">
                <div className="mb-3">
                  <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-poppins">5. Prohibited Activities</h2>
                  <p className="text-xs font-medium text-black">Strict platform restrictions and enforcement</p>
                </div>

                <div className="space-y-3.5 text-sm md:text-base text-black leading-relaxed">
                  <p>Users are strictly prohibited from:</p>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm md:text-base text-black">
                    <li>
                      Engaging in fraudulent, deceptive, or money laundering behavior.
                    </li>
                    <li>
                      Posting illegal, offensive, explicit, or intellectual property infringing content.
                    </li>
                    <li>
                      Attempting off-platform payments to circumvent escrow protection.
                    </li>
                    <li>
                      Interfering with the technical infrastructure or scraping user data without authorization.
                    </li>
                  </ul>

                  <div className="bg-slate-50 border-l-4 border-amber-600 p-3.5 rounded-r-xl text-sm text-black leading-relaxed mt-3 flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-black block mb-0.5">Enforcement Warning:</span>
                      Violation of these guidelines may result in immediate account suspension, escrow withholding, or permanent termination without prior notice.
                    </div>
                  </div>
                </div>
              </section>

              {/* 6. Dispute Resolution */}
              <section id="disputes" className="scroll-mt-28 py-6">
                <div className="mb-3">
                  <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-poppins">6. Dispute Resolution</h2>
                  <p className="text-xs font-medium text-black">Fair resolution process for contract disagreements</p>
                </div>

                <div className="space-y-3.5 text-sm md:text-base text-black leading-relaxed">
                  <p>
                    In the event of a disagreement between a Client and a Vendor, TASA Africa provides an internal escrow dispute resolution mechanism. Users agree to cooperate in good faith with TASA Africa&apos;s support team.
                  </p>
                  <p>
                    If a dispute cannot be resolved through internal mediation, it shall be governed by applicable legal frameworks and arbitration procedures in accordance with TASA Africa operating entities.
                  </p>
                </div>
              </section>

              {/* 7. Contact Us */}
              <section id="terms-contact" className="scroll-mt-28 py-6">
                <div className="mb-3">
                  <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-poppins">7. Contact Us</h2>
                  <p className="text-xs font-medium text-black">Inquiries regarding these Terms of Service</p>
                </div>

                <div className="space-y-3.5 text-sm md:text-base text-black leading-relaxed">
                  <p>
                    If you have questions regarding these Terms of Service, marketplace policies, or contract guidelines, contact our Legal and Support team:
                  </p>

                  <ul className="space-y-2.5 pt-1 text-sm md:text-base text-black">
                    <li className="flex items-center gap-2.5">
                      <Mail className="w-4.5 h-4.5 text-[#0f766e] shrink-0" />
                      <span><strong>Email:</strong> <a href="mailto:support@tasaafrica.com" className="text-black hover:text-[#0f766e] underline">support@tasaafrica.com</a></span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <MapPin className="w-4.5 h-4.5 text-[#0f766e] shrink-0" />
                      <span><strong>Address:</strong> Lagos, Nigeria</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Globe className="w-4.5 h-4.5 text-[#0f766e] shrink-0" />
                      <span><strong>Website:</strong> <a href="https://tasaafrica.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#0f766e] underline">www.tasaafrica.com</a></span>
                    </li>
                  </ul>

                  <div className="pt-3 border-t border-slate-200 text-xs text-black flex items-center gap-2 italic">
                    <span>Our Legal and Support team reviews all inquiries within <strong>24 - 48 business hours</strong>.</span>
                  </div>
                </div>
              </section>

            </div>

          </div>
        </div>
      </section>

      <FooterLinksSection />
    </div>
  );
}
