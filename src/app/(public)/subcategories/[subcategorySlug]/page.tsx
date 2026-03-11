import SubcategoryPage from "@/component-pages/SubCategoryPage";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Skill {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  providers?: number;
  popular?: boolean;
  rating?: number;
  reviewCount?: number;
  category?: string;
  icon?: string;
}

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId?: string;
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
}

interface SkillsData {
  popularSkills: Skill[];
  allSkills: Skill[];
}

const baseUrl =
  process.env.PRODUCTION_URL || "https://tasa-server.onrender.com";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

// Generate dynamic metadata based on fetched data
export async function generateMetadata({
  params,
}: {
  params: Promise<{ subcategorySlug: string }>;
}): Promise<Metadata> {
  const { subcategorySlug } = await params;

  try {
    const response = await fetch(
      `${baseUrl}/api/subcategories/slug/${subcategorySlug}`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      return {
        title: "Subcategory - TASA",
        description:
          "Explore our wide range of skills and find the perfect match for your needs.",
      };
    }

    const subcategory: Subcategory = await response.json();

    return {
      title: `${subcategory.name} - TASA`,
      description:
        subcategory.description ||
        `Explore top ${subcategory.name} professionals on TASA. Find the perfect expert for your project needs.`,
      openGraph: {
        title: `${subcategory.name} - TASA`,
        description:
          subcategory.description ||
          `Explore top ${subcategory.name} professionals on TASA.`,
      },
    };
  } catch (error) {
    return {
      title: "Subcategory - TASA",
      description:
        "Explore our wide range of skills and find the perfect match for your needs.",
    };
  }
}

export default async function SubcategoryPageWrapper(props: {
  params: Promise<{ subcategorySlug: string }>;
}) {
  const { subcategorySlug } = await props.params;

  // Fetch subcategory details
  const apiResponse = await fetch(
    `${baseUrl}/api/subcategories/slug/${subcategorySlug}`,
    {
      next: { revalidate: 3600 },
    },
  );

  if (!apiResponse.ok) {
    return notFound();
  }

  const subcategory: Subcategory = await apiResponse.json();

  // Fetch skills for this subcategory
  const skillsRes = await fetch(
    `${baseUrl}/api/subcategories/${subcategorySlug}/skills`,
    {
      next: { revalidate: 3600 },
    },
  );

  if (!skillsRes.ok) {
    return notFound();
  }

  const skillsJson = await skillsRes.json();
  const skills: SkillsData = skillsJson.data || {
    popularSkills: [],
    allSkills: [],
  };

  return <SubcategoryPage subcategory={subcategory} skills={skills} />;
}
