import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Creatives | Build Your Global Creative Career — Tasa Africa",
  appleWebApp: {
    title: "Tasa Africa",
    statusBarStyle: "default",
    capable: true,
  },
  description:
    "Join Africa's premier platform for creative visionaries, designers, animators, filmmakers, and sound artists. Connect with top brands, protect your income with milestone escrow, and expand your craft borderless.",
  keywords: [
    "African creatives",
    "Creative freelance platform",
    "African digital artists",
    "Graphic designers Africa",
    "Motion designers Africa",
    "Cinematography Africa",
    "African creative community",
    "Tasa Africa creatives",
  ],
  openGraph: {
    title: "For Creatives | Build Your Global Creative Career — Tasa Africa",
    description:
      "Your craft. Your terms. Connect with clients who value African creative excellence, get paid securely through escrow, and grow globally.",
    url: "https://www.tasaafrica.com/creatives",
    siteName: "Tasa Africa",
    images: [
      "/image/Defy%20Conventional%20Boundaries_%20Creative%20Culture%20Collage.png",
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "For Creatives | Build Your Global Creative Career — Tasa Africa",
    description:
      "Your craft. Your terms. Connect with clients who value African creative excellence, get paid securely through escrow, and grow globally.",
    images: [
      "/image/Defy%20Conventional%20Boundaries_%20Creative%20Culture%20Collage.png",
    ],
  },
};

export default function CreativesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
