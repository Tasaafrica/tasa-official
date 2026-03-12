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

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
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
      `${baseUrl}/api/categories/${categorySlug}/subcategories`,
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

  // Fetch subcategories for this category
  const apiResponse = await fetch(
    `${baseUrl}/api/categories/${categorySlug}/subcategories`,
    {
      next: { revalidate: 3600 },
    },
  );

  if (!apiResponse.ok) {
    return notFound();
  }

  const responseJson = await apiResponse.json();
  let subcategories: Subcategory[] = responseJson.data || [];

  // Fetch skills for each subcategory in parallel
  const subcategoriesWithSkills = await Promise.all(
    subcategories.map(async (subcategory) => {
      try {
        const skillsRes = await fetch(
          `${baseUrl}/api/subcategories/${subcategory.slug}/skills`,
          {
            next: { revalidate: 3600 },
          },
        );

        if (!skillsRes.ok) {
          console.warn(
            `Skills API returned status ${skillsRes.status} for ${subcategory.slug}`,
          );
          return subcategory;
        }

        const skillsData = await skillsRes.json();

        // Debug: Log the full response structure
        console.log(`[${subcategory.slug}] Raw response:`, {
          hasData: !!skillsData.data,
          hasAllSkills: !!skillsData.allSkills,
          dataKeys: skillsData.data ? Object.keys(skillsData.data) : [],
          topLevelKeys: Object.keys(skillsData),
        });

        // Handle both response formats
        // Format 1: { data: { allSkills: [...], popularSkills: [...] } }
        // Format 2: { allSkills: [...], popularSkills: [...] }
        // Format 3: { data: [...] } (array directly)
        let skillsList = [];

        if (skillsData.data?.allSkills) {
          skillsList = skillsData.data.allSkills;
        } else if (skillsData.allSkills) {
          skillsList = skillsData.allSkills;
        } else if (Array.isArray(skillsData.data)) {
          skillsList = skillsData.data;
        } else if (Array.isArray(skillsData)) {
          skillsList = skillsData;
        }

        console.log(
          `[${subcategory.name}] Skills extracted:`,
          skillsList.length,
        );

        return {
          ...subcategory,
          skills: skillsList,
        };
      } catch (error) {
        console.error(`Error fetching skills for ${subcategory.slug}:`, error);
        return subcategory;
      }
    }),
  );

  return (
    <CategoriesPage
      categorySlug={categorySlug}
      subcategories={subcategoriesWithSkills}
    />
  );
}
