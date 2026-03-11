// Server Component - Better performance and SEO
import Header from "@/app/component/parts/header";
import PopularCategory from "@/app/component/parts/popularCategory";
import ImpressedServiceCard from "@/app/component/parts/impressedServiceCard";
import WhyChooseTasa from "@/app/component/parts/whyChooseTasa";
import HowItWorksSection from "@/app/component/parts/howItWorksSection";
import Link from "next/link";
import { Button } from "@/app/component/ui/button";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import EmailVerificationWrapper from "@/components/layout/EmailVerificationWrapper";
import HomeHeroSection from "@/app/component/parts/homeHeroSection";
import TrustedBySection from "@/app/component/parts/trustedBySection";
import CtaSection from "@/app/component/parts/ctaSection";
import ScrollRevealText from "@/app/component/parts/ScrollRevealText";
import ScrollRevealCard from "@/app/component/parts/ScrollRevealCard";
import { Poppins } from "next/font/google";
import { ShieldCheck, Headphones, BadgeCheck } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function HomePage() {
  // No client state needed - search modal is handled in Header component

  return (
    <EmailVerificationWrapper>
      <div>
        {/*header*/}
        <Header />
        {/*hero section*/}
        <HomeHeroSection fontClassName={poppins.className} />
        {/* Trusted By Section */}
        <TrustedBySection />
        <section className="hidden md:block py-8 bg-white">
          <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
            <PopularCategory />
          </div>
        </section>
        {/**category for mobile*/}
        <section className="block md:hidden">
          <PopularCategory layout="vertical" />
        </section>

        {/* Totally Impressed Services Section */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
            <div className="flex items-center justify-between mb-8">
              <ScrollRevealText as="h2" className="text-3xl md:text-3xl font-semibold text-slate-900">
                On TASA...
              </ScrollRevealText>
              <ScrollRevealText variant="lifted" className="text-sm font-medium text-[#0F766E] hover:text-[#0D5F59] transition-colors">
                <Link href="/services">
                  View All
                </Link>
              </ScrollRevealText>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 items-center lg:justify-center">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-[560px]">
                {[
                  {
                    imageAlt: "Modern website design",
                    imageUrl:
                      "https://images.unsplash.com/photo-1754379657900-962db3a86873?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1200",
                    sellerName: "Wanda Runa",
                    sellerLevel: "Top Rated",
                    title: "I will design a creative modern website for you",
                    rating: 4.9,
                    reviews: 1200,
                    startingPrice: 120,
                  },
                  {
                    imageAlt: "Social media marketing manager",
                    imageUrl:
                      "https://images.unsplash.com/photo-1759215524500-8834e4935603?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1200",
                    sellerName: "Sara Lanti",
                    sellerLevel: "Level 2",
                    title: "I will be your social media marketing manager",
                    rating: 5.0,
                    reviews: 850,
                    startingPrice: 250,
                  },
                ].map((item, index) => (
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

        {/* Why Choose Tasa Section */}
        <WhyChooseTasa />

        <HowItWorksSection />

        {/* Ready To Get Started Section */}
        <CtaSection />

        <FooterLinksSection />

        {/* Search functionality is now handled in the Header component */}
      </div>
    </EmailVerificationWrapper>
  );
}
