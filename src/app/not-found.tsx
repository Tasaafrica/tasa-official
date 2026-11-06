import Header from "@/app/component/parts/header";
import NotFoundHero from "@/app/component/parts/NotFoundHero";
import NotFoundExplore from "@/app/component/parts/NotFoundExplore";
import FooterLinksSection from "@/app/component/parts/footerLinksSection";
import CustomContextMenu from "@/components/ui/CustomContextMenu";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Tasa Africa",
  description:
    "The page you're looking for doesn't exist. Search talent, discover businesses, or browse opportunities across Africa on Tasa Africa.",
  appleWebApp: {
    title: "Tasa Africa",
    statusBarStyle: "default",
    capable: true,
  },
};

export default function NotFound() {
  return (
    <CustomContextMenu>
      <div
        className="min-h-screen flex flex-col justify-between bg-[var(--color-bg-page)] text-[var(--color-text-primary)]"
        suppressHydrationWarning
      >
        <Header />
        <main className="flex-1">
          <NotFoundHero fontClassName="font-display" />
          <NotFoundExplore />
        </main>
        <FooterLinksSection />
      </div>
    </CustomContextMenu>
  );
}
