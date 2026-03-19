"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";

// Slides del carrusel - reemplazar con imágenes reales
const slides = [
  {
    id: 1,
    src: "/images/hero/slide-1.jpg",
    alt: "Colección minimalista kiren",
  },
  {
    id: 2,
    src: "/images/hero/slide-2.jpg",
    alt: "Esenciales de temporada",
  },
  {
    id: 3,
    src: "/images/hero/slide-3.jpg",
    alt: "Nueva colección KIREN",
  },
];

const AUTOPLAY_INTERVAL = 5000; // 5 segundos entre slides
const TRANSITION_DURATION = 1.2; // Duración de la transición en segundos

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Función para ir a un slide específico
  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating || index === currentSlide) return;

      setIsAnimating(true);

      const slidesContainer = slidesRef.current;
      if (!slidesContainer) return;

      const slideElements = slidesContainer.querySelectorAll(".hero-slide");
      const currentEl = slideElements[currentSlide];
      const nextEl = slideElements[index];

      // Timeline de transición suave
      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentSlide(index);
          setIsAnimating(false);
        },
      });

      // Fade out del slide actual con ligero zoom
      tl.to(currentEl, {
        opacity: 0,
        scale: 1.05,
        duration: TRANSITION_DURATION,
        ease: "power2.inOut",
      });

      // Fade in del siguiente slide
      tl.fromTo(
        nextEl,
        { opacity: 0, scale: 1.1 },
        {
          opacity: 1,
          scale: 1,
          duration: TRANSITION_DURATION,
          ease: "power2.inOut",
        },
        0 // Iniciar al mismo tiempo
      );
    },
    [currentSlide, isAnimating]
  );

  // Siguiente slide
  const nextSlide = useCallback(() => {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }, [currentSlide, goToSlide]);

  // Autoplay
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [nextSlide]);

  // Pausar autoplay al interactuar
  const handleDotClick = (index: number) => {
    // Resetear el autoplay
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
    goToSlide(index);
    // Reiniciar autoplay
    autoplayRef.current = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL);
  };

  // Animación de entrada inicial
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in del hero completo
      gsap.fromTo(
        heroRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.out", delay: 0.2 }
      );

      // Animación del primer slide
      const firstSlide = slidesRef.current?.querySelector(".hero-slide");
      if (firstSlide) {
        gsap.fromTo(
          firstSlide,
          { scale: 1.15, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.3 }
        );
      }

      // Animación de los dots
      gsap.fromTo(
        ".hero-dot",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.8,
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-[70vh] lg:h-[85vh] overflow-hidden bg-black/5"
      style={{ opacity: 0 }}
    >
      {/* Contenedor de slides */}
      <div ref={slidesRef} className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="hero-slide absolute inset-0"
            style={{ opacity: index === 0 ? 1 : 0 }}
          >
            {/* Imagen del slide */}
            <div className="relative w-full h-full">
              {/* Placeholder mientras no hay imágenes reales */}
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                <div className="text-center text-black/20">
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
                  <p className="font-inter text-sm">{slide.alt}</p>
                  <p className="font-inter text-xs mt-1">Slide {slide.id}</p>
                </div>
              </div>

              {/* 
                Descomentar cuando tengas las imágenes reales:
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  className="object-cover"
                  sizes="100vw"
                />
              */}
            </div>
          </div>
        ))}
      </div>

      {/* Dots de navegación */}
      <div className="absolute bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            aria-label={`Ir al slide ${index + 1}`}
            className="hero-dot group relative p-2"
          >
            <span
              className={`block h-[2px] transition-all duration-500 ease-out ${
                index === currentSlide
                  ? "w-8 bg-black"
                  : "w-6 bg-black/25 group-hover:bg-black/50"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Indicador de scroll (opcional) */}
      <div className="absolute bottom-8 lg:bottom-12 right-6 lg:right-12 hidden lg:block">
        <div className="flex flex-col items-center gap-2 text-black/40">
          <span className="font-inter text-[10px] tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-px h-8 bg-black/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-black/40 animate-scroll-line" />
          </div>
        </div>
      </div>
    </section>
  );
}