export type UserSkill = {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
};

export type UserRecord = {
  _id: string;
  name: string;
  email: string;
  role?: string;
  profileImage?: string | null;
  bio?: string | null;
  company?: string | null;
  mobile?: string | null;
  whatsapp?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  location?: string | null;
  skills?: UserSkill[];
  rating?: number | null;
  isActive?: boolean;
  isEmailVerified?: boolean;
  emailVerifiedAt?: string | null;
  socialProvider?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
