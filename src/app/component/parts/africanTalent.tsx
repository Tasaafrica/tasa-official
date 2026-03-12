"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AfricanTalent() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className="py-20 bg-slate-50 overflow-hidden">
      <motion.div
        className="container mx-auto px-6 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        {/* Text Content Above Image */}
        <div className="mb-5">
          <motion.p
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-teal-600 font-bold tracking-widest text-sm uppercase mb-4"
          >
            One Platform...
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-3xl lg:text-3xl font-bold text-slate-900"
          >
            Diverse Talents & Professionals
          </motion.h2>
        </div>

        {/* Centered & Cropped Image */}
        <div className="relative max-w-5xl mx-auto border-b-2 border-dashed border-slate-300">
          <motion.div
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            {/* 
                The "Hip Upward" Crop 
                Using a container with a fixed aspect ratio or height 
                and object-top to show the upper bodies.
            */}
            <div className="relative w-full overflow-hidden">
              <img
                src="/image/African_professionals.png"
                alt="African Professionals"
                className="w-full h-auto"
              />
              
              {/* 
                  Smooth fade-out at the bottom to blend with the white page
              */}
              <div className="hidden absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/40 to-transparent" />
            </div>
            
            {/* Floating subtle detail to add style */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 0.5 }}
              className="hidden absolute -bottom-6 left-1/2 -translate-x-1/2 bg-teal-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-xl"
            >
              World-Class Experts
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
