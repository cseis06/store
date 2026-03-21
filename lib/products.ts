import { createClient } from '@/lib/supabase/server'
import { createStaticClient } from '@/lib/supabase/static'
import { 
  Product, 
  ProductListItem, 
  ApiResponse, 
  PaginatedResponse,
  transformProduct,
  transformProductListItem 
} from '@/types/product'

// ============================================
// OBTENER PRODUCTO POR SLUG
// ============================================

export async function getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          description
        ),
        product_images (
          id,
          url,
          alt_text,
          display_order,
          is_primary
        ),
        product_variants (
          id,
          name,
          sku,
          size,
          color,
          color_hex,
          price_adjustment,
          stock_quantity,
          is_active
        )
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return { success: false, data: null, error: 'Producto no encontrado' }
    }

    return {
      success: true,
      data: transformProduct(data),
    }
  } catch (error) {
    console.error('Error in getProductBySlug:', error)
    return { success: false, data: null, error: 'Error al obtener el producto' }
  }
}

// ============================================
// OBTENER TODOS LOS SLUGS (para generateStaticParams)
// Usa cliente estático porque se ejecuta en build time
// ============================================

export async function getAllProductSlugs(): Promise<string[]> {
  try {
    // Usar cliente estático (sin cookies) para build time
    const supabase = createStaticClient()

    const { data, error } = await supabase
      .from('products')
      .select('slug')
      .eq('is_active', true)

    if (error) {
      console.error('Error fetching slugs:', error)
      return []
    }

    return data?.map((p) => p.slug) || []
  } catch (error) {
    console.error('Error in getAllProductSlugs:', error)
    return []
  }
}

// ============================================
// OBTENER PRODUCTOS RELACIONADOS
// ============================================

export async function getRelatedProducts(
  categorySlug: string,
  excludeProductId: string,
  limit: number = 4
): Promise<ProductListItem[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        compare_at_price,
        is_new,
        is_on_sale,
        is_featured,
        categories!inner (
          name,
          slug
        ),
        product_images!inner (
          url,
          is_primary
        )
      `)
      .eq('is_active', true)
      .eq('categories.slug', categorySlug)
      .eq('product_images.is_primary', true)
      .neq('id', excludeProductId)
      .limit(limit)

    if (error) {
      console.error('Error fetching related products:', error)
      return []
    }

    return (data || []).map(transformProductListItem)
  } catch (error) {
    console.error('Error in getRelatedProducts:', error)
    return []
  }
}

// ============================================
// OBTENER PRODUCTOS CON FILTROS
// ============================================

export async function getProducts(options?: {
  categorySlug?: string
  collectionSlug?: string
  featured?: boolean
  onSale?: boolean
  isNew?: boolean
  search?: string
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'name'
  page?: number
  limit?: number
}): Promise<PaginatedResponse<ProductListItem>> {
  try {
    const supabase = await createClient()
    const page = options?.page || 1
    const limit = options?.limit || 12
    const offset = (page - 1) * limit

    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        compare_at_price,
        is_new,
        is_on_sale,
        is_featured,
        created_at,
        categories (
          name,
          slug
        ),
        product_images!inner (
          url,
          is_primary
        )
      `, { count: 'exact' })
      .eq('is_active', true)
      .eq('product_images.is_primary', true)

    // Filtros
    if (options?.categorySlug) {
      query = query.eq('categories.slug', options.categorySlug)
    }

    if (options?.featured) {
      query = query.eq('is_featured', true)
    }

    if (options?.onSale) {
      query = query.eq('is_on_sale', true)
    }

    if (options?.isNew) {
      query = query.eq('is_new', true)
    }

    if (options?.search) {
      query = query.ilike('name', `%${options.search}%`)
    }

    // Ordenamiento
    switch (options?.sortBy) {
      case 'price_asc':
        query = query.order('price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'name':
        query = query.order('name', { ascending: true })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    // Paginación
    query = query.range(offset, offset + limit - 1)

    const { data, count, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return {
        success: false,
        data: [],
        count: 0,
        page,
        limit,
        totalPages: 0,
      }
    }

    return {
      success: true,
      data: (data || []).map(transformProductListItem),
      count: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  } catch (error) {
    console.error('Error in getProducts:', error)
    return {
      success: false,
      data: [],
      count: 0,
      page: 1,
      limit: 12,
      totalPages: 0,
    }
  }
}

// ============================================
// SHORTCUTS
// ============================================

export async function getFeaturedProducts(limit: number = 8): Promise<ProductListItem[]> {
  const response = await getProducts({ featured: true, limit })
  return response.data
}

export async function getSaleProducts(limit: number = 8): Promise<ProductListItem[]> {
  const response = await getProducts({ onSale: true, limit })
  return response.data
}

export async function getNewProducts(limit: number = 8): Promise<ProductListItem[]> {
  const response = await getProducts({ isNew: true, sortBy: 'newest', limit })
  return response.data
}

export async function searchProducts(query: string, limit: number = 12): Promise<ProductListItem[]> {
  const response = await getProducts({ search: query, limit })
  return response.data
}
