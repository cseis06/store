"use client";

import Link from "next/link";
import Image from "next/image";

export interface Product {
  id: number;
  name: string;
  price: number;
  slug: string;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  salePrice?: number;
}

interface ProductCardProps {
  product: Product;
}

// Formatear precio en pesos argentinos
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(price);
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/producto/${product.slug}`} className="group">
      {/* Imagen del producto */}
      <div className="aspect-[3/4] bg-black/5 mb-4 overflow-hidden relative">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.isNew && (
            <span className="inline-block px-2 py-1 bg-black text-white font-inter text-[10px] tracking-wider uppercase">
              Nuevo
            </span>
          )}
          {product.isSale && (
            <span className="inline-block px-2 py-1 bg-white text-black font-inter text-[10px] tracking-wider uppercase border border-black">
              Oferta
            </span>
          )}
        </div>

        {/* Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center text-black/20">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={0.5}
              stroke="currentColor"
              className="w-12 h-12 mx-auto mb-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
        </div>

        {/* 
          Descomentar cuando tengas las imágenes:
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        */}

        {/* Overlay sutil en hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

        {/* Botón quick add (opcional) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-full py-3 bg-white/95 text-black font-inter text-xs tracking-wide hover:bg-white transition-colors cursor-pointer">
            Agregar al carrito
          </button>
        </div>
      </div>

      {/* Info del producto */}
      <div className="space-y-1">
        <p className="font-inter text-sm text-black/80 group-hover:text-black transition-colors duration-300">
          {product.name}
        </p>
        <div className="flex items-center gap-2">
          {product.isSale && product.salePrice ? (
            <>
              <p className="font-inter text-sm text-black">
                {formatPrice(product.salePrice)}
              </p>
              <p className="font-inter text-sm text-black/40 line-through">
                {formatPrice(product.price)}
              </p>
            </>
          ) : (
            <p className="font-inter text-sm text-black/50">
              {formatPrice(product.price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}