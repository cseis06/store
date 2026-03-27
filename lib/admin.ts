import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface AdminUser {
  id: string
  email: string
  role: string
  fullName: string | null
}

// Verificar si el usuario actual es admin
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, role, full_name')
      .eq('id', user.id)
      .single()

    if (error || !profile || profile.role !== 'admin') {
      return null
    }

    return {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      fullName: profile.full_name,
    }
  } catch (error) {
    console.error('Error checking admin:', error)
    return null
  }
}

// Proteger página de admin - redirige si no es admin
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser()
  
  if (!admin) {
    redirect('/auth/login?error=unauthorized')
  }
  
  return admin
}

// Obtener estadísticas del dashboard
export async function getDashboardStats() {
  try {
    const supabase = await createClient()

    const [
      { count: productsCount },
      { count: ordersCount },
      { count: customersCount },
      { data: recentOrders },
      { data: revenueData }
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('orders').select('total, created_at').gte('created_at', new Date(new Date().setDate(new Date().getDate() - 30)).toISOString())
    ])

    const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

    return {
      products: productsCount || 0,
      orders: ordersCount || 0,
      customers: customersCount || 0,
      revenue: totalRevenue,
      recentOrders: recentOrders || [],
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      products: 0,
      orders: 0,
      customers: 0,
      revenue: 0,
      recentOrders: [],
    }
  }
}
