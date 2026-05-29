"use client";

import React, { useState } from "react";
import Header from "@/app/component/parts/header";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Search, MessageCircle, User, Briefcase, CreditCard, ShieldCheck } from "lucide-react";

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className={`text-lg font-semibold transition-colors duration-200 ${isOpen ? 'text-teal-600' : 'text-slate-900 group-hover:text-teal-600'}`}>
          {question}
        </span>
        <div className={`flex-shrink-0 ml-4 p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-teal-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600'}`}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-slate-600 leading-relaxed text-lg">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("General");

  const categories = [
    { name: "General", icon: MessageCircle },
    { name: "Vendors", icon: Briefcase },
    { name: "Clients", icon: User },
    { name: "Payments", icon: CreditCard },
    { name: "Safety", icon: ShieldCheck },
  ];

  const faqs = {
    General: [
      {
        question: "What is TASA?",
        answer: "TASA is a premium service marketplace designed to connect skilled individuals (Vendors) across Africa with businesses and individuals (Clients) across the globe who need their expertise. We focus on fostering a community of excellence and professional growth."
      },
      {
        question: "How do I get started?",
        answer: "You can get started by creating an account. Choose whether you want to join as a Vendor to offer services or a Client to hire talent. Simply click the 'Join' button in the header."
      },
      {
        question: "Is TASA available outside Africa?",
        answer: "While our primary focus is empowering African talent and businesses, anyone globally can sign up as a Client to hire talented African professionals."
      }
    ],
    Vendors: [
      {
        question: "How do I become a Vendor?",
        answer: "Once you have a standard account, you can click on 'Become a Vendor' in your dashboard. You'll need to complete your profile, list your skills, and create your first service listing."
      },
      {
        question: "What are the fees for Vendors?",
        answer: "TASA takes a small service fee from each completed transaction to maintain the platform, provide support, and market your services to potential clients. Fees are clearly displayed in your earnings dashboard."
      },
      {
        question: "Does TASA set prices for Vendor services?",
        answer: "No, TASA does not set prices for Vendor services. Vendors are free to set their own prices for their services. However, TASA reserves the right to remove any service that is not in compliance with our terms and conditions."
      },
      {
        question: "How do I get paid?",
        answer: "Once a service is completed and approved by the Client, the funds are cleared into your TASA wallet. You can then withdraw them to your local bank account or preferred payment method."
      }
    ],
    Clients: [
      {
        question: "How do I hire someone?",
        answer: "You can browse categories or use the search bar to find services. Once you find a service that meets your needs, you can contact the Vendor to discuss project details."
      },
      {
        question: "What happens if I'm not satisfied with a service?",
        answer: "We encourage open communication with your Vendor first. If you cannot reach a resolution, TASA provides a dispute resolution process to ensure fairness for both parties."
      }
    ],
    Payments: [
      {
        question: "Is my payment information secure?",
        answer: "Yes, we use industry-standard encryption and professional payment processors to ensure your financial data is never stored on our servers and is always handled securely."
      },
      {
        question: "What payment methods are supported?",
        answer: "We support various methods including Credit/Debit cards, bank transfers, and local mobile money options in many African countries."
      }
    ],
    Safety: [
        {
          question: "How does TASA ensure quality?",
          answer: "We have a verification system for Vendors and a review system where Clients can rate their experience. Our support team also monitors the platform for any unprofessional behavior."
        },
        {
          question: "How do I report a suspicious activity?",
          answer: "You can report any user or listing directly through the report button on their profile/page, or by contacting our 24/7 support team."
        }
    ]
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-white vendor-font-body">
      <Header variant="white" />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-teal-50/50 rounded-bl-[200px] -z-10" />
        
        {/* Africa Sketch – matching user's layout in other pages */}
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

        <div className="container-responsive relative z-10 text-center">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeInUp}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100">
              <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-[10px] font-bold rounded-full uppercase tracking-tighter">Help Center</span>
              <span className="text-slate-400 text-xs">How can we help you today?</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-8">
              Frequently Asked <span className="text-teal-600">Questions</span>
            </h1>

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search for answers..."
                className="w-full pl-14 pr-6 py-5 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border-none focus:ring-2 focus:ring-teal-500 transition-all text-slate-800"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 lg:py-32">
        <div className="container-responsive">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Sidebar / Categories */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="sticky top-24 space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 px-4">Categories</h3>
                <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-semibold transition-all whitespace-nowrap lg:whitespace-normal ${
                        activeCategory === cat.name 
                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' 
                        : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <cat.icon className={`w-5 h-5 ${activeCategory === cat.name ? 'text-white' : 'text-slate-400'}`} />
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Questions List */}
            <div className="flex-1 max-w-3xl">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-3xl font-bold text-slate-900 mb-8">{activeCategory} Questions</h2>
                <div className="bg-white rounded-3xl">
                  {faqs[activeCategory as keyof typeof faqs].map((faq, index) => (
                    <FAQItem key={index} question={faq.question} answer={faq.answer} />
                  ))}
                </div>
              </motion.div>

              {/* Still need help? */}
              <div className="mt-20 p-8 md:p-12 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
                    <p className="text-slate-400">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                  </div>
                  <a 
                    href="mailto:support@tasa.africa"
                    className="inline-flex items-center justify-center px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-teal-500/20 whitespace-nowrap"
                  >
                    Get in Touch
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterLinksSection />
    </div>
  );
}
