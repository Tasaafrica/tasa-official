import VendorsPage from "@/component-pages/VendorsPage";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Professional {
  _id: string;
  name: string;
  title: string;
  bio: string;
  location: string;
  rating: number;
  reviewCount: number;
  profileImage: string;
  skills: string[];
  priceFrom: number;
  priceCurrency: string;
  verified: boolean;
}

// Dummy professionals data
const dummyProfessionals: Professional[] = [
  {
    _id: "prof1",
    name: "Kwame Osei",
    title: "Senior Expert",
    bio: "Highly experienced professional with 8+ years of expertise in this field. Specialized in delivering high-quality solutions with attention to detail and commitment to excellence.",
    location: "Accra, Ghana",
    rating: 4.9,
    reviewCount: 52,
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    skills: ["Advanced", "Certified", "Fast Delivery"],
    priceFrom: 15000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof2",
    name: "Amara Okafor",
    title: "Lead Professional",
    bio: "Expert in delivering high-quality results with attention to detail. Dedicated to understanding client needs and providing customized solutions that exceed expectations.",
    location: "Abuja, Nigeria",
    rating: 4.8,
    reviewCount: 38,
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    skills: ["Premium", "Verified", "Responsive"],
    priceFrom: 12000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof3",
    name: "Zuri Mutua",
    title: "Specialist",
    bio: "Specialized in delivering custom solutions tailored to your needs. With a focus on innovation and efficiency, I help businesses achieve their goals through strategic implementation.",
    location: "Nairobi, Kenya",
    rating: 4.7,
    reviewCount: 31,
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    skills: ["Custom", "Professional", "Dedicated"],
    priceFrom: 13000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof4",
    name: "Thabo Mkhize",
    title: "Expert Developer",
    bio: "Specializing in cutting-edge solutions and best practices. I bring technical expertise combined with strategic thinking to solve complex business challenges.",
    location: "Johannesburg, South Africa",
    rating: 4.6,
    reviewCount: 28,
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    skills: ["Modern Tech", "Scalable", "Reliable"],
    priceFrom: 16000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof5",
    name: "Ama Benneh",
    title: "Professional",
    bio: "Dedicated to providing excellent customer service and quality work. I believe in building long-term relationships with clients through reliable and professional service.",
    location: "Lagos, Nigeria",
    rating: 4.8,
    reviewCount: 42,
    profileImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop",
    skills: ["Quality", "On-time", "Professional"],
    priceFrom: 10000,
    priceCurrency: "₦",
    verified: false,
  },
  {
    _id: "prof6",
    name: "Kofi Asante",
    title: "Senior Expert",
    bio: "Years of experience delivering exceptional results to clients. I combine technical expertise with strategic thinking to create solutions that drive business growth.",
    location: "Dar es Salaam, Tanzania",
    rating: 4.9,
    reviewCount: 45,
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    skills: ["Mastery", "Excellence", "Trusted"],
    priceFrom: 18000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof7",
    name: "Naledi Khumalo",
    title: "Specialist",
    bio: "Focused on delivering innovative and creative solutions. I leverage the latest technologies and methodologies to help businesses stay competitive in their markets.",
    location: "Cape Town, South Africa",
    rating: 4.7,
    reviewCount: 35,
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    skills: ["Creative", "Innovative", "Fast"],
    priceFrom: 8000,
    priceCurrency: "₦",
    verified: false,
  },
  {
    _id: "prof8",
    name: "Juma Karanja",
    title: "Lead Developer",
    bio: "Expert in building scalable and robust solutions that stand the test of time. I focus on writing clean code and implementing best practices across all projects.",
    location: "Kampala, Uganda",
    rating: 4.6,
    reviewCount: 29,
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    skills: ["Scalable", "Robust", "Efficient"],
    priceFrom: 14000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof9",
    name: "Fatima Hassan",
    title: "Full Stack Expert",
    bio: "Comprehensive expertise across all aspects of the field. I bring a holistic approach to problem-solving and deliver end-to-end solutions that create real value.",
    location: "Dakar, Senegal",
    rating: 4.8,
    reviewCount: 39,
    profileImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop",
    skills: ["Full Stack", "Comprehensive", "Expert"],
    priceFrom: 11000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof10",
    name: "Sipho Ndlela",
    title: "Professional",
    bio: "Reliable and professional service delivery guaranteed. I take pride in understanding client requirements thoroughly and delivering beyond expectations.",
    location: "Gaborone, Botswana",
    rating: 4.5,
    reviewCount: 24,
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    skills: ["Reliable", "Professional", "Consistent"],
    priceFrom: 9000,
    priceCurrency: "₦",
    verified: false,
  },
  {
    _id: "prof11",
    name: "Abeba Tewolde",
    title: "Expert",
    bio: "Deep expertise combining theoretical and practical experience. I help clients navigate complex challenges with strategic solutions backed by proven methodologies.",
    location: "Addis Ababa, Ethiopia",
    rating: 4.7,
    reviewCount: 32,
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    skills: ["Expert", "Experienced", "Knowledge"],
    priceFrom: 5000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof12",
    name: "Obi Nwosu",
    title: "Senior Professional",
    bio: "Senior level expertise with proven track record. I bring leadership and strategic thinking to every project, ensuring successful outcomes and client satisfaction.",
    location: "Port Harcourt, Nigeria",
    rating: 4.6,
    reviewCount: 27,
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    skills: ["Senior", "Proven", "Trusted"],
    priceFrom: 13000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof13",
    name: "Hadiya Kimani",
    title: "Creative Expert",
    bio: "Creative problem solver with innovative approach. I think outside the box to develop unique solutions that set my clients apart from competition.",
    location: "Kigali, Rwanda",
    rating: 4.8,
    reviewCount: 40,
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    skills: ["Creative", "Innovative", "Problem Solver"],
    priceFrom: 7000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof14",
    name: "Idriss Diallo",
    title: "Master Expert",
    bio: "Mastery level expertise with exceptional results. I combine years of experience with continuous learning to deliver solutions that exceed industry standards.",
    location: "Kinshasa, DRC",
    rating: 4.9,
    reviewCount: 48,
    profileImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop",
    skills: ["Master", "Exceptional", "Excellence"],
    priceFrom: 20000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof15",
    name: "Zainab Traore",
    title: "Professional",
    bio: "Professional service with attention to quality and detail. I'm committed to delivering solutions that are not just good, but exceptional.",
    location: "Bamako, Mali",
    rating: 4.7,
    reviewCount: 33,
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    skills: ["Quality", "Detail", "Professional"],
    priceFrom: 6000,
    priceCurrency: "₦",
    verified: false,
  },
  {
    _id: "prof16",
    name: "Emeka Okonkwo",
    title: "Lead Expert",
    bio: "Leading the way in quality and innovation. I'm passionate about helping clients succeed through cutting-edge solutions and dedicated support.",
    location: "Lagos, Nigeria",
    rating: 4.8,
    reviewCount: 41,
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    skills: ["Leadership", "Innovation", "Quality"],
    priceFrom: 17000,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof17",
    name: "Grace Mensah",
    title: "Specialist",
    bio: "Specialized expertise in delivering specific solutions. I focus on understanding unique client needs and developing targeted strategies for success.",
    location: "Accra, Ghana",
    rating: 4.6,
    reviewCount: 26,
    profileImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    skills: ["Specialized", "Focused", "Expert"],
    priceFrom: 11000,
    priceCurrency: "₦",
    verified: false,
  },
  {
    _id: "prof18",
    name: "Hassan Ahmed",
    title: "Professional",
    bio: "Professional excellence in service delivery. I believe in transparency, reliability, and going the extra mile for my clients.",
    location: "Cairo, Egypt",
    rating: 4.7,
    reviewCount: 34,
    profileImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    skills: ["Professional", "Excellent", "Reliable"],
    priceFrom: 9500,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof19",
    name: "Chioma Nwankwo",
    title: "Expert Developer",
    bio: "Expert development with cutting-edge techniques. I stay current with industry trends and apply best practices to deliver future-proof solutions.",
    location: "Lagos, Nigeria",
    rating: 4.8,
    reviewCount: 43,
    profileImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop",
    skills: ["Development", "Modern", "Efficient"],
    priceFrom: 14500,
    priceCurrency: "₦",
    verified: true,
  },
  {
    _id: "prof20",
    name: "Mohamed Ibrahim",
    title: "Senior Expert",
    bio: "Senior level expertise with comprehensive knowledge. I provide strategic guidance and hands-on expertise to drive project success.",
    location: "Nairobi, Kenya",
    rating: 4.9,
    reviewCount: 50,
    profileImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop",
    skills: ["Senior", "Knowledge", "Experience"],
    priceFrom: 19000,
    priceCurrency: "₦",
    verified: true,
  },
];

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

