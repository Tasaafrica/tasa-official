import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
//import "./globals.css";
import Header from "../component/parts/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TASA | Categories | Skill and Service Hub",
  description:"Explore all skills and services",
  keywords:"skills, services, categories",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo/favicon.ico", sizes: "16x16", type: "image/x-icon" },
    ],
    apple: [
      { url: "/logo/logo_bg_teal.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    
        {children}
    </>
  );
}
