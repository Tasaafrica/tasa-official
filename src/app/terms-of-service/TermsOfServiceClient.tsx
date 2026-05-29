"use client";

import React from "react";
import Header from "@/app/component/parts/header";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import { motion } from "framer-motion";
import { Shield, FileText, Scale, Lock, RefreshCcw, HelpCircle, AlertCircle, CheckCircle2 } from "lucide-react";

export default function TermsOfServiceClient() {
  const sections = [
    {
      id: "introduction",
      title: "1. Introduction",
      content: (
        <div className="space-y-4">
          <p>Welcome to TASA. These Terms of Service ("Terms") govern your access to and use of the TASA platform, including our website, mobile applications, and any other services provided by TASA (collectively, the "Platform").</p>
          <p>By accessing or using the Platform, you agree to be bound by these Terms and our Privacy Policy. If you are using the Platform on behalf of an organization, you agree to these Terms for that organization and represent that you have the authority to bind that organization to these Terms.</p>
          <p>Please read these Terms carefully. If you do not agree to these Terms, you may not use our services.</p>
        </div>
      ),
      icon: HelpCircle
    },
    {
      id: "definitions",
      title: "2. Definitions",
      content: (
        <div className="space-y-4">
          <p><strong>"Platform"</strong> refers to the TASA ecosystem, including all digital interfaces and services.</p>
          <p><strong>"User"</strong> refers to any individual or entity that registers an account or uses the Platform.</p>
          <p><strong>"Vendor"</strong> refers to users who offer, provide, and perform services through the Platform.</p>
          <p><strong>"Client"</strong> refers to users who seek, purchase, and receive services through the Platform.</p>
          <p><strong>"Service Listing"</strong> refers to the description of a service offered by a Vendor on the Platform.</p>
        </div>
      ),
      icon: FileText
    },
    {
      id: "user-accounts",
      title: "3. User Accounts & Security",
      content: (
        <div className="space-y-4">
          <p>To access most features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
          <p>You are responsible for maintaining the confidentiality of your account credentials and are fully responsible for all activities that occur under your account. You agree to immediately notify TASA of any unauthorized use, or suspected unauthorized use of your account.</p>
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-xl mt-4">
            <p className="text-teal-800 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Account Safety Tip:
            </p>
            <p className="text-teal-700 text-sm">Always use a strong, unique password and enable two-factor authentication if available to protect your personal and financial data.</p>
          </div>
        </div>
      ),
      icon: Shield
    },
    {
      id: "marketplace-rules",
      title: "4. Marketplace Guidelines",
      content: (
        <div className="space-y-4">
          <p>TASA acts as a bridge connecting Vendors and Clients. Except where explicitly stated, TASA is not a party to the contractual relationship between Users.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Professionalism:</strong> All users must maintain professional conduct and respect.</li>
            <li><strong>Quality Assurance:</strong> Vendors are expected to deliver services that match or exceed their listing descriptions.</li>
            <li><strong>Direct Communication:</strong> All work-related communication should ideally happen within the Platform to ensure safety and record-keeping.</li>
            <li><strong>Non-Circumvention:</strong> Users agree not to bypass TASA's payment systems to avoid service fees.</li>
          </ul>
        </div>
      ),
      icon: Scale
    },
    {
      id: "payments",
      title: "5. Financial Transactions",
      content: (
        <div className="space-y-4">
          <p>TASA uses secure third-party payment processors to handle all financial transactions. By using our payment systems, you agree to the terms of these third-party processors.</p>
          <p><strong>Service Fees:</strong> TASA may charge a fee for facilitating transactions. These fees are clearly disclosed at the time of purchase or payout.</p>
          <p><strong>Refunds:</strong> Refund requests are handled according to our Refund Policy, which prioritizes fairness for both Clients and Vendors based on the stage of service delivery.</p>
        </div>
      ),
      icon: Lock
    },
    {
      id: "prohibited",
      title: "6. Prohibited Activities",
      content: (
        <div className="space-y-4">
          <p>Users are strictly prohibited from:</p>
          <ul className="list-disc pl-6 space-y-2 text-red-600/80">
            <li className="text-slate-600">Engaging in fraudulent or deceptive behavior.</li>
            <li className="text-slate-600">Posting illegal, offensive, or infringing content.</li>
            <li className="text-slate-600">Interfering with the security or operation of the Platform.</li>
            <li className="text-slate-600">Collecting other users' data without their explicit consent.</li>
          </ul>
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl mt-4 flex gap-3 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>Violation of these rules may lead to immediate suspension or permanent termination of your account without prior notice.</p>
          </div>
        </div>
      ),
      icon: Shield
    },
    {
      id: "disputes",
      title: "7. Dispute Resolution",
      content: (
        <div className="space-y-4">
          <p>In the event of a disagreement between a Client and a Vendor, TASA provides a dispute resolution mechanism. Users agree to cooperate in good faith with TASA's resolution process.</p>
          <p>If a dispute cannot be resolved through TASA's internal tools, it shall be governed by the laws of the jurisdiction where TASA is registered, without regard to its conflict of law principles.</p>
        </div>
      ),
      icon: RefreshCcw
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-white vendor-font-body">
      <Header variant="white" />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-teal-50/50 rounded-bl-[200px] -z-10" />
        
        {/* Africa Sketch Background - Subtle */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 0.1, x: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-10 lg:left-200 sm:left-100 left-20 w-[600px] h-[600px] pointer-events-none z-0"
        >
          <img 
            src="/africa-sketch.svg" 
            alt="" 
            className="w-full h-full object-contain object-right-top" 
          />
        </motion.div>

        <div className="container-responsive relative z-10">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeInUp}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded-full uppercase tracking-wider">Legal Framework</span>
              <div className="h-px w-12 bg-teal-200" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Terms of <span className="text-teal-600">Service</span>
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-slate-500">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-teal-500" />
                    <span>Effective: May 20, 2026</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                    <span>Version 2.1</span>
                </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 lg:py-24">
        <div className="container-responsive">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar Navigation - Hidden on mobile */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 px-4">Navigation</h3>
                {sections.map((section) => (
                  <a 
                    key={section.id}
                    href={`#${section.id}`}
                    className="group block px-4 py-3 rounded-2xl text-slate-600 hover:text-teal-600 hover:bg-teal-50/50 transition-all font-medium relative overflow-hidden"
                  >
                    <span className="relative z-10">{section.title.split('. ')[1]}</span>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 transform -translate-x-full group-hover:translate-x-0 transition-transform" />
                  </a>
                ))}
                
                <div className="mt-12 px-4 py-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Download</p>
                    <button className="flex items-center gap-2 text-sm text-slate-700 hover:text-teal-600 transition-colors font-medium">
                        <FileText className="w-4 h-4" />
                        Terms of Service (PDF)
                    </button>
                </div>
              </div>
            </aside>

            {/* Terms Content */}
            <div className="flex-1 max-w-4xl">
              <div className="space-y-20">
                {sections.map((section, index) => (
                  <motion.div 
                    key={section.id}
                    id={section.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="scroll-mt-24 group"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 flex items-center justify-center bg-white shadow-soft border border-slate-100 rounded-2xl group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                        <section.icon className="w-6 h-6 transition-colors" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{section.title}</h2>
                    </div>
                    <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed font-normal">
                      {section.content}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Note */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="mt-24 p-8 md:p-16 bg-[#1e293b] rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-slate-200"
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />
                
                <div className="relative z-10 text-center md:text-left">
                  <h3 className="text-3xl font-bold mb-6">Need legal clarification?</h3>
                  <p className="text-slate-400 text-lg mb-10 max-w-2xl leading-relaxed">
                    Our team is committed to transparency. If you have questions about our terms, privacy practices, or marketplace policies, we're here to help.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <a 
                        href="mailto:support@tasa.africa"
                        className="inline-flex items-center justify-center px-10 py-5 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-teal-500/20"
                    >
                        Contact Support
                    </a>
                    <a 
                        href="/help"
                        className="inline-flex items-center justify-center px-10 py-5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all active:scale-95 backdrop-blur-sm border border-white/10"
                    >
                        Visit Help Center
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <FooterLinksSection />
      
      <style jsx global>{`
        .shadow-soft {
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
}
