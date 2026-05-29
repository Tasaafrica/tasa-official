import CategoriesPage from "@/component-pages/CategoriesPages";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Skill {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId?: string;
  skills?: Skill[];
  icon?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

// Generate dynamic metadata based on fetched data
export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;

  try {
    const response = await fetch(
      `${baseUrl}/api/categories/slug/${categorySlug}`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      return {
        title: "Category | TASA",
        description:
          "Explore our categories and find the perfect professional for your needs.",
      };
    }

    const responseJson = await response.json();
    const categoryName = responseJson.data?.name || responseJson.name || categorySlug;

    return {
      title: `${categoryName} | TASA`,
      description: `Explore ${categoryName} services and find the perfect professional for your needs.`,
      openGraph: {
        title: `${categoryName} | TASA`,
        description: `Explore top ${categoryName} services on TASA.`,
      },
    };
  } catch (error) {
    return {
      title: "Category | TASA",
      description:
        "Explore our categories and find the perfect professional for your needs.",
    };
  }
}

export default async function CategoryPageWrapper(props: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await props.params;

  // Run fetches in parallel for better performance
  const [categoryResponse, skillsResponse] = await Promise.all([
    fetch(`${baseUrl}/api/categories/slug/${categorySlug}`, {
      next: { revalidate: 3600 },
    }),
    fetch(`${baseUrl}/api/categories/${categorySlug}/skills`, {
      next: { revalidate: 3600 },
    })
  ]);

  let categoryName = categorySlug;
  if (categoryResponse.ok) {
    const categoryData = await categoryResponse.json();
    categoryName = categoryData.data?.name || categoryData.name || categorySlug;
  }

  if (!skillsResponse.ok) {
    // If category exists but skills fail, we can still show the page with empty skills
    // but if the category itself didn't load properly and skills failed, maybe notFound
    if (!categoryResponse.ok) return notFound();
  }

  const skillsJson = skillsResponse.ok ? await skillsResponse.json() : { data: [] };

  // Support multiple response shapes from the API.
  let skillsList: Skill[] = [];
  const rawData = skillsJson.data || skillsJson;
  
  if (rawData.allSkills && Array.isArray(rawData.allSkills)) {
    skillsList = rawData.allSkills;
  } else if (rawData.skills && Array.isArray(rawData.skills)) {
    skillsList = rawData.skills;
  } else if (Array.isArray(rawData)) {
    skillsList = rawData;
  } else if (typeof rawData === 'object' && rawData !== null) {
    const possibleArray = Object.values(rawData).find(val => Array.isArray(val));
    if (possibleArray) skillsList = possibleArray as Skill[];
  }

  // Keep CategoriesPage contract by creating one flat skills group per category.
  const subcategoriesWithSkills: Subcategory[] = [
    {
      _id: categorySlug,
      name: "All Skills",
      slug: categorySlug,
      description: `All skills available in ${categoryName}.`,
      skills: skillsList,
    },
  ];

  return (
    <CategoriesPage
      categorySlug={categorySlug}
      categoryName={categoryName}
      subcategories={subcategoriesWithSkills}
    />
  );
}
