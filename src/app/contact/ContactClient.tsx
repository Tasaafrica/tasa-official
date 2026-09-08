"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock,
  Copy,
  Globe,
  HelpCircle,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { toast } from "sonner";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import Header from "@/app/component/parts/header";

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const supportEmail = "support@tasaafrica.com";
  const whatsappNumber = "2349012345678";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello%20TASA%20Support,%20I%20need%20assistance.`;
  const supportPhone = "+2349012345678";
  const phoneUrl = `tel:${supportPhone}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(supportEmail);
      setCopiedEmail(true);
      toast.success("Email address copied to clipboard!");
      setTimeout(() => setCopiedEmail(false), 3000);
    } catch (_err) {
      toast.error("Failed to copy email address.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    toast.success("Thank you! Your message has been sent successfully.");
    setFormData({
      name: "",
      email: "",
      subject: "General Inquiry",
      message: "",
    });
  };

  const faqs = [
    {
      q: "How does TASA protect my payments?",
      a: "TASA uses an escrow payment system. Payment is secured when a contract starts and only released to the vendor after you approve the completed work.",
    },
    {
      q: "What is the typical response time for support?",
      a: "Our WhatsApp channel is active for instant replies (under 10 mins) during support hours. Form queries and emails are resolved within 12 to 24 hours.",
    },
    {
      q: "How can I apply to become a verified vendor?",
      a: "You can click 'Become a Vendor' in the header/footer, complete your profile, add portfolio items, and request verification from your settings tab.",
    },
  ];

  const socialLinks = [
    {
      name: "Twitter",
      icon: <FaXTwitter className="w-5 h-5" />,
      url: "https://x.com/tasa_africa",
      hoverColor: "hover:bg-black hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin className="w-5 h-5" />,
      url: "https://linkedin.com/company/tasa-africa",
      hoverColor: "hover:bg-[#0077B5] hover:text-white",
    },
    {
      name: "Facebook",
      icon: <FaFacebook className="w-5 h-5" />,
      url: "https://facebook.com/tasa.africa",
      hoverColor: "hover:bg-[#1877F2] hover:text-white",
    },
    {
      name: "Instagram",
      icon: <FaInstagram className="w-5 h-5" />,
      url: "https://instagram.com/tasa_africa",
      hoverColor:
        "hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-pink-500 hover:to-purple-500 hover:text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col overflow-x-hidden antialiased">
      <Header variant="white" />

      {/* Hero Banner with Modern Glow Lights */}
      <section className="relative pt-36 pb-24 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-teal-500/10 to-emerald-500/5 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute -bottom-20 left-10 w-[450px] h-[450px] bg-gradient-to-br from-indigo-500/10 to-purple-500/5 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        </div>

        <div className="container-responsive relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-xs font-bold tracking-wider uppercase text-teal-300">
              We are here to support you
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-teal-300 leading-tight"
          >
            Connect With Our Team
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed px-4"
          >
            Have feedback, business questions, or need support resolving an
            issue? Reach out through any of our channels or submit the form
            below.
          </motion.p>
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="py-16 lg:py-24 -mt-12 relative z-20 flex-grow">
        <div className="container-responsive">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Quick Actions & Office details */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8">
              {/* WhatsApp Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-slate-200/50 transition-all duration-500 group flex flex-col justify-between min-h-[250px] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[100px] pointer-events-none" />

                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 transform group-hover:scale-110 transition-transform duration-300">
                      <FaWhatsapp className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                        WhatsApp Live Chat
                      </h3>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Online Support
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    Connect instantly with support reps for fast query
                    resolutions, payments, or verification details.
                  </p>
                </div>

                <button
                  disabled
                  className="relative overflow-hidden inline-flex items-center justify-center w-full py-4 rounded-2xl bg-slate-950 text-white font-bold text-sm opacity-50 cursor-not-allowed border-none"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Chatting
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </motion.div>

              {/* Phone Call Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-slate-200/50 transition-all duration-500 group flex flex-col justify-between min-h-[250px] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[100px] pointer-events-none" />

                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 transform group-hover:scale-110 transition-transform duration-300">
                      <Phone className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                        Phone Hotline
                      </h3>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mt-1">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        Direct Line
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    Speak directly with a customer representative to resolve
                    disputes or get immediate platform help.
                  </p>
                </div>

                <button
                  disabled
                  className="relative overflow-hidden inline-flex items-center justify-center w-full py-4 rounded-2xl bg-slate-950 text-white font-bold text-sm opacity-50 cursor-not-allowed border-none"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Call Hotline
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </motion.div>

              {/* Email Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-slate-200/50 transition-all duration-500 group flex flex-col justify-between min-h-[250px] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-[100px] pointer-events-none" />

                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20 transform group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                        Email Correspondence
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Average Response: 12h
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    For business partnerships, advertising, vendor disputes, or
                    media inquiries, send us a direct message.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="relative overflow-hidden inline-flex items-center justify-center w-full py-4 rounded-2xl bg-slate-950 text-white font-bold text-sm hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-600/10 transition-all duration-300 active:scale-[0.98] cursor-pointer border-none"
                >
                  {copiedEmail ? (
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-teal-300" />
                      Copied Support Email!
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Copy className="w-4 h-4 opacity-80" />
                      Copy Support Email
                    </span>
                  )}
                </button>
              </motion.div>

              {/* Operations Details Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 shadow-md space-y-5"
              >
                <div className="flex items-center gap-3 text-slate-900 font-extrabold text-base pb-3 border-b border-slate-100">
                  <MapPin className="w-5 h-5 text-teal-600" />
                  <span>Operations Office</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
                  <div className="flex gap-3">
                    <Clock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900">
                        Support Hours
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Mon – Fri: 8 AM – 6 PM
                      </p>
                      <p className="text-xs text-slate-500">
                        Sat: 9 AM – 2 PM (WAT)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Globe className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900">
                        Base Location
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Lagos, Nigeria
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white border border-slate-100 rounded-[2.5rem] p-6 sm:p-10 shadow-xl shadow-slate-100/30"
              >
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                    Send Direct Message
                  </h2>
                  <p className="text-sm text-slate-500">
                    We usually get back to users within a few business hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-xs font-bold text-slate-700 uppercase tracking-wider block"
                      >
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-4.5 w-4.5 text-slate-400" />
                        </span>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Amina Bello"
                          className="w-full h-13 pl-11 pr-4 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all outline-none bg-slate-50/50 text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-xs font-bold text-slate-700 uppercase tracking-wider block"
                      >
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-4.5 w-4.5 text-slate-400" />
                        </span>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="amina@example.com"
                          className="w-full h-13 pl-11 pr-4 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all outline-none bg-slate-50/50 text-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-xs font-bold text-slate-700 uppercase tracking-wider block"
                    >
                      Inquiry Category
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full h-13 px-4 rounded-xl border border-slate-200 text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all outline-none bg-slate-50/50 text-sm font-medium cursor-pointer"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">
                        Technical Support
                      </option>
                      <option value="Billing & Pricing">
                        Billing & Escrow Escort
                      </option>
                      <option value="Partnership Proposal">Partnerships</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-xs font-bold text-slate-700 uppercase tracking-wider block"
                    >
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      placeholder="Please explain your question or concern in detail..."
                      className="w-full p-4 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all outline-none bg-slate-50/50 resize-y text-sm font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-75 text-white font-extrabold rounded-2xl shadow-lg shadow-teal-600/10 hover:shadow-teal-500/20 transition-all duration-300 flex items-center justify-center gap-2 border-none active:scale-[0.99] cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4.5 h-4.5" />
                        Send Support Message
                      </>
                    )}
                  </button>
                </form>
              </motion.div>

              {/* Inline FAQ section */}
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 sm:p-8 shadow-md">
                <div className="flex items-center gap-3 text-slate-900 font-extrabold text-lg mb-6 pb-2 border-b border-slate-50">
                  <HelpCircle className="w-5 h-5 text-teal-600" />
                  <span>Frequently Answered Questions</span>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div
                      key={faq.q}
                      className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/30"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setActiveFaq(activeFaq === idx ? null : idx)
                        }
                        className="w-full px-5 py-4 text-left font-bold text-sm text-slate-800 flex justify-between items-center bg-white hover:bg-slate-50/80 transition-colors border-none cursor-pointer outline-none"
                      >
                        <span>{faq.q}</span>
                        <ChevronRight
                          className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === idx ? "rotate-90" : ""}`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {activeFaq === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-5 py-4 border-t border-slate-50 text-xs sm:text-sm text-slate-500 leading-relaxed bg-slate-50/50">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Area */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="container-responsive text-center">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            Stay Connected
          </h2>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-8 max-w-md mx-auto leading-snug">
            Follow TASA's channels to receive updates and news
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className={`flex items-center gap-2.5 px-6 py-3.5 bg-slate-50 border border-slate-200/50 rounded-2xl font-bold text-sm text-slate-600 transition-all duration-300 ${social.hoverColor}`}
              >
                {social.icon}
                <span>{social.name}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <FooterLinksSection />
    </div>
  );
}
