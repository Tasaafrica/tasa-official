import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Students | Turn Your Skills into Real Income — Tasa Africa",
  appleWebApp: {
    title: "Tasa Africa",
    statusBarStyle: "default",
    capable: true,
  },
  description:
    "Are you a student in Africa with a creative, technical, or writing skill? Earn on your own schedule, build a verified portfolio, and launch your professional career before graduation on Tasa Africa.",
  keywords: [
    "Student freelancers Africa",
    "Student side income Africa",
    "Campus talent Africa",
    "Student gigs Africa",
    "Freelance for students",
    "Tasa Africa students",
    "Earn while studying Africa",
  ],
  openGraph: {
    title: "For Students | Turn Your Skills into Real Income — Tasa Africa",
    description:
      "Turn your creative, technical, or academic talents into income. Connect with verified clients across Africa and build your professional reputation.",
    url: "https://www.tasaafrica.com/students",
    siteName: "Tasa Africa",
    images: ["/image/nigerian-student.png"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "For Students | Turn Your Skills into Real Income — Tasa Africa",
    description:
      "Join the student freelance revolution. Earn flexible income, build verified client portfolios, and gain real-world experience.",
    images: ["/image/nigerian-student.png"],
  },
};

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
