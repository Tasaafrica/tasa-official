import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "For Industries & Companies | Enterprise Talent & Vendor Solutions — Tasa Africa",
  appleWebApp: {
    title: "Tasa Africa",
    statusBarStyle: "default",
    capable: true,
  },
  description:
    "Scale corporate operations with Africa's verified technical workforce, specialized vendor firms, and institutional SLA compliance. Bespoke solutions for enterprises, SMEs, and institutions.",
  keywords: [
    "Enterprise talent Africa",
    "Corporate workforce Africa",
    "Vendor firms Africa",
    "Technical contracting Africa",
    "Tasa Africa for industries",
    "SLA talent management Africa",
    "B2B freelance solutions",
  ],
  openGraph: {
    title: "For Industries & Companies | Enterprise Talent Solutions — Tasa Africa",
    description:
      "Deploy contracted specialist teams and verified vendor firms with institutional compliance and dedicated account management.",
    url: "https://www.tasaafrica.com/industries",
    siteName: "Tasa Africa",
    images: ["/image/corporate-skyscrapers.png"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "For Industries & Companies | Enterprise Solutions — Tasa Africa",
    description:
      "Scale corporate operations with verified technical workforce and institutional SLA contracts.",
    images: ["/image/corporate-skyscrapers.png"],
  },
};

export default function IndustriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
