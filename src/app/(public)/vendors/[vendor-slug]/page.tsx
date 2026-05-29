import VendorsPage from "@/component-pages/VendorsPage";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds

interface Professional {
  _id: string;
  name: string;
  category?: string;
  bio?: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  profileImage?: string;
  skills?: string[];
  priceFrom?: number;
  priceCurrency?: string;
  isEmailVerified?: boolean;
  email?: string;
  mobile?: string;
  whatsapp?: string;
  country?: string;
  state?: string;
  city?: string;
  isActive?: boolean;
  slug?: string;
}

interface ApiResponse {
  success: boolean;
  data?: Professional;
  message?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchVendor(slug: string): Promise<Professional | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vendors/slug/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`[Vendor API] Failed to fetch vendor: ${response.status}`);
      return null;
    }

    const data: ApiResponse = await response.json();

    if (!data.success || !data.data) {
      console.error("[Vendor API] Invalid response format:", data);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error(
      "[Vendor API] Error fetching vendor:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "vendor-slug": string }>;
}): Promise<Metadata> {
  const { "vendor-slug": vendorSlug } = await params;

  if (!vendorSlug) {
    return {
      title: "Vendor Profile | TASA",
      description: "View vendor profile and services on TASA.",
    };
  }

  const vendor = await fetchVendor(vendorSlug);

  if (!vendor) {
    return {
      title: "Vendor Profile | TASA",
      description: "View vendor profile and services on TASA.",
    };
  }

  return {
    title: `${vendor.category ? `${vendor.category} | ` : ''}${vendor.name} | TASA`,
    description: (() => {
      const category = vendor.category || 'Professional';
      const location = vendor.state ? ` in ${vendor.state}` : '';
      const bio = vendor.bio
        ? vendor.bio.replace(/\s+/g, ' ').trim().slice(0, 120)
        : `Connect with trusted ${category.toLowerCase()}s on TASA`;

      return `${vendor.name} is a ${category}${location} on TASA. ${bio}`;
    })(),
    openGraph: {
      title: `${vendor.name}${vendor.category ? ` | ${vendor.category}` : ''} | TASA`,
      description: `${vendor.name} is a ${vendor.category || 'professional'} in ${vendor.state || 'your area'} on TASA. Connect and work with this vendor.`,
      url: `https://tasa.com/vendors/${vendor.slug}`,
      siteName: 'TASA',

      images: [
        {
          url: `https://tasa.com/api/og?title=${encodeURIComponent(vendor.name)}${vendor.category ? `&category=${encodeURIComponent(vendor.category)}` : ''}${vendor.state ? `&location=${encodeURIComponent(vendor.state)}` : ''}${vendor.profileImage ? `&image=${encodeURIComponent(vendor.profileImage)}` : ''}`,
          width: 1200,
          height: 630,
          alt: `${vendor.name} on TASA`,
        },
      ],
      locale: 'en_US',
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${vendor.name}${vendor.category ? ` | ${vendor.category}` : ''} | TASA`,
      description: `Connect with ${vendor.name} on TASA.`,
      images: [`https://tasa.com/api/og?title=${encodeURIComponent(vendor.name)}${vendor.category ? `&category=${encodeURIComponent(vendor.category)}` : ''}${vendor.state ? `&location=${encodeURIComponent(vendor.state)}` : ''}${vendor.profileImage ? `&image=${encodeURIComponent(vendor.profileImage)}` : ''}`],
    },
    alternates: {
  canonical: `https://tasa.com/vendors/${vendor.slug}`,
},
  };
}

export default async function VendorPageWrapper({
  params,
}: {
  params: Promise<{ "vendor-slug": string }>;
}) {
  const { "vendor-slug": vendorSlug } = await params;

  if (!vendorSlug) {
    return notFound();
  }

  const vendor = await fetchVendor(vendorSlug);
  console.log("Fetched Vendor:", vendor);

  if (!vendor) {
    return notFound();
  }

  return <VendorsPage professional={vendor} />;
}
