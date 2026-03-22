import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import EmailVerificationWrapper from "@/components/layout/EmailVerificationWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TASA | Skill and Service Hub | Young Talent Marketplace",
  description:
    "Connect with qualified professionals. Find expert services in programming, design, marketing, and more. Trusted platform for hiring skilled professionals.",
  keywords:
    "professional services, freelancers, experts, TASA, hiring, skilled professionals, young talents, skills, services",
  
};



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" data-scroll-behavior="smooth">
       <head>
        <title>TASA | Skill and Service Hub | Young Talent Marketplace</title>

        {/* Favicon */}
       <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
    <link rel="shortcut icon" href="/favicon/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="Tasa | Dashboard" />
    <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body>
        <SessionProvider session={session}>
          <EmailVerificationWrapper>{children}</EmailVerificationWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
