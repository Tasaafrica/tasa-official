export interface FloatingBadge {
  type: string;
  label: string;
  title: string;
  iconName: string;
}

export interface WhyChooseItem {
  heading: string;
  description: string;
  skip?: boolean;
}

export interface CTAButton {
  label: string;
  href: string;
}

export interface WhyChooseTasaData {
  badge: string;
  heading: string;
  highlight: string;
  description: string;
  image: string;
  imageAlt: string;
  floatingBadges: FloatingBadge[];
  items: WhyChooseItem[];
  primaryCTA: CTAButton;
  secondaryCTA: CTAButton;
}
