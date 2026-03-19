"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CatalogFilters, { FilterState } from "@/components/catalog/CatalogFilters";
import ProductCard, { Product } from "@/components/common/ProductCard";

// Registrar ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Productos de ejemplo - reemplazar con datos reales
const allProducts: Product[] = [
  {
    id: 1,
    name: "Remera Essential Blanca",
    price: 45000,
    slug: "remera-essential-blanca",
    image: "/images/products/product-1.jpg",
    category: "remeras",
    isNew: true,
  },
  {
    id: 2,
    name: "Remera Essential Negra",
    price: 45000,
    slug: "remera-essential-negra",
    image: "/images/products/product-2.jpg",
    category: "remeras",
  },
  {
    id: 3,
    name: "Top Minimal",
    price: 38000,
    slug: "top-minimal",
    image: "/images/products/product-3.jpg",
    category: "tops",
    isNew: true,
  },
  {
    id: 4,
    name: "Top Cruzado",
    price: 42000,
    slug: "top-cruzado",
    image: "/images/products/product-4.jpg",
    category: "tops",
  },
  {
    id: 5,
    name: "Pollera Line",
    price: 61000,
    slug: "pollera-line",
    image: "/images/products/product-5.jpg",
    category: "polleras",
  },
  {
    id: 6,
    name: "Pollera Midi",
    price: 68000,
    slug: "pollera-midi",
    image: "/images/products/product-6.jpg",
    category: "polleras",
    isSale: true,
    salePrice: 54000,
  },
  {
    id: 7,
    name: "Short Minimal",
    price: 52000,
    slug: "short-minimal",
    image: "/images/products/product-7.jpg",
    category: "shorts",
  },
  {
    id: 8,
    name: "Short Wide",
    price: 56000,
    slug: "short-wide",
    image: "/images/products/product-8.jpg",
    category: "shorts",
    isNew: true,
  },
  {
    id: 9,
    name: "Pantalón Wide",
    price: 78000,
    slug: "pantalon-wide",
    image: "/images/products/product-9.jpg",
    category: "pantalones",
  },
  {
    id: 10,
    name: "Pantalón Recto",
    price: 72000,
    slug: "pantalon-recto",
    image: "/images/products/product-10.jpg",
    category: "pantalones",
  },
  {
    id: 11,
    name: "Cinturón Classic",
    price: 28000,
    slug: "cinturon-classic",
    image: "/images/products/product-11.jpg",
    category: "accesorios",
  },
  {
    id: 12,
    name: "Bolso Minimal",
    price: 95000,
    slug: "bolso-minimal",
    image: "/images/products/product-12.jpg",
    category: "accesorios",
    isNew: true,
  },
];

export default function CatalogoPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<FilterState>({
    category: null,
    priceRange: null,
    sortBy: "newest",
  });

  // Filtrar y ordenar productos
  const filteredProducts = allProducts
    .filter((product) => {
      // Filtro por categoría
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Filtro por precio
      if (filters.priceRange) {
        const price = product.salePrice || product.price;
        const [min, max] = filters.priceRange.split("-").map((v) => {
          if (v.includes("+")) return Infinity;
          return parseInt(v);
        });
        if (price < min || price > max) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;

      switch (filters.sortBy) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "newest":
        default:
          return b.id - a.id;
      }
    });

  // Animaciones
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación del header
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        }
      );

      // Animación de los productos
      const products = gridRef.current?.querySelectorAll(".product-item");
      if (products) {
        gsap.fromTo(
          products,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: "power3.out",
            delay: 0.2,
          }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // Re-animar cuando cambian los filtros
  useEffect(() => {
    const products = gridRef.current?.querySelectorAll(".product-item");
    if (products && products.length > 0) {
      gsap.fromTo(
        products,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.03,
          ease: "power2.out",
        }
      );
    }
  }, [filters]);

  return (
    <div ref={pageRef} className="min-h-screen">
      {/* Header de la página */}
      <div
        ref={headerRef}
        className="bg-black/[0.02] py-16 lg:py-24"
      >
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

      {/* Contenido principal */}
      <div className="container-kiren py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filtros */}
          <CatalogFilters
            activeFilters={filters}
            onFilterChange={setFilters}
          />

          {/* Grid de productos */}
          <div className="flex-1">
            {/* Contador de resultados (desktop) */}
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
                  onClick={() =>
                    setFilters({
                      category: null,
                      priceRange: null,
                      sortBy: "newest",
                    })
                  }
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
  );
}