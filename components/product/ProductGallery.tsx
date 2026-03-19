"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ProductImage } from "@/types/product";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainImageRef = useRef<HTMLDivElement>(null);

  // Animación al cambiar de imagen
  const handleImageChange = (index: number) => {
    if (index === activeIndex) return;

    gsap.to(mainImageRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setActiveIndex(index);
        gsap.to(mainImageRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      },
    });
  };

  // Animación inicial
  useEffect(() => {
    gsap.fromTo(
      mainImageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => handleImageChange(index)}
            className={`flex-shrink-0 w-16 h-20 lg:w-20 lg:h-24 overflow-hidden transition-all duration-300 ${
              index === activeIndex
                ? "ring-1 ring-black"
                : "ring-1 ring-transparent hover:ring-black/30"
            }`}
          >
            {/* Placeholder */}
            <div className="w-full h-full bg-black/5 flex items-center justify-center text-black/20">
              <span className="text-[10px]">{index + 1}</span>
            </div>

            {/* 
              Descomentar cuando tengas las imágenes:
              <Image
                src={image.src}
                alt={image.alt}
                width={80}
                height={96}
                className="w-full h-full object-cover"
              />
            */}
          </button>
        ))}
      </div>

      {/* Imagen principal */}
      <div
        ref={mainImageRef}
        className="flex-1 aspect-[3/4] bg-black/5 overflow-hidden relative"
      >
        {/* Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center text-black/20">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={0.5}
              stroke="currentColor"
              className="w-20 h-20 mx-auto mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            <p className="font-inter text-sm">{productName}</p>
            <p className="font-inter text-xs mt-1">Imagen {activeIndex + 1} de {images.length}</p>
          </div>
        </div>

        {/* 
          Descomentar cuando tengas las imágenes:
          <Image
            src={images[activeIndex].src}
            alt={images[activeIndex].alt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        */}

        {/* Navegación con flechas en móvil */}
        {images.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 lg:hidden">
            <button
              onClick={() =>
                handleImageChange(activeIndex === 0 ? images.length - 1 : activeIndex - 1)
              }
              className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
              aria-label="Imagen anterior"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() =>
                handleImageChange(activeIndex === images.length - 1 ? 0 : activeIndex + 1)
              }
              className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
              aria-label="Siguiente imagen"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}

        {/* Indicadores en móvil */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 lg:hidden">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleImageChange(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === activeIndex ? "bg-black" : "bg-black/30"
                }`}
                aria-label={`Ver imagen ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}