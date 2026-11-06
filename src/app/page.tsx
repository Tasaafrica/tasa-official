// Server Component - Better performance and SEO

import ArtisansProfessionalsSection from "@/app/component/parts/artisansProfessionalsSection";
import CreativeSection from "@/app/component/parts/creativeSection";
import CtaSection from "@/app/component/parts/ctaSection";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import Header from "@/app/component/parts/header";
import HomeHeroSection from "@/app/component/parts/homeHeroSection";
// import ImpressedServiceSection from "@/app/component/parts/impressedServiceSection";
// import AfricanTalent from "@/app/component/parts/africanTalent";
// import WhyChooseTasa from "@/app/component/parts/whyChooseTasa";
// import HowItWorksSection from "@/app/component/parts/howItWorksSection";
import IndustriesCompaniesSection from "@/app/component/parts/industriesCompaniesSection";
import StudentCTA from "@/app/component/parts/studentCTA";
import WhyBeOnTasaSection from "@/app/component/parts/whyBeOnTasaSection";

import CustomContextMenu from "@/components/ui/CustomContextMenu";

export default function HomePage() {
  // No client state needed - search modal is handled in Header component

  return (
    <CustomContextMenu>
      <div>
        {/*header*/}
        <Header />
        {/*hero section*/}
        <HomeHeroSection fontClassName="font-display" />

        {/* Creative Section */}
        <CreativeSection />

        {/* Artisans & Professionals Section */}
        <ArtisansProfessionalsSection />

        {/* Industries & Companies Section */}
        <IndustriesCompaniesSection />

        {/* Hidden sections:
              - ImpressedServiceSection ("On TASA...")
              - AfricanTalent ("Diverse Talents & Services")
              - WhyChooseTasa (following section)
          */}

        {/* Student Enrollment Section */}
        <StudentCTA />

        {/* Hidden: <HowItWorksSection /> */}

        {/* Ready To Get Started Section */}
        <CtaSection />

        {/* Why You Should Be On Tasa Africa Section */}
        <WhyBeOnTasaSection />

        <FooterLinksSection />

        {/* Search functionality is now handled in the Header component */}
      </div>
    </CustomContextMenu>
  );
}
