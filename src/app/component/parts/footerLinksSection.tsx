interface FooterLink {
  title?: string;
  name?: string;
  links: string;
  disabled?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const categories: FooterLink[] = [
  {
    title: "Graphics & Design",
    links: "/categories/graphics-design",
  },
  {
    title: "Digital Marketing",
    links: "/categories/digital-marketing",
  },
  {
    title: "Writing & Translation",
    links: "/categories/writing-translation",
  },
  {
    title: "Video & Animation",
    links: "/categories/video-animation",
  },
  {
    title: "Music & Audio",
    links: "/categories/music-audio",
  },
  {
    title: "Programming & Tech",
    links: "/categories/programming-tech",
  },
  {
    title: "Data & AI",
    links: "/categories/data-ai",
  },
  {
    title: "Business & Consulting",
    links: "/categories/business-consulting",
  },
  {
    title: "Lifestyle & Wellness",
    links: "/categories/lifestyle-wellness",
  },
  {
    title: "Personal & Errand Services",
    links: "/categories/personal-errand-services",
  },
  {
    title: "Home & Maintenance",
    links: "/categories/home-maintenance",
  },
  {
    title: "Events & Logistics",
    links: "/categories/events-logistics",
  },
];

const clientsLinks: FooterLink[] = [
  {
    name: "For Business & Clients",
    links: "/how-tasa-works",
  },
  {
    name: "For Investors",
    links: "/investors",
    disabled: true,
  },
  {
    name: "How TASA Works",
    links: "/how-tasa-works",
  },
  {
    name: "Customer Success Stories",
    links: "/customer-success-stories",
    disabled: true,
  },
  {
    name: "Trust & Safety",
    links: "/trust-safety",
    disabled: true,
  },
  {
    name: "Quality Guide",
    links: "/quality-guide",
    disabled: true,
  },
];

const freelancersLinks: FooterLink[] = [
  {
    name: "Tasa for Creatives",
    links: "/creatives",
  },
  {
    name: "Tasa for Professionals",
    links: "/professionals",
  },
  {
    name: "Tasa for Artisans",
    links: "/professionals",
  },
  {
    name: "Tasa for Students",
    links: "/students",
  },
  {
    name: "Tasa for Minors",
    links: "/tasa-for-minors",
    disabled: true,
  },
  {
    name: "Tasa for Business",
    links: "/industries",
  },
  {
    name: "Vendor Support",
    links: "/vendor-support",
    disabled: true,
  },
  {
    name: "Vendor Resources",
    links: "/vendor-resources",
    disabled: true,
  },
  {
    name: "Events",
    links: "/events",
    disabled: true,
  },
];

const _businessLinks: FooterLink[] = [
  {
    name: "TASA Pro",
    links: "/tasa-pro",
  },
  {
    name: "Project Management Service",
    links: "/project-management-service",
  },
  {
    name: "ClearVoice - Content Marketing",
    links: "/clearvoice-content-marketing",
  },
  {
    name: "Contact Sales",
    links: "/contact-sales",
  },
];

const companyLinks: FooterLink[] = [
  {
    name: "About TASA",
    links: "/about",
  },
  {
    name: "Investment & Funding",
    links: "/investment-funding",
    disabled: true,
  },
  {
    name: "Blog",
    links: "/blog",
  },
  {
    name: "FAQ",
    links: "/faq",
  },
  {
    name: "Contact Us",
    links: "/contact",
  },
  {
    name: "Partnerships",
    links: "/partnerships",
    disabled: true,
  },
  {
    name: "Privacy Policy",
    links: "/privacy-policy",
  },
  {
    name: "Terms of Service",
    links: "/terms-of-service",
  },
];

const columns: FooterColumn[] = [
  {
    title: "Industry",
    links: categories,
  },
  {
    title: "For Clients",
    links: clientsLinks,
  },
  {
    title: "For Talents",
    links: freelancersLinks,
  },
  {
    title: "Company",
    links: companyLinks,
  },
];

import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaLinkedin, FaXTwitter } from "react-icons/fa6";

const FooterLinksSection = () => (
  <div className="relative z-50 mx-auto bg-[#0F172A] w-full border-t border-slate-700">
    <div className="container-responsive py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left">
        {columns.map((column) => (
          <div
            key={column.title}
            className="flex flex-col items-center md:items-start"
          >
            <h3 className="text-base font-bold mb-5 text-white uppercase tracking-wider">
              {column.title}
            </h3>
            <ul className="space-y-3">
              {column.links.map((item) => (
                <li key={`${item.title || item.name}-${item.links}`}>
                  {item.disabled ? (
                    <span className="text-sm text-slate-500/70 select-none cursor-not-allowed">
                      {item.title || item.name}
                    </span>
                  ) : (
                    <Link
                      href={`${item.links}`}
                      className="text-sm text-slate-100 hover:text-[var(--color-brand-secondary)] transition-colors duration-200"
                    >
                      {item.title || item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
    {/* Footer - A simple copyright, main footer likely in layout.tsx */}
    <footer className="py-8 text-sm text-slate-500 dark:text-slate-400">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        {/* Logo left */}
        <div className="flex items-center justify-center md:justify-start w-full md:w-auto mb-2 md:mb-0">
          <Link href="/">
            <Image
              src="/logos/TAL_1.png"
              alt="TASA Logo"
              width={240}
              height={200}
              className="h-16 sm:h-18 w-auto object-contain cursor-pointer brightness-0 invert transition-transform duration-200 hover:scale-[1.02]"
            />
          </Link>
        </div>
        {/* Copyright center */}
        <div className="flex-1 text-center text-slate-300">
          <p>
            &copy; {new Date().getFullYear()} TASA Africa - Skill and Service
            marketplace. All rights reserved.
          </p>
        </div>
        {/* Social icons right */}
        <div className="flex items-center justify-center md:justify-end w-full md:w-auto gap-4 px-2 text-slate-300">
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-[var(--color-brand-secondary)] transition-colors p-2"
          >
            <FaXTwitter className="h-5 w-5" />
          </a>
          <a
            href="https://facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-[var(--color-brand-secondary)] transition-colors p-2"
          >
            <FaFacebook className="h-5 w-5" />
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-[var(--color-brand-secondary)] transition-colors p-2"
          >
            <FaLinkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  </div>
);

export default FooterLinksSection;
