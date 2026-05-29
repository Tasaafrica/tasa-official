import SkillsPage from "@/component-pages/SkillsPage";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Skill {
  subcategory: any;
  category: any;
  _id: string;
  name: string;
  slug: string;
  description?: string;
  providers?: number;
  popular?: boolean;
  rating?: number;
  reviewCount?: number;
  categoryId?: string;
  subcategoryId?: string;
  icon?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

// Generate dynamic metadata for better SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await fetch(`${baseUrl}/api/skills/slug/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return {
        title: "Professional Services | TASA",
        description: "Find expert professional services tailored to your needs on TASA.",
      };
    }

    const skillData = await response.json();
    const skill = skillData.data || skillData;
    
    // Extract names for contextual SEO
    const skillName = skill.name || "Professional Skill";
    const categoryName = skill.category?.name || "";
    const pageTitle = `${skillName} | TASA`;
    const seoDescription = skill.description 
      ? skill.description.slice(0, 160) 
      : `Get expert ${skillName} services from top-rated professionals on the TASA marketplace.`;

    return {
      title: pageTitle,
      description: seoDescription,
      keywords: [skillName, categoryName, "Professional Services", "Hire Experts", "TASA"].filter(Boolean),
      openGraph: {
        title: pageTitle,
        description: seoDescription,
        type: "website",
        siteName: "TASA",
        images: [
          {
            url: `/categoryhero/${skill.category?.slug || 'graphics-design'}.png`, // Try to use category image as preview
            width: 1200,
            height: 630,
            alt: `${skillName} on TASA`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: pageTitle,
        description: seoDescription,
      },
    };
  } catch (error) {
    return {
      title: "Hire Expert Professionals | TASA",
      description: "Explore expert skills and professional services on the TASA marketplace.",
    };
  }
}

export default async function SkillPageWrapper(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  // Validate slug
  if (!slug || slug.trim() === "") {
    return notFound();
  }

  try {
    // Fetch skill details
    const skillResponse = await fetch(`${baseUrl}/api/skills/slug/${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!skillResponse.ok) {
      return notFound();
    }

    const skillData = await skillResponse.json();
    const skill: Skill = skillData.data || skillData;

    if (!skill || !skill._id) {
      return notFound();
    }

    return <SkillsPage skill={skill} />;
  } catch (error) {
    console.error("Error in SkillPageWrapper:", error);
    return notFound();
  }
}
