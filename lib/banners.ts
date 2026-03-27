import { createClient } from '@/lib/supabase/server'

export interface Banner {
  id: string
  type: 'hero' | 'promo' | 'category'
  title: string | null
  subtitle: string | null
  description: string | null
  ctaText: string | null
  ctaLink: string | null
  imageUrl: string | null
  imageAlt: string | null
  displayOrder: number
}

// ============================================
// OBTENER BANNERS POR TIPO
// ============================================

export async function getBannersByType(type: 'hero' | 'promo' | 'category'): Promise<Banner[]> {
  try {
    const supabase = await createClient()
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('type', type)
      .eq('is_active', true)
      // Solo banners que estén dentro de su período de validez
      .or(`start_date.is.null,start_date.lte.${now}`)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching banners:', error)
      return []
    }

    return (data || []).map(transformBanner)
  } catch (error) {
    console.error('Error in getBannersByType:', error)
    return []
  }
}

// ============================================
// SHORTCUTS
// ============================================

export async function getHeroSlides(): Promise<Banner[]> {
  return getBannersByType('hero')
}

export async function getPromoBanner(): Promise<Banner | null> {
  const banners = await getBannersByType('promo')
  return banners[0] || null
}

// ============================================
// HELPER DE TRANSFORMACIÓN
// ============================================

function transformBanner(data: any): Banner {
  return {
    id: data.id,
    type: data.type,
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    ctaText: data.cta_text,
    ctaLink: data.cta_link,
    imageUrl: data.image_url,
    imageAlt: data.image_alt,
    displayOrder: data.display_order,
  }
}
