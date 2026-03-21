// ============================================
// TIPOS BASE (compatibles con Supabase)
// ============================================

export interface ProductImage {
  id: string
  url: string
  alt: string
  displayOrder: number
  isPrimary: boolean
}

export interface ProductVariant {
  id: string
  name: string
  sku: string | null
  size: string | null
  color: string | null
  colorHex: string | null
  priceAdjustment: number
  stock: number
  isActive: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

// ============================================
// PRODUCTO COMPLETO (para página de detalle)
// ============================================

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string | null
  price: number              // Precio actual de venta
  compareAtPrice: number | null  // Precio anterior (si hay descuento)
  sku: string | null
  stockQuantity: number
  category: Category
  images: ProductImage[]
  variants: ProductVariant[]
  isActive: boolean
  isFeatured: boolean
  isNew: boolean
  isSale: boolean            // Si está en oferta
  details: string[]
  care: string[]
  createdAt: string
  updatedAt: string
}

// ============================================
// PRODUCTO PARA LISTADOS (cards)
// ============================================

export interface ProductListItem {
  id: string
  name: string
  slug: string
  price: number              // Precio actual
  compareAtPrice: number | null  // Precio anterior
  image: string
  category: string
  categorySlug: string
  isNew: boolean
  isSale: boolean
  isFeatured: boolean
}

// ============================================
// COLECCIONES
// ============================================

export interface Collection {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  bannerUrl: string | null
  isFeatured: boolean
  isActive: boolean
  productCount?: number
}

export interface CollectionWithProducts extends Collection {
  products: ProductListItem[]
}

// ============================================
// RESPUESTAS DE API
// ============================================

export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  count: number
  page: number
  limit: number
  totalPages: number
}

// ============================================
// HELPERS DE TRANSFORMACIÓN
// ============================================

/**
 * Transforma datos de Supabase al formato Product
 */
export function transformProduct(data: any): Product {
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description || '',
    shortDescription: data.short_description,
    price: data.price,
    compareAtPrice: data.compare_at_price,
    sku: data.sku,
    stockQuantity: data.stock_quantity,
    category: {
      id: data.categories?.id || '',
      name: data.categories?.name || 'Sin categoría',
      slug: data.categories?.slug || '',
      description: data.categories?.description || null,
    },
    images: (data.product_images || [])
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((img: any) => ({
        id: img.id,
        url: img.url,
        alt: img.alt_text || data.name,
        displayOrder: img.display_order,
        isPrimary: img.is_primary,
      })),
    variants: (data.product_variants || [])
      .filter((v: any) => v.is_active)
      .map((variant: any) => ({
        id: variant.id,
        name: variant.name,
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        colorHex: variant.color_hex,
        priceAdjustment: variant.price_adjustment || 0,
        stock: variant.stock_quantity,
        isActive: variant.is_active,
      })),
    isActive: data.is_active,
    isFeatured: data.is_featured,
    isNew: data.is_new,
    isSale: data.is_on_sale,
    details: parseDetails(data.description),
    care: getDefaultCare(),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

/**
 * Transforma datos de Supabase al formato ProductListItem
 */
export function transformProductListItem(data: any): ProductListItem {
  const primaryImage = data.product_images?.find((img: any) => img.is_primary) 
    || data.product_images?.[0]

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    price: data.price,
    compareAtPrice: data.compare_at_price,
    image: primaryImage?.url || '/placeholder-product.jpg',
    category: data.categories?.name || 'Sin categoría',
    categorySlug: data.categories?.slug || '',
    isNew: data.is_new || false,
    isSale: data.is_on_sale || false,
    isFeatured: data.is_featured || false,
  }
}

// ============================================
// HELPERS DE PRECIO
// ============================================

/**
 * Calcula el porcentaje de descuento
 */
export function getDiscountPercentage(price: number, compareAtPrice: number | null): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0
  return Math.round((1 - price / compareAtPrice) * 100)
}

/**
 * Verifica si un producto tiene descuento válido
 */
export function hasDiscount(price: number, compareAtPrice: number | null): boolean {
  return !!compareAtPrice && compareAtPrice > price
}

// ============================================
// HELPERS INTERNOS
// ============================================

function parseDetails(description: string | null): string[] {
  if (!description) return []
  
  const sentences = description.split('. ').filter(s => s.length > 10)
  
  if (sentences.length >= 3) {
    return sentences.slice(0, 4).map(s => s.trim())
  }
  
  return [
    'Algodón 100% premium',
    'Corte regular fit',
    'Cuello redondo reforzado',
    'Lavable a máquina',
  ]
}

function getDefaultCare(): string[] {
  return [
    'Lavar a máquina a 30°C',
    'No usar blanqueador',
    'Planchar a temperatura media',
    'No lavar en seco',
  ]
}
