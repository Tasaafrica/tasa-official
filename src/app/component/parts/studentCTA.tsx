"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function StudentCTA() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
        <div className="relative rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-2xl">
          {/* Decorative background effects */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-teal-500/10 to-transparent pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-teal-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-50" />

          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-0 min-h-[500px]">
            {/* Text Content */}
            <motion.div 
              className="w-full lg:w-1/2 p-10 md:p-16 z-10 text-left"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-6">
                <div className="h-px w-8 bg-teal-500" />
                <span className="text-teal-400 font-semibold tracking-wider text-sm uppercase">For the next gen</span>
              </motion.div>

              <motion.h2 
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
              >
                Are you a <span className="text-teal-400 font-extrabold italic">student?</span>
              </motion.h2>

              <motion.div variants={fadeInUp} className="space-y-2 mb-8">
                <p className="text-2xl md:text-3xl text-slate-300 font-medium">Got a skill?</p>
                <p className="text-xl text-slate-400">Don't be left out, join the marketplace designed for your success.</p>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <button className="group relative inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-teal-900/20">
                  Join the trend
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </motion.div>
            </motion.div>

            {/* Image Content */}
            <div className="w-full lg:w-1/2 relative h-full self-stretch lg:self-end">
              <motion.div 
                className="relative h-full flex items-end justify-center lg:justify-end"
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Abstract shape behind image */}
                <div className="absolute bottom-0 right-0 w-[80%] h-[80%] bg-teal-600/10 rounded-tl-[10rem] -z-0" />
                
                <img 
                  src="/image/nigerian-student.png" 
                  alt="Talented Student" 
                  className="relative z-10 w-full max-w-[500px] lg:max-w-none lg:h-[110%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform scale-125 md:scale-110 lg:scale-100 lg:translate-y-8 origin-bottom"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
