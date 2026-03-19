// Tipos para productos - preparado para API

export interface ProductImage {
  id: string;
  src: string;
  alt: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  currency: string;
  images: ProductImage[];
  variants: ProductVariant[];
  category: {
    name: string;
    slug: string;
  };
  collection?: {
    name: string;
    slug: string;
  };
  details: string[];
  care: string[];
  isNew?: boolean;
  isSale?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
}

// Tipos para colecciones
export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  banner?: string;
  badge?: "permanent" | "current" | "capsule" | "upcoming";
  season?: string;
  year?: string;
  productCount: number;
  createdAt: string;
}

export interface CollectionWithProducts extends Collection {
  products: ProductListItem[];
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}