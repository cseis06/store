"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import CatalogFilters, { FilterState } from "@/components/catalog/CatalogFilters"
import ProductCard from "@/components/common/ProductCard"
import { ProductListItem } from "@/types/product"
import { Category } from "@/lib/categories"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface CatalogContentProps {
  initialProducts: ProductListItem[]
  initialCount: number
  categories: Category[]
}

export default function CatalogContent({
  initialProducts,
  initialCount,
  categories,
}: CatalogContentProps) {
  const pageRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const [products, setProducts] = useState(initialProducts)
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    priceRange: null,
    sortBy: "newest",
  })

  // Filtrar y ordenar productos
  const filteredProducts = products
    .filter((product) => {
      // Filtro por categoría (comparar por slug)
      if (filters.category && product.categorySlug !== filters.category) {
        return false
      }

      // Filtro por precio
      if (filters.priceRange) {
        const price = product.price
        const [minStr, maxStr] = filters.priceRange.split("-")
        const min = parseInt(minStr)
        const max = maxStr.includes("+") ? Infinity : parseInt(maxStr)
        
        if (price < min || price > max) {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "newest":
        default:
          return 0 // Mantener orden original (ya viene ordenado por newest del servidor)
      }
    })

  // Animación inicial
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        }
      )

      const items = gridRef.current?.querySelectorAll(".product-item")
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: "power3.out",
            delay: 0.2,
          }
        )
      }
    }, pageRef)

    return () => ctx.revert()
  }, [])

  // Re-animar cuando cambian los filtros
  useEffect(() => {
    const items = gridRef.current?.querySelectorAll(".product-item")
    if (items && items.length > 0) {
      gsap.fromTo(
        items,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.03,
          ease: "power2.out",
        }
      )
    }
  }, [filters])

  const handleClearFilters = useCallback(() => {
    setFilters({
      category: null,
      priceRange: null,
      sortBy: "newest",
    })
  }, [])

  return (
    <div ref={pageRef} className="min-h-screen">
      {/* Header */}
      <div ref={headerRef} className="bg-black/[0.02] py-16 lg:py-24">
        <div className="container-kiren text-center">
          <h1 className="font-oswald text-4xl lg:text-5xl font-bold tracking-wide mb-4">
            Catálogo
          </h1>
          <p className="font-inter text-black/60 max-w-md mx-auto">
            Explorá nuestra colección completa de piezas minimalistas diseñadas
            para el día a día.
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="container-kiren py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filtros */}
          <CatalogFilters
            activeFilters={filters}
            onFilterChange={setFilters}
            categories={categories}
          />

          {/* Grid de productos */}
          <div className="flex-1">
            {/* Contador (desktop) */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <p className="font-inter text-sm text-black/50">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "producto" : "productos"}
              </p>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div
                ref={gridRef}
                className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
              >
                {filteredProducts.map((product) => (
                  <div key={product.id} className="product-item">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="font-inter text-black/50 mb-4">
                  No se encontraron productos con los filtros seleccionados.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="font-inter text-sm text-black underline underline-offset-4 hover:no-underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
