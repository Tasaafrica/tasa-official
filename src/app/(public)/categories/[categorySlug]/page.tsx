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
      `${baseUrl}/api/categories/${categorySlug}/skills`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      return {
        title: "Category - TASA",
        description:
          "Explore our categories and find the perfect professional for your needs.",
      };
    }

    const capitalizeFirstLetter = (slug: string) => {
      return slug.charAt(0).toUpperCase() + slug.slice(1);
    };

    return {
      title: `${capitalizeFirstLetter(categorySlug)} - TASA`,
      description: `Explore ${capitalizeFirstLetter(
        categorySlug,
      )} services and find the perfect professional for your needs.`,
      openGraph: {
        title: `${capitalizeFirstLetter(categorySlug)} - TASA`,
        description: `Explore top ${capitalizeFirstLetter(categorySlug)} services on TASA.`,
      },
    };
  } catch (error) {
    return {
      title: "Category - TASA",
      description:
        "Explore our categories and find the perfect professional for your needs.",
    };
  }
}

export default async function CategoryPageWrapper(props: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await props.params;

  // Fetch skills directly for this category (no subcategory grouping).
  const apiResponse = await fetch(
    `${baseUrl}/api/categories/${categorySlug}/skills`,
    {
      next: { revalidate: 3600 },
    },
  );

  if (!apiResponse.ok) {
    return notFound();
  }

  const responseJson = await apiResponse.json();

  // Support multiple response shapes from the API.
  let skillsList: Skill[] = [];
  if (responseJson.data?.allSkills) {
    skillsList = responseJson.data.allSkills;
  } else if (responseJson.allSkills) {
    skillsList = responseJson.allSkills;
  } else if (Array.isArray(responseJson.data)) {
    skillsList = responseJson.data;
  } else if (Array.isArray(responseJson)) {
    skillsList = responseJson;
  }

  // Keep CategoriesPage contract by creating one flat skills group per category.
  const subcategoriesWithSkills: Subcategory[] = [
    {
      _id: categorySlug,
      name: "All Skills",
      slug: categorySlug,
      description: `All skills available in ${categorySlug}.`,
      skills: skillsList,
    },
  ];

  return (
    <CategoriesPage
      categorySlug={categorySlug}
      subcategories={subcategoriesWithSkills}
    />
  );
}
