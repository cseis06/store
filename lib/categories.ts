import { createClient } from '@/lib/supabase/server'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  productCount?: number
}

// ============================================
// OBTENER TODAS LAS CATEGORÍAS
// ============================================

export async function getAllCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return (data || []).map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      imageUrl: cat.image_url,
    }))
  } catch (error) {
    console.error('Error in getAllCategories:', error)
    return []
  }
}

// ============================================
// OBTENER CATEGORÍAS CON CONTEO DE PRODUCTOS
// ============================================

export async function getCategoriesWithCount(): Promise<Category[]> {
  try {
    const supabase = await createClient()

    // Obtener categorías con conteo de productos activos
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        products!inner (
          id
        )
      `)
      .eq('is_active', true)
      .eq('products.is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      // Si falla el join, obtener solo categorías
      console.error('Error with join, falling back:', error)
      return getAllCategories()
    }

    return (data || []).map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      imageUrl: cat.image_url,
      productCount: cat.products?.length || 0,
    }))
  } catch (error) {
    console.error('Error in getCategoriesWithCount:', error)
    return []
  }
}
