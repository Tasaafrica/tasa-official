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

const baseUrl =
  process.env.PRODUCTION_URL || "https://tasa-server.onrender.com";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

// Generate dynamic metadata based on fetched data
export async function generateMetadata({
  params,
}: {
  params: Promise<{ sid: string }>;
}): Promise<Metadata> {
  const { sid } = await params;

  try {
    const response = await fetch(`${baseUrl}/api/skills/${sid}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return {
        title: "Skill - TASA",
        description: "Find professional services for your needs.",
      };
    }

    const skillData = await response.json();
    const skill = skillData.data || skillData;

    return {
      title: `${skill.name} - TASA`,
      description: `Professional ${skill.name.toLowerCase()} services on TASA.`,
      openGraph: {
        title: `${skill.name} - TASA`,
        description: `Find top ${skill.name.toLowerCase()} professionals on TASA.`,
      },
    };
  } catch (error) {
    return {
      title: "Skill - TASA",
      description: "Find professional services for your needs.",
    };
  }
}

export default async function SkillPageWrapper(props: {
  params: Promise<{ sid: string }>;
}) {
  const { sid } = await props.params;

  // Validate skillId
  if (!sid || sid.trim() === "") {
    return notFound();
  }

  try {
    // Fetch skill details
    const skillResponse = await fetch(`${baseUrl}/api/skills/${sid}`, {
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
