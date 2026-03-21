"use client"

import Link from "next/link"
import Image from "next/image"
import { ProductListItem, hasDiscount, getDiscountPercentage } from "@/types/product"

interface ProductCardProps {
  product: ProductListItem
}

// Formateador de precio para Guaraníes
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function ProductCard({ product }: ProductCardProps) {
  const showDiscount = hasDiscount(product.price, product.compareAtPrice)
  const discountPercent = getDiscountPercentage(product.price, product.compareAtPrice)

  return (
    <Link href={`/producto/${product.slug}`} className="group block">
      {/* Imagen */}
      <div className="relative aspect-[3/4] overflow-hidden bg-black/5 mb-4">
        {product.image && product.image !== '/placeholder-product.jpg' ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-black/15">
            {/* SVG placeholder */}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-2 py-1 bg-black text-white font-inter text-[10px] tracking-wider uppercase">
              Nuevo
            </span>
          )}
          {showDiscount && (
            <span className="px-2 py-1 bg-white text-black border font-inter text-[10px] tracking-wider uppercase">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Quick action en hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-full py-3 bg-white/95 backdrop-blur-sm text-black font-inter text-xs tracking-wide hover:bg-black hover:text-white transition-colors cursor-pointer">
            Ver detalles
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2">
        <p className="font-inter text-[10px] text-black/40 uppercase tracking-wider">
          {product.category}
        </p>

        <h3 className="font-inter text-sm text-black font-normal group-hover:text-black/70 transition-colors line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          <span className={`font-inter text-sm text-black`}>
            {formatPrice(product.price)}
          </span>
          {showDiscount && product.compareAtPrice && (
            <span className="font-inter text-sm text-black/40 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}