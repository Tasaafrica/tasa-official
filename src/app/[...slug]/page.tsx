"use client";

import Header from "@/app/component/parts/header";
import NotFoundHero from "@/app/component/parts/NotFoundHero";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import EmailVerificationWrapper from "@/components/layout/EmailVerificationWrapper";

export default function CatchAllPage() {
  return (
    <EmailVerificationWrapper>
      <div>
        <Header />
        <NotFoundHero />
        <FooterLinksSection />
      </div>
    </EmailVerificationWrapper>
  );
}
