"use client";

import Link from "next/link";
import { ShieldCheck, Headphones, BadgeCheck } from "lucide-react";
import ScrollRevealText from "./ScrollRevealText";
import ScrollRevealCard from "./ScrollRevealCard";
import ImpressedServiceCard from "./impressedServiceCard";

export default function ImpressedServiceSection() {
  const services = [
    {
      imageAlt: "Modern website design",
      imageUrl:
        "https://res.cloudinary.com/duo4b1nit/image/upload/v1773857079/ui-ux.jpg",
      sellerAvatar: "male-ui-ux.png",
      sellerName: "Mikel Ali",
      sellerLevel: "Top Rated",
      title: "UI/UX Designer creating high-converting digital experiences",
      rating: 4.9,
      reviews: 1200,      
      startingPrice: 3500,
      currency: "GH₵",
    },
    {
      imageAlt: "Social media marketing manager",
      imageUrl:
        "digital-marketing.png",
      sellerAvatar: "female-digital-marketing.png",
      sellerName: "Sara Lanti",
      sellerLevel: "Level 2",
      title: "Digital Strategist scaling brands through social media marketing",
      rating: 5.0,
      reviews: 850,
      startingPrice: 120,
      currency: "$",
    },
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container-responsive">
        <div className="flex items-center justify-between mb-8">
          <ScrollRevealText as="h2" className="md:ml-20 text-3xl md:text-3xl font-semibold text-slate-900">
            On TASA...
          </ScrollRevealText>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:justify-center">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-[560px]">
            {services.map((item, index) => (
              <ScrollRevealCard
                key={item.title}
                delay={index * 0.15}
              >
                <ImpressedServiceCard
                  {...item}
                />
              </ScrollRevealCard>
            ))}
          </div>

          {/* Trust & Assurance Boxes */}
          <div className="grid gap-4 w-full lg:w-[360px]">
            <ScrollRevealCard delay={0} variant="pop">
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center">
                    <BadgeCheck className="h-5 w-5 text-[#0F766E]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">
                      High Quality Work
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Find the right freelancer to begin working on your
                      project within minutes.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollRevealCard>
            <ScrollRevealCard delay={0.1} variant="pop">
              <div className="rounded-2xl border border-[#334155] bg-[#334155] px-5 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.12)]">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">
                      Protected Payments
                    </h3>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Always know what you'll pay upfront. Your payment isn't
                      released until you approve the work.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollRevealCard>
            <ScrollRevealCard delay={0.2} variant="pop">
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-teal-50 flex items-center justify-center">
                    <Headphones className="h-5 w-5 text-[#0F766E]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">
                      24/7 Support
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Questions? Our round-the-clock support team is available
                      to help anytime, anywhere.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollRevealCard>
          </div>
        </div>
      </div>
    </section>
  );
}
