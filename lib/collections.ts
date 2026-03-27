import { createClient } from '@/lib/supabase/server'
import { createStaticClient } from '@/lib/supabase/static'
import { 
  Collection, 
  CollectionWithProducts, 
  ProductListItem,
  transformProductListItem 
} from '@/types/product'

// ============================================
// OBTENER TODAS LAS COLECCIONES
// ============================================

export async function getAllCollections(options?: {
  featured?: boolean
  limit?: number
}): Promise<Collection[]> {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('collections')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (options?.featured) {
      query = query.eq('is_featured', true)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching collections:', error)
      return []
    }

    return (data || []).map(transformCollection)
  } catch (error) {
    console.error('Error in getAllCollections:', error)
    return []
  }
}

// ============================================
// OBTENER COLECCIONES DESTACADAS
// ============================================

export async function getFeaturedCollections(limit: number = 4): Promise<Collection[]> {
  return getAllCollections({ featured: true, limit })
}

// ============================================
// OBTENER COLECCIÓN DESTACADA CON PRODUCTOS (para home)
// ============================================

export async function getFeaturedCollectionWithProducts(productLimit: number = 4): Promise<CollectionWithProducts | null> {
  try {
    // Obtener la primera colección destacada
    const collections = await getFeaturedCollections(1)
    
    if (collections.length === 0) {
      return null
    }

    // Obtener la colección con sus productos
    return getCollectionBySlug(collections[0].slug, { limit: productLimit })
  } catch (error) {
    console.error('Error in getFeaturedCollectionWithProducts:', error)
    return null
  }
}

// ============================================
// OBTENER TODOS LOS SLUGS (para generateStaticParams)
// ============================================

export async function getAllCollectionSlugs(): Promise<string[]> {
  try {
    // Usar cliente estático (sin cookies) para build time
    const supabase = createStaticClient()

    const { data, error } = await supabase
      .from('collections')
      .select('slug')
      .eq('is_active', true)

    if (error) {
      console.error('Error fetching collection slugs:', error)
      return []
    }

    return data?.map((c) => c.slug) || []
  } catch (error) {
    console.error('Error in getAllCollectionSlugs:', error)
    return []
  }
}

// ============================================
// OBTENER COLECCIÓN POR SLUG CON PRODUCTOS
// ============================================

export async function getCollectionBySlug(
  slug: string,
  options?: {
    limit?: number
    page?: number
    sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'name'
  }
): Promise<CollectionWithProducts | null> {
  try {
    const supabase = await createClient()

    // Primero obtener la colección
    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (collectionError || !collection) {
      console.error('Error fetching collection:', collectionError)
      return null
    }

    // Luego obtener los productos de la colección
    const page = options?.page || 1
    const limit = options?.limit || 12
    const offset = (page - 1) * limit

    let productsQuery = supabase
      .from('product_collections')
      .select(`
        display_order,
        products!inner (
          id,
          name,
          slug,
          price,
          compare_at_price,
          is_featured,
          is_new,
          is_on_sale,
          created_at,
          product_images!inner (
            url,
            is_primary
          ),
          categories (
            name,
            slug
          )
        )
      `)
      .eq('collection_id', collection.id)
      .eq('products.is_active', true)
      .eq('products.product_images.is_primary', true)

    // Ordenamiento (por defecto: display_order de la colección)
    // Nota: Supabase no soporta ordenar por campos relacionados de forma nativa
    // así que ordenamos después de obtener los datos
    productsQuery = productsQuery.order('display_order', { ascending: true })

    // Paginación
    productsQuery = productsQuery.range(offset, offset + limit - 1)

    const { data: productsData, error: productsError } = await productsQuery

    if (productsError) {
      console.error('Error fetching collection products:', productsError)
      return {
        ...transformCollection(collection),
        products: [],
      }
    }

    // Transformar al formato esperado
    let products: ProductListItem[] = (productsData || []).map((item: any) => ({
      id: item.products.id,
      name: item.products.name,
      slug: item.products.slug,
      price: item.products.price,
      compareAtPrice: item.products.compare_at_price,
      image: item.products.product_images?.[0]?.url || '/placeholder-product.jpg',
      category: item.products.categories?.name || 'Sin categoría',
      categorySlug: item.products.categories?.slug || '',
      isNew: item.products.is_new || false,
      isSale: item.products.is_on_sale || false,
      isFeatured: item.products.is_featured || false,
    }))

    // Ordenar en memoria si se especificó sortBy
    if (options?.sortBy) {
      switch (options.sortBy) {
        case 'price_asc':
          products = products.sort((a, b) => a.price - b.price)
          break
        case 'price_desc':
          products = products.sort((a, b) => b.price - a.price)
          break
        case 'name':
          products = products.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'newest':
          // Ya vienen ordenados por display_order, no podemos ordenar por created_at
          // sin tener ese campo en el resultado
          break
      }
    }

    return {
      ...transformCollection(collection),
      products,
    }
  } catch (error) {
    console.error('Error in getCollectionBySlug:', error)
    return null
  }
}

// ============================================
// OBTENER CONTEO DE PRODUCTOS POR COLECCIÓN
// ============================================

export async function getCollectionProductCount(collectionId: string): Promise<number> {
  try {
    const supabase = await createClient()

    const { count, error } = await supabase
      .from('product_collections')
      .select('*', { count: 'exact', head: true })
      .eq('collection_id', collectionId)

    if (error) {
      console.error('Error counting collection products:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('Error in getCollectionProductCount:', error)
    return 0
  }
}

// ============================================
// HELPER DE TRANSFORMACIÓN
// ============================================

function transformCollection(data: any): Collection {
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    imageUrl: data.image_url,
    bannerUrl: data.banner_url,
    isFeatured: data.is_featured,
    isActive: data.is_active,
    productCount: data.product_count,
  }
}
