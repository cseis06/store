"use server"

import { createClient } from "@/lib/supabase/server"
import type { CreateOrderData, CreateOrderResult } from "@/lib/orders"

// Items que vienen del carrito local (Zustand)
interface CartItemInput {
  productId: string
  variantId: string | null
  quantity: number
  productName: string
  productImage: string | null
  variantName: string | null
  unitPrice: number
}

interface CreateOrderInput extends CreateOrderData {
  items: CartItemInput[]
}

export async function createOrder(data: CreateOrderInput): Promise<CreateOrderResult> {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: "Debés iniciar sesión para realizar un pedido" }
    }

    // Validar que hay items
    if (!data.items || data.items.length === 0) {
      return { success: false, error: "El carrito está vacío" }
    }

    // Calcular totales
    let subtotal = 0
    const orderItems = data.items.map((item) => {
      const itemSubtotal = item.unitPrice * item.quantity
      subtotal += itemSubtotal

      return {
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        variantId: item.variantId,
        variantName: item.variantName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: itemSubtotal,
      }
    })

    // Costo de envío
    const shippingCost = subtotal >= 300000 ? 0 : 25000
    const total = subtotal + shippingCost

    // Crear la orden
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        status: "pending",
        payment_status: "pending",
        payment_method: data.paymentMethod,
        subtotal,
        shipping_cost: shippingCost,
        total,
        shipping_address: data.shippingAddress,
        notes: data.notes || null,
      })
      .select("id, order_number")
      .single()

    if (orderError) {
      console.error("Error creating order:", orderError)
      return { success: false, error: "Error al crear el pedido" }
    }

    // Insertar items de la orden
    const orderItemsData = orderItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      product_name: item.productName,
      product_image: item.productImage,
      variant_name: item.variantName,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      subtotal: item.subtotal,
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsData)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      // Eliminar la orden si fallan los items
      await supabase.from("orders").delete().eq("id", order.id)
      return { success: false, error: "Error al procesar los productos del pedido" }
    }

    // Vaciar el carrito del servidor (si existe)
    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)

    return {
      success: true,
      orderNumber: order.order_number,
    }
  } catch (error) {
    console.error("Error in createOrder:", error)
    return { success: false, error: "Error inesperado al crear el pedido" }
  }
}
