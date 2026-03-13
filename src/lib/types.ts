export interface Category {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subcategory {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  categoryId: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Skill {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  subcategoryId: string;
  categoryId: string;
  description?: string;
  providers?: number;
  popular?: boolean;
  rating?: number;
  reviewCount?: number;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type SearchResult = {
  id: string;
  name: string;
  slug: string;
  type: "category" | "subcategory" | "skill";
  description?: string;
  parentName?: string;
};
