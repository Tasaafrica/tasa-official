"use client";

import React from "react";
import Header from "@/app/component/parts/header";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import { motion } from "framer-motion";
import { Lock, Eye, ShieldCheck, Database, Share2, Bell, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "overview",
      title: "1. Privacy Overview",
      content: (
        <div className="space-y-4">
          <p>At TASA, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform.</p>
          <p>We use your data to provide and improve the Platform. By using TASA, you agree to the collection and use of information in accordance with this policy.</p>
        </div>
      ),
      icon: Eye
    },
    {
      id: "collection",
      title: "2. Information We Collect",
      content: (
        <div className="space-y-4">
          <p>We collect information that you provide directly to us, such as when you create an account, update your profile, or communicate with other users.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Data:</strong> Name, email address, phone number, and location.</li>
            <li><strong>Professional Data:</strong> Skills, portfolio items, and service descriptions for Vendors.</li>
            <li><strong>Financial Data:</strong> Payment information processed by our secure partners.</li>
            <li><strong>Usage Data:</strong> Information on how you interact with our Platform.</li>
          </ul>
        </div>
      ),
      icon: Database
    },
    {
      id: "usage",
      title: "3. How We Use Your Information",
      content: (
        <div className="space-y-4">
          <p>We use the collected data for various purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain our Platform.</li>
            <li>To notify you about changes to our services.</li>
            <li>To allow you to participate in interactive features.</li>
            <li>To provide customer support and gather analysis.</li>
            <li>To detect, prevent and address technical or security issues.</li>
          </ul>
        </div>
      ),
      icon: ShieldCheck
    },
    {
      id: "sharing",
      title: "4. Information Sharing",
      content: (
        <div className="space-y-4">
          <p>We do not sell your personal data. We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Other Users:</strong> As needed to facilitate transactions between Clients and Vendors.</li>
            <li><strong>Service Providers:</strong> Third-party companies that help us provide our services (e.g., payment processors).</li>
            <li><strong>Legal Requirements:</strong> If required to do so by law or in response to valid requests by public authorities.</li>
          </ul>
        </div>
      ),
      icon: Share2
    },
    {
      id: "security",
      title: "5. Data Security",
      content: (
        <div className="space-y-4">
          <p>The security of your data is important to us. We implement a variety of security measures to maintain the safety of your personal information.</p>
          <p>However, please remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
        </div>
      ),
      icon: Lock
    },
    {
      id: "rights",
      title: "6. Your Data Rights",
      content: (
        <div className="space-y-4">
          <p>Depending on your location, you may have certain rights regarding your personal data, including the right to access, correct, or delete the information we have on you.</p>
          <p>You can manage most of your data directly through your account settings. For additional requests, please contact our support team.</p>
        </div>
      ),
      icon: Bell
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
        <div className="absolute top-0 left-0 w-1/3 h-full bg-blue-50/50 rounded-br-[200px] -z-10" />
        
        {/* Subtle Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-50/30 rounded-full blur-[120px] -z-10" />

        <div className="container-responsive relative z-10">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeInUp}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">Privacy First</span>
              <div className="h-px w-12 bg-blue-200" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Privacy <span className="text-blue-600">Policy</span>
            </h1>
            
            <p className="text-lg text-slate-600 leading-relaxed mb-4">
              Your data security is our top priority.
            </p>
            <p className="text-slate-500 max-w-2xl">
              Last Updated: May 20, 2026 • Version 1.0
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 lg:py-24">
        <div className="container-responsive">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar Navigation */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 px-4">Policy Sections</h3>
                {sections.map((section) => (
                  <a 
                    key={section.id}
                    href={`#${section.id}`}
                    className="group block px-4 py-3 rounded-2xl text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all font-medium relative overflow-hidden"
                  >
                    <span className="relative z-10">{section.title.split('. ')[1]}</span>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 transform -translate-x-full group-hover:translate-x-0 transition-transform" />
                  </a>
                ))}
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 max-w-4xl">
              <div className="space-y-20">
                {sections.map((section) => (
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
                      <div className="w-12 h-12 flex items-center justify-center bg-white shadow-soft border border-slate-100 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
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

              {/* Contact Card */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="mt-24 p-8 md:p-16 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Mail className="text-blue-400 w-6 h-6" />
                    <h3 className="text-2xl font-bold">Privacy Concerns?</h3>
                  </div>
                  <p className="text-slate-400 text-lg mb-10 max-w-2xl leading-relaxed">
                    If you have any questions about this Privacy Policy, your data rights, or how we protect your information, please contact our data protection officer.
                  </p>
                  <a 
                    href="mailto:privacy@tasa.africa"
                    className="inline-flex items-center justify-center px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                  >
                    Contact Privacy Team
                  </a>
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
