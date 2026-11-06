import type { WhyChooseTasaData } from "./types";

export const tasaForIndustries: WhyChooseTasaData = {
  badge: "Why Choose Tasa Africa",
  heading: "Scale Enterprise Operations.",
  highlight: "Backed by Africa's Top Verified Talent.",
  description:
    "Connect with trusted business networks, procure specialized services, forge strategic B2B partnerships, and tap into continent-wide expertise to accelerate your business growth across Africa.",
  image: "/image/corporate-skyscrapers.png",
  imageAlt:
    "Modern corporate skyscrapers symbolizing enterprise capability across African markets",
  floatingBadges: [
    {
      type: "compliance",
      label: "Compliance",
      title: "Institutional SLA",
      iconName: "Building2",
    },
    {
      type: "escrow",
      label: "Escrow",
      title: "Milestone Protection",
      iconName: "ShieldCheck",
    },
  ],
  items: [
    {
      heading: "Put Your Business on the Map",
      description:
        "Give your business a place to be discovered. Create a profile, showcase what you do, highlight your products and services, and help potential customers and partners find out more about your business.",
      skip: false,
    },
    {
      heading: "Find the People Who Move Your Business Forward",
      description:
        "Every business needs the right people to get things done. Whether you need someone for a specific project, a specialist for a particular task, or employees for long-term roles, connect with skilled professionals who can help you move forward.",
      skip: false,
    },
    {
      heading: "Turn Business Connections Into Partnerships",
      description:
        "Sometimes, growth comes from working with the right people. Connect with other businesses, explore ways to collaborate, share opportunities, and build partnerships that create value for everyone involved.",
      skip: false,
    },
    {
      heading: "Discover New Markets and Business Opportunities",
      description:
        "Your next big opportunity could be outside your usual network. Discover projects, contracts, new markets and business opportunities that can help you reach more customers and take your business further.",
      skip: false,
    },
    {
      heading: "Explore Funding and Investment Opportunities",
      description:
        "Growing a business often requires more than a good idea. Whether you're looking for capital to expand, launch a new product or take on bigger projects, discover potential investors and funding opportunities that align with your business goals.",
      skip: false,
    },
    {
      heading: "Find the Services Your Business Needs",
      description:
        "You don't have to do everything yourself. From technology and marketing to accounting, logistics, maintenance and other professional services, connect with service providers who can help you run your business better.",
      skip: false,
    },
    {
      heading: "Build Relationships Beyond a Single Transaction",
      description:
        "Good business relationships shouldn't end after one job. Connect with clients, suppliers, professionals and other businesses you can work with again. Build lasting relationships that create room for more opportunities and sustainable growth.",
      skip: false,
    },
  ],
  primaryCTA: {
    label: "Partner as an Enterprise",
    href: "/contact",
  },
  secondaryCTA: {
    label: "Explore Enterprise Solutions",
    href: "/categories",
  },
};

export default tasaForIndustries;
