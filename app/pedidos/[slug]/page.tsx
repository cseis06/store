import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { getOrderByNumber } from "@/lib/orders.server"
import { 
  getOrderStatusLabel, 
  getPaymentStatusLabel, 
  getPaymentMethodLabel 
} from "@/lib/orders"

interface Props {
  params: Promise<{ slug: string }>
}

// Formateador de precio
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Formateador de fecha
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("es-PY", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Colores de estado
const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }
  return colors[status] || "bg-gray-100 text-gray-800"
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const orderNumber = decodeURIComponent(slug)
  const order = await getOrderByNumber(orderNumber)

  if (!order) {
    return { title: "Pedido no encontrado | KIREN" }
  }

  return {
    title: `Pedido ${order.orderNumber} | KIREN`,
    description: `Detalles del pedido ${order.orderNumber}`,
  }
}

export default async function OrderDetailPage({ params }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/pedidos")
  }

  const { slug } = await params
  const orderNumber = decodeURIComponent(slug)
  const order = await getOrderByNumber(orderNumber)

  if (!order) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-black/[0.02] py-12 lg:py-16">
        <div className="container-kiren">
          <Link
            href="/pedidos"
            className="inline-flex items-center gap-2 font-inter text-sm text-black/60 hover:text-black transition-colors mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Volver a mis pedidos
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="font-oswald text-3xl lg:text-4xl font-bold tracking-wide">
                Pedido {order.orderNumber}
              </h1>
              <p className="font-inter text-black/60 mt-1">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <span
              className={`self-start px-4 py-2 text-sm font-medium uppercase tracking-wider ${getStatusColor(
                order.status
              )}`}
            >
              {getOrderStatusLabel(order.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="container-kiren py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Productos */}
          <div className="lg:col-span-2">
            <h2 className="font-oswald text-xl font-semibold mb-6">Productos</h2>
            <div className="border border-black/10">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className={`flex gap-4 p-4 ${
                    index !== order.items.length - 1 ? "border-b border-black/10" : ""
                  }`}
                >
                  <div className="relative w-20 h-24 bg-black/5 flex-shrink-0">
                    {item.productImage ? (
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-black/20">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={0.5}
                          stroke="currentColor"
                          className="w-8 h-8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-inter font-medium">{item.productName}</p>
                    {item.variantName && (
                      <p className="font-inter text-sm text-black/60">
                        {item.variantName}
                      </p>
                    )}
                    <p className="font-inter text-sm text-black/60 mt-1">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-inter font-medium">
                      {formatPrice(item.subtotal)}
                    </p>
                    <p className="font-inter text-xs text-black/50">
                      {formatPrice(item.unitPrice)} c/u
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Notas */}
            {order.notes && (
              <div className="mt-6">
                <h3 className="font-inter font-medium mb-2">Notas del pedido</h3>
                <p className="font-inter text-sm text-black/70 p-4 bg-black/[0.02]">
                  {order.notes}
                </p>
              </div>
            )}
          </div>

          {/* Resumen y datos */}
          <div className="lg:col-span-1 space-y-6">
            {/* Resumen */}
            <div className="bg-black/[0.02] p-6">
              <h3 className="font-oswald text-lg font-semibold mb-4">Resumen</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-black/60">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/60">Envío</span>
                  {order.shippingCost === 0 ? (
                    <span className="text-green-600">Gratis</span>
                  ) : (
                    <span>{formatPrice(order.shippingCost)}</span>
                  )}
                </div>
                <div className="border-t border-black/10 pt-3 mt-3">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-lg">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pago */}
            <div className="border border-black/10 p-6">
              <h3 className="font-oswald text-lg font-semibold mb-4">Pago</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-black/60">Método</span>
                  <span>{getPaymentMethodLabel(order.paymentMethod)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/60">Estado</span>
                  <span>{getPaymentStatusLabel(order.paymentStatus)}</span>
                </div>
              </div>

              {order.paymentMethod === "bank_transfer" && order.paymentStatus === "pending" && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 text-sm">
                  <p className="font-medium text-yellow-800 mb-2">
                    Pendiente de pago
                  </p>
                  <p className="text-yellow-700 text-xs">
                    Realizá la transferencia y envianos el comprobante por WhatsApp
                    al{" "}
                    <a
                      href="https://wa.me/595981123456"
                      className="underline font-medium"
                    >
                      0981 123 456
                    </a>
                  </p>
                </div>
              )}
            </div>

            {/* Envío */}
            <div className="border border-black/10 p-6">
              <h3 className="font-oswald text-lg font-semibold mb-4">
                Dirección de envío
              </h3>
              <div className="font-inter text-sm text-black/70 space-y-1">
                <p className="font-medium text-black">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.phone}</p>
                <p>
                  {order.shippingAddress.street} {order.shippingAddress.number}
                  {order.shippingAddress.apartment &&
                    `, ${order.shippingAddress.apartment}`}
                </p>
                <p>
                  {order.shippingAddress.neighborhood}, {order.shippingAddress.city}
                </p>
                {order.shippingAddress.reference && (
                  <p className="text-black/50 mt-2">
                    Ref: {order.shippingAddress.reference}
                  </p>
                )}
              </div>
            </div>

            {/* Ayuda */}
            <div className="text-center pt-4">
              <p className="font-inter text-sm text-black/50 mb-2">
                ¿Necesitás ayuda con tu pedido?
              </p>
              <a
                href="https://wa.me/595981123456"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-inter text-sm text-black hover:underline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                  />
                </svg>
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
