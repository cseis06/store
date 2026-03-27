"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProductListItem } from "@/types/product";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FeaturedProductsProps {
  products: ProductListItem[];
}

// Formatear precio en Guaraníes
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      const productCards = productsRef.current?.querySelectorAll(".product-card");
      if (productCards) {
        gsap.fromTo(
          productCards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: productsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-20 lg:py-32">
      <div className="container-kiren">
        {/* Título */}
        <h2
          ref={titleRef}
          className="font-oswald text-3xl lg:text-4xl font-semibold tracking-wide text-center mb-16"
        >
          Destacados
        </h2>

        {/* Grid de productos */}
        <div
          ref={productsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/producto/${product.slug}`}
              className="product-card group"
            >
              {/* Imagen del producto */}
              <div className="aspect-[3/4] bg-black/5 mb-4 overflow-hidden relative">
                {product.image && product.image !== '/placeholder-product.jpg' ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  /* Placeholder */
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
                      <span className="font-inter text-xs">Imagen</span>
                    </div>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isNew && (
                    <span className="bg-black text-white text-[10px] font-inter tracking-wider px-2 py-1">
                      NUEVO
                    </span>
                  )}
                  {product.isSale && (
                    <span className="bg-red-600 text-white text-[10px] font-inter tracking-wider px-2 py-1">
                      OFERTA
                    </span>
                  )}
                </div>

                {/* Overlay en hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>

              {/* Info del producto */}
              <div className="space-y-1">
                <p className="font-inter text-sm text-black/80 group-hover:text-black transition-colors duration-300">
                  {product.name}
                </p>
                <div className="flex items-center gap-2">
                  {product.compareAtPrice && product.compareAtPrice > product.price ? (
                    <>
                      <p className="font-inter text-sm text-red-600">
                        {formatPrice(product.price)}
                      </p>
                      <p className="font-inter text-xs text-black/40 line-through">
                        {formatPrice(product.compareAtPrice)}
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
          ))}
        </div>

        {/* Botón ver todos */}
        <div className="text-center mt-12">
          <Link
            href="/catalogo"
            className="inline-block font-inter text-sm tracking-wide text-black/70 hover:text-black transition-colors duration-300 relative group"
          >
            Ver todos los productos
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>
      </div>
    </section>
  );
}
