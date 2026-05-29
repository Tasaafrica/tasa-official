import type { Metadata } from "next";
import PrivacyPolicyClient from "./PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | TASA",
  description: "Your privacy is our priority. Learn how TASA collects, uses, and protects your data to provide a secure marketplace experience.",
  keywords: ["Privacy Policy", "Data Protection", "TASA Privacy"],
  openGraph: {
    title: "Privacy Policy | TASA",
    description: "Learn how we handle your data and protect your privacy.",
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
