// Server Component - Better performance and SEO
import Header from "@/app/component/parts/header";
import PopularCategory from "@/app/component/parts/popularCategory";
import ImpressedServiceSection from "@/app/component/parts/impressedServiceSection";
import WhyChooseTasa from "@/app/component/parts/whyChooseTasa";
import HowItWorksSection from "@/app/component/parts/howItWorksSection";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import HomeHeroSection from "@/app/component/parts/homeHeroSection";
import TrustedBySection from "@/app/component/parts/trustedBySection";
import CtaSection from "@/app/component/parts/ctaSection";
import { Poppins } from "next/font/google";
import AfricanTalent from "@/app/component/parts/africanTalent";
import StudentCTA from "@/app/component/parts/studentCTA";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function HomePage() {
  // No client state needed - search modal is handled in Header component

  return (
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
        <ImpressedServiceSection />

        {/* African Talent Section */}
        <AfricanTalent />

        {/* Why Choose Tasa Section */}
        <WhyChooseTasa />

        {/* Student Enrollment Section */}
        <StudentCTA />

        <HowItWorksSection />

        {/* Ready To Get Started Section */}
        <CtaSection />

        <FooterLinksSection />

        {/* Search functionality is now handled in the Header component */}
      </div>
  );
}
