"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import gsap from "gsap"
import { useCartStore, CartItem as CartItemType } from "@/stores/cartStore"

interface CartItemProps {
  item: CartItemType
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

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, getItemPrice } = useCartStore()
  const itemRef = useRef<HTMLDivElement>(null)

  // Precio unitario (producto + ajuste de variante)
  const unitPrice = getItemPrice(item)
  const subtotal = unitPrice * item.quantity

  const handleRemove = () => {
    // Animación de salida
    gsap.to(itemRef.current, {
      opacity: 0,
      x: -20,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        removeItem(item.id)
      },
    })
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    const maxStock = item.variant?.stockQuantity || 10
    if (newQuantity > maxStock) return
    updateQuantity(item.id, newQuantity)
  }

  return (
    <div
      ref={itemRef}
      className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-4 py-6 border-b border-black/10 last:border-b-0"
    >
      {/* Producto (imagen + info) */}
      <div className="lg:col-span-6 flex gap-4">
        {/* Imagen */}
        <Link
          href={`/producto/${item.product.slug}`}
          className="relative w-24 h-32 lg:w-28 lg:h-36 flex-shrink-0 bg-black/5 overflow-hidden group"
        >
          {item.product.image ? (
            <Image
              src={item.product.image}
              alt={item.product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="120px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-black/20">
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
        </Link>

        {/* Info */}
        <div className="flex flex-col justify-between py-1">
          <div>
            <Link
              href={`/producto/${item.product.slug}`}
              className="font-inter text-sm text-black hover:text-black/70 transition-colors line-clamp-2"
            >
              {item.product.name}
            </Link>
            {item.variant && (
              <p className="font-inter text-xs text-black/50 mt-1">
                {item.variant.name}
                {item.variant.size && ` - ${item.variant.size}`}
                {item.variant.color && ` - ${item.variant.color}`}
              </p>
            )}
          </div>

          {/* Botón eliminar (mobile) */}
          <button
            onClick={handleRemove}
            className="lg:hidden inline-flex items-center gap-1 font-inter text-xs text-black/50 hover:text-red-600 transition-colors mt-2"
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
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
            Eliminar
          </button>
        </div>
      </div>

      {/* Cantidad */}
      <div className="lg:col-span-2 flex items-center justify-start lg:justify-center">
        <div className="flex items-center border border-black/20">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-10 h-10 flex items-center justify-center text-black/60 hover:text-black hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          </button>
          <span className="w-12 text-center font-inter text-sm">
            {item.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= 10}
            className="w-10 h-10 flex items-center justify-center text-black/60 hover:text-black hover:bg-black/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Precio unitario */}
      <div className="lg:col-span-2 flex items-center justify-between lg:justify-end">
        <span className="lg:hidden font-inter text-xs text-black/50">Precio:</span>
        <span className="font-inter text-sm text-black/70">
          {formatPrice(unitPrice)}
        </span>
      </div>

      {/* Subtotal */}
      <div className="lg:col-span-2 flex items-center justify-between lg:justify-end gap-4">
        <span className="lg:hidden font-inter text-xs text-black/50">Subtotal:</span>
        <div className="flex items-center gap-4">
          <span className="font-inter text-sm font-medium">
            {formatPrice(subtotal)}
          </span>
          {/* Botón eliminar (desktop) */}
          <button
            onClick={handleRemove}
            className="hidden lg:flex items-center justify-center w-8 h-8 text-black/30 hover:text-red-600 transition-colors"
            title="Eliminar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
