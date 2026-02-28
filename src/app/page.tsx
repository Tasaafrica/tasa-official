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
import { Poppins } from "next/font/google";
import {
  Search,
  CheckCircle,
  ChevronRight,
  ShieldCheck,
  Headphones,
  BadgeCheck,
} from "lucide-react";

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
        <section
          className={`${poppins.className} pt-20 pb-10 bg-[linear-gradient(90deg,#CCFBF1_0%,#CCFBF1_0%,#FFFFFF_100%)]`}
        >
          <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold tracking-wide text-teal-700 mb-3 hidden">
                  SkillMarket
                </p>
                <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-gray-900 mb-5">
                  Find the right skills and services for your business
                </h1>
                <p className="text-gray-600 text-base md:text-lg mb-6 max-w-xl">
                  Work with talented people at the most affordable price to get
                  the best services and results.
                </p>
                <div className="max-w-xl">
                  <div className="group flex flex-col sm:flex-row items-stretch gap-3 mb-4 bg-white border px-3 py-2 shadow-sm transition-all duration-200 focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-[#0F766E]/20 hover:shadow-md">
                    <div className="flex items-center gap-3 flex-1 px-2">
                      <Search className="h-4 w-4 text-gray-400 group-focus-within:text-[#0F766E] transition-colors duration-200" />
                      <input
                        type="text"
                        placeholder="What service are you looking for?"
                        className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                        aria-label="Search services"
                      />
                    </div>
                    <Button className="h-10 sm:h-11 rounded-50 bg-[#0F766E] hover:bg-[#0D5F59] text-white px-6 shadow-sm transition-all duration-200 hover:shadow-md">
                      Search
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span className="font-semibold text-[#334155]">
                      Popular:
                    </span>
                    {[
                      "Website Design",
                      "Logo Design",
                      "WordPress",
                      "AI Art",
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className="px-2.5 py-1  text-[#334155]-600 transition-all duration-200 hover:border-[#0F766E] hover:text-[#0F766E] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]/30"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative overflow-hidden rounded-2xl  aspect-[4/3]">
                  <div className="absolute inset-0 flex items-center justify-center  text-sm">
                    <img
                      src="hero-image.png"
                      alt="Hero Image"
                      className="w-full h-full object-fit-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </div>
                <div className="absolute -left-6 bottom-6 bg-[#334155] rounded-xl shadow-md px-4 py-3 border border-[#334155]">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-white">
                        Trusted &amp; Verified
                      </p>
                      <p className="text-sm font-semibold text-slate-200">
                        2k+ professionals
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Trusted By Section */}
        <section className="py-8 bg-white border-b border-slate-200 md:mx-20 lg:mx-32">
          <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-slate-400">
                <p className="text-xs uppercase tracking-[0.2em]">
                  Trusted by:
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6">
                {["Northstar", "BluePeak", "NovaWorks", "CloudMint"].map(
                  (brand) => (
                    <div
                      key={brand}
                      className="px-5 py-2 rounded-full border border-slate-200 bg-slate-50 text-slate-500 text-sm font-semibold tracking-wide"
                    >
                      {brand}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
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
              <h2 className="text-3xl md:text-3xl font-semibold text-slate-900">
                On TASA...
              </h2>
              <Link
                href="/services"
                className="text-sm font-medium text-[#0F766E] hover:text-[#0D5F59] transition-colors"
              >
                View All
              </Link>
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
                ].map((item) => (
                  <ImpressedServiceCard
                    key={item.title}
                    {...item}
                  />
                ))}
              </div>

              {/* Trust & Assurance Boxes */}
              <div className="grid gap-4 w-full lg:w-[360px]">
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
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Tasa Section */}
         <WhyChooseTasa />

        <HowItWorksSection />

        {/* Ready To Get Started Section */}
        <section className="py-16 md:py-24 bg-white text-black">
          <div className="container mx-auto px-6 sm:px-8 md:px-10 lg:px-16">
            <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_40px_rgba(15,23,42,0.18)] bg-[#0F766E]">
              <div className="grid md:grid-cols-2 items-stretch">
                <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
                  <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-6">
                    Find the talent needed
                    <br />
                    to get your business
                    <br />
                    growing.
                  </h2>
                  <Link href="/signup">
                    <Button className="w-fit bg-white text-[#0F766E] hover:bg-slate-100 font-semibold rounded-lg px-6 py-3 shadow-sm">
                      Get Started
                    </Button>
                  </Link>
                </div>
                <div className="relative min-h-[240px] md:min-h-[320px]">
                  <div className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1600"
                      alt="Team working together"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0F766E]/90 via-[#0F766E]/40 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <FooterLinksSection />

        {/* Search functionality is now handled in the Header component */}
      </div>
    </EmailVerificationWrapper>
  );
}
