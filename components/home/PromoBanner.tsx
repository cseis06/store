"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Banner } from "@/lib/banners";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PromoBannerProps {
  banner: Banner;
}

export default function PromoBanner({ banner }: PromoBannerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { scale: 1.1 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      const contentElements = contentRef.current?.children;
      if (contentElements) {
        gsap.fromTo(
          contentElements,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[60vh] lg:h-[70vh] overflow-hidden"
    >
      {/* Imagen de fondo */}
      <div ref={imageRef} className="absolute inset-0">
        {banner.imageUrl ? (
          <Image
            src={banner.imageUrl}
            alt={banner.imageAlt || banner.title || "Promoción"}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          /* Placeholder */
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
            <div className="text-center text-black/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={0.5}
                stroke="currentColor"
                className="w-24 h-24 mx-auto mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <p className="font-inter text-sm">Banner promocional</p>
            </div>
          </div>
        )}
      </div>

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenido */}
      <div className="relative h-full flex items-center justify-center">
        <div ref={contentRef} className="text-center px-6">
          {banner.subtitle && (
            <span className="inline-block font-inter text-xs tracking-[0.3em] text-white/70 uppercase mb-4">
              {banner.subtitle}
            </span>
          )}
          {banner.title && (
            <h2 className="font-oswald text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wide mb-4">
              {banner.title}
            </h2>
          )}
          {banner.description && (
            <p className="font-inter text-base md:text-lg text-white/80 mb-8 max-w-md mx-auto">
              {banner.description}
            </p>
          )}
          {banner.ctaText && banner.ctaLink && (
            <Link
              href={banner.ctaLink}
              className="inline-block font-inter text-sm tracking-wide text-black bg-white px-8 py-4 hover:bg-white/90 transition-colors duration-300"
            >
              {banner.ctaText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
