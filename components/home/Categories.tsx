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

// Categorías de la tienda
const categories = [
  {
    id: 1,
    name: "Remeras",
    slug: "remeras",
    image: "/images/categories/remeras.jpg",
  },
  {
    id: 2,
    name: "Tops",
    slug: "tops",
    image: "/images/categories/tops.jpg",
  },
  {
    id: 3,
    name: "Polleras",
    slug: "polleras",
    image: "/images/categories/polleras.jpg",
  },
  {
    id: 4,
    name: "Shorts",
    slug: "shorts",
    image: "/images/categories/shorts.jpg",
  },
  {
    id: 5,
    name: "Pantalones",
    slug: "pantalones",
    image: "/images/categories/pantalones.jpg",
  },
  {
    id: 6,
    name: "Accesorios",
    slug: "accesorios",
    image: "/images/categories/accesorios.jpg",
  },
];

export default function Categories() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación del título
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

      // Animación de las categorías
      const categoryCards = gridRef.current?.querySelectorAll(".category-card");
      if (categoryCards) {
        gsap.fromTo(
          categoryCards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
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
    <section ref={sectionRef} className="py-20 lg:py-32 bg-black/[0.02]">
      <div className="container-kiren">
        {/* Título */}
        <h2
          ref={titleRef}
          className="font-oswald text-3xl lg:text-4xl font-semibold tracking-wide text-center mb-16"
        >
          Categorías
        </h2>

        {/* Grid de categorías */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6"
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categoria/${category.slug}`}
              className="category-card group relative aspect-[4/5] overflow-hidden bg-black/5"
            >
              {/* Placeholder de imagen */}
              <div className="absolute inset-0 flex items-center justify-center text-black/15">
                <div className="text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={0.5}
                    stroke="currentColor"
                    className="w-16 h-16 mx-auto"
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
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              */}

              {/* Overlay gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 group-hover:from-black/70 transition-all duration-500" />

              {/* Nombre de la categoría */}
              <div className="absolute inset-0 flex items-end p-6 lg:p-8">
                <div className="w-full">
                  <h3 className="font-oswald text-xl lg:text-2xl font-semibold text-white tracking-wide">
                    {category.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-2 text-white/70 group-hover:text-white transition-colors duration-300">
                    <span className="font-inter text-xs tracking-wide">
                      Ver productos
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
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}