import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import OrderStatusForm from "./OrderStatusForm"

interface Props {
  params: Promise<{ slug: string }>
}

// Formatear precio
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Formatear fecha
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-PY", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const paymentMethodLabels: Record<string, string> = {
  cash_on_delivery: "Efectivo contra entrega",
  bank_transfer: "Transferencia bancaria",
}

async function getOrder(orderNumber: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
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
      ),
      profiles (
        full_name,
        email,
        phone
      )
    `)
    .eq("order_number", orderNumber)
    .single()

  if (error || !data) return null
  return data
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const order = await getOrder(slug)

  if (!order) {
    return { title: "Pedido no encontrado | Admin KIREN" }
  }

  return {
    title: `Pedido ${order.order_number} | Admin KIREN`,
  }
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { slug } = await params
  const order = await getOrder(slug)

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/pedidos"
            className="inline-flex items-center gap-1 font-inter text-sm text-neutral-500 hover:text-neutral-700 transition-colors mb-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Volver a pedidos
          </Link>
          <h1 className="font-oswald text-2xl lg:text-3xl font-bold text-neutral-900">
            Pedido {order.order_number}
          </h1>
          <p className="font-inter text-neutral-500 mt-1">
            {formatDate(order.created_at)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="font-oswald text-lg font-semibold text-neutral-900">
                Productos ({order.order_items?.length || 0})
              </h2>
            </div>
            <div className="divide-y divide-neutral-100">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex gap-4 p-4">
                  <div className="w-16 h-20 bg-neutral-100 rounded overflow-hidden relative flex-shrink-0">
                    {item.product_image ? (
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-inter text-sm font-medium text-neutral-900">
                      {item.product_name}
                    </p>
                    {item.variant_name && (
                      <p className="font-inter text-xs text-neutral-500">
                        {item.variant_name}
                      </p>
                    )}
                    <p className="font-inter text-xs text-neutral-500 mt-1">
                      {formatPrice(item.unit_price)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-inter text-sm font-medium text-neutral-900">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer info */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="font-oswald text-lg font-semibold text-neutral-900 mb-4">
              Dirección de envío
            </h2>
            <div className="font-inter text-sm text-neutral-700 space-y-1">
              <p className="font-medium text-neutral-900">
                {order.shipping_address?.firstName} {order.shipping_address?.lastName}
              </p>
              <p>{order.shipping_address?.phone}</p>
              <p>
                {order.shipping_address?.street} {order.shipping_address?.number}
                {order.shipping_address?.apartment && `, ${order.shipping_address.apartment}`}
              </p>
              <p>
                {order.shipping_address?.neighborhood}, {order.shipping_address?.city}
              </p>
              {order.shipping_address?.reference && (
                <p className="text-neutral-500">
                  Ref: {order.shipping_address.reference}
                </p>
              )}
            </div>

            {order.notes && (
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <p className="font-inter text-xs text-neutral-500 mb-1">Notas del cliente:</p>
                <p className="font-inter text-sm text-neutral-700">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Estado */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="font-oswald text-lg font-semibold text-neutral-900 mb-4">
              Estado del pedido
            </h2>
            <OrderStatusForm
              orderId={order.id}
              currentStatus={order.status}
              currentPaymentStatus={order.payment_status}
            />
          </div>

          {/* Resumen */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="font-oswald text-lg font-semibold text-neutral-900 mb-4">
              Resumen
            </h2>
            <div className="space-y-3 font-inter text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Envío</span>
                {order.shipping_cost === 0 ? (
                  <span className="text-green-600">Gratis</span>
                ) : (
                  <span>{formatPrice(order.shipping_cost)}</span>
                )}
              </div>
              <div className="border-t border-neutral-200 pt-3">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-lg">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pago */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="font-oswald text-lg font-semibold text-neutral-900 mb-4">
              Método de pago
            </h2>
            <p className="font-inter text-sm text-neutral-700">
              {paymentMethodLabels[order.payment_method] || order.payment_method}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
