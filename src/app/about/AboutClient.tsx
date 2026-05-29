"use client";

import React from "react";
import Header from "@/app/component/parts/header";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import { motion } from "framer-motion";
import { Users, Target, Shield, Zap, Sparkles, Award } from "lucide-react";
import { useAuthModal } from "@/components/providers/AuthModalProvider";
import { useSearchModal } from "@/components/providers/SearchModalProvider";


export default function AboutPage() {
  const { openSignup } = useAuthModal();
  const { openSearch } = useSearchModal();

  const fadeInUp = {

    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.2 } }
  };

  const values = [
    {
      icon: Shield,
      title: "Trust & Security",
      description: "We prioritize the safety of our users with robust verification systems and secure payment gateways.",
      color: "bg-teal-50 text-teal-600"
    },
    {
      icon: Zap,
      title: "Efficiency",
      description: "Connecting you with the right talent or service in minutes, not days. Speed meets quality here.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We set high standards for vendors to ensure every service delivered is nothing short of exceptional.",
      color: "bg-purple-50 text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header variant="white" />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-2/3 bg-teal-50/50 rounded-bl-[200px] -z-10" />
        
        {/* Africa Sketch Background */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 0.25, x: 0 }}
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
            variants={stagger}
            className="max-w-4xl"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded-full uppercase tracking-wider">Our Story</span>
              <div className="h-px w-12 bg-teal-200" />
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-8">
              Redefining the <span className="text-teal-600">Talent Economy</span> in Africa.
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl">
              TASA is more than just a marketplace. We are a bridge connecting youth potential with professional opportunities, fostering a community of excellence.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats/Highlight Section */}
      <section className="py-12 border-y border-gray-100 bg-gray-50/30">
        <div className="container-responsive">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center md:text-left">
              <p className="text-3xl font-bold text-slate-900">10k+</p>
              <p className="text-sm text-slate-500 font-medium">Talented Vendors</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-3xl font-bold text-slate-900">50k+</p>
              <p className="text-sm text-slate-500 font-medium">Services Delivery</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-3xl font-bold text-slate-900">98%</p>
              <p className="text-sm text-slate-500 font-medium">Success Rate</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-3xl font-bold text-slate-900">24/7</p>
              <p className="text-sm text-slate-500 font-medium">Dedicated Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24">
        <div className="container-responsive">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative z-10">
                <img 
                  src="/image/nigerian-student.png" 
                  alt="TASA Founder/Values" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-teal-600/20 rounded-[2rem] -z-0" />
              <div className="absolute top-10 -left-10 w-20 h-20 bg-teal-500 rounded-2xl rotate-12 z-20 flex items-center justify-center shadow-lg">
                <Sparkles className="text-white w-10 h-10" />
              </div>
            </motion.div>

            <div className="space-y-12">
              <motion.div 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }}
                variants={stagger}
                className="space-y-4"
              >
                <motion.div variants={fadeInUp} className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Target className="w-5 h-5 text-teal-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
                </motion.div>
                <motion.p variants={fadeInUp} className="text-lg text-slate-600 leading-relaxed">
                  To empower every young individual across Africa with the tools and platform needed to transform their skills into a sustainable source of income, while providing businesses with access to reliable, high-quality local talent.
                </motion.p>
              </motion.div>

              <motion.div 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }}
                variants={stagger}
                className="space-y-4"
              >
                <motion.div variants={fadeInUp} className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
                </motion.div>
                <motion.p variants={fadeInUp} className="text-lg text-slate-600 leading-relaxed">
                  To become the heartbeat of professional services in Africa, where talent knows no boundaries and excellence is the only currency. We envision a future where every skill is valued and every opportunity is reachable.
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500 rounded-full blur-[100px]" />
        </div>
        
        <div className="container-responsive relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Built on Foundation of Trust</h2>
            <p className="text-slate-400 text-lg">Our core values define every interaction on the TASA platform.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-teal-500/50 transition-all group"
              >
                <div className={`p-4 rounded-2xl w-fit mb-6 transition-transform group-hover:scale-110 duration-300`}>
                  <value.icon className="w-6 h-6 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-slate-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-24 bg-white">
        <div className="container-responsive">
          <div className="bg-teal-600 rounded-[3rem] p-10 md:p-20 text-center text-white relative overflow-hidden">
            {/* Shapes */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to grow with TASA?</h2>
              <p className="text-xl text-teal-50 mb-12 max-w-2xl mx-auto opacity-90">
                Join thousands of students and professionals who are already redefining their careers on Africa's most trusted service marketplace.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={openSignup}
                  className="px-10 py-5 bg-white text-teal-600 rounded-2xl font-bold text-lg hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-teal-900/20 active:scale-95"
                >
                  Create Account
                </button>
                <button 
                  onClick={openSearch}
                  className="px-10 py-5 bg-teal-700 text-white rounded-2xl font-bold text-lg hover:bg-teal-800 transition-all active:scale-95 border border-white/20"
                >
                  Explore Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterLinksSection />
    </div>
  );
}
