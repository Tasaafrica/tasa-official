"use client";

import { Search, MessageSquare, Lightbulb, Send } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
};

const stepTransition = (index: number) => ({
  duration: 0.6,
  delay: index * 0.15,
});

export default function HowItWorksSection() {
  return (
    <section className="py-18 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
        <div className="text-center mb-12">
          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            How it works
          </motion.p>
          <motion.h2
            className="text-3xl md:text-4xl font-semibold text-slate-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Simple steps to get started
          </motion.h2>
          <motion.p
            className="text-slate-600 mt-3 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover, connect, and deliver faster with a workflow designed to
            keep projects moving.
          </motion.p>
        </div>

        <div className="relative">
          <div className="grid gap-6 md:grid-cols-3 lg:hidden">
            {/* Step 01 - Illustrative Search */}
            <motion.div
              className="relative rounded-2xl border-2 border-dashed border-slate-300 bg-transparent p-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={stepVariants}
              transition={stepTransition(0)}
            >
              <div className="text-sm font-semibold text-slate-400 mb-2">
                01
              </div>
              <div className="mb-4 -rotate-2">
                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    defaultValue="Search or Post"
                    className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                    aria-label="Search or post"
                  />
                  <button
                    type="button"
                    className="rounded-full cursor-pointer bg-[#0F766E] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0D5F59] transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Find the skills you need or list the services you offer with
                clear descriptions.
              </p>
            </motion.div>

            {/* Step 02 - Illustrative Chat */}
            <motion.div
              className="relative rounded-2xl border-2 border-dashed border-slate-300 bg-transparent p-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={stepVariants}
              transition={stepTransition(1)}
            >
              <div className="text-sm font-semibold text-slate-400 mb-2">
                02
              </div>
              <div className="mb-4">
                <div className="flex flex-col gap-2">
                  <div className="self-start rounded-2xl rounded-tl-sm bg-slate-100 px-3 py-2 text-xs text-slate-700">
                    Hello
                  </div>
                  <div className="self-end rounded-2xl rounded-tr-sm bg-[#0F766E] px-3 py-2 text-xs text-white">
                    Lets connect & discuss
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full bg-transparent text-xs text-slate-600 placeholder:text-slate-400 focus:outline-none"
                    aria-label="Type a message"
                  />
                  <button
                    type="button"
                    className="h-8 w-8 p-2 cursor-pointer rounded-full bg-[#0F766E] text-white text-xs font-semibold hover:bg-[#0D5F59] transition-colors"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Chat with professionals or clients to align on scope, budget,
                and timelines.
              </p>
            </motion.div>

            {/* Step 03 - Illustrative Progress */}
            <motion.div
              className="relative rounded-2xl border-2 border-dashed border-slate-300 bg-transparent p-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={stepVariants}
              transition={stepTransition(2)}
            >
              <div className="text-sm font-semibold text-slate-400 mb-2">
                03
              </div>
              <div className="mb-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-full bg-[#0F766E] text-white flex items-center justify-center">
                        <Lightbulb className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          Project Delivered
                        </p>
                        <p className="text-[11px] text-slate-500">
                          All tasks completed
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#0F766E]">
                      100%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white border border-slate-200 overflow-hidden">
                    <div className="h-full w-full bg-[#0F766E]" />
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="inline-flex h-2 w-2 rounded-full bg-[#0F766E]" />
                    Milestones achieved
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Achieve Your Goals
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Collaborate smoothly and deliver results with confidence.
              </p>
            </motion.div>
          </div>

          {/* Large-screen illustrative layout */}
          <div className="relative hidden lg:block h-[520px]">
            {/* connectors */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 1200 520"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="arrow"
                  markerWidth="10"
                  markerHeight="10"
                  refX="6"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L0,6 L6,3 z" fill="#CBD5E1" />
                </marker>
              </defs>
              <path
                d="M190,140 C380,60 520,90 640,180"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="2"
                strokeDasharray="6 8"
                markerEnd="url(#arrow)"
              />
              <path
                d="M670,220 C820,300 930,260 1010,200"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="2"
                strokeDasharray="6 8"
                markerEnd="url(#arrow)"
              />
            </svg>

            {/* Step 01 */}
            <motion.div
              className="absolute left-6 top-8 w-[360px] -rotate-2 rounded-2xl border-2 border-dashed border-slate-300 bg-transparent p-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={stepVariants}
              transition={stepTransition(0)}
            >
              <div className="text-sm font-semibold text-slate-400 mb-2">
                01
              </div>
              <div className="mb-4 -rotate-1">
                <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    defaultValue="Search or Post"
                    className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                    aria-label="Search or post"
                  />
                  <button
                    type="button"
                    className="rounded-full bg-[#0F766E] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#0D5F59] transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Find the skills you need or list the services you offer with
                clear descriptions.
              </p>
            </motion.div>

            {/* Step 02 */}
            <motion.div
              className="absolute left-[420px] top-[150px] w-[340px] rotate-2 rounded-2xl border-2 border-dashed border-slate-300 bg-transparent p-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={stepVariants}
              transition={stepTransition(1)}
            >
              <div className="text-sm font-semibold text-slate-400 mb-2">
                02
              </div>
              <div className="mb-4">
                <div className="flex flex-col gap-2">
                  <div className="self-start rounded-2xl rounded-tl-sm bg-slate-100 px-3 py-2 text-xs text-slate-700">
                    Hello
                  </div>
                  <div className="self-end rounded-2xl rounded-tr-sm bg-[#0F766E] px-3 py-2 text-xs text-white">
                    Lets connect & discuss
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full bg-transparent text-xs text-slate-600 placeholder:text-slate-400 focus:outline-none"
                    aria-label="Type a message"
                  />
                  <button
                    type="button"
                    className="h-8 w-8 p-2 rounded-full bg-[#0F766E] text-white text-xs font-semibold hover:bg-[#0D5F59] transition-colors"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Chat with professionals or clients to align on scope, budget,
                and timelines.
              </p>
            </motion.div>

            {/* Step 03 */}
            <motion.div
              className="absolute right-8 top-10 w-[360px] -rotate-3 rounded-2xl border-2 border-dashed border-slate-300 bg-transparent p-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={stepVariants}
              transition={stepTransition(2)}
            >
              <div className="text-sm font-semibold text-slate-400 mb-2">
                03
              </div>
              <div className="mb-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-full bg-[#0F766E] text-white flex items-center justify-center">
                        <Lightbulb className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-900">
                          Project Delivered
                        </p>
                        <p className="text-[11px] text-slate-500">
                          All tasks completed
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#0F766E]">
                      100%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white border border-slate-200 overflow-hidden">
                    <div className="h-full w-full bg-[#0F766E]" />
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="inline-flex h-2 w-2 rounded-full bg-[#0F766E]" />
                    Milestones achieved
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Achieve Your Goals
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Collaborate smoothly and deliver results with confidence.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
