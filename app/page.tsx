"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrar ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación del hero
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3 }
      ).fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.5"
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="min-h-screen flex items-center justify-center px-6"
      >
        <div className="text-center max-w-3xl">
          <h1
            ref={titleRef}
            className="font-oswald text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            LO MÍNIMO ES
            <br />
            <span className="text-black/30">LO MÁXIMO</span>
          </h1>
          <p
            ref={subtitleRef}
            className="font-inter text-lg md:text-xl text-black/60 max-w-xl mx-auto"
          >
            Descubre esenciales curados diseñados para el minimalista moderno.
          </p>
        </div>
      </section>

      {/* Placeholder sections para probar scroll */}
      <section className="min-h-screen bg-black/5 flex items-center justify-center">
        <p className="font-oswald text-2xl text-black/30">Desplázate para ver la animación del header</p>
      </section>

      <section className="min-h-screen flex items-center justify-center">
        <p className="font-oswald text-2xl text-black/30">Más contenido aquí...</p>
      </section>
    </>
  );
}