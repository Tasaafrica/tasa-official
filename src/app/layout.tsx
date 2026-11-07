import { Geist, Geist_Mono, Climate_Crisis, Source_Sans_3, Poppins, Plus_Jakarta_Sans } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import EmailVerificationWrapper from "@/components/layout/EmailVerificationWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { AuthModalProvider } from "@/components/providers/AuthModalProvider";
import { SearchModalProvider } from "@/components/providers/SearchModalProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const climateCrisis = Climate_Crisis({
  variable: "--font-climate-crisis",
  subsets: ["latin"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tasa Africa | Skill and Service Hub | Young Talent Marketplace",
  description:
    "Connect with qualified professionals. Find expert services in programming, design, marketing, and more. Trusted platform for hiring skilled professionals.",
  keywords:
    "professional services, freelancers, experts, TASA, hiring, skilled professionals, young talents, skills, services, African Talents, Remote Jobs",
  icons: {
    icon: [
      {
        url: "/icon0.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon1.png",
        type: "image/png",
        sizes: "96x96",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon0-light.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon1-light.png",
        type: "image/png",
        sizes: "96x96",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    shortcut: [
      {
        url: "/favicon.ico",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-light.ico",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/apple-icon-light.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    title: "Tasa Africa",
    statusBarStyle: "default",
    capable: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <title>Tasa Africa | Skill and Service Hub | Young Talent Marketplace</title>

        {/* Favicons (Light Mode) */}
        <link rel="icon" href="/icon0.svg" type="image/svg+xml" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/icon1.png" type="image/png" sizes="96x96" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/favicon.ico" sizes="any" media="(prefers-color-scheme: light)" />
        <link rel="apple-touch-icon" href="/apple-icon.png" media="(prefers-color-scheme: light)" />

        {/* Favicons (Dark Mode - White icon for dark tabs) */}
        <link rel="icon" href="/icon0-light.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href="/icon1-light.png" type="image/png" sizes="96x96" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href="/favicon-light.ico" sizes="any" media="(prefers-color-scheme: dark)" />
        <link rel="apple-touch-icon" href="/apple-icon-light.png" media="(prefers-color-scheme: dark)" />

        <meta name="apple-mobile-web-app-title" content="Tasa Africa" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${climateCrisis.variable} ${sourceSans.variable} ${poppins.variable} ${plusJakartaSans.variable} font-poppins`}>
        {/**Google analytics */}
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <SessionProvider session={session}>
          <SearchModalProvider>
            <AuthModalProvider>
              <Toaster position="top-right" richColors />
              <EmailVerificationWrapper>{children}</EmailVerificationWrapper>
            </AuthModalProvider>
          </SearchModalProvider>
        </SessionProvider>
        {/**vercel analytics */}
        <Analytics />
      </body>
    </html>
  );
}
