"use client";

import Header from "@/app/component/parts/header";
import NotFoundHero from "@/app/component/parts/NotFoundHero";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";

export default function CatchAllPage() {
  return (
    <div>
        <Header />
        <NotFoundHero />
        <FooterLinksSection />
    </div>
  );
}
