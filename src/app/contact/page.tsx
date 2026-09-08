import type { Metadata } from "next";
import ContactPage from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact TASA | Connect with TASA Support",
  description: "Get in touch with the TASA support team. Chat on WhatsApp, send us an email, or submit a support message directly. We are here to help.",
  keywords: ["Contact TASA", "TASA Support", "TASA WhatsApp Support", "Africa Freelancer Support"],
  openGraph: {
    title: "Contact TASA | Connect with TASA Support",
    description: "Get in touch with the TASA support team. We're here to help you get the most out of our talent platform.",
  },
};

export default function Page() {
  return <ContactPage />;
}