// Generate dynamic metadata based on vendor data
export async function generateMetadata({
  params,
}: {
  params: Promise<{ vendorSlug: string }>;
}): Promise<Metadata> {
  try {
    const { vendorSlug: vendorId } = await params;

    if (!vendorId) {
      return {
        title: "Vendor Profile - TASA",
        description: "View vendor profile and services on TASA.",
      };
    }

    const vendor = dummyProfessionals.find((p) => p._id === vendorId);

    if (!vendor) {
      return {
        title: "Vendor Profile - TASA",
        description: "View vendor profile and services on TASA.",
      };
    }

    return {
      title: `${vendor.name} - ${vendor.title} - TASA`,
      description: `${vendor.name} - ${vendor.title}. ${vendor.bio}`,
      openGraph: {
        title: `${vendor.name} - TASA`,
        description: `${vendor.name} - ${vendor.title}. Connect with this professional on TASA.`,
        images: vendor.profileImage ? [{ url: vendor.profileImage }] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Vendor Profile - TASA",
      description: "View vendor profile and services on TASA.",
    };
  }
}

export default async function VendorPageWrapper({
  params,
}: {
  params: Promise<{ vendorSlug: string }>;
}) {
  try {
    const { vendorSlug: vendorId } = await params;

    if (!vendorId) {
      return notFound();
    }

    const vendor = dummyProfessionals.find((p) => p._id === vendorId);

    if (!vendor) {
      return notFound();
    }

    return <VendorsPage professional={vendor} />;
  } catch (error) {
    console.error("Error loading vendor:", error);
    return notFound();
  }
}
