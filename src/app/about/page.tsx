import type { Metadata } from "next";
import AboutPage from "./AboutClient";

export const metadata: Metadata = {
  title: "About TASA | Redefining Africa's Talent Economy",
  description: "TASA is a bridge connecting youth potential with professional opportunities across Africa. Learn about our mission, vision, and the foundation of trust we are building.",
  keywords: ["TASA", "Africa", "Talent Marketplace", "Freelance Africa", "Service Marketplace Africa"],
  openGraph: {
    title: "About TASA | Redefining Africa's Talent Economy",
    description: "Empowering young individuals across Africa with professional opportunities.",
    images: ["/africa-sketch.svg"],
  },
};

export default function Page() {
  return <AboutPage />;
}
