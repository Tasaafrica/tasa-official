import Header from "@/app/component/parts/header";
import NotFoundHero from "@/app/component/parts/NotFoundHero";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import EmailVerificationWrapper from "@/components/layout/EmailVerificationWrapper";

export const metadata = {
  title: "Page Not Found - TASA",
  description:
    "The page you're looking for doesn't exist. Let's get you back on track.",
};

export default function NotFound() {
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
