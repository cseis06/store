"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { useCartStore } from "@/stores/cartStore"
import CartItem from "@/components/cart/CartItem"

// Formateador de precio para Guaraníes
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function CartPageContent() {
  const { items, getSubtotal, clearCart } = useCartStore()
  const pageRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const total = getSubtotal()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  // Animación de entrada
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      )

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.15 }
      )
    }, pageRef)

    return () => ctx.revert()
  }, [])

  // Estado vacío
  if (items.length === 0) {
    return (
      <div ref={pageRef} className="min-h-screen">
        <div className="container-kiren py-16 lg:py-24">
          <div className="max-w-md mx-auto text-center">
            {/* Icono */}
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-black/5 flex items-center justify-center">
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

            <h1 className="font-oswald text-3xl lg:text-4xl font-bold tracking-wide mb-4">
              Tu carrito está vacío
            </h1>
            <p className="font-inter text-black/60 mb-8">
              Parece que aún no agregaste ningún producto a tu carrito.
            </p>

            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-inter text-sm hover:bg-black/90 transition-colors"
            >
              Explorar catálogo
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
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={pageRef} className="min-h-screen">
      {/* Header */}
      <div ref={headerRef} className="bg-black/[0.02] py-12 lg:py-16">
        <div className="container-kiren">
          <h1 className="font-oswald text-3xl lg:text-4xl font-bold tracking-wide">
            Carrito
          </h1>
          <p className="font-inter text-black/60 mt-2">
            {itemCount} {itemCount === 1 ? "producto" : "productos"}
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div ref={contentRef} className="container-kiren py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            {/* Header de tabla (desktop) */}
            <div className="hidden lg:grid grid-cols-12 gap-4 pb-4 border-b border-black/10 mb-6">
              <div className="col-span-6">
                <span className="font-inter text-xs text-black/50 uppercase tracking-wider">
                  Producto
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-inter text-xs text-black/50 uppercase tracking-wider">
                  Cantidad
                </span>
              </div>
              <div className="col-span-2 text-right">
                <span className="font-inter text-xs text-black/50 uppercase tracking-wider">
                  Precio
                </span>
              </div>
              <div className="col-span-2 text-right">
                <span className="font-inter text-xs text-black/50 uppercase tracking-wider">
                  Subtotal
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-6">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8 pt-8 border-t border-black/10">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 font-inter text-sm text-black/60 hover:text-black transition-colors"
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
                Seguir comprando
              </Link>

              <button
                onClick={() => {
                  if (confirm("¿Estás seguro de que querés vaciar el carrito?")) {
                    clearCart()
                  }
                }}
                className="font-inter text-sm text-red-600 hover:text-red-700 transition-colors cursor-pointer"
              >
                Vaciar carrito
              </button>
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-black/[0.02] p-6 lg:p-8 sticky top-32">
              <h2 className="font-oswald text-lg font-semibold mb-6">
                Resumen del pedido
              </h2>

              {/* Detalles */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between font-inter text-sm">
                  <span className="text-black/60">Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between font-inter text-sm">
                  <span className="text-black/60">Envío</span>
                  <span className="text-black/60">Calculado en checkout</span>
                </div>
              </div>

              {/* Divisor */}
              <div className="border-t border-black/10 my-6" />

              {/* Total */}
              <div className="flex justify-between items-center mb-8">
                <span className="font-oswald text-lg font-semibold">Total</span>
                <span className="font-oswald text-xl font-bold">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Botón checkout */}
              <Link
                href="/checkout"
                className="block w-full py-4 bg-black text-white text-center font-inter text-sm font-medium hover:bg-black/90 transition-colors"
              >
                Proceder al pago
              </Link>

              {/* Métodos de pago */}
              <div className="mt-6 pt-6 border-t border-black/10">
                <p className="font-inter text-xs text-black/50 text-center mb-3">
                  Métodos de pago aceptados
                </p>
                <div className="flex justify-center gap-2">
                  {/* Iconos de métodos de pago */}
                  <div className="w-10 h-6 bg-black/10 rounded flex items-center justify-center">
                    <span className="text-[8px] font-medium text-black/40">VISA</span>
                  </div>
                  <div className="w-10 h-6 bg-black/10 rounded flex items-center justify-center">
                    <span className="text-[8px] font-medium text-black/40">MC</span>
                  </div>
                  <div className="w-10 h-6 bg-black/10 rounded flex items-center justify-center">
                    <span className="text-[8px] font-medium text-black/40">AMEX</span>
                  </div>
                </div>
              </div>

              {/* Seguridad */}
              <div className="mt-6 flex items-center justify-center gap-2 text-black/40">
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
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
                <span className="font-inter text-xs">Pago 100% seguro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
