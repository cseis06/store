"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Collection } from "@/types/product"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface CollectionsGridProps {
  featuredCollections: Collection[]
  regularCollections: Collection[]
}

export default function CollectionsGrid({ 
  featuredCollections, 
  regularCollections 
}: CollectionsGridProps) {
  const pageRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

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
      )

      // Animación de las colecciones
      const items = gridRef.current?.querySelectorAll(".collection-item")
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        )
      }
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef} className="min-h-screen">
      {/* Header de la página */}
      <div ref={headerRef} className="bg-black/[0.02] py-16 lg:py-24">
        <div className="container-kiren text-center">
          <h1 className="font-oswald text-4xl lg:text-5xl font-bold tracking-wide mb-4">
            Colecciones
          </h1>
          <p className="font-inter text-black/60 max-w-md mx-auto">
            Explorá nuestras colecciones diseñadas con un enfoque minimalista y
            atemporal.
          </p>
        </div>
      </div>

      {/* Grid de colecciones */}
      <div className="container-kiren py-12 lg:py-16">
        <div ref={gridRef}>
          {/* Colecciones destacadas - Layout grande */}
          {featuredCollections.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {featuredCollections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/coleccion/${collection.slug}`}
                  className="collection-item group relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden bg-black/5"
                >
                  {/* Imagen o placeholder */}
                  {collection.imageUrl ? (
                    <Image
                      src={collection.imageUrl}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
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
                  )}

                  {/* Overlay gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-500" />

                  {/* Badge de destacada */}
                  <div className="absolute top-6 left-6">
                    <span className="inline-block px-3 py-1 bg-white/90 text-black font-inter text-[10px] tracking-wider uppercase">
                      Destacada
                    </span>
                  </div>

                  {/* Contenido */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
                    <h2 className="font-oswald text-3xl lg:text-4xl font-bold text-white tracking-wide mb-3">
                      {collection.name}
                    </h2>
                    <p className="font-inter text-sm text-white/80 max-w-sm mb-4 leading-relaxed">
                      {collection.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-inter text-xs text-white/60">
                        {collection.productCount || 0} productos
                      </span>
                      <div className="flex items-center gap-2 text-white group-hover:gap-4 transition-all duration-300">
                        <span className="font-inter text-sm tracking-wide">
                          Explorar
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
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Colecciones regulares - Grid más pequeño */}
          {regularCollections.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {regularCollections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/coleccion/${collection.slug}`}
                  className="collection-item group relative aspect-[3/4] overflow-hidden bg-black/5"
                >
                  {/* Imagen o placeholder */}
                  {collection.imageUrl ? (
                    <Image
                      src={collection.imageUrl}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-black/15">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={0.5}
                        stroke="currentColor"
                        className="w-16 h-16"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent group-hover:from-black/80 transition-all duration-500" />

                  {/* Contenido */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <h3 className="font-oswald text-xl font-semibold text-white tracking-wide mb-2">
                      {collection.name}
                    </h3>
                    <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors">
                      <span className="font-inter text-xs">
                        {collection.productCount || 0} productos
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
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
              ))}
            </div>
          )}

          {/* Estado vacío */}
          {featuredCollections.length === 0 && regularCollections.length === 0 && (
            <div className="text-center py-20">
              <p className="font-inter text-black/60 mb-4">
                No hay colecciones disponibles en este momento.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-black text-white font-inter text-sm hover:bg-black/90 transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Sección de newsletter */}
      <div className="bg-black text-white py-16 lg:py-24">
        <div className="container-kiren text-center">
          <h2 className="font-oswald text-2xl lg:text-3xl font-semibold tracking-wide mb-4">
            No te pierdas nada
          </h2>
          <p className="font-inter text-white/60 max-w-md mx-auto mb-8">
            Suscribite para ser el primero en conocer nuevas colecciones y
            ofertas exclusivas.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-3 bg-white/5 border border-white/20 text-white placeholder:text-white/40 font-inter text-sm focus:outline-none focus:border-white/50 transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-black font-inter text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Suscribirse
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
