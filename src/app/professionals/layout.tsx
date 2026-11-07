import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Artisans & Professionals | Certified African Experts & Master Craftspeople — Tasa Africa",
  appleWebApp: {
    title: "Tasa Africa",
    statusBarStyle: "default",
    capable: true,
  },
  description:
    "Connect with Africa's certified executives, tech consultants, and master craftspeople. From engineering and advisory to carpentry, electrical, and fabrication. Vetted with institutional standards.",
  keywords: [
    "African professionals",
    "Certified African artisans",
    "African craftspeople",
    "Business consultants Africa",
    "Engineering talent Africa",
    "Technical trades Africa",
    "Tasa Africa professionals",
    "Tasa Africa artisans",
  ],
  openGraph: {
    title:
      "Artisans & Professionals | Certified African Experts & Master Craftspeople — Tasa Africa",
    description:
      "Certified executive minds and master craftspeople ready to build, scale, and deliver with uncompromised excellence across Africa.",
    url: "https://www.tasaafrica.com/professionals",
    siteName: "Tasa Africa",
    images: ["/image/male%20professional.png"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Artisans & Professionals | African Certified Experts & Craftspeople — Tasa Africa",
    description:
      "Connect with certified consultants and master craftspeople across Africa. Deliver projects with institutional-grade trust.",
    images: ["/image/female%20professional.png"],
  },
};

export default function ProfessionalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
