import type { Metadata } from "next";
import PrivacyPolicyClient from "./PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Protection | TASA Africa",
  description: "Comprehensive Privacy Policy for TASA Africa. Learn how we collect, process, and protect your data across Nigeria (NDPA 2023), South Africa (POPIA), EU/UK (GDPR), United States (CCPA/CPRA), and international jurisdictions.",
  keywords: [
    "TASA Africa Privacy Policy",
    "NDPA Nigeria Data Protection Act",
    "POPIA South Africa Privacy",
    "GDPR Compliance Africa",
    "CCPA CPRA Privacy Rights",
    "Freelance Marketplace Data Security",
    "African Tech Data Governance",
    "TASA Mobile App Privacy"
  ],
  openGraph: {
    title: "Privacy Policy & Data Protection | TASA Africa",
    description: "Learn about TASA Africa's global data protection standards, user rights, and regional compliance (NDPA, POPIA, GDPR, CCPA).",
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
