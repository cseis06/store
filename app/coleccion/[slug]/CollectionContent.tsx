"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ProductCard from "@/components/common/ProductCard"
import { CollectionWithProducts, ProductListItem } from "@/types/product"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const sortOptions = [
  { value: "default", label: "Destacados" },
  { value: "newest", label: "Más recientes" },
  { value: "price-asc", label: "Menor precio" },
  { value: "price-desc", label: "Mayor precio" },
  { value: "name-asc", label: "A-Z" },
]

interface CollectionContentProps {
  collection: CollectionWithProducts
}

export default function CollectionContent({ collection }: CollectionContentProps) {
  const [sortBy, setSortBy] = useState("default")
  const [sortedProducts, setSortedProducts] = useState(collection.products)

  const bannerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Ordenar productos
  useEffect(() => {
    const products = [...collection.products]

    switch (sortBy) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        products.sort((a, b) => b.price - a.price)
        break
      case "name-asc":
        products.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "newest":
        // Si tuviéramos createdAt, ordenaríamos por eso
        // Por ahora, invertimos el orden original
        products.reverse()
        break
      default:
        // Orden original (por display_order de la colección)
        break
    }

    setSortedProducts(products)
  }, [sortBy, collection.products])

  // Animaciones de entrada
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Banner
      gsap.fromTo(
        bannerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.out" }
      )

      const bannerContent = bannerRef.current?.querySelectorAll(".banner-content > *")
      if (bannerContent) {
        gsap.fromTo(
          bannerContent,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.4,
          }
        )
      }
    })

    return () => ctx.revert()
  }, [])

  // Animaciones de productos (cuando cambia el ordenamiento)
  useEffect(() => {
    if (sortedProducts.length === 0) return

    const ctx = gsap.context(() => {
      const items = gridRef.current?.querySelectorAll(".product-item")
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power3.out",
          }
        )
      }
    })

    return () => ctx.revert()
  }, [sortedProducts, sortBy])

  return (
    <div className="min-h-screen">
      {/* Banner de colección */}
      <div
        ref={bannerRef}
        className="relative h-[50vh] lg:h-[70vh] bg-black/5 overflow-hidden"
      >
        {/* Imagen de banner o placeholder */}
        {collection.bannerUrl || collection.imageUrl ? (
          <Image
            src={collection.bannerUrl || collection.imageUrl || ''}
            alt={collection.name}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/30" />
        )}

        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />

        {/* Contenido del banner */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="container-kiren pb-12 lg:pb-16">
            <div className="banner-content max-w-2xl text-white">
              {/* Breadcrumb */}
              <nav className="mb-6">
                <ol className="flex items-center gap-2 text-sm text-white/60">
                  <li>
                    <Link href="/" className="hover:text-white transition-colors">
                      Inicio
                    </Link>
                  </li>
                  <li>/</li>
                  <li>
                    <Link href="/colecciones" className="hover:text-white transition-colors">
                      Colecciones
                    </Link>
                  </li>
                </ol>
              </nav>

              {/* Badge de destacada */}
              {collection.isFeatured && (
                <span className="inline-block px-3 py-1 border border-white/40 text-xs tracking-widest uppercase mb-4">
                  Colección destacada
                </span>
              )}

              {/* Nombre */}
              <h1 className="font-oswald text-4xl lg:text-6xl font-bold tracking-wide mb-4">
                {collection.name}
              </h1>

              {/* Descripción */}
              {collection.description && (
                <p className="font-inter text-white/80 text-lg leading-relaxed max-w-lg">
                  {collection.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container-kiren py-12 lg:py-16">
        {/* Barra de herramientas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-black/10">
          {/* Contador */}
          <p className="font-inter text-sm text-black/60">
            <span className="text-black font-medium">{sortedProducts.length}</span>{" "}
            {sortedProducts.length === 1 ? "producto" : "productos"}
          </p>

          {/* Ordenar */}
          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="font-inter text-sm text-black/60">
              Ordenar por:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="font-inter text-sm border border-black/20 px-4 py-2 bg-transparent focus:outline-none focus:border-black transition-colors cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid de productos */}
        {sortedProducts.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
          >
            {sortedProducts.map((product) => (
              <div key={product.id} className="product-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-inter text-black/60 mb-4">
              No hay productos en esta colección todavía.
            </p>
            <Link
              href="/colecciones"
              className="inline-block px-6 py-3 bg-black text-white font-inter text-sm hover:bg-black/90 transition-colors"
            >
              Ver todas las colecciones
            </Link>
          </div>
        )}
      </div>

      {/* Sección: Otras colecciones */}
      <section className="bg-black/[0.02] py-16 lg:py-20">
        <div className="container-kiren">
          <h2 className="font-oswald text-2xl lg:text-3xl font-semibold tracking-wide text-center mb-4">
            Otras colecciones
          </h2>
          <p className="font-inter text-black/60 text-center mb-10">
            Descubrí más propuestas de nuestra marca
          </p>
          <div className="flex justify-center">
            <Link
              href="/colecciones"
              className="inline-flex items-center gap-2 px-8 py-4 border border-black text-black font-inter text-sm hover:bg-black hover:text-white transition-colors"
            >
              Ver todas las colecciones
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
      </section>
    </div>
  )
}
