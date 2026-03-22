import { createClient } from '@/lib/supabase/server'
import type { Order, OrderItem } from './orders'

// ============================================
// FUNCIONES DE SERVIDOR
// ============================================

export async function getMyOrders(): Promise<Order[]> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          variant_id,
          product_name,
          product_image,
          variant_name,
          quantity,
          unit_price,
          subtotal
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return []
    }

    return (data || []).map((order: any) => ({
      id: order.id,
      orderNumber: order.order_number,
      userId: order.user_id,
      status: order.status,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
      subtotal: order.subtotal,
      shippingCost: order.shipping_cost,
      total: order.total,
      shippingAddress: order.shipping_address,
      notes: order.notes,
      items: (order.order_items || []).map((item: any) => ({
        productId: item.product_id,
        productName: item.product_name,
        productSlug: '',
        productImage: item.product_image,
        variantId: item.variant_id,
        variantName: item.variant_name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        subtotal: item.subtotal,
      })),
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    }))
  } catch (error) {
    console.error('Error in getMyOrders:', error)
    return []
  }
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_id,
          variant_id,
          product_name,
          product_image,
          variant_name,
          quantity,
          unit_price,
          subtotal
        )
      `)
      .eq('order_number', orderNumber)
      .eq('user_id', user.id)
      .single()

    if (error || !data) return null

    return {
      id: data.id,
      orderNumber: data.order_number,
      userId: data.user_id,
      status: data.status,
      paymentStatus: data.payment_status,
      paymentMethod: data.payment_method,
      subtotal: data.subtotal,
      shippingCost: data.shipping_cost,
      total: data.total,
      shippingAddress: data.shipping_address,
      notes: data.notes,
      items: (data.order_items || []).map((item: any) => ({
        productId: item.product_id,
        productName: item.product_name,
        productSlug: '',
        productImage: item.product_image,
        variantId: item.variant_id,
        variantName: item.variant_name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        subtotal: item.subtotal,
      })),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  } catch (error) {
    console.error('Error in getOrderByNumber:', error)
    return null
  }
}
