"use client";

import React, { useState } from "react";
import Header from "@/app/component/parts/header";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import { motion } from "framer-motion";
import {
  Mail,
  Clock,
  CheckCircle2,
  MapPin,
  Globe
} from "lucide-react";

export default function PrivacyPolicyClient() {
  const [activeSection, setActiveSection] = useState("overview");

  const shortcutLinks = [
    { id: "overview", label: "Overview & Scope" },
    { id: "collection", label: "Data We Collect" },
    { id: "usage", label: "How We Use Data" },
    { id: "regional-compliance", label: "Regional Laws (NDPA, POPIA, GDPR, CCPA)" },
    { id: "sharing", label: "Third-Party Sharing" },
    { id: "cookies", label: "Cookies & Tracking" },
    { id: "retention", label: "Data Retention" },
    { id: "privacy-contact", label: "Contact Us" },
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
              Privacy Policy
              <br />
              <span className="px-3 py-1 bg-[#0f766e] text-white text-xs font-semibold rounded-full border border-[#0f766e] inline-block mt-2">
                v2.0 • Updated Sept 8, 2026
              </span>
            </h1>

            {/* Quick Shortcut Pills Header */}
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
                      { id: "overview", label: "1. Overview & Scope" },
                      { id: "legal-basis", label: "2. Legal Bases for Processing" },
                      { id: "collection", label: "3. Information We Collect" },
                      { id: "usage", label: "4. How We Use Data" },
                      { id: "regional-compliance", label: "5. Regional Privacy Laws" },
                      { id: "sharing", label: "6. Third-Party Data Sharing" },
                      { id: "cookies", label: "7. Cookies & Telemetry" },
                      { id: "retention", label: "8. Data Retention & Erasure" },
                      { id: "security", label: "9. Data Security" },
                      { id: "children", label: "10. Children's Privacy" },
                      { id: "privacy-contact", label: "11. Contact Us" },
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
                    Data Protection Officer
                  </div>
                  <p className="text-black text-xs mb-2 leading-relaxed">
                    Have questions about your personal data rights or privacy concerns?
                  </p>
                  <a
                    href="mailto:privacy@tasaafrica.com"
                    className="inline-flex items-center text-[#0f766e] hover:underline font-semibold text-xs gap-1"
                  >
                    Contact Data Protection Officer
                  </a>
                </div>
              </div>
            </aside>

            {/* Main Policy Content Column (Clean List Format) */}
            <div className="flex-1 max-w-4xl divide-y divide-slate-200/80 text-black">

              {/* 1. Overview & Scope */}
              <section id="overview" className="scroll-mt-28 py-6 first:pt-0">
                <div className="mb-3">
                  <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-poppins">1. Overview & Scope</h2>
                  <p className="text-xs font-medium text-black">Legal applicability across web, mobile apps, and services</p>
                </div>

                <div className="bg-slate-50 border-l-4 border-[#0f766e] p-3.5 rounded-r-xl mb-5 text-sm md:text-base text-black leading-relaxed">
                  <span className="font-bold text-black block mb-1">TL;DR Key Summary:</span>
                  TASA Africa operates a global freelance marketplace connecting Clients with Vendors across Africa and internationally. This Privacy Policy details how we handle personal information collected via our website, mobile application, APIs, and escrow payment systems.
                </div>

                <div className="space-y-3.5 text-sm md:text-base text-black leading-relaxed">
                  <p>
                    <strong>TASA Africa</strong> (“TASA”, “we”, “us”, or “our”) is committed to maintaining the trust and confidence of our users globally. This Privacy Policy applies to all individuals who access or use our services, including:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm md:text-base text-black">
                    <li><strong>Clients:</strong> Individuals or entities seeking freelance services, contracting talent, or making payments.</li>
                    <li><strong>Vendors / Freelancers:</strong> Professionals listing service offerings, building portfolios, or executing projects.</li>
                    <li><strong>Platform Visitors:</strong> Anyone browsing our web applications or downloading our mobile apps.</li>
                  </ul>
                  <p className="text-xs text-black italic border-t border-slate-200 pt-2.5">
                    By accessing or using TASA Africa platforms, you acknowledge that you have read, understood, and agree to the data collection and processing practices described herein.
                  </p>
                </div>
              </section>

              {/* 2. Legal Bases for Processing */}
              <section id="legal-basis" className="scroll-mt-28 py-6">
                <div className="mb-3">
                  <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-poppins">2. Legal Bases for Data Processing</h2>
                  <p className="text-xs font-medium text-black">Lawful grounds under NDPA 2023, GDPR Article 6, and international law</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-sm text-black">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="font-bold text-black mb-1 flex items-center gap-2 text-sm md:text-base">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" /> Performance of Contract
                    </div>
                    <p className="text-black text-xs md:text-sm leading-relaxed">
                      Processing necessary to fulfill service agreements between Clients and Vendors, handle escrow disbursements, and deliver platform functionality.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="font-bold text-black mb-1 flex items-center gap-2 text-sm md:text-base">
                      <CheckCircle2 className="w-4.5 h-4.5 text-[#0f766e] shrink-0" /> Explicit Consent
                    </div>
                    <p className="text-black text-xs md:text-sm leading-relaxed">
                      Where you provide clear affirmative consent for marketing communications, non-essential cookie tracking, or optional profile badges.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="font-bold text-black mb-1 flex items-center gap-2 text-sm md:text-base">
                      <CheckCircle2 className="w-4.5 h-4.5 text-amber-600 shrink-0" /> Legal & Regulatory Obligation
                    </div>
                    <p className="text-black text-xs md:text-sm leading-relaxed">
                      Compliance with Know-Your-Customer (KYC), Anti-Money Laundering (AML), tax reporting, Central Bank regulations, and NDPC statutory duties.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="font-bold text-black mb-1 flex items-center gap-2 text-sm md:text-base">
                      <CheckCircle2 className="w-4.5 h-4.5 text-purple-600 shrink-0" /> Legitimate Interests
                    </div>
                    <p className="text-black text-xs md:text-sm leading-relaxed">
                      Protecting our platform against fraud, securing technical infrastructure, preventing account takeover, and improving marketplace UX.
                    </p>
                  </div>
                </div>
              </section>

              {/* 3. Information We Collect */}
              <section id="collection" className="scroll-mt-28 py-6">
                <div className="mb-3">
                  <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-poppins">3. Information We Collect</h2>
                  <p className="text-xs font-medium text-black">Granular breakdown for Clients, Vendors, and Mobile App users</p>
                </div>

                <div className="space-y-5 text-sm md:text-base text-black">
                  {/* Category 1 */}
                  <div>
                    <h3 className="text-base font-bold text-black mb-1.5">
                      A. Account & Identity Verification (KYC)
                    </h3>
                    <p className="text-sm text-black mb-2 leading-relaxed">
                      To build trust and comply with statutory financial requirements across Nigeria, Africa, and global markets, we collect:
                    </p>
                    <ul className="list-disc pl-5 text-sm md:text-base text-black space-y-1.5">
                      <li>Full Legal Name, Email Address, Phone Number, Country of Residence.</li>
                      <li>Government-issued ID documents (Passport, National Identity Number / NIN, Voter ID, BVN verification for payout compliance in Nigeria where required by financial regulators).</li>
                      <li>Profile photographs, professional bio, and account authentication credentials.</li>
                    </ul>
                  </div>

                  {/* Category 2 */}
                  <div className="pt-3.5 border-t border-slate-200">
                    <h3 className="text-base font-bold text-black mb-2">
                      B. Client vs. Vendor Specific Data
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm text-black">
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                        <span className="font-bold text-[#0f766e] block mb-1">For Vendors / Freelancers:</span>
                        Service portfolio items, hourly rates, skill certifications, past work history, payout bank account details, and ratings/reviews.
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
                        <span className="font-bold text-emerald-800 block mb-1">For Clients:</span>
                        Project briefs, budget specifications, organization name, payment billing address, contract milestones, and review feedback.
                      </div>
                    </div>
                  </div>

                  {/* Category 3 */}
                  <div className="pt-3.5 border-t border-slate-200">
                    <h3 className="text-base font-bold text-black mb-1.5">
                      C. Mobile Application & Technical Telemetry
                    </h3>
                    <p className="text-sm text-black leading-relaxed mb-2">
                      When accessing TASA Africa via our iOS/Android mobile applications or web apps:
                    </p>
                    <ul className="list-disc pl-5 text-sm md:text-base text-black space-y-1.5">
                      <li><strong>Device Information:</strong> Device hardware model, operating system version, unique device identifiers (IDFA/GAID), app version.</li>
                      <li><strong>Usage & Crash Metrics:</strong> Application event logs, crash reports, performance analytics.</li>
                      <li><strong>Location Data:</strong> Approximate location (via IP) for currency/locale setting; precise location only if voluntarily enabled for proximity-based vendor discovery.</li>
                      <li><strong>Push Notifications:</strong> Device tokens used to send project alerts, contract updates, and messaging notifications.</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 4. How We Use Data */}
              <section id="usage" className="scroll-mt-28 py-6">
                <div className="mb-3">
                  <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-poppins">4. How We Use & Protect Your Information</h2>
                  <p className="text-xs font-medium text-black">Core operational purposes and safety mechanisms</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-sm text-black">
                  <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-[#0f766e] mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-black block mb-0.5 text-sm md:text-base">Platform Operation & Escrow</span>
                      Facilitating job postings, matching clients with suitable African vendors, executing escrow payments, and managing disputes.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-black block mb-0.5 text-sm md:text-base">Trust, Security & Verification</span>
                      Verifying vendor credentials, preventing identity fraud, detecting unauthorized access, and maintaining platform integrity.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-black block mb-0.5 text-sm md:text-base">Communication & Support</span>
                      Sending project status notifications, security alerts, system updates, and assisting with customer support inquiries.
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-black block mb-0.5 text-sm md:text-base">Regulatory Compliance</span>
                      Fulfilling tax withholding, anti-money laundering regulations, and compliance reporting across legal jurisdictions.
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. Regional Privacy Laws (NDPA, POPIA, GDPR, CCPA) */}
              <section id="regional-compliance" className="scroll-mt-28 py-6">
                <div className="mb-3">
                  <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-poppins">5. Regional Privacy Laws & Addendums</h2>
                  <p className="text-xs font-medium text-black">Provisions tailored for Nigeria, Pan-Africa, Europe, UK, and North America</p>
                </div>

                <div className="space-y-5 text-sm md:text-base text-black">

                  {/* Nigeria NDPA */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-emerald-200/70">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm md:text-base font-bold text-black flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-mono text-[11px]">NIGERIA</span>
                        Nigeria Data Protection Act (NDPA 2023)
                      </h3>
                      <span className="text-xs text-emerald-800 font-bold">NDPC Compliant</span>
                    </div>
                    <p className="leading-relaxed mb-2 text-sm md:text-base text-black">
                      For data subjects located in Nigeria, TASA Africa strictly complies with the <strong>Nigeria Data Protection Act 2023 (NDPA)</strong> and guidelines issued by the Nigeria Data Protection Commission (NDPC):
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-black">
                      <li><strong>Data Subject Rights:</strong> Right to object to processing, right to withdraw consent at any time without penalty, right to request restriction, and right to lodge a complaint directly with the NDPC.</li>
                      <li><strong>Lawful Safeguards:</strong> Personal data is processed in accordance with strict principles of accountability, data minimization, and purpose limitation.</li>
                      <li><strong>Cross-Border Data Transfers:</strong> Any transfer of Nigerian residents&apos; data outside Nigeria is protected through adequate legal mechanisms in compliance with NDPA Section 41.</li>
                    </ul>
                  </div>

                  {/* Pan-Africa (POPIA, Kenya, Ghana, AU Malabo) */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-teal-200/70">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm md:text-base font-bold text-black flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-teal-100 text-teal-900 rounded font-mono text-[11px]">PAN-AFRICA</span>
                        POPIA (South Africa) & AU Malabo Framework
                      </h3>
                      <span className="text-xs text-[#0f766e] font-bold">African Union Aligned</span>
                    </div>
                    <p className="leading-relaxed mb-2 text-sm md:text-base text-black">
                      TASA Africa operates across the African continent and aligns with major national data privacy legislation and pan-African frameworks:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-black">
                      <li><strong>South Africa (POPIA):</strong> Compliance with the Protection of Personal Information Act, ensuring conditionality for lawful processing of special personal information.</li>
                      <li><strong>Kenya & Ghana:</strong> Full alignment with Kenya DPA 2019 and Ghana Data Protection Act 2012 (Act 843).</li>
                      <li><strong>African Union Malabo Convention:</strong> TASA Africa upholds the principles of the AU Convention on Cyber Security and Personal Data Protection across all operating African jurisdictions.</li>
                    </ul>
                  </div>

                  {/* Europe & UK GDPR */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm md:text-base font-bold text-black flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#0f766e]/10 text-[#0f766e] rounded font-mono text-[11px]">EU / UK</span>
                        EU & UK General Data Protection Regulation (GDPR)
                      </h3>
                      <span className="text-xs text-[#0f766e] font-bold">GDPR Compliant</span>
                    </div>
                    <p className="leading-relaxed mb-2 text-sm md:text-base text-black">
                      If you reside in the European Economic Area (EEA) or the United Kingdom, you possess guaranteed legal rights under Articles 15-22 of the GDPR:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-semibold text-black">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">1. Right of Access</div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">2. Right to Erasure</div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">3. Data Portability</div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">4. Right to Rectify</div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">5. Right to Object</div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">6. Restriction</div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">7. Withdraw Consent</div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">8. Lodge Complaint</div>
                    </div>
                    <p className="text-xs md:text-sm mt-2 text-black">
                      Transfers of EEA/UK data outside those regions utilize Standard Contractual Clauses (SCCs) approved by the European Commission.
                    </p>
                  </div>

                  {/* US CCPA / CPRA */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-purple-200/70">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm md:text-base font-bold text-black flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-900 rounded font-mono text-[11px]">UNITED STATES</span>
                        California Consumer Privacy Act (CCPA / CPRA)
                      </h3>
                      <span className="text-xs text-purple-900 font-bold">No Data Selling</span>
                    </div>
                    <p className="leading-relaxed mb-1.5 text-sm md:text-base text-black">
                      For California and US residents: <strong>TASA Africa DOES NOT sell or share your personal data for monetary or third-party commercial consideration.</strong> You have the right to request disclosure of categories of data collected, request deletion, and exercise rights without discriminatory service pricing.
                    </p>
                  </div>

                </div>
              </section>

              {/* 6. Third-Party Data Sharing */}
              <section id="sharing" className="scroll-mt-28 py-6">
                <div className="mb-3">
                  <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-poppins">6. Third-Party Sub-Processors & Sharing</h2>
                  <p className="text-xs font-medium text-black">Authorized external service providers</p>
                </div>

                <div className="space-y-3.5 text-sm md:text-base text-black">
                  <p className="leading-relaxed">
                    We strictly vet and contract third-party vendors (sub-processors) bound by strict non-disclosure and data protection agreements:
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs md:text-sm border-collapse text-black">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-black font-bold">
                          <th className="py-2.5 px-3">Sub-Processor Category</th>
                          <th className="py-2.5 px-3">Example Partners</th>
                          <th className="py-2.5 px-3">Data Handled</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-black">
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-black">Escrow & Payment Gateways</td>
                          <td className="py-2.5 px-3">Paystack, Flutterwave, Stripe</td>
                          <td className="py-2.5 px-3 text-black">Transaction data, payout accounts, card tokens</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-black">Cloud Infrastructure</td>
                          <td className="py-2.5 px-3">AWS, Vercel, Google Cloud</td>
                          <td className="py-2.5 px-3 text-black">Encrypted application databases & storage</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-black">KYC & Identity Verification</td>
                          <td className="py-2.5 px-3">IdentityPass, Smile ID</td>
                          <td className="py-2.5 px-3 text-black">Government ID validation, NIN/BVN cross-check</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-black">Push & SMS Messaging</td>
                          <td className="py-2.5 px-3">Twilio, Termii, Firebase</td>
                          <td className="py-2.5 px-3 text-black">Phone numbers, push tokens, alert content</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* 7. Cookies & Tracking */}
              <section id="cookies" className="scroll-mt-28 py-6">
                <div className="mb-3">
                  <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-poppins">7. Cookies & Tracking Technologies</h2>
                  <p className="text-xs font-medium text-black">Managing web cookies, session tokens, and analytics</p>
                </div>

                <div className="space-y-3.5 text-sm md:text-base text-black leading-relaxed">
                  <p>
                    We use cookies, local storage, and web beacons to enhance session security, maintain login persistence, and collect performance metrics.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs md:text-sm text-black">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-black text-sm block mb-1">Strictly Necessary</span>
                      Essential for authentication, CSRF security tokens, and account access. Cannot be disabled.
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-black text-sm block mb-1">Performance & Analytics</span>
                      Anonymized telemetry to evaluate platform speed, page load performance, and UI responsiveness.
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="font-bold text-black text-sm block mb-1">Functional & Preference</span>
                      Remembers language, local currency preference (e.g. NGN, KES, ZAR, USD), and theme modes.
                    </div>
                  </div>
                </div>
              </section>

              {/* 8. Data Retention & Erasure Schedule */}
              <section id="retention" className="scroll-mt-28 py-6">
                <div className="mb-3">
                  <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-poppins">8. Data Retention & Erasure Schedule</h2>
                  <p className="text-xs font-medium text-black">Clear timelines for data storage and deletion</p>
                </div>

                <div className="space-y-3.5 text-sm md:text-base text-black">
                  <p className="leading-relaxed">
                    We retain personal data only as long as necessary to fulfill marketplace contracts and comply with legal retention requirements:
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs md:text-sm border-collapse text-black">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-black font-bold">
                          <th className="py-2.5 px-3">Data Category</th>
                          <th className="py-2.5 px-3">Retention Period</th>
                          <th className="py-2.5 px-3">Deletion Trigger</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-black">
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-black">Active Profile & Portfolio Data</td>
                          <td className="py-2.5 px-3">Duration of Active Account</td>
                          <td className="py-2.5 px-3 text-black">Account Deletion Request</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-black">Financial & Escrow Invoices</td>
                          <td className="py-2.5 px-3">7 Years (Tax/CBN Law)</td>
                          <td className="py-2.5 px-3 text-black">Statutory Tax Expiry</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-black">KYC Verification Documents</td>
                          <td className="py-2.5 px-3">5 Years post-account close</td>
                          <td className="py-2.5 px-3 text-black">AML Statutory Expiry</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-black">Server Logs & Crash Telemetry</td>
                          <td className="py-2.5 px-3">90 Days</td>
                          <td className="py-2.5 px-3 text-black">Automatic Log Rotation</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* 9. Data Security */}
              <section id="security" className="scroll-mt-28 py-6">
                <div className="mb-3">
                  <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-poppins">9. Data Security Architecture</h2>
                  <p className="text-xs font-medium text-black">Enterprise-grade encryption and technical safeguards</p>
                </div>

                <div className="space-y-3.5 text-sm md:text-base text-black leading-relaxed">
                  <p>
                    TASA Africa employs robust technical and organizational security measures:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm md:text-base text-black">
                    <li><strong>Encryption Standards:</strong> Data in transit is protected via TLS 1.3 encryption. Data at rest is encrypted using AES-256 standards.</li>
                    <li><strong>Access Control:</strong> Strict role-based access control (RBAC) and multi-factor authentication (MFA) for administrative operations.</li>
                    <li><strong>Vulnerability Monitoring:</strong> Continuous threat monitoring, annual penetration testing, and automated vulnerability scanning.</li>
                  </ul>
                </div>
              </section>

              {/* 10. Children's Privacy */}
              <section id="children" className="scroll-mt-28 py-6">
                <div className="mb-3">
                  <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-poppins">10. Children&apos;s Privacy (18+ Requirement)</h2>
                  <p className="text-xs font-medium text-black">Age restrictions on TASA marketplace platforms</p>
                </div>

                <p className="text-sm md:text-base text-black leading-relaxed">
                  TASA Africa services are strictly intended for individuals who are <strong>18 years of age or older</strong>. We do not knowingly collect personal information from minors under 18. If we discover an account registered by a minor, we will promptly close the account and remove associated data.
                </p>
              </section>

              {/* 11. Contact Us */}
              <section id="privacy-contact" className="scroll-mt-28 py-6">
                <div className="mb-3">
                  <h2 className="text-xl md:text-2xl font-bold text-black mb-1 font-poppins">11. Contact Us</h2>
                  <p className="text-xs font-medium text-black">Exercise your rights under NDPA, POPIA, GDPR, or CCPA</p>
                </div>

                <div className="space-y-3.5 text-sm md:text-base text-black leading-relaxed">
                  <p>
                    If you wish to submit a Data Subject Access Request (DSAR), request profile deletion, or ask questions regarding data processing in Nigeria, Africa, Europe, or globally, contact our Data Protection Officer:
                  </p>

                  <ul className="space-y-2.5 pt-1 text-sm md:text-base text-black">
                    <li className="flex items-center gap-2.5">
                      <Mail className="w-4.5 h-4.5 text-[#0f766e] shrink-0" />
                      <span><strong>Email:</strong> <a href="mailto:privacy@tasaafrica.com" className="text-black hover:text-[#0f766e] underline">privacy@tasaafrica.com</a></span>
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
                    <Clock className="w-3.5 h-3.5 text-[#0f766e] shrink-0" />
                    <span>Our Data Protection Officer responds to all verified Data Subject Rights Requests within <strong>30 days</strong> as required by statutory regulations.</span>
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
