// ============================================
// TIPOS
// ============================================

export type PaymentMethod = 'cash_on_delivery' | 'bank_transfer'
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface ShippingAddress {
  firstName: string
  lastName: string
  phone: string
  street: string
  number: string
  apartment?: string
  city: string
  neighborhood: string
  reference?: string
}

export interface OrderItem {
  productId: string
  productName: string
  productSlug: string
  productImage: string | null
  variantId: string | null
  variantName: string | null
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  subtotal: number
  shippingCost: number
  total: number
  shippingAddress: ShippingAddress
  notes: string | null
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface CreateOrderData {
  paymentMethod: PaymentMethod
  shippingAddress: ShippingAddress
  notes?: string
}

export interface CreateOrderResult {
  success: boolean
  orderNumber?: string
  error?: string
}

// ============================================
// HELPERS (sin dependencias de servidor)
// ============================================

export function getPaymentMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    cash_on_delivery: 'Efectivo contra entrega',
    bank_transfer: 'Transferencia bancaria',
  }
  return labels[method] || method
}

export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    processing: 'En preparación',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  }
  return labels[status] || status
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    pending: 'Pendiente',
    paid: 'Pagado',
    failed: 'Fallido',
    refunded: 'Reembolsado',
  }
  return labels[status] || status
}
