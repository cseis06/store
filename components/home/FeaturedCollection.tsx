"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrar ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Datos de la colección destacada
const collection = {
  name: "Essentials",
  season: "Otoño / Invierno 2025",
  description: "Piezas atemporales diseñadas para durar. Simplicidad en cada detalle.",
  slug: "essentials-aw25",
  image: "/images/collections/essentials-banner.jpg",
};

// Productos de la colección
const collectionProducts = [
  {
    id: 1,
    name: "Blazer Oversized",
    price: 125000,
    slug: "blazer-oversized",
    image: "/images/products/collection-1.jpg",
  },
  {
    id: 2,
    name: "Pantalón Wide",
    price: 78000,
    slug: "pantalon-wide",
    image: "/images/products/collection-2.jpg",
  },
  {
    id: 3,
    name: "Camisa Classic",
    price: 62000,
    slug: "camisa-classic",
    image: "/images/products/collection-3.jpg",
  },
  {
    id: 4,
    name: "Vestido Midi",
    price: 95000,
    slug: "vestido-midi",
    image: "/images/products/collection-4.jpg",
  },
];

// Formatear precio en pesos argentinos
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(price);
};

export default function FeaturedCollection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLAnchorElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación del banner
      gsap.fromTo(
        bannerRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      // Animación del contenido del banner
      const bannerContent = bannerRef.current?.querySelector(".banner-content");
      if (bannerContent) {
        gsap.fromTo(
          bannerContent.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animación de los productos
      const products = productsRef.current?.querySelectorAll(".collection-product");
      if (products) {
        gsap.fromTo(
          products,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
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

  return (
    <section ref={sectionRef} className="py-20 lg:py-32">
      <div className="container-kiren">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Banner vertical de la colección */}
          <Link
            ref={bannerRef}
            href={`/coleccion/${collection.slug}`}
            className="group relative aspect-[3/4] lg:aspect-auto lg:min-h-[600px] overflow-hidden bg-black/5"
          >
            {/* Placeholder de imagen */}
            <div className="absolute inset-0 flex items-center justify-center text-black/15">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={0.5}
                stroke="currentColor"
                className="w-20 h-20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </div>

            {/* 
              Descomentar cuando tengas la imagen:
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            */}

            {/* Overlay gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Contenido del banner */}
            <div className="banner-content absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
              <span className="font-inter text-xs tracking-widest text-white/70 uppercase mb-3">
                {collection.season}
              </span>
              <h3 className="font-oswald text-4xl lg:text-5xl font-bold text-white tracking-wide mb-4">
                {collection.name}
              </h3>
              <p className="font-inter text-sm text-white/80 max-w-xs mb-6 leading-relaxed">
                {collection.description}
              </p>
              <div className="flex items-center gap-2 text-white group-hover:gap-4 transition-all duration-300">
                <span className="font-inter text-sm tracking-wide">
                  Ver colección
                </span>
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
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Grid de productos de la colección */}
          <div ref={productsRef} className="grid grid-cols-2 gap-4 lg:gap-6 content-start">
            {collectionProducts.map((product) => (
              <Link
                key={product.id}
                href={`/producto/${product.slug}`}
                className="collection-product group"
              >
                {/* Imagen del producto */}
                <div className="aspect-[3/4] bg-black/5 mb-4 overflow-hidden relative">
                  {/* Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center text-black/20">
                    <div className="text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={0.5}
                        stroke="currentColor"
                        className="w-10 h-10 mx-auto mb-2"
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
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  */}

                  {/* Overlay sutil en hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>

                {/* Info del producto */}
                <div className="space-y-1">
                  <p className="font-inter text-sm text-black/80 group-hover:text-black transition-colors duration-300">
                    {product.name}
                  </p>
                  <p className="font-inter text-sm text-black/50">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}