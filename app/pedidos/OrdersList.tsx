"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import gsap from "gsap"
import { 
  Order, 
  getOrderStatusLabel, 
  getPaymentStatusLabel, 
  getPaymentMethodLabel 
} from "@/lib/orders"

interface OrdersListProps {
  orders: Order[]
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

export default function OrdersList({ orders }: OrdersListProps) {
  const pageRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Animaciones de entrada
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      )

      const items = listRef.current?.querySelectorAll(".order-item")
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.2,
          }
        )
      }
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef} className="min-h-screen">
      {/* Header */}
      <div ref={headerRef} className="bg-black/[0.02] py-12 lg:py-16">
        <div className="container-kiren">
          <h1 className="font-oswald text-3xl lg:text-4xl font-bold tracking-wide">
            Mis Pedidos
          </h1>
          <p className="font-inter text-black/60 mt-2">
            {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="container-kiren py-12 lg:py-16">
        {orders.length === 0 ? (
          // Estado vacío
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-black/5 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-10 h-10 text-black/30"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </div>
            <h2 className="font-oswald text-xl font-semibold mb-2">
              No tenés pedidos todavía
            </h2>
            <p className="font-inter text-black/60 mb-8">
              Cuando realices una compra, aparecerá aquí.
            </p>
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center px-8 py-4 bg-black text-white font-inter text-sm hover:bg-black/90 transition-colors"
            >
              Explorar catálogo
            </Link>
          </div>
        ) : (
          // Lista de pedidos
          <div ref={listRef} className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="order-item border border-black/10 overflow-hidden"
              >
                {/* Header del pedido */}
                <div className="bg-black/[0.02] px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div>
                      <p className="font-inter text-xs text-black/50 uppercase tracking-wider">
                        Pedido
                      </p>
                      <p className="font-oswald font-semibold">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="font-inter text-xs text-black/50 uppercase tracking-wider">
                        Fecha
                      </p>
                      <p className="font-inter text-sm">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="font-inter text-xs text-black/50 uppercase tracking-wider">
                        Total
                      </p>
                      <p className="font-inter text-sm font-medium">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium uppercase tracking-wider ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                {/* Productos */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 mb-6">
                    {order.items.slice(0, 4).map((item, index) => (
                      <div
                        key={index}
                        className="relative w-16 h-20 bg-black/5 flex-shrink-0"
                      >
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
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                              />
                            </svg>
                          </div>
                        )}
                        {item.quantity > 1 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[10px] flex items-center justify-center rounded-full">
                            {item.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-16 h-20 bg-black/5 flex items-center justify-center">
                        <span className="font-inter text-sm text-black/50">
                          +{order.items.length - 4}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Detalles adicionales */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-black/10">
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-black/60">
                      <span>
                        <span className="text-black/40">Pago:</span>{" "}
                        {getPaymentMethodLabel(order.paymentMethod)}
                      </span>
                      <span>
                        <span className="text-black/40">Estado pago:</span>{" "}
                        {getPaymentStatusLabel(order.paymentStatus)}
                      </span>
                    </div>

                    <Link
                      href={`/pedidos/${order.orderNumber}`}
                      className="inline-flex items-center gap-2 font-inter text-sm hover:text-black transition-colors text-black/60"
                    >
                      Ver detalles
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
                          d="m8.25 4.5 7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
