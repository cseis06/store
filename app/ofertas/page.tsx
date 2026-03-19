"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "@/components/common/ProductCard";
import { getSaleProducts } from "@/lib/products";
import { ProductListItem } from "@/types/product";

// Registrar ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Opciones de ordenamiento
const sortOptions = [
  { value: "discount", label: "Mayor descuento" },
  { value: "price-asc", label: "Menor precio" },
  { value: "price-desc", label: "Mayor precio" },
  { value: "newest", label: "Mas recientes" },
];

export default function OfertasPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("discount");
  const [totalProducts, setTotalProducts] = useState(0);

  // Refs para animaciones
  const bannerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const response = await getSaleProducts({ sortBy, limit: 24 });
      setProducts(response.data);
      setTotalProducts(response.pagination.total);
      setLoading(false);
    };

    loadProducts();
  }, [sortBy]);

  // Animaciones de entrada
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animacion del banner
      gsap.fromTo(
        bannerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      // Animacion del contenido del banner
      const bannerContent = bannerRef.current?.querySelectorAll(".banner-content > *");
      if (bannerContent) {
        gsap.fromTo(
          bannerContent,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.3,
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  // Animaciones de productos
  useEffect(() => {
    if (loading || products.length === 0) return;

    const ctx = gsap.context(() => {
      const items = gridRef.current?.querySelectorAll(".product-item");
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
        );
      }
    });

    return () => ctx.revert();
  }, [loading, products, sortBy]);

  // Calcular el ahorro total promedio
  const calculateAverageSaving = () => {
    if (products.length === 0) return 0;
    const totalDiscount = products.reduce((acc, p) => {
      if (p.salePrice) {
        return acc + (1 - p.salePrice / p.price) * 100;
      }
      return acc;
    }, 0);
    return Math.round(totalDiscount / products.length);
  };

  return (
    <div className="min-h-screen">
      {/* Banner de ofertas */}
      <div
        ref={bannerRef}
        className="relative bg-black text-white py-16 lg:py-24 overflow-hidden"
      >
        {/* Patron decorativo */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 20px,
                white 20px,
                white 21px
              )`,
            }}
          />
        </div>

        <div className="container-kiren relative">
          <div className="banner-content max-w-2xl">
            {/* Etiqueta */}
            <span className="inline-block px-3 py-1 border border-white/30 text-xs tracking-widest uppercase mb-6">
              Ofertas especiales
            </span>

            {/* Titulo */}
            <h1 className="font-oswald text-4xl lg:text-6xl font-bold tracking-wide mb-4">
              Hasta {calculateAverageSaving() > 0 ? `${calculateAverageSaving()}%` : "30%"} OFF
            </h1>

            {/* Descripcion */}
            <p className="font-inter text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
              Descubri nuestra seleccion de piezas con descuentos exclusivos. 
              Stock limitado en todas las tallas.
            </p>

            {/* Info adicional */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
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
                    d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
                <span className="text-white/70">Envio gratis +$50.000</span>
              </div>
              <div className="flex items-center gap-2">
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
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                <span className="text-white/70">Cambios gratis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Elemento decorativo grande */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 text-[20rem] font-oswald font-bold text-white/5 leading-none pointer-events-none select-none hidden lg:block">
          %
        </div>
      </div>

      {/* Contenido principal */}
      <div ref={contentRef} className="container-kiren py-12 lg:py-16">
        {/* Barra de herramientas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-black/10">
          {/* Contador de productos */}
          <p className="font-inter text-sm text-black/60">
            {loading ? (
              "Cargando..."
            ) : (
              <>
                <span className="text-black font-medium">{totalProducts}</span>{" "}
                {totalProducts === 1 ? "producto en oferta" : "productos en oferta"}
              </>
            )}
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
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-black/5 mb-4" />
                <div className="h-4 bg-black/5 rounded w-3/4 mb-2" />
                <div className="h-4 bg-black/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
          >
            {products.map((product) => (
              <div key={product.id} className="product-item">
                <ProductCard
                  product={{
                    id: parseInt(product.id.replace(/\D/g, "")) || 0,
                    name: product.name,
                    price: product.price,
                    slug: product.slug,
                    image: product.image,
                    category: product.category,
                    isNew: product.isNew,
                    isSale: product.isSale,
                    salePrice: product.salePrice,
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-inter text-black/60 mb-4">
              No hay productos en oferta en este momento.
            </p>
            <Link
              href="/catalogo"
              className="inline-block px-6 py-3 bg-black text-white font-inter text-sm hover:bg-black/90 transition-colors"
            >
              Ver catalogo completo
            </Link>
          </div>
        )}
      </div>

      {/* Seccion de newsletter */}
      <section className="bg-black/[0.02] py-16 lg:py-20">
        <div className="container-kiren">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-oswald text-2xl lg:text-3xl font-semibold tracking-wide mb-4">
              No te pierdas ninguna oferta
            </h2>
            <p className="font-inter text-black/60 mb-8">
              Suscribite a nuestro newsletter y vas a recibir acceso anticipado a todas 
              nuestras promociones y lanzamientos exclusivos.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 border border-black/20 font-inter text-sm focus:outline-none focus:border-black transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-black text-white font-inter text-sm hover:bg-black/90 transition-colors"
              >
                Suscribirme
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Terminos */}
      <div className="container-kiren py-8 border-t border-black/10">
        <p className="font-inter text-xs text-black/40 text-center">
          Los descuentos se aplican sobre el precio original. No acumulable con otros 
          descuentos o promociones. Stock sujeto a disponibilidad. Los precios pueden 
          variar sin previo aviso.
        </p>
      </div>
    </div>
  );
}