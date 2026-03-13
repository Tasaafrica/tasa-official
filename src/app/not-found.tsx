import Header from "@/app/component/parts/header";
import NotFoundHero from "@/app/component/parts/NotFoundHero";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";

export const metadata = {
  title: "Page Not Found - TASA",
  description:
    "The page you're looking for doesn't exist. Let's get you back on track.",
};

export default function NotFound() {
  return (
    <div>
        <Header />
        <NotFoundHero />
        <FooterLinksSection />
    </div>
  );
}
