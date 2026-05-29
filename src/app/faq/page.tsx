import type { Metadata } from "next";
import FAQClient from "./FAQClient";

export const metadata: Metadata = {
  title: "FAQ | TASA",
  description: "Find answers to common questions about using TASA, from account setup and service listings to payments and dispute resolution.",
  keywords: ["TASA FAQ", "How to use TASA", "TASA Support", "Vendor Help", "Client Help"],
  openGraph: {
    title: "FAQ | TASA",
    description: "Everything you need to know about navigating the TASA platform.",
  },
};

export default function FAQPage() {
  return <FAQClient />;
}
